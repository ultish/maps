// app/components/globe-map.js
import Component from '@glimmer/component';
import * as d3 from 'd3';
import versor from 'versor';

export default class GlobeMapComponent extends Component {
  <template>
    <canvas id='globe-canvas' width='960' height='500'></canvas>
  </template>
  width = 960;
  height = 500;
  projectionName = 'geoOrthographic';
  land50;
  land110;
  context;
  path;
  projection;
  v0;
  q0;
  r0;
  a0;
  tl; // Variables for zoom state

  constructor() {
    super(...arguments);
    this.loadData();
  }

  async loadData() {
    try {
      const land50 = await d3.json('/world-low.geojson');
      const land110 = await d3.json('/world.geojson');
      this.land50 = land50;
      this.land110 = land110;
      this.setupGlobe();
    } catch (error) {
      console.error('Error loading GeoJSON data:', error);
      // Handle the error (e.g., display an error message in the template)
    }
  }

  setupGlobe() {
    const canvasElement = document.getElementById('globe-canvas');
    this.context = canvasElement.getContext('2d');
    this.projection = d3[this.projectionName]().precision(0.1);
    this.path = d3.geoPath(this.projection, this.context);

    const [[x0, y0], [x1, y1]] = this.path.bounds({ type: 'Sphere' });
    const dy = Math.ceil(y1 - y0),
      l = Math.min(Math.ceil(x1 - x0), dy);
    this.projection
      .scale((this.projection.scale() * (l - 1)) / l)
      .precision(0.2);

    this.render = (land) => {
      this.context.clearRect(0, 0, this.width, this.height);
      this.context.beginPath(),
        this.path({ type: 'Sphere' }),
        (this.context.fillStyle = '#fff'),
        this.context.fill();
      this.context.beginPath(),
        this.path(land),
        (this.context.fillStyle = '#000'),
        this.context.fill();
      this.context.beginPath(),
        this.path({ type: 'Sphere' }),
        this.context.stroke();
    };

    d3.select(this.context.canvas)
      .call(
        this.zoom(this.projection)
          .on('zoom.render', () => this.render(this.land110))
          .on('end.render', () => this.render(this.land50)),
      )
      .call(() => this.render(this.land50));
  }

  // Zoom-related functions
  point(event, that) {
    const t = d3.pointers(event, that);

    if (t.length !== this.tl) {
      this.tl = t.length;
      if (this.tl > 1)
        this.a0 = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
      this.zoomStarted.call(that, event);
    }

    return this.tl > 1
      ? [
          d3.mean(t, (p) => p[0]),
          d3.mean(t, (p) => p[1]),
          Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]),
        ]
      : t[0];
  }

  zoomStarted(event) {
    this.v0 = versor.cartesian(this.projection.invert(this.point(event, this)));
    this.q0 = versor((this.r0 = this.projection.rotate()));
  }

  zoomed(event) {
    this.projection.scale(event.transform.k);
    const pt = this.point(event, this);
    const v1 = versor.cartesian(this.projection.rotate(this.r0).invert(pt));
    const delta = versor.delta(this.v0, v1);
    let q1 = versor.multiply(this.q0, delta);

    // For multitouch, compose with a rotation around the axis.
    if (pt[2]) {
      const d = (pt[2] - this.a0) / 2;
      const s = -Math.sin(d);
      const c = Math.sign(Math.cos(d));
      q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
    }

    this.projection.rotate(versor.rotation(q1));

    // In vicinity of the antipode (unstable) of q0, restart.
    if (delta[0] < 0.7) this.zoomStarted.call(this, event);
  }

  zoom(
    projection,
    {
      scale = projection._scale === undefined
        ? (projection._scale = projection.scale())
        : projection._scale,
      scaleExtent = [0.8, 8],
    } = {},
  ) {
    const zoom = d3
      .zoom()
      .scaleExtent(scaleExtent.map((x) => x * scale))
      .on('start', this.zoomStarted.bind(this))
      .on('zoom', this.zoomed.bind(this));

    return Object.assign(
      (selection) =>
        selection
          .property('__zoom', d3.zoomIdentity.scale(projection.scale()))
          .call(zoom),
      {
        on(type, ...options) {
          return options.length
            ? (zoom.on(type, ...options), this)
            : zoom.on(type);
        },
      },
    );
  }
}
