"use strict";

var _ = require('underscore'),
    Backbone = require('backbone'),
    Message = require('../models/message');

var MessageCollection = Backbone.Collection.extend({
    model: Message,
    serialized: function () {
        // Create nested tree
        if (this.length === 0) {
            return [];
        }
        var lookup = {},
            tree = [],
            parentId = this.first().get('parent');
        this.each(function (message) {
            var msg = message.serialized();
            msg.children = [];
            lookup[msg.url] = msg;
            if (msg.parent === parentId) {
                tree.push(msg);
            } else {
                lookup[msg.parent].children.push(msg);
            }
        });
        return tree;
    }
});

module.exports = MessageCollection;