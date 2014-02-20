'use strict';

var Backbone = require('backbone');

module.exports = Backbone.Model.extend({

  idAttribute: 'url',
  
  serialized: function () {
    var data = this.toJSON();
    //data.user = this.user.serialized();
    return data;
  },

  url: function () {
    return this.id || (this.get('message') + 'vote/');
  }
});