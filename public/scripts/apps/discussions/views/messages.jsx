var _ = require('underscore'),
    $ = require('jquery'),
    React = require('react'),
    VotesView = require('./votes.jsx'),
    Message = require('../models/message'),
    urls = require('../../../urls');

var MessageTreeView = React.createClass({
    // FIXME: this could be much more efficient
    render: function () {
        console.log('MessageTreeView:render');
        var children,
            others,
            self = this,
            parentUrl = this.props.parent;
        if (parentUrl) {
            function isChild(message) {
                return message.parent === parentUrl;
            }
            children = _.filter(this.props.data, isChild);
            others = _.reject(this.props.data, isChild);
        } else {
            children = [_.first(this.props.data)];
            others = _.rest(this.props.data);
        }
        childTrees = children.map(function (message) {
            // recursively using JSX causes issues. Falling back to regular JS.
            return MessageDetailView({
                key: message.url || 'new',
                data: message,
                children: MessageTreeView({
                    data:others,
                    parent:message.url,
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

var MessageEditView = React.createClass({
    getInitialState: function () {
        return {preview: null};
    },
    submit: function (event) {
        console.log('MessageEditView:submit');
        event.preventDefault();
        var rawBody = $('textarea', event.target).val(),
            message;
        if (this.props.data) {
            message = this.props.discussion.getMessage(this.props.data.url);
            message.set('raw_body', rawBody);
            message.save();
        } else {
            message = new Message({
                raw_body: rawBody,
                parent: this.props.parent
            });
            message.save();
            this.props.discussion.messages.add(message);
        }
        this.props.done();
    },
    loadPreview: function (rawBody, callback) {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8000' + urls.get('api:message:preview'),
            contentType: 'application/json',
            data: JSON.stringify({'raw_body': rawBody}),
            headers: {
                Authorization: 'Token ' + localStorage.Authorization
            },
            success: callback
        });
    },
    preview: function () {
        console.log('MessageEditView:preview');
        var rawBody,
            self = this;
        if (this.state.preview) {
            this.setState({preview: null});
        } else {
            rawBody = $('textarea', this.getDOMNode()).val();
            this.loadPreview(rawBody, function (messageObj) {
                // FIXME: why is this returning an array for body?
                self.setState({preview: messageObj.body[0]});
            });
        }
    },
    render: function () {
        console.log('MessageEditView:render');
        var defaultValue = this.props.data && this.props.data.raw_body,
            previewClass = this.state.preview ? 'preview' : 'preview hide',
            textareaClass = this.state.preview ? 'hide' : '';

        return (
            <form onSubmit={this.submit}>
            <textarea className={textareaClass} defaultValue={defaultValue} placeholder="Comment..."></textarea>
            <div className={previewClass} className="preview" dangerouslySetInnerHTML={{__html: this.state.preview}}></div>
            <input type="submit" />{' '}
            <a onClick={this.preview}>{this.state.preview ? 'Back to Edit' : 'Preview' }</a>{' '}
            <a onClick={this.props.done}>cancel</a>
            </form>
        );
    }
})

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
            doneReplying = _.partial(this.done, 'replying');
        return (
            <div className="message-detail">
                <MessageView data={this.props.data} discussion={this.props.discussion} done={doneEditing} />
                {this.props.data.canEdit ? <a onClick={this.edit}>edit</a> : ''}
                <img src={this.props.data.user.gravatar} />{' '}
                {this.props.data.user.name}<br />
                {this.props.data.date_created}<br />
                <a onClick={this.reply}>reply</a>
                <VotesView data={this.props.data.votes} messageUrl={this.props.data.url} discussion={this.props.discussion} />
                <hr />
                {this.state.replying ? <MessageEditView parent={this.props.data.url} discussion={this.props.discussion} done={doneReplying} /> : ''}
                {this.props.children}
            </div>
        );
    }
});

module.exports = MessageTreeView;