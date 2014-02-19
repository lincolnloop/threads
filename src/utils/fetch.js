'use strict';

var RSVP = require('rsvp');
var config = require('clientconfig');

// urls/routing
var urls = require('../urls');



var token = function() {
  /*
   * Return a promise for a refreshed token
   */
  var promise =  RSVP.Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', config.apiUrl + urls.get('api:refresh_tokens'));
    request.responseType = 'json';
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Token ' + localStorage.apiKey);

    request.onload = function() {
      if (request.status === 200) {
        console.log(request);
        resolve(request.response);
      } else {
        reject(request);
      }
    };

    request.send();
  });

  return promise;
};

exports.token = token;
