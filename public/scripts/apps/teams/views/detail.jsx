var _ = require('underscore'),
    React = require('react');

var TeamDetailView = React.createClass({
    componentWillMount: function () {
        console.log('TeamDetailView:componentWillMount');
        var team = this.props.team;
        team.on('change', _.bind(this.updateState, this));
        team.discussions.on('reset add remove change', _.bind(this.updateState, this));
        if (!team.discussions.fetched) {
            team.discussions.fetch();
        }
        this.updateState();
    },
    componentWillUnmount: function () {
        console.log('TeamDetailView:componentWillUnmount');
        this.props.team.off('change', _.bind(this.updateState, this));
        this.props.team.discussions.off(null, _.bind(this.updateState, this));
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
