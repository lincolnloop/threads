'use strict';

var _ = require('underscore');
var zepto = require('browserify-zepto');
var classSet = require('react/lib/cx');
var log = require('loglevel');
var React = require('react');
var OrganizationList = require('../teams/OrganizationList.jsx');
var store = require('../store');
var teamUtils = require('../teams/utils');
var urls = require('../urls');
var ListHeader = require('./ListHeader.jsx');
var Sidebar = require('./Sidebar.jsx');
var Footer = require('./SmallFooter.jsx');

var AppView = React.createClass({

  getInitialState: function() {
    log.info('LargeAppView:getInitialState');
    return {
      'layout': 'auto'
    }
  },

  render: function() {
    return (
      <section className="app large">
        <Sidebar ref="sidebar" handleLayoutClick={this.props.handleLayoutClick} />
        <nav className="list-main">
          <ListHeader title={this.props.title}
                contextView={this.props.headerContextView} />
          {this.props.list}
        </nav>
        <div className="content-main">
          {this.props.main}
        </div>
      </section>
    );
  },

  componentDidUpdate: function() {
    var teamSlug = this.props.team ? this.props.team.slug : null;
    var contentNodes = document.getElementsByClassName('content');
    if (contentNodes.length) {
      // scroll document to top when doing a page transition
      // TODO: Apply this to the new content page only
      window.scrollTo(0,0);
    }
    // set active team
    // TODO: Check if the active node has changed before doing anything
    // 1. reset current active
    var sidebarNode = this.refs.sidebar.getDOMNode();
    zepto('.active', sidebarNode).removeClass('active');
    if (!teamSlug) {
      return;
    }
    // 2. set active node
    zepto('[data-slug=' + teamSlug + ']').addClass('active');

  }
});

window.store = store;

module.exports = AppView;
