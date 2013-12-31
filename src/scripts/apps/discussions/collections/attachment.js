var Backbone = require('backbone'),
    Attachment = require('../models/attachment');

module.exports = Backbone.Collection.extend({
    model: Attachment
});