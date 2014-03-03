'use strict';

var _ = require('underscore');
var React = require('react');
var Team = require('./Team');
var log = require('loglevel');

var Organization = React.createClass({
  render: function() {
    log.debug('Organization:render');
    return (
      React.DOM.div({'className': 'org-group'},
        React.DOM.h3({}, this.props.name),
        React.DOM.ul({},
          this.props.teams.map(function(team) {
            return Team(_.extend({'key': team.slug}, team));
          })
        )
      )
    );
  }
});

module.exports = Organization;
