import Component from '@glimmer/component';
import * as d3 from 'd3';
import { tracked } from '@glimmer/tracking';
import { didInsert } from './ol';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { fn } from '@ember/helper';

export default class GlobeMapComponent extends Component {
  <template>
    <style>span.clickable { cursor: pointer } </style>
    <div class='globe-container' {{didInsert onInsert=this.inserted}}></div>
    <div class='country-links'>
      {{#each this.countryNames as |countryName|}}
        <span
          class='clickable'
          {{on 'click' (fn this.rotateToCountry countryName)}}
        >{{countryName}}</span>
      {{/each}}
    </div>
  </template>

  @tracked countryNames: [];
  projection;
  drawGlobe;

  @action
  async inserted(e) {
    const data = await d3.json('/world-low.geojson');
    this.geoJsonData = data;
    this.countryNames = data.features.map((d) => d.properties.name);
    this.setupGlobe(e);
  }

  setupGlobe(e) {
    const canvas = d3
      .select(e)
      .append('canvas')
      .attr('width', 960)
      .attr('height', 500);
    const context = canvas.node().getContext('2d');

    const projection = d3.geoOrthographic().scale(250).translate([480, 250]);
    this.projection = projection;
    const path = d3.geoPath(projection, context);

    this.drawGlobe = () => {
      context.clearRect(0, 0, 960, 500);
      this.geoJsonData.features.forEach((d) => {
        context.beginPath();
        path(d);
        context.fillStyle = 'lightgray';
        context.fill();
        context.strokeStyle = 'white';
        context.stroke();
      });
    };

    this.drawGlobe();
  }

  @action
  rotateToCountry(countryName) {
    const countryFeature = this.geoJsonData.features.find(
      (d) => d.properties.name === countryName,
    );
    if (countryFeature) {
      const centroid = d3.geoCentroid(countryFeature);
      const initialRotation = this.projection.rotate();
      const targetRotation = [-centroid[0], -centroid[1]];

      d3.timer((elapsed) => {
        const t = Math.min(1, elapsed / 1000);
        this.projection.rotate(
          d3.interpolate(initialRotation, targetRotation)(t),
        );
        this.drawGlobe();
        return t >= 1;
      });
    }
  }
}
