var path = require('path');
var templatizer = require('templatizer');

var publicDir = path.join(__dirname, '/public');
templatizer(path.join(publicDir, '/templates'), path.join(publicDir + '/build/templates.js'));
