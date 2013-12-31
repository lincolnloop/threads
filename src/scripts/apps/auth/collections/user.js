var Backbone = require('backbone'),
    User = require('../models/user'),
    urls = require('../../../urls');

module.exports = Backbone.Collection.extend({
    model: User,
    url: function () {
        return urls.get('api:user');
    }
});