var _ = require('underscore');
var clientconfig = require('clientconfig');

// The default config can be overridden/extended by config passed in by cookie
module.exports = _.extend({
  apiUrl: 'https://gingerhq.com'
}, clientconfig);
