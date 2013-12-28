var _ = require('underscore'),
    $ = require('jquery'),
    React = require('react'),
    VotesView = require('./votes.jsx'),
    MessageEditView = require('./messageEdit.jsx'),
    Message = require('../models/message'),
    urls = require('../../../urls');

require('react/addons');

var MessageTreeView = React.createClass({
    // FIXME: this could be much more efficient
    render: function () {
        console.log('MessageTreeView:render');
        var children,
            others,
            self = this,
            parentUrl = this.props.parent;
        if (parentUrl) {
            children = this.props.lookup[parentUrl] || [];
            others = _.difference(this.props.data, children);
        } else {
            children = [_.first(this.props.data)];
            others = _.rest(this.props.data);
        }
        childTrees = children.map(function (message) {
            // recursively using JSX causes issues. Falling back to regular JS.
            return MessageDetailView({
                key: message.url || 'new',
                data: message,
                children: others,
                childViews: MessageTreeView({
                    data: others,
                    lookup: self.props.lookup,
                    parent: message.url,
                    discussion: self.props.discussion
                }),
                discussion: self.props.discussion
            });
        });
        return (<div className="message-children">{childTrees}</div>);
    }
});

var MessageContentView = React.createClass({
    render: function () {
        console.log('MessageContentView:render');
        return <div className="content"  dangerouslySetInnerHTML={{__html: this.props.data.body}}></div>;
    }
});

var MessageDetailView = React.createClass({
    getInitialState: function () {
        return {
            editing: false,
            replying: false
        };
    },
    edit: function (event) {
        this.setState({editing: true});
    },
    reply: function (event) {
        this.setState({replying: true});
    },
    done: function (input) {
        var state = {};
        state[input] = false;
        this.setState(state);
    },
    render: function () {
        console.log('MessageDetailView:render');
        var MessageView = this.state.editing && !this.previewing ? MessageEditView : MessageContentView,
            doneEditing = _.partial(this.done, 'editing'),
            doneReplying = _.partial(this.done, 'replying'),
            classes = React.addons.classSet({
                'message-detail': true,
                'message-unread': !this.props.data.read,
                'message-collapsed': this.props.data.collapsed
            });
        return (
            <div className={classes}>
                <MessageView data={this.props.data} discussion={this.props.discussion} done={doneEditing} />
                {this.props.data.canEdit ? <a onClick={this.edit}>edit</a> : ''}
                <img src={this.props.data.user.gravatar} />{' '}
                {this.props.data.user.name}<br />
                {this.props.data.date_created}<br />
                <a onClick={this.reply}>reply</a>
                <VotesView data={this.props.data.votes} messageUrl={this.props.data.url} discussion={this.props.discussion} />
                <hr />
                {this.state.replying ? <MessageEditView parent={this.props.data.url} discussion={this.props.discussion} done={doneReplying} /> : ''}
                {this.props.childViews}
            </div>
        );
    }
});

module.exports = MessageTreeView;