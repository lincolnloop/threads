'use strict';

var Backbone = require('backbone');

module.exports = Backbone.Model.extend({

  idAttribute: 'url',

  initialize: function (options) {
    if (options.user) {
      this.user = window.data.users.get(options.user) || window.data.anonUser;
    } else {
      this.user = window.data.user;
    }
  },
  serialized: function () {
    var data = this.toJSON();
    data.user = this.user.serialized();
    return data;
  },

  url: function () {
    return this.id || (this.get('message') + 'vote/');
  }
});
