'use strict';
var config = require('../config/' + (process.env.NODE_ENV || 'development'));
var pkg = require('../package.json');

var production = (process.env.NODE_ENV === 'production');

exports.index = function (req, res) {
  res.cookie('config', JSON.stringify(config));
  res.render('index', {
    js: '/' + pkg.name + (production ? '.min' : '') + '.js',
    css: '/' + pkg.name + (production ? '.min' : '') + '.css',
  });
};
