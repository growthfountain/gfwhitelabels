const pug = require('pug');

if (require.extensions) {
  require.extensions['.pug'] = function compile(module, filename) {
    var template = pug.compileFile(filename, {
      pretty: false,
      client: true,
      inlineRuntimeFunctions: true,
      globals: ['require', 'app'],
    });
    module.exports = template
  };
  require.extensions['.png'] = function compile(module, filename) {
    module.exports = filename;
  };
}

global.require = require;
const { LocalStorage } = require('node-localstorage');
const { JSDOM } = require('jsdom');

global.localStorage = new LocalStorage('./test/localStorageTemp');
global.window = (new JSDOM('<body><div id="page"><div id="content"></div></div></body>', {
  url: 'https://alpha.growthfountain.com'
})).window;

global.window.localStorage = global.localStorage;
global._ = require('underscore');

window.__defineSetter__('location', (val) => {});

_.extend(global, _.pick(window, [
  'document',
  'pageYOffset',
  'pageXOffset',
  'location',
  'getComputedStyle',
  'Element',
  'HTMLInputElement',
  'Node',
  'innerHeight',
  'innerWidth',
]));

HTMLInputElement.prototype.setSelectionRange = () => {};

global.navigator = { userAgent: 'node.js' };
global.$ = global.jQuery = require('jquery');

global.Backbone = require('backbone');
global.Tether = window.Tether = require('tether');
require('bootstrap');
require('babel-polyfill');
require('jquery-serializejson');
require('js/html5-dataset.js');
require('classlist-polyfill');

require('../src/extensions.js');

global.api = require('../src/helpers/forms.js');
const App = require('../src/app.js');
global.app = App();
const Router = require('src/router.js');
app.routers = new Router();

global.testHelpers = require('./testHelpers.js');

global.chai      = require('chai');
global.sinon     = require('sinon');
global.should    = chai.should();
global.expect    = chai.expect;
