import Component from '@glimmer/component';
import { action } from '@ember/object';
import { didInsert } from './ol';
import d3 from 'd3';
import d3inertia from 'd3-inertia';

// import { geoInertiaDrag } from './d3-inertia';
import turf from '@turf/turf';
import * as topo from 'topojson';
import createZoomBehavior from './d3-geo-zoom';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

import HdsButton from '@hashicorp/design-system-components/components/hds/button';

import Test from './test';
export default class D3Test extends Component {
  @tracked width = 0;
  @tracked height = 0;

  @tracked w = 0;
  @tracked h = 0;
  @tracked tX = 0;
  @tracked tY = 0;
  @tracked scale = 0;

  canvas;
  projection;
  context;
  features;
  path;
  inertia;
  json2;

  @action
  refreshSize() {
    const ele = document.getElementById('d3');
    const box = ele.getBoundingClientRect();
    this.width = box.width;
    this.height = box.height;

    this.w = this.width;
    this.h = this.height;

    this.tX = this.width / 2;
    this.tY = this.height / 2;

    this.scale = Math.min(this.width, this.height) / 2;

    this.projection.translate([this.tX, this.tY]);

    this.projection.scale(this.scale);

    d3.select('#d3 canvas')
      .attr('width', this.width)
      .attr('height', this.height);

    this.render();
  }
  @action
  async inserted(element) {
    const box = element.getBoundingClientRect();
    const width = box.width;
    const height = box.height;

    // console.log(this.width, this.height);
    // const projection = d3.geoOrthographic().scale(300).rotate([-90, -45]);
    // const projection = d3.geoEquirectangular();
    // const projection = d3Projection.geoEckert3();

    this.projection = d3
      .geoOrthographic()
      .translate([width / 2, height / 2]) // centers the globe
      .scale(Math.min(width, height) / 2); // sets a good initial size

    const json = await d3.json('/world-low.geojson');
    const topojson = await d3.json('/world-low.topojson');
    this.features = topo.mesh(topojson, topojson.objects['world-low']);

    this.json2 = turf.clone(json);
    console.log(
      json,
      turf.simplify(this.json2, { tolerance: 0.1, highQuality: false }),
    );

    this.canvas = d3
      .select(element)
      .append('canvas')
      .attr('width', width)
      .attr('height', height);

    this.context = this.canvas.node().getContext('2d');
    this.path = d3.geoPath().projection(this.projection).context(this.context);

    const scaleExtent = [1, 5]; // Your desired scale extent, min, max
    const northUp = false; // Whether to keep north up
    const noRotation = true;

    this.canvas.call(
      d3.drag().subject(this.dragSubject),
      // .on('start', dragstarted)
      // .on('drag', dragged)
      // .on('end', dragended)
      // .on('start.render drag.render end.render', render),
    );
    // Note: placing this above the zoom behaviour causes this.inertia to
    // take over the drag() feature, hence preventing d3.zoom() from
    // using it
    // working interia
    this.inertia = d3inertia.geoInertiaDrag(
      this.canvas,
      () => {
        this.render.call(this);
      },
      this.projection,
      [],
    );

    createZoomBehavior(this.canvas.node(), {
      projection: this.projection,
      scaleExtent,
      northUp,
      noRotation,
      onMove: (evt) => {
        this.render.call(this, evt);
      },
    });

    this.render();
  }

  render(transform) {
    this.context.clearRect(
      0,
      0,
      this.canvas.attr('width'),
      this.canvas.attr('height'),
    );

    this.context.save();
    // if (transform) {
    //   this.context.translate(transform.x, transform.y);
    //   this.context.scale(transform.k, transform.k);
    // }
    this.context.lineWidth = 0.5;

    this.context.beginPath();
    this.path({ type: 'Sphere' });
    this.context.fillStyle = '#233ae8';
    this.context.fill();

    let graticuleGenerator = d3.geoGraticule();

    this.context.beginPath();
    this.context.strokeStyle = '#040f5f';
    this.path(graticuleGenerator());
    this.context.stroke();

    this.context.strokeStyle = 'white';
    this.context.lineWidth = 0.5;
    this.context.beginPath();
    // when using topojson.features
    // path({ type: 'FeatureCollection', features: features });
    // when using topojson.mesh
    // this.path(this.features);
    this.path(this.json2);
    this.context.stroke();

    // draw a red line showing current this.inertia
    if (typeof this.inertia == 'object') {
      this.context.beginPath();
      this.context.moveTo(
        this.inertia.position[0] + this.inertia.velocity[0] / 10,
        this.inertia.position[1] + this.inertia.velocity[1] / 10,
      );
      this.context.lineTo(
        this.inertia.position[0] +
          (this.inertia.velocity[0] * this.inertia.t) / 10,
        this.inertia.position[1] +
          (this.inertia.velocity[1] * this.inertia.t) / 10,
      );
      this.context.lineWidth = 2;
      this.context.strokeStyle = 'red';
      this.context.stroke();
      this.context.lineWidth = 0.5;
    }
    var p = this.projection.rotate().map((d) => Math.floor(10 * d) / 10);
    this.context.fillText(`λ = ${p[0]}, φ = ${p[1]}, γ = ${p[2]}`, 10, 10);

    this.context.restore();
  }

  dragSubject() {}

  <template>
    <div id='d3' {{didInsert onInsert=this.inserted}}>
      <h1>D3</h1>
      <p>width:
        {{this.w}}
        height:
        {{this.h}}
        translate: [{{this.tX}},
        {{this.tY}}] scale:
        {{this.scale}}</p>
      <p>
        <button {{on 'click' this.refreshSize}}>Refresh</button>
        {{! <Hds::Button @text='Basic button' /> }}
        <HdsButton
          @text='bas'
          @icon='sync'
          @size='small'
          {{on 'click' this.refreshSize}}
        />
      </p>
    </div>
  </template>
}
