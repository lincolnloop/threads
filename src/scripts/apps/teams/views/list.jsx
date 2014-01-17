"use strict";

var _ = require('underscore'),
    React = require('react'),
    EventsMixin = require('../../../core/eventsMixin');

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


var TeamListView = React.createClass({
    mixins: [EventsMixin],
    componentWillMount: function () {
        console.log('TeamListView:componentWillMount');
        _.bindAll(this, 'updateState');
        // TODO: add forces a render for every team that is added to a collection
        this.events.listenTo(this.props.teams, 'sync add remove change', this.updateState);
        this.updateState();
    },
    updateState: function () {
        console.log('TeamListView:updateState');
        this.setState({data: this.props.teams.serialized()});
    },
    render: function() {
        console.log('TeamListView:render');
        var self = this;
        var orgNodes = _.map(this.state.data, function (teams, org) {
            return (
                <div className="org-group" key={org}>
                    <h3>{org}</h3>
                    <OrgTeamListView data={teams} />
                </div>
            );
        });
        return (
          <div className="team-list">
            {orgNodes}
          </div>
        );
    }
});
module.exports = TeamListView;
