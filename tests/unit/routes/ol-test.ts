import { module, test } from 'qunit';
import { setupTest } from 'maps/tests/helpers';

module('Unit | Route | ol', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:ol');
    assert.ok(route);
  });
});
