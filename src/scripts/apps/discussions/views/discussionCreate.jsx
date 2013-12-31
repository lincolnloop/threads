var React = require('react'),
    MessageEditView = require('./messageEdit.jsx');

module.exports = React.createClass({
    componentWillMount: function () {
        this.props.discussion.once('change:url', this.redirect);
    },
    messageCreateCallback: function (rawBody) {
        console.log('DiscussionCreateView:messageCreateCallback');
        var self = this,
            title = $('#disc-title').val();
        this.props.discussion.set({
            title: title,
            message: {
                raw_body: rawBody
            }
        });
        this.props.discussion.save({}, {
            success: function (disc) {
                self.props.team.discussions.add(disc);
            }
        });
    },
    redirect: function () {
        console.log('DiscussionCreateView:redirect');
        var discUrl = this.props.discussion.get('message').permalink;
        window.app.router.navigate(discUrl, {trigger: true});
    },
    render: function () {
        console.log('DiscussionCreateView:render');
        var teamName = this.props.team.get('name');
        return (
            <div className="discussion-create">
                <h2>{teamName} : New Discussion</h2>
                <input id="disc-title" type="text" placeholder="What are we talking about?" />
                <MessageEditView discussion={this.props.discussion} done={this.messageCreateCallback} />
            </div>
        );
    }
});