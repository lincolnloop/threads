var Backbone = require('backbone'),
    Vote = require('../models/vote');

module.exports = Backbone.Collection.extend({
    model: Vote
});