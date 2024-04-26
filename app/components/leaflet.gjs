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
    var map = L.map('leaflet-map').setView([0, 0], 2); // Initial view centered at (0, 0) with zoom level 2

    // Adding the basemap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Volcano data (replace with your actual data)
    var volcanoes = [
      { name: 'Mount Fuji', location: [35.3606, 138.7274] },
      { name: 'Mount Etna', location: [37.755, 15.002] },
      // ... add more volcano data ...
    ];

    // Adding markers for each volcano
    for (var i = 0; i < volcanoes.length; i++) {
      var volcano = volcanoes[i];
      L.marker(volcano.location)
        .addTo(map)
        .bindPopup('<b>' + volcano.name + '</b>');
    }

    var myLines = [
      {
        type: 'LineString',
        coordinates: [
          [-100, 40],
          [-105, 45],
          [-110, 55],
        ],
      },
      {
        type: 'LineString',
        coordinates: [
          [-105, 40],
          [-110, 45],
          [-115, 55],
        ],
      },
    ];

    var myStyle = {
      color: '#ff7800',
      weight: 5,
      opacity: 0.65,
    };

    L.geoJSON(myLines, {
      style: myStyle,
    }).addTo(map);

    var states = [
      {
        type: 'Feature',
        properties: { party: 'Republican' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-104.05, 48.99],
              [-97.22, 48.98],
              [-96.58, 45.94],
              [-104.03, 45.94],
              [-104.05, 48.99],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: { party: 'Democrat' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-109.05, 41.0],
              [-102.06, 40.99],
              [-102.03, 36.99],
              [-109.04, 36.99],
              [-109.05, 41.0],
            ],
          ],
        },
      },
    ];

    L.geoJSON(states, {
      style: function (feature) {
        switch (feature.properties.party) {
          case 'Republican':
            return { color: '#ff0000' };
          case 'Democrat':
            return { color: '#0000ff' };
        }
      },
    }).addTo(map);

    const fixRussia = fixAntimeridianSplit(russia);
    L.geoJson(fixRussia).addTo(map);

    // L.geoJson(fixAntimeridianSplit(circle)).addTo(map);

    L.geoJson(fixAntimeridianSplit(circle)).addTo(map);

    L.geoJson(fixAntimeridianSplit(circle2)).addTo(map);

    var geojsonFeature = {
      type: 'Feature',
      properties: {
        name: 'Coors Field',
        amenity: 'Baseball Stadium',
        popupContent: 'This is where the Rockies play!',
      },
      geometry: {
        type: 'Point',
        coordinates: [-104.99404, 39.75621],
      },
    };
    var geojsonMarkerOptions = {
      radius: 8,
      fillColor: '#ff7800',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };

    L.geoJSON(geojsonFeature, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      },
    }).addTo(map);
  }

  <template>
    <div id='leaflet-map' {{didInsert onInsert=this.inserted}}>

      {{yield}}
    </div>
  </template>
}
