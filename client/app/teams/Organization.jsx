'use strict';

var _ = require('underscore');
var React = require('react');
var TeamView = require('./TeamItem.jsx');
var log = require('loglevel');

var OrganizationView = React.createClass({
  render: function() {
    log.debug('Organization:render');
    return (
      React.DOM.div({'className': 'org-group'},
        React.DOM.h3({'className': 'org-header'}, this.props.name),
        React.DOM.ul({'className': 'team-list'},
          this.props.teams.map(function(team) {
            return TeamView(_.extend({'key': team.slug}, team));
          })
        )
      )
    );
  }
});

module.exports = OrganizationView;
