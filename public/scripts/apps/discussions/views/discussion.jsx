var _ = require('underscore'),
    React = require('react'),
    EventsMixin = require('../../../core/eventsMixin'),
    VotesView = require('./votes.jsx');

var MessageTreeView = React.createClass({
    // FIXME: this could be much more efficient
    render: function () {
        var children,
            others,
            self = this,
            parentUrl = this.props.parent;
        function isChild(message) {
            return message.parent == parentUrl;
        }
        children = _.filter(this.props.data, isChild);
        others = _.reject(this.props.data, isChild);
        childTrees = children.map(function (message) {
            // recursively using JSX causes issues. Falling back to regular JS.
            return MessageDetailView({
                key: message.url,
                data: message,
                children: MessageTreeView({data:others, parent:message.url}),
                discussion: self.props.discussion
            });
        });
        return (<div className="message-children">{childTrees}</div>)
    }
});

var MessageDetailView = React.createClass({
    getInitialState: function () {
        return {editing: false};
    },
    render: function () {
        console.log('MessageDetailView:render');
        if (this.state.editing) {
            msgText = <textarea value={this.props.data.raw_body}></textarea>;
        } else {
            msgText = <div className="content"  dangerouslySetInnerHTML={{__html: this.props.data.body}}></div>;
        }
        return (
            <div className="message-detail">
                {msgText}
                <img src={this.props.data.user.gravatar} />{' '}
                {this.props.data.user.name}<br />
                {this.props.data.date_created}
                <VotesView data={this.props.data.votes} messageUrl={this.props.data.url} discussion={this.props.discussion} />
                <hr />
                {this.props.children}
            </div>
        );
    }
})

var DiscussionDetailView = React.createClass({
    mixins: [EventsMixin],
    componentWillMount: function () {
        console.log('DiscussionDetailView:componentWillMount');
        var discussion = this.props.discussion;
        this.events.listenTo(discussion, 'sync change', this.updateState);
        this.events.listenTo(discussion.message, 'sync change stateChanged', this.updateState);
        this.events.listenTo(discussion.messages, 'reset add remove change', this.updateState);
        this.updateState();
        discussion.fetchAll();
    },
    updateState: function () {
        console.log('DiscussionDetailView:updateState');
        this.setState({data: this.props.discussion.serialized()});
    },
    onUserInput: function () {
        console.log(arguments);
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
            children = this.props.discussion.messages.invoke('serialized');
        return (
            <div className="discussion-detail">
                <h2>{this.state.data.title}</h2>
                <MessageDetailView data={message} discussion={this.props.discussion} />
                <hr />
                <MessageTreeView data={children} parent={message.url} discussion={this.props.discussion} />
            </div>
        );
    }
});
module.exports = DiscussionDetailView;