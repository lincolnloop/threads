var _ = require('underscore'),
    React = require('react');
/*
var OrgTeamListView = React.createClass({
    render: function () {
        console.log('OrgListTeamView:render');
        var teamNodes = this.props.data.map(function (team) {
            var unread = team.unread.length;
            return (
                <li key={team.slug}>
                    <a href={team.link}>
                        {team.name}{' '}
                        <span className="unread-count">{unread ? unread : ''}</span>
                    </a>
                </li>
            );
        });
        return (
            <ul>
                {teamNodes}
            </ul>
        );
    }
});
*/

var MessageDetailView = React.createClass({
    render: function () {
        console.log('MessageDetailView:render');
        return (
            <div className="message-detail">
                <div className="content"  dangerouslySetInnerHTML={{__html: this.props.data.body}}></div>
                {this.props.data.user.gravatar}
            </div>
        );
    }
})

var DiscussionDetailView = React.createClass({
    componentWillMount: function () {
        console.log('DiscussionDetailView:componentWillMount');
        this.props.discussion.on('reset add remove change', _.bind(this.updateState, this));
        this.updateState();
    },
    updateState: function () {
        console.log('DiscussionDetailView:updateState');
        this.setState({data: this.props.discussion.serialized()});
    },
    render: function() {
        console.log('DiscussionDetailView:render');
        var self = this;
        var message = this.props.discussion.message.serialized();
        return (
          <div className="discussion-detail">
            {this.state.data.title}
            <MessageDetailView data={message} />
          </div>
        );
    }
});
module.exports = DiscussionDetailView;