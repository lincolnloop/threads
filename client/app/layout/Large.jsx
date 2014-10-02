'use strict';

var _ = require('underscore');
var classSet = require('react/lib/cx');
var log = require('loglevel');
var React = require('react');
var OrganizationList = require('../teams/OrganizationList.jsx');
var store = require('../store');
var teamUtils = require('../teams/utils');
var urls = require('../urls');
var Header = require('./SmallHeader.jsx');
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
        <Sidebar handleLayoutClick={this.props.handleLayoutClick} />
        <nav className="list-main">
          <Header title={this.props.title}
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
