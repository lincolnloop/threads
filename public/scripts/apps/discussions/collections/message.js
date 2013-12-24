var Backbone = require('backbone'),
    Message = require('../models/message');

var MessageCollection = Backbone.Collection.extend({
    model: Message
});

module.exports = MessageCollection;