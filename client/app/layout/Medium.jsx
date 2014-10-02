'use strict';

var _ = require('underscore');
var classSet = require('react/lib/cx');
var log = require('loglevel');
var React = require('react');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var OrganizationList = require('../teams/OrganizationList.jsx');
var store = require('../store');
var teamUtils = require('../teams/utils');
var urls = require('../urls');
var Header = require('./SmallHeader.jsx');
var Sidebar = require('./Sidebar.jsx');
var Footer = require('./SmallFooter.jsx');

var AppView = React.createClass({

  getInitialState: function() {
    log.info('MediumAppView:getInitialState');
    return {}
  },

  render: function() {
    return (
      <section className="app medium">
        <Sidebar handleLayoutClick={this.props.handleLayoutClick} />
        <div className="content-main">
          {this.props.main}
        </div>
      </section>
    );
  },

  componentDidUpdate: function() {
    var contentNodes = document.getElementsByClassName('content');
    if (contentNodes.length) {
      // scroll document to top when doing a page transition
      // TODO: Apply this to the new content page only
      window.scrollTo(0,0);
    }
  }
});

window.store = store;

module.exports = AppView;
