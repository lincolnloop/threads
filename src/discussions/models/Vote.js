'use strict';

var Backbone = require('backbone');

module.exports = Backbone.Model.extend({

  idAttribute: 'url',

  initialize: function (options) {
    if (options.user) {
      this.user = window.AppView.state.users.get(options.user) || window.AppView.state.anonUser;
    } else {
      this.user = window.AppView.state.user;
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
