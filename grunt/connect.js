"use strict";

var ENV = process.env.NODE_ENV || 'development',
    config = require('../config/' + ENV),
    Cookies = require('cookies'),
    pushState = require('grunt-connect-pushstate/lib/utils').pushState;

module.exports = {
  server: {
    options: {
      base: 'build',
      port: 8000,
      middleware: function (connect, options) {
        return [
            Cookies.express(),
            function (req, res, next) {
              res.cookies.set('config', JSON.stringify(config), { httpOnly: false });
              next();
            },
            pushState(),
            connect.static(options.base)
        ];
      }
    }
  }
};