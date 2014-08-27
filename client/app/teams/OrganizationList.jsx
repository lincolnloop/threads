'use strict';

var _ = require('underscore');
var React = require('react');
var log = require('loglevel');
var Header = require('../components/Header.jsx');
var OrganizationView = require('./Organization.jsx');

var OrganizationListView = React.createClass({
  render: function() {
    log.info('OrganizationView:render');
    return (
      <div className="content-view">
        {this.props.organizations.map(function(org) {
          return OrganizationView(_.extend({key: org.name}, org));
        })}
      </div>
    );
  },

  componentDidMount: function() {
    store.on('change:teams', this.forceUpdate.bind(this));
  },

  componentWillUnmount: function() {
    store.off('change:teams', this.forceUpdate.bind(this));
  }

});

module.exports = OrganizationListView;
