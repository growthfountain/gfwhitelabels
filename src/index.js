require('src/sass/mixins_all.sass');
require('./shims.js');
require('./extensions.js');
//TODO: remove this on next iteration
global.api = require('./helpers/forms.js');
global.onYouTubeIframeAPIReady = () => {
  app.helpers.scripts.onYoutubeAPILoaded();
};

$(document).ready(function() {
  require('./eventHandlers.js');
  global.app = require('app.js')();
  app.start();
});
