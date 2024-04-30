import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
// import Circle from 'ol/geom/Circle';
// import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import { /*Circle as CircleStyle,*/ Fill, Stroke, Style, Text } from 'ol/style';
import {
  OSM,
  Vector as VectorSource,
  VectorTile as VectorTileSource,
} from 'ol/source';
import {
  Tile as TileLayer,
  Vector as VectorLayer,
  VectorTile as VectorTileLayer,
} from 'ol/layer';

import MVT from 'ol/format/MVT';
// import TileDebug from 'ol/source/TileDebug';

// import rewind from '@mapbox/geojson-rewind';
// import jtst from 'jsts/org/locationtech/jts'

import { world } from './countries';
import { world as worldMed } from './worldmedres';

import {
  russia,
  rectangle,
  diamond,
  line,
  multiLine,
  line2,
  line3,
} from './russia';
import { fixAntimeridianSplit3 as geojsonFix } from './geojson';

import splitGeoJSON from 'geojson-antimeridian-cut';

export const didInsert = modifier(
  // eslint-disable-next-line no-empty-pattern
  (element, [], { onInsert, onDestroy }) => {
    if (onInsert) {
      onInsert(element);
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
      MultiPolygon: new Style({
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

    // const fixRussia = geojsonFix(russia, 0);
    const fixRussia = splitGeoJSON(russia);
    const fixRectangle = splitGeoJSON(rectangle);
    const fixDiamond = splitGeoJSON(diamond);
    const fixLine = splitGeoJSON(line);
    const fixLine2 = splitGeoJSON(line2);
    const fixLine3 = splitGeoJSON(line3);
    const mfixLine = splitGeoJSON(multiLine);

    // const worldfix = geojsonFix(world);
    // console.log(worldfix);

    const worldSource = new VectorSource({
      features: new GeoJSON().readFeatures(world, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const worldLayer = new VectorLayer({
      source: worldSource,
      style: new Style({
        stroke: new Stroke({
          color: 'black',
          width: 1,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
    });

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

    const rectangleSource = new VectorSource({
      features: new GeoJSON().readFeatures(fixRectangle, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const rectangleLayer = new VectorLayer({
      source: rectangleSource,
      style: new Style({
        stroke: new Stroke({
          color: '#0aa26b',
          width: 5,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
    });

    const diamondSource = new VectorSource({
      features: new GeoJSON().readFeatures(fixDiamond, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const diamondLayer = new VectorLayer({
      source: diamondSource,
      style: new Style({
        stroke: new Stroke({
          color: 'black',
          width: 1,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
    });

    const lineSource = new VectorSource({
      features: new GeoJSON().readFeatures(fixLine, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const lineLayer = new VectorLayer({
      source: lineSource,
      style: new Style({
        stroke: new Stroke({
          color: 'grey',
          width: 5,
        }),
      }),
    });

    const lineSource2 = new VectorSource({
      features: new GeoJSON().readFeatures(fixLine2, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const lineLayer2 = new VectorLayer({
      source: lineSource2,
      style: new Style({
        stroke: new Stroke({
          color: 'pink',
          width: 5,
        }),
      }),
    });
    const lineSource3 = new VectorSource({
      features: new GeoJSON().readFeatures(fixLine3, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }),
    });
    const lineLayer3 = new VectorLayer({
      source: lineSource3,
      style: new Style({
        stroke: new Stroke({
          color: 'orange',
          width: 5,
        }),
      }),
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

    // const style = new Style({
    //   fill: new Fill({
    //     color: 'rgba(255, 255, 255, 0.6)',
    //   }),
    //   stroke: new Stroke({
    //     color: '#319FD3',
    //     width: 1,
    //   }),
    //   text: new Text({
    //     font: '12px Calibri,sans-serif',
    //     fill: new Fill({
    //       color: '#000',
    //     }),
    //     stroke: new Stroke({
    //       color: '#fff',
    //       width: 3,
    //     }),
    //   }),
    // });

    // const vtLayer = new VectorTileLayer({
    //   declutter: true,
    //   source: new VectorTileSource({
    //     maxZoom: 15,
    //     format: new MVT(),
    //     url:
    //       'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/' +
    //       'ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
    //   }),
    //   style: function (feature) {
    //     style.getText().setText(feature.get('name'));
    //     return style;
    //   },
    // });

    new Map({
      layers: [
        // vtLayer,
        new TileLayer({
          source: new OSM(),
        }),
        worldLayer,
        vectorLayer,
        rectangleLayer,
        diamondLayer,
        lineLayer,
        mlineLayer,
        lineLayer2,
        lineLayer3,
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
