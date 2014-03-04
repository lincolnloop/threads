'use strict';

var _ = require('underscore');
var React = require('react');
var TeamView = require('./team');
var log = require('loglevel');

var OrganizationView = React.createClass({
  render: function() {
    log.debug('Organization:render');
    return (
      React.DOM.div({'className': 'org-group'},
        React.DOM.h3({}, this.props.name),
        React.DOM.ul({},
          this.props.teams.map(function(team) {
            return TeamView(_.extend({'key': team.slug}, team));
          })
        )
      )
    );
  }
});

module.exports = OrganizationView;
