'use strict';

var md5 = require('MD5');

var gravatar = {
  getEmailHash: function(email) {
    return md5(email || '');
  },
  get: function(email, size) { 
    size = size || 40;
    return 'https://secure.gravatar.com/avatar/' + this.getEmailHash(email) + '?d=mm&amp;s=' + size;
  }
};

module.exports = gravatar;
