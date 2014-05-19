'use strict';
var express = require('express');
var routes = require('./routes');
var path = require('path');
var hbs = require('express-hbs');

var start = function(port) {
  var app = express();

  app.engine('hbs', hbs.express3());

  app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'hbs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '..', 'build')));
  });

  app.configure('development', function () {
    app.use(express.errorHandler());

    // Make the /client directory available so that Chrome dev tools can follow
    // source maps
    app.use('/client', express.static(path.join(__dirname, '..', 'client')));
  });

  // Dispatch the index route unless the request is in one of the excluded paths
  app.get(/^\/patterns/, routes.patterns);

  // Dispatch the index route unless the request is in one of the excluded paths
  app.get(/^(?!(\/threads\.css|\/threads\.js|\/vendor\.js|\/fonts\/|\/static\/|\/client\/)).*$/, routes.index);

  app.listen(port);
};

exports.start = start;
