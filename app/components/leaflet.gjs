/** eslint-disable no-loss-of-precision */

import Component from '@glimmer/component';
import L from 'leaflet';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';

import { fixAntimeridianSplit } from './ol';
import { russia, circle, circle2 } from './russia';

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

    const fixRussia = fixAntimeridianSplit(russia);
    const fixCircle = fixAntimeridianSplit(circle);
    const fixCircle2 = fixAntimeridianSplit(circle2);

    L.geoJson(fixRussia).addTo(map);
    L.geoJson(fixCircle).addTo(map);
    L.geoJson(fixCircle2).addTo(map);
  }

  <template>
    <div id='leaflet-map' {{didInsert onInsert=this.inserted}}>

      {{yield}}
    </div>
  </template>
}
