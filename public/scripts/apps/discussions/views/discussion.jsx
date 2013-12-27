var React = require('react'),
    EventsMixin = require('../../../core/eventsMixin'),
    MessageTreeView = require('./messages.jsx');


var DiscussionDetailView = React.createClass({
    /*
     * Manages state of the message tree including votes and attachments.
     */
    mixins: [EventsMixin],
    componentWillMount: function () {
        console.log('DiscussionDetailView:componentWillMount');
        var discussion = this.props.discussion;
        this.events.listenTo(discussion, 'sync change', this.updateState);
        this.events.listenTo(discussion.message, 'sync change votesChanged', this.updateState);
        this.events.listenTo(discussion.messages, 'reset add remove change voteChanged', this.updateState);
        this.updateState();
        discussion.fetchAll();
    },
    updateState: function () {
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
        var message = this.props.discussion.message.serialized(),
            children = this.props.discussion.messages.invoke('serialized'),
            // on first render add the discussion message into the message tree
            messages = children.unshift(message);
        return (
            <div className="discussion-detail">
                <h2>{this.state.data.title}</h2>
                <MessageTreeView data={children} discussion={this.props.discussion} />
            </div>
        );
    }
});
module.exports = DiscussionDetailView;