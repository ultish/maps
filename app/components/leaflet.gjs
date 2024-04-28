/** eslint-disable no-loss-of-precision */

import Component from '@glimmer/component';
import L from 'leaflet';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';

import { fixAntimeridianSplit3 as geojsonFix } from './geojson';
import splitGeoJSON from 'geojson-antimeridian-cut';
import {
  russia,
  rectangle,
  diamond,
  line,
  line2,
  line3,
  multiLine,
} from './russia';

const didInsert = modifier(
  (element, [doSomething], { onInsert, onDestroy }) => {
    if (onInsert) {
      console.log(doSomething);
      onInsert(element);
    }

    return () => {
      if (onDestroy) {
        onDestroy(element);
      }
    };
  },
);

export default class Leaflet extends Component {
  constructor(owner: unknown, args: any) {
    super(owner, args);
  }

  @action
  inserted() {
    console.log('asdasd');
    var map = L.map('leaflet-map', {
      worldCopyJump: true,
    }).setView([0, 0], 2); // Initial view centered at (0, 0) with zoom level 2

    // Adding the basemap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const fixRussia = splitGeoJSON(russia);
    const fixRectangle = splitGeoJSON(rectangle);
    const fixDiamond = splitGeoJSON(diamond);
    const fixLine = splitGeoJSON(line);
    const fixMLine = splitGeoJSON(multiLine);
    const fixLine2 = splitGeoJSON(line2);
    const fixLine3 = splitGeoJSON(line3);

    L.geoJson(fixRussia).addTo(map);
    L.geoJson(fixRectangle).addTo(map);
    L.geoJson(fixDiamond).addTo(map);
    L.geoJson(fixLine).addTo(map);
    L.geoJson(fixLine2).addTo(map);
    L.geoJson(fixLine3).addTo(map);
    L.geoJson(fixMLine).addTo(map);
  }

  <template>
    <div id='leaflet-map' {{didInsert onInsert=this.inserted}}>

      {{yield}}
    </div>
  </template>
}
