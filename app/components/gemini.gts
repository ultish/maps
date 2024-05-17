import Component from '@glimmer/component';
import { action } from '@ember/object';
import d3 from 'd3';
import { didInsert } from './ol';
import turf from '@turf/turf';

export default class Gemini extends Component {
  <template>
    <div {{didInsert onInsert=this.inserted}}>
    </div>
  </template>

  @action
  async inserted(element: HTMLElement) {
    const width = 960;
    const height = 500;
    const sensitivity = 75;
    const autoRotateDelay = 30000; // 5 seconds

    let worldLow,
      worldHigh,
      canvas,
      context,
      projection,
      path,
      graticule,
      countries,
      sphere,
      rotation = { x: 0, y: 0 },
      dragging = false,
      autoRotateTimeout;
    let currentCountry = null;

    worldLow = await d3.json('world-low.geojson');
    worldHigh = await d3.json('world.geojson');

    worldHigh.features.forEach((feature) => {
      feature.geometry = turf.simplify(feature.geometry, {
        tolerance: 0.02,
        highQuality: true,
      });
    });

    let nextCol = 1;
    function genColor() {
      var ret = [];
      if (nextCol < 16777215) {
        ret.push(nextCol & 0xff); // R
        ret.push((nextCol & 0xff00) >> 8); // G
        ret.push((nextCol & 0xff0000) >> 16); // B
        nextCol += 1;
      }
      var col = 'rgb(' + ret.join(',') + ')';
      return col;
    }

    d3.select(element)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    canvas = d3
      .select(element)
      .append('canvas')
      .attr('width', width)
      .attr('height', height);
    context = canvas.node().getContext('2d');

    projection = d3
      .geoOrthographic()
      .scale(250)
      .precision(0.5)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    path = d3.geoPath(projection, context);
    graticule = d3.geoGraticule10();

    // d3.json('world-low.geojson').then((data) => {
    sphere = { type: 'Sphere' };
    countries = worldHigh;

    // Inside the d3.json callback, after loading the GeoJSON:
    countries.features.forEach((country, i) => {
      country.properties.color = genColor();
    });

    render(worldHigh);
    startAutoRotate();

    canvas.call(
      d3.drag().on('start', dragStart).on('drag', dragged).on('end', dragEnd),
    );
    canvas.on('wheel', zoomed);
    canvas.on('mousemove', showTooltip);
    // });

    function render(data) {
      context.clearRect(0, 0, width, height);

      projection.rotate([rotation.x, rotation.y]);

      context.beginPath();
      path(graticule);
      context.strokeStyle = '#ccc';
      context.stroke();

      // context.beginPath();
      // path(countries);
      // context.fillStyle = '#007BFF';
      // // context.fill();
      // context.stroke();

      // Render countries
      data.features.forEach((country) => {
        context.beginPath();
        path(country);
        context.fillStyle = country.properties.color;
        context.fill();
      });

      // if (currentCountry) {
      //   context.beginPath();
      //   path(currentCountry);
      //   context.fillStyle = '#ff0000'; // Highlight color
      //   context.fill();
      // }

      context.beginPath();
      path(sphere);
      context.strokeStyle = '#000';
      context.stroke();
    }

    function dragStart() {
      dragging = true;
      stopAutoRotate();
    }

    function dragged(event) {
      const rotate = projection.rotate();
      const k = sensitivity / projection.scale();

      rotation.x = rotate[0] + event.dx * k;
      rotation.y = rotate[1] - event.dy * k;

      // Clamp y rotation to avoid the pole flipping upside down
      rotation.y = Math.max(-90, Math.min(90, rotation.y));
      render(worldLow);
    }
    function dragEnd() {
      dragging = false;
      setTimeout(startAutoRotate, autoRotateDelay); // Start auto-rotate after the delay
      render(worldHigh);
    }
    let wheeling = null;
    const minScale = 200;
    const maxScale = 800;

    function zoomed(event) {
      if (wheeling) {
        clearTimeout(wheeling);
      }

      dragging = true;
      stopAutoRotate();

      const scaleFactor = 1.1; // Adjust this value to control zoom speed

      if (event.deltaY < 0) {
        projection.scale(Math.min(projection.scale() * scaleFactor, maxScale));
      } else {
        projection.scale(Math.max(projection.scale() / scaleFactor, minScale));
      }
      render(worldLow); // Assuming you're using this for a lower-resolution render during zooming
      wheeling = setTimeout(() => {
        dragging = false;
        startAutoRotate();
        render(worldHigh); // Assuming you're using this for the high-resolution render
      }, 250);
    }

    function showTooltip(event) {
      const tooltip = d3.select('.tooltip');
      const pixel = context.getImageData(
        event.offsetX,
        event.offsetY,
        1,
        1,
      ).data;
      const pickedColor = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;

      currentCountry = null;
      countries.features.forEach((country) => {
        if (pickedColor == country.properties.color) {
          currentCountry = country;
          // ... (show tooltip with country name)

          // Customize tooltip content based on GeoJSON properties
          tooltip.transition().duration(0).style('opacity', 0.9);
          tooltip
            .html(
              `Name: ${country.properties.name}<br>Population: ${country.properties.pop_est}`,
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 20 + 'px');
        }
      });

      if (!currentCountry) {
        // ... (hide tooltip)
        tooltip.transition().duration(0).style('opacity', 0);
      }
    }

    // function startAutoRotate() {
    //   if (!dragging && !autoRotateTimeout) {
    //     autoRotateTimeout = setInterval(() => {
    //       rotation.x += 0.2; // Adjust rotation speed as needed
    //       render(worldHigh);
    //     }, 16); // Approximately 60 FPS
    //   }
    // }
    function startAutoRotate() {
      if (!dragging) {
        let lastTime = performance.now();

        var animate = (currentTime) => {
          if (dragging) return;

          const deltaTime = Math.min(currentTime - lastTime, 100); // Cap deltaTime
          rotation.x += (0.2 * deltaTime) / 16;
          render(worldHigh);
          lastTime = currentTime;

          requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      }
    }

    function stopAutoRotate() {
      clearInterval(autoRotateTimeout);
      autoRotateTimeout = null;
    }
  }
}
