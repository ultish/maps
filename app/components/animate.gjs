import Component from '@glimmer/component';
import { didInsert } from './ol';
import { action } from '@ember/object';
import d3 from 'd3';

export default class Animate extends Component {
  @action
  inserted() {
    // Set up canvas and context
    const canvas = d3
      .select('body')
      .append('canvas')
      .attr('width', 960)
      .attr('height', 500);
    const context = canvas.node().getContext('2d');

    const projection = d3.geoOrthographic().scale(250).translate([480, 250]);
    const path = d3.geoPath(projection, context);

    // Load GeoJSON data
    d3.json('/world-low.geojson').then((data) => {
      // Create an array to store country names for creating links later.
      const countryNames = data.features.map((d) => d.properties.name);

      // Function to draw the globe
      function drawGlobe() {
        context.clearRect(0, 0, 960, 500);
        data.features.forEach((d) => {
          context.beginPath();
          path(d);
          context.fillStyle = 'lightgray';
          context.fill();
          context.strokeStyle = 'white';
          context.stroke();
        });
      }

      // Initial drawing of the globe
      drawGlobe();

      // Create country links (replace with actual links/buttons)
      d3.select('body')
        .append('div')
        .selectAll('a')
        .data(countryNames)
        .join('a')
        .text((d) => d)
        .on('click', (event, countryName) => {
          const countryFeature = data.features.find(
            (d) => d.properties.name === countryName,
          );
          if (countryFeature) {
            // Calculate centroid using d3.geoCentroid
            const centroid = d3.geoCentroid(countryFeature);

            const initialRotation = projection.rotate(); // Store initial rotation
            const targetRotation = [-centroid[0], -centroid[1]];

            // Smooth transition using d3.timer
            d3.timer((elapsed) => {
              const t = Math.min(1, elapsed / 1000); // Transition over 1 second
              projection.rotate(
                d3.interpolate(initialRotation, targetRotation)(t),
              );
              drawGlobe();
              return t >= 1; // Stop timer when transition is complete
            });
          }
        });
    });
  }

  <template><div id='animate' {{didInsert onInsert=this.inserted}} /></template>
}
