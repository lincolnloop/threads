var Backbone = require('backbone'),
    Message = require('./message'),
    MessageCollection = require('../collections/message'),
    urls = require('../../../urls');

var DiscussionModel = Backbone.Model.extend({
    idAttribute: "url",
    initialize: function () {
        console.log('DiscussionModel:initialize');
        this.message = new Message();
        this.messages = new MessageCollection();
        this.latestMessage = new Message();
        this.setRelationships();
    },
    setRelationships: function () {
        /*
         * Set the backbone objects (message, latestMessage, messages)
         * from the JSON attributes on `this`.
         * This needs to be called manually when full data is fetched from the server.
         */
        var msg = this.get('message'),
            latest = this.get('latest_message'),
            children = this.get('children');
        if (this.isNew()) {
            return;
        }
        if (msg) {
            this.hasSummary = true;
            this.message.set(msg);
            this.message.setUser();
            this.user = this.message.user;
        }
        if (children) {
            this.hasDetail = true;
            this.messages.reset(children);
            this.messages.invoke('set', {team: this.get('team')}, {silent: true});
            if (children.length === 0) {
                this.latestMessage.set(msg);
                this.latestMessage.setUser();
            } else {
                this.setLatest();
            }
        } else {
            this.latestMessage.set(latest);
            this.latestMessage.setUser();
        }
        this.set({
            date_latest_activity: this.latestMessage.get('date_created')
        });
    },
    url: function () {
        return this.id || urls.get('api:discussion');
    },
    getDateObj: function () {
        return new Date(this.get('date_latest_activity'));
    },
    serialized: function () {
        return this.toJSON();
    }
});

module.exports = DiscussionModel;
