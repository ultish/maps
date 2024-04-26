import { module, test } from 'qunit';
import { setupTest } from 'maps/tests/helpers';

module('Unit | Route | d3', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:d3');
    assert.ok(route);
  });
});
