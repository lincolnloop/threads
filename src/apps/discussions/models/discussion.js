"use strict";

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
        this.hasSummary = false;
        this.hasDetail = false;
        this.on('sync', this.setRelationships);
        this.setRelationships();
    },
    setLatest: function () {
        /*
         * Updates latestMessage and the attribute 'date_latest_activity'
         * Called when new messages are added to the
         * `messages` collection, and when the `date_created` attribute changes.
         */
        this.latestMessage = this.messages.last();
        this.set({date_latest_activity: this.latestMessage.get('date_created')});
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
    fetchAll: function (cb) {
        if (!this.hasDetail) {
            this.fetch({success: cb});
        }
    },
    url: function () {
        return this.id || urls.get('api:discussion');
    },
    getDateObj: function () {
        // TODO: this.get('date_latest_activity') 
        // doesn't return on first save
        return new Date(this.get('message').date_latest_activity);
    },
    serialized: function () {
        var data = this.toJSON();
        data.message = this.message.serialized();
        data.message.children = this.messages.serialized();
        return data;
    },
    getMessage: function (messageUrl) {
        return this.message.id === messageUrl ? this.message : this.messages.get(messageUrl);
    }
});

module.exports = DiscussionModel;
