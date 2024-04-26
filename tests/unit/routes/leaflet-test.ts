import { module, test } from 'qunit';
import { setupTest } from 'maps/tests/helpers';

module('Unit | Route | leaflet', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:leaflet');
    assert.ok(route);
  });
});
