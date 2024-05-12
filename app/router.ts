import EmberRouter from '@ember/routing/router';
import config from 'maps/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('leaflet');
  this.route('ol');
  this.route('d3');
  this.route('charts');
  this.route('gemini');
});
