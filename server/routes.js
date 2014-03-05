'use strict';
var ENV = process.env.NODE_ENV || 'development';
var config = require('../config/' + ENV);

exports.index = function (req, res) {
  res.cookie('config', JSON.stringify(config));
  res.render('index');
};
