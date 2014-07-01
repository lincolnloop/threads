var _ = require('underscore');
var clientconfig = require('clientconfig');

// The default config can be overridden/extended by config passed in by cookie
module.exports = _.extend({
  debug: false,
  apiUrl: 'https://usethreads.com'
}, clientconfig);
