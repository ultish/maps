import Component from '@glimmer/component';
import { action } from '@ember/object';
import { didInsert } from './ol';
import d3 from 'd3';
import d3Inertia from 'd3-inertia';
import turf from '@turf/turf';
import d3Projection from 'd3-geo-projection';
import * as topo from 'topojson';
import createZoomBehavior from './d3-geo-zoom';

export default class D3Test extends Component {
  @action
  async inserted(element) {
    // const projection = d3.geoOrthographic().scale(300).rotate([-90, -45]);

    const width = 800;

    const height = 800;

    const MARGIN = 5;

    const projection = d3.geoEquirectangular();
    // const projection = d3.geoOrthographic();

    // const projection = d3Projection.geoEckert3();
    // .scale(Math.min(width, height) / 2 - MARGIN)
    // .translate([width / 2, height / 2]);

    const json = await d3.json('/world-low.geojson');

    const topojson = await d3.json('/world-low.topojson');
    const features = topo.mesh(topojson, topojson.objects['world-low']);

    const json2 = turf.clone(json);
    console.log(
      json,
      turf.simplify(json2, { tolerance: 0.1, highQuality: false }),
    );

    const canvas = d3
      .select(element)
      .append('canvas')
      .attr('width', 800)
      .attr('height', 800);

    const context = canvas.node().getContext('2d');
    const path = d3.geoPath().projection(projection).context(context);

    let render = () => {};

    const scaleExtent = [0.5, 3]; // Your desired scale extent
    const northUp = true; // Whether to keep north up
    const noRotation = true;

    // Note: placing this above the zoom behaviour causes inertia to
    // take over the drag() feature, hence preventing d3.zoom() from
    // using it
    // working interia
    const inertia = d3Inertia.geoInertiaDrag(
      canvas,
      function () {
        render();
      },
      projection,
      [],
    );

    createZoomBehavior(canvas.node(), {
      projection,
      scaleExtent,
      northUp,
      noRotation,
      onMove: function (evt) {
        render(evt);
      },
    });
    render = (transform) => {
      context.clearRect(0, 0, canvas.attr('width'), canvas.attr('height'));

      context.save();
      if (transform) {
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);
      }
      context.lineWidth = 0.5;

      context.beginPath();
      path({ type: 'Sphere' });
      context.fillStyle = '#233ae8';
      context.fill();

      let graticuleGenerator = d3.geoGraticule();

      context.beginPath();
      context.strokeStyle = '#040f5f';
      path(graticuleGenerator());
      context.stroke();

      context.strokeStyle = 'white';
      context.lineWidth = 0.5;
      context.beginPath();
      // when using topojson.features
      // path({ type: 'FeatureCollection', features: features });
      // when using topojson.mesh
      path(features);
      context.stroke();

      context.restore();
      // draw a red line showing current inertia
      if (typeof inertia == 'object') {
        context.beginPath();
        context.moveTo(
          inertia.position[0] + inertia.velocity[0] / 10,
          inertia.position[1] + inertia.velocity[1] / 10,
        );
        context.lineTo(
          inertia.position[0] + (inertia.velocity[0] * inertia.t) / 10,
          inertia.position[1] + (inertia.velocity[1] * inertia.t) / 10,
        );
        context.lineWidth = 2;
        context.strokeStyle = '#00eeb0';
        context.stroke();
        context.lineWidth = 0.5;
      }

      var p = projection.rotate().map((d) => Math.floor(10 * d) / 10);
      context.fillText(`λ = ${p[0]}, φ = ${p[1]}, γ = ${p[2]}`, 10, 10);
    };

    render();
  }

  <template>
    <div {{didInsert onInsert=this.inserted}}>
      D3
    </div>
  </template>
}
