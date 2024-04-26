import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
// import Circle from 'ol/geom/Circle';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import { /*Circle as CircleStyle,*/ Fill, Stroke, Style } from 'ol/style';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

// import rewind from '@mapbox/geojson-rewind';
// import jtst from 'jsts/org/locationtech/jts'

import { russia, circle, circle2 } from './russia';

import turf from '@turf/turf';

const didInsert = modifier(
  (element, [doSomething], { onInsert, onDestroy }) => {
    if (onInsert) {
      onInsert(element);
      console.log(doSomething);
    }

    return () => {
      if (onDestroy) {
        onDestroy(element);
      }
    };
  },
);

export function fixAntimeridianSplit(geojson) {
  // Handle FeatureCollection
  if (geojson.type === 'FeatureCollection') {
    return turf.featureCollection(
      geojson.features.map((feature) => fixAntimeridianSplit(feature)),
    );
  }

  // Ensure we are dealing with a Polygon feature
  if (geojson.type !== 'Feature' || geojson.geometry.type !== 'Polygon') {
    throw new Error(
      'Input must be a GeoJSON Feature or FeatureCollection with Polygon geometry',
    );
  }

  const polygon = geojson.geometry.coordinates[0]; // Get the exterior ring coordinates

  // Check if the polygon crosses the antimeridian
  const longitudes = polygon.map((coord) => coord[0]);
  const crossesAntimeridian =
    Math.max(...longitudes) - Math.min(...longitudes) > 180;

  if (crossesAntimeridian) {
    // Create a clone of the polygon to modify
    const fixedPolygon = turf.clone(geojson);
    const fixedCoords = fixedPolygon.geometry.coordinates[0];

    // Iterate through each pair of consecutive coordinates
    for (let i = 0; i < fixedCoords.length - 1; i++) {
      const currentLng = fixedCoords[i][0];
      const nextLng = fixedCoords[i + 1][0];

      // Check if the segment crosses the antimeridian
      if (Math.abs(nextLng - currentLng) > 180) {
        // Calculate the correct longitude offset
        const offset = nextLng > currentLng ? -360 : 360;

        // Adjust the longitude of the next coordinate
        fixedCoords[i + 1][0] += offset;
      }
    }

    return fixedPolygon;
  } else {
    // No need to fix, return the original GeoJSON
    return geojson;
  }
}

export default class Ol extends Component {
  constructor(owner: unknown, args: any) {
    super(owner, args);
  }

  @action
  inserted() {
    const styles = {
      Polygon: new Style({
        stroke: new Stroke({
          color: '#3388ff',
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
    };

    const styleFunction = function (feature) {
      return styles[feature.getGeometry().getType()];
    };

    const fixRussia = fixAntimeridianSplit(russia);
    const fixCircle = fixAntimeridianSplit(circle);
    const fixCircle2 = fixAntimeridianSplit(circle2);

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(fixRussia, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });

    const circleSource = new VectorSource({
      features: new GeoJSON().readFeatures(fixCircle, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const circleLayer = new VectorLayer({
      source: circleSource,
      style: styleFunction,
    });

    const circle2Source = new VectorSource({
      features: new GeoJSON().readFeatures(fixCircle2, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const circle2Layer = new VectorLayer({
      source: circle2Source,
      style: styleFunction,
    });
    new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
        circleLayer,
        circle2Layer,
      ],
      target: 'ol-map',
      view: new View({
        center: [0, 0],
        zoom: 0,
        minZoom: 0,
      }),
    });
  }

  <template>
    <div id='ol-map' {{didInsert onInsert=this.inserted}}></div>
  </template>
}
