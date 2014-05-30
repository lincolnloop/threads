'use strict';

var Q = require('q');
var config = require('./config');
var urls = require('../urls');

var userUri = function() {
  /*
   * Return a promise for the user URI
   */
  var deferred = Q.defer();
  var request = new XMLHttpRequest();
  var url = config.apiUrl + urls.get('api:refresh_tokens');
  request.open('GET', url);
  // for some reason this fails on android/iOS default browsers
  //request.responseType = 'json';
  request.setRequestHeader('Accept', 'application/json');
  request.setRequestHeader('Authorization', 'Token ' + localStorage.apiKey);

  request.onload = function() {
    if (request.status === 200) {
      // Resolve the promise with the 'url' attribute of the JSON response
      deferred.resolve(request.response.url);
    } else {
      deferred.reject(Error('There was a server error fetching user data'));
    }
  };

  request.onerror = function() {
    deferred.reject(Error('There was an error fetching user data'));
  };

  request.send();

  return deferred.promise;
};

exports.userUri = userUri;
