'use strict';

var _ = require('underscore');
var $ = require('jquery');
var md5 = require('MD5');
var Backbone = require('backbone');
var urls = require('../urls');

module.exports = Backbone.Model.extend({
  idAttribute: 'url',
  initialize: function () {
    _.bindAll(this, 'setEmailHash', 'getGravatar', 'saveOrg');
    this.setEmailHash();
    this.bind('change:email', this.setEmailHash);
  },
  defaults: {
    online: false
  },
  // API URL
  url: function () {
    return this.id;
  },
  setEmailHash: function () {
    this.emailHash = md5(this.get('email') || '');
  },
  getGravatar: function (size) {
    size = size || 40;
    return 'https://secure.gravatar.com/avatar/' + this.emailHash + '?d=mm&amp;s=' + size;
  },
  saveOrg: function (callback) {
    var ajaxOpts;
    if (this.get('organization')) {
      ajaxOpts = {
        type: 'PUT',
        url: urls.get('api:userprofile'),
        contentType: 'application/json',
        data: JSON.stringify({'organization': this.get('organization')})
      };
      if (_.isFunction(callback)) {
        ajaxOpts.success = callback;
      }
      $.ajax(ajaxOpts);
    }
  },
  serialized: function () {
    var data = this.toJSON();
    data.gravatar = this.getGravatar();
    return data;
  }
});
