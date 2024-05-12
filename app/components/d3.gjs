import Component from '@glimmer/component';
import { action } from '@ember/object';
import { didInsert } from './ol';
import d3 from 'd3';
import d3inertia from 'd3-inertia';

import { geoInertiaDrag } from './d3-inertia';
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
  hiddenCanvas;
  projection;
  context;
  hiddenContext;
  features;
  path;
  inertia;
  json2;
  prevActiveNode;

  theData = new Map();

  colourToNode = {};
  nodeToColor = {};

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

    d3.select('#d3 canvas.hiddenCanvas')
      .attr('width', this.width)
      .attr('height', this.height);

    this.draw();
  }

  nextCol = 1;
  genColor() {
    var ret = [];
    if (this.nextCol < 16777215) {
      ret.push(this.nextCol & 0xff); // R
      ret.push((this.nextCol & 0xff00) >> 8); // G
      ret.push((this.nextCol & 0xff0000) >> 16); // B
      this.nextCol += 1;
    }
    var col = 'rgb(' + ret.join(',') + ')';
    return col;
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
      .clipAngle(90)
      .translate([width / 2, height / 2]) // centers the globe
      .scale(Math.min(width, height) / 2); // sets a good initial size

    const json = await d3.json('/world-low.geojson');
    const topojson = await d3.json('/world-low.topojson');
    this.features = topo.mesh(topojson, topojson.objects['world-low']);

    this.json2 = turf.clone(json);
    // console.log(json);
    // console.log(
    //   json,
    //   turf.simplify(this.json2, { tolerance: 1, highQuality: false }),
    // );

    // this.json2 = turf.simplify(this.json2, {
    //   tolerance: 0.1,
    //   highQuality: false,
    // });

    // turf.simplify(this.json2, {
    //   tolerance: 0.1,
    //   highQuality: true,
    //   mutate: true,
    // });
    // console.log(this.json2, json);

    this.databind(this.json2);

    this.canvas = d3
      .select(element)
      .append('canvas')
      .attr('width', width)
      .attr('height', height);

    this.hiddenCanvas = d3
      .select(element)
      .append('canvas')
      .classed('hiddenCanvas', true)
      .attr('width', width)
      .attr('height', height);

    const tooltip = d3
      .select(element)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // var customBase = document.createElement('custom');
    // var custom = d3.select(customBase);

    this.path = d3.geoPath().projection(this.projection);
    //.context(this.context);

    this.context = this.canvas.node().getContext('2d');
    this.hiddenContext = this.hiddenCanvas.node().getContext('2d');

    const scaleExtent = [1, 5]; // Your desired scale extent, min, max
    const northUp = false; // Whether to keep north up
    const noRotation = true;

    // Note: placing this above the zoom behaviour causes this.inertia to
    // take over the drag() feature, hence preventing d3.zoom() from
    // using it
    // working interia
    this.inertia = /*d3inertia.*/ geoInertiaDrag(
      this.canvas,
      () => {
        this.draw.call(this);
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
        this.draw.call(this, evt);
      },
    });

    this.draw();

    // Handle mousemove events for picking
    this.canvas.on('mousemove', (event) => {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;

      // render on move so we can highlight a country
      this.draw();

      const pixelData = this.hiddenContext.getImageData(
        mouseX,
        mouseY,
        1,
        1,
      ).data;
      var colKey =
        'rgb(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ')';

      const node = this.colourToNode[colKey];

      if (node) {
        if (this.prevActiveNode) {
          this.prevActiveNode.active = false;
        }
        this.prevActiveNode = node;
        node.active = true;
        const properties = node.geojson.properties;

        // Customize tooltip content based on GeoJSON properties
        tooltip.transition().duration(0).style('opacity', 0.9);
        tooltip
          .html(`Name: ${properties.name}<br>Population: ${properties.pop_est}`)
          .style('left', `${mouseX + 5}px`)
          .style('top', `${mouseY + 20}px`);
      } else {
        if (this.prevActiveNode) {
          this.prevActiveNode.active = false;
        }
        tooltip.transition().duration(0).style('opacity', 0);
      }
    });
  }

  databind(data) {
    // let colorScale = d3
    //   .scaleSequential(d3.interpolateBlues)
    //   .domain([0, d3.max(data.features, (d) => d.properties.pop_est)]);

    let colorScale = d3
      .scaleLog()
      .domain([
        d3.min(data.features, (d) => d.properties.pop_est),
        d3.max(data.features, (d) => d.properties.pop_est),
      ]) // Adjust domain according to your data
      .range(['#f7fbff', '#08306b']); // Adjust color range as desired

    // colorScale = d3.scaleSequential(
    //   d3.extent(data.features.map((f) => f.properties.pop_est).sort()),
    //   d3.interpolateYlGnBu,
    // );

    data.features.forEach((f) => {
      const hash = this.hashCode(JSON.stringify(f));

      let fillColour = colorScale(f.properties.pop_est);
      const node = new Node(hash, f, this.genColor(), fillColour);
      this.theData.set(hash, node);
      this.colourToNode[node.colour] = node;
    });
  }

  draw() {
    this.hiddenContext.clearRect(
      0,
      0,
      this.hiddenCanvas.attr('width'),
      this.hiddenCanvas.attr('height'),
    );

    this.theData.forEach((node) => {
      this.hiddenContext.fillStyle = node.colour;
      this.hiddenContext.beginPath();
      this.path.context(this.hiddenContext)(node.geojson);
      this.hiddenContext.fill();
    });

    this.context.clearRect(
      0,
      0,
      this.canvas.attr('width'),
      this.canvas.attr('height'),
    );

    this.context.save();
    this.context.lineWidth = 0.5;

    this.context.beginPath();
    this.path.context(this.context)({ type: 'Sphere' });
    this.context.fillStyle = 'rgba(0, 0, 200, 0.1)';
    this.context.stroke();

    let graticuleGenerator = d3.geoGraticule();

    this.context.beginPath();
    this.context.strokeStyle = '#040f5f';
    this.path.context(this.context)(graticuleGenerator());
    this.context.stroke();

    this.context.strokeStyle = 'white';
    this.context.lineWidth = 0.5;

    this.theData.forEach((node) => {
      this.context.fillStyle = node.active ? 'red' : node.fillColour;
      this.context.beginPath();
      this.path.context(this.context)(node.geojson);
      this.context.fill();
    });

    var p = this.projection.rotate().map((d) => Math.floor(10 * d) / 10);
    this.context.fillText(`λ = ${p[0]}, φ = ${p[1]}, γ = ${p[2]}`, 10, 10);

    this.context.restore();
  }

  // do i even need this?? why store map? lol
  hashCode(s) {
    return s.split('').reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  <template>
    <h1>D3</h1>
    <p>width:
      {{this.w}}
      height:
      {{this.h}}
      translate: [{{this.tX}},
      {{this.tY}}] scale:
      {{this.scale}}</p>
    <p>
      <button type='button' {{on 'click' this.refreshSize}}>Refresh</button>
      {{! <Hds::Button @text='Basic button' /> }}
      <HdsButton
        @text='bas'
        @icon='sync'
        @size='small'
        {{on 'click' this.refreshSize}}
      />
    </p>
    <div id='d3' {{didInsert onInsert=this.inserted}}>

    </div>
  </template>
}

class Node {
  id;
  geojson;
  fillColour;
  colour;
  active;

  constructor(id, geojson, colour, fillColour) {
    this.id = id;
    this.geojson = geojson;
    this.colour = colour;
    this.fillColour = fillColour;
    this.active = false;
  }
}
