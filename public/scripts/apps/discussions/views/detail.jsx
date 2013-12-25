var _ = require('underscore'),
    React = require('react'),
    EventsMixin = require('../../../core/eventsMixin');

var MessageTreeView = React.createClass({
    // FIXME: this could be much more efficient
    render: function () {
        var children,
            others,
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
                children: MessageTreeView({data:others, parent:message.url})
            });
        });
        return (<div className="message-children">{childTrees}</div>)
    }
});

var MessageDetailView = React.createClass({
    render: function () {
        console.log('MessageDetailView:render');
        return (
            <div className="message-detail">
                <div className="content"  dangerouslySetInnerHTML={{__html: this.props.data.body}}></div>
                <img src={this.props.data.user.gravatar} />{' '}
                {this.props.data.user.name}<br />
                {this.props.data.date_created}
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
        _.bindAll(this, 'updateState')
        var discussion = this.props.discussion;
        this.events.listenTo(discussion, 'sync change', this.updateState);
        this.events.listenTo(discussion.message, 'sync change', this.updateState);
        this.events.listenTo(discussion.messages, 'reset add remove change', this.updateState);
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
            children = this.props.discussion.messages.invoke('serialized');
        return (
            <div className="discussion-detail">
                <h2>{this.state.data.title}</h2>
                <MessageDetailView data={message} />
                <hr />
                <MessageTreeView data={children} parent={message.url} />
            </div>
        );
    }
});
module.exports = DiscussionDetailView;