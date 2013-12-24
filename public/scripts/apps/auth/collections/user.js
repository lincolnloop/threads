var Backbone = require('backbone'),
    User = require('../models/user'),
    urls = require('../../../urls');

module.exports = Backbone.Collection.extend({
    model: User,
    url: function () {
        return 'http://localhost:8000' + urls.get('api:user');
    }
});