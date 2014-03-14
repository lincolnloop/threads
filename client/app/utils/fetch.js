'use strict';

var RSVP = require('rsvp');
var config = require('./config');
var urls = require('../urls');


var userUri = function() {
  /*
   * Return a promise for the user URI
   */
  var promise = new RSVP.Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', config.apiUrl + urls.get('api:refresh_tokens'));
    request.responseType = 'json';
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', 'Token ' + localStorage.apiKey);

    request.onload = function() {
      if (request.status === 200) {
        // Resolve the promise with the 'url' attribute of the JSON response
        resolve(request.response.url);
      } else {
        reject(Error('There was a server error fetching user data'));
      }
    };

    request.onerror = function() {
      reject(Error('There was an error fetching user data'));
    };

    request.send();
  });

  return promise;
};

exports.userUri = userUri;
