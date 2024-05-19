import Component from '@glimmer/component';
import * as d3 from 'd3';
import { didInsert } from './ol';

import { action } from '@ember/object';
export default class GlobeMapComponent extends Component {
  <template>
    <div class='globe-container' {{didInsert onInsert=this.inserted}}></div>
  </template>

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
    const path = d3.geoPath(projection, context);

    const drawGlobe = () => {
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

    drawGlobe();

    d3.select(e)
      .append('div')
      .selectAll('a')
      .data(this.countryNames)
      .join('a')
      .text((d) => d)
      .on('click', (event, countryName) => {
        const countryFeature = this.geoJsonData.features.find(
          (d) => d.properties.name === countryName,
        );
        if (countryFeature) {
          const centroid = d3.geoCentroid(countryFeature);
          const initialRotation = projection.rotate();
          const targetRotation = [-centroid[0], -centroid[1]];

          d3.timer((elapsed) => {
            const t = Math.min(1, elapsed / 1000);
            projection.rotate(
              d3.interpolate(initialRotation, targetRotation)(t),
            );
            drawGlobe();
            return t >= 1;
          });
        }
      });
  }
}
