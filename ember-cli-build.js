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
    minifyCSS: {
      options: {
        advanced: false,
      },
    },
    // sassOptions: {
    //   precision: 4,
    //   includePaths: [
    //     './node_modules/@hashicorp/design-system-tokens/dist/products/css',
    //     './node_modules/@hashicorp/ember-flight-icons/dist/styles',
    //     './node_modules/@hashicorp/design-system-components/dist/styles',
    //   ],
    // },
    // Add options here
  });

  app.import(
    'node_modules/@hashicorp/design-system-components/dist/styles/@hashicorp/design-system-components.css',
  );
  app.import('node_modules/ol/ol.css');
  return app.toTree();
};
