"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    AttachmentCollection = require('../collections/attachment'),
    VoteCollection = require('../collections/vote'),
    urls = require('../../../urls');

var Message = Backbone.Model.extend({

    idAttribute: "url",

    initialize: function (options) {
        _.bindAll(this, 'permalink', 'toggleCollapse', 'socketAttachment',
                        'socketVote', 'setUser', 'setAttachments', 'setVotes', 'fork',
                        'isForked', 'getOrFetchForkedDiscussion');
        if (typeof options === 'undefined') {
            options = {};
        }

        this.setUser();
        this.attachments = new AttachmentCollection(options.attachments);
        this.votes = new VoteCollection(options.votes);
        var self = this;
        this.votes.on('add remove destroy reset change', function () {
            self.trigger('voteChanged');
        });
        this.bind('change:votes', this.setVotes);
        this.bind('change:user', this.setUser);
        this.bind('change:attachments', this.setAttachments);
        $(document).bind('socket.io:attachment', this.socketAttachment);
        $(document).bind('socket.io:vote', this.socketVote);
    },

    destroy: function (options) {
        $(document).unbind('socket.io:attachment', this.socketAttachment)
                   .unbind('socket.io:vote', this.socketVote);
    },

    serialized: function () {
        var data = this.toJSON();
        if (this.user) {
            data.user = this.user.serialized();
        }
        data.canEdit = this.isEditable();
        data.votes = this.votes.invoke('serialized');
        return data;
    },

    validate: function (attrs) {
        var errors = [];
        if (!attrs.raw_body && !this.attachments) {
            errors.push('Message cannot be empty');
        }
        return errors.length ? errors : null;
    },

    url: function () {
        return this.id || urls.get('api:message');
    },

    setUser: function () {
        var userId = this.get('user') || window.app.data.requestUser.id;
        this.user = window.app.data.users.get(userId) || window.app.data.anonUser;
        // messages are never new to the user who wrote them
        if (this.user.id === window.app.data.requestUser.id) {
            this.set({read: true}, {silent: true});
        }
    },

    setAttachments: function () {
        // update collection when underlying attachments change
        if (!this.isNew()) {
            this.attachments.reset(this.get('attachments'));
        }
    },

    setVotes: function () {
        // update collection when underlying votes change
        this.votes.reset(this.get('votes'));
    },

    permalink: function () {
        // the permalink depends on whether this is the
        // initial message in the discussion or a child message
        if (this.isNew()) {
            return null;
        }
        return this.get('permalink');
    },

    toggleCollapse: function () {
        if (this.get('collapsed')) {
            this.set({collapsed: false}, {silent: true});
        } else {
            this.set({collapsed: true}, {silent: true});
        }

        $.ajax({
            type: "PUT",
            url: urls.get('api:message:collapseExpand', {
                message_id: this.get('id')
            })
        });
    },
    socketAttachment: function (event, verb, attachment) {
        if (attachment.message === this.id) {
            if (this.attachments.get(attachment.url)) {
                this.attachments.get(attachment.url).set(attachment);
            } else {
                var attachmentModel = new $$.Attachment(attachment);
                this.attachments.add(attachmentModel);
            }
        }
    },
    socketVote: function (event, verb, vote) {
        /*
         * add/delete the vote to the votes collection on the message
         */
        // extract the message resource_uri
        var messageResource = vote.url.split('/').slice(0, -3).join('/') + '/',
            clientToken = $$.parseClientToken(vote._client_token),
            voteModel;
        if (this.id === messageResource) {
            // is the vote is already in the collection?
            voteModel = this.votes.get(vote.url);
            // check if current user is waiting for an update
            if (!voteModel && clientToken.isMine) {
                voteModel = this.votes.getByCid(clientToken.cId);
            }
            if (voteModel) {
                if (verb === "update" || verb === "create") {
                    voteModel.set(vote);
                } else if (verb === "delete") {
                    this.votes.remove(voteModel);
                }
            } else if (verb === "create") {
                voteModel = new $$.Vote(vote);
                this.votes.add(voteModel);
            }
        }
    },
    fork: function (data) {
        var that = this;
        $.ajax({
            type: 'POST',
            url: urls.get('api:message:fork', {
                message_id: this.get('id')
            }),
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function () {
                that.trigger('forked', that);
            }
        });
    },
    isForked: function () {
        return this.get('discussion') && this.get('parent');
    },
    isEditable: function () {
        return this.user.id === window.app.data.requestUser.id;
    },
    getOrFetchForkedDiscussion: function () {
        // return the forked discussion or fetch it
        var discussion,
            message = this,
            team = gingerApp.data.teams.get(this.get('team')),
            Discussion = require('./discussion');
        // check that we haven't already fetched the discussion
        // or a fetch is in progress
        if (this.forkedDiscussion) {
            return this.forkedDiscussion;
        }
        // get or fetch the discussion
        if (team) {
            this.forkedDiscussion = team.discussions.get(this.get('discussion'));
            if (!this.forkedDiscussion) {
                this.forkedDiscussion = new Discussion({'url': this.get('discussion')});
                this.forkedDiscussion.fetch({
                    'success': function (model, response) {
                        model.resetModels();
                        team.discussions.add(model);
                    }
                });
            }
            return this.forkedDiscussion;
        }
    }
});

module.exports = Message;
