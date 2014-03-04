'use strict';

// Don't try to run the tests unless this code is running from within the
// tests/index.html file, with a "mocha" div present.
if (document.getElementById('mocha')) {
  require('./app.js');
  require('./syndicat.js');
}
