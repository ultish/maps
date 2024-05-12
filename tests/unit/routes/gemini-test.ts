import { module, test } from 'qunit';
import { setupTest } from 'maps/tests/helpers';

module('Unit | Route | gemini', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:gemini');
    assert.ok(route);
  });
});
