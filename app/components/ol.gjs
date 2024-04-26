import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
// import Circle from 'ol/geom/Circle';
// import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import { /*Circle as CircleStyle,*/ Fill, Stroke, Style } from 'ol/style';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';

// import rewind from '@mapbox/geojson-rewind';
// import jtst from 'jsts/org/locationtech/jts'

import { russia, circle, circle2, line, multiLine } from './russia';
import { fixAntimeridianSplit3 as geojsonFix } from './geojson';

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
      LineString: new Style({
        stroke: new Stroke({
          color: 'green',
          width: 5,
        }),
      }),
      MultiLineString: new Style({
        stroke: new Stroke({
          color: 'red',
          width: 5,
        }),
      }),
    };

    const styleFunction = function (feature) {
      return styles[feature.getGeometry().getType()];
    };

    const fixRussia = geojsonFix(russia);
    const fixCircle = geojsonFix(circle);
    const fixCircle2 = geojsonFix(circle2);
    const fixLine = geojsonFix(line);
    const mfixLine = geojsonFix(multiLine);

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

    const lineSource = new VectorSource({
      features: new GeoJSON().readFeatures(fixLine, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const lineLayer = new VectorLayer({
      source: lineSource,
      style: styleFunction,
    });

    const mlineSource = new VectorSource({
      features: new GeoJSON().readFeatures(mfixLine, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const mlineLayer = new VectorLayer({
      source: mlineSource,
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
        lineLayer,
        mlineLayer,
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
