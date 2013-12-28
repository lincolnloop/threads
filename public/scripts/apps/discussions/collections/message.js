var _ = require('underscore'),
    Backbone = require('backbone'),
    Message = require('../models/message');

var MessageCollection = Backbone.Collection.extend({
    model: Message,
    serialized: function () {
        // Group by organization and serialize each team model
        var data = this.groupBy(function (message) {
            return message.get('parent');
        });
        _.each(data, function (messages, parent) {
            data[parent] = _.invoke(messages, 'serialized');
        });
        return data;
    }
});

module.exports = MessageCollection;