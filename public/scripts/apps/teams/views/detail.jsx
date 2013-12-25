var _ = require('underscore'),
    Backbone = require('backbone'),
    React = require('react'),
    EventsMixin = require('../../../core/eventsMixin');

var TeamDetailView = React.createClass({
    mixins: [EventsMixin],
    componentWillMount: function () {
        console.log('TeamDetailView:componentWillMount');
        var team = this.props.team;
        this.events.listenTo(team, 'change', this.updateState);
        this.events.listenTo(team.discussions, 'sync add remove change', this.updateState);
        if (!team.discussions.fetched) {
            team.discussions.fetch();
        }
        this.updateState();
    },
    componentWillUnmount: function () {
        console.log('TeamDetailView:componentWillUnmount');
    },
    updateState: function () {
        console.log('TeamDetailView:updateState');
        this.setState({
            team: this.props.team.serialized(),
            discussions: this.props.team.discussions.serialized()
        });
    },
    render: function() {
        console.log('TeamDetailView:render');
        var discussionNodes = this.state.discussions.map(function (disc) {
            return (
                <li key={disc.url}>
                    <a href={disc.message.permalink}>{disc.title}</a>
                </li>
            );
        });
        return (
          <div className="team-detail">
            <h2>{this.state.team.name}</h2>
            <ul>
                {discussionNodes}
            </ul>
          </div>
        );
    }
});

module.exports = TeamDetailView;
