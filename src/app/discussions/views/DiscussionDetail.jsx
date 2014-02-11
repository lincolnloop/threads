"use strict";

var _ = require('underscore'),
    React = require('react'),
    EventsMixin = require('../../core/eventsMixin'),
    MessageTreeView = require('./messages.jsx');


var DiscussionDetailView = React.createClass({
    /*
     * Manages state of the message tree including votes and attachments.
     */
    mixins: [EventsMixin],
    componentWillMount: function () {
        console.log('DiscussionDetailView:componentWillMount');
        var discussion = this.props.discussion;
        this.events.listenTo(discussion, 'change', this.updateState);
        this.events.listenTo(discussion.message, 'change reset voteChanged', this.updateState);
        this.events.listenTo(discussion.messages, 'change reset voteChanged', this.updateState);
        this.updateState();
        discussion.fetchAll();
    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    },
    updateState: function (event) {
        console.log('DiscussionDetailView:updateState');
        this.setState({data: this.props.discussion.serialized()});
    },
    render: function() {
        console.log('DiscussionDetailView:render');
        var message = this.props.discussion.message;
        // if the message doesn't have an ID, we're still waiting on a sync
        return message.isNew() ? this.renderEmpty() : this.renderFull();
    },
    renderEmpty: function () {
        return <div className="discussion-detail loading"></div>;
    },
    renderFull: function () {
        return (
            <div className="discussion-detail">
                <h2>{this.state.data.title}</h2>
                <MessageTreeView data={this.state.data.message} discussion={this.props.discussion} />
            </div>
        );
    }
});
module.exports = DiscussionDetailView;