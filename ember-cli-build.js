'use strict';
/* eslint-env node */

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },
    'ember-template-imports': {
      inline_source_map: true,
    },
    babel: {
      sourceMaps: 'inline',
    },
    // Add options here
  });

  return app.toTree();
};
