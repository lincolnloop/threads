'use strict';
var config = require('../config/' + (process.env.NODE_ENV || 'development'));
var pkg = require('../package.json');

var production = (process.env.NODE_ENV === 'production');

exports.index = function (req, res) {
  console.log('routes:index');
  res.cookie('config', JSON.stringify(config));
  res.render('index', {
    app: pkg.name + (production ? '.min' : '') + '.js',
    vendor: 'vendor' + (production ? '.min' : '') + '.js',
    css: pkg.name + (production ? '.min' : '') + '.css',
  });
};

exports.patterns = function (req, res) {
  console.log('routes:patterns');
  res.cookie('config', JSON.stringify(config));
  res.render('patterns', {
    app: '/' + pkg.name + (production ? '.min' : '') + '.js',
    vendor: '/vendor' + (production ? '.min' : '') + '.js',
    css: '/' + pkg.name + (production ? '.min' : '') + '.css',
  });
};
