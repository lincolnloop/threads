'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var ReactDOM = require('react-dom');
var log = require('loglevel');
var qs = require('query-string');
var React = require('react');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var OrganizationList = require('../teams/OrganizationList.jsx');
var store = require('../store');
var teamUtils = require('../teams/utils');
var urls = require('../urls');
var Sidebar = require('./Sidebar.jsx');
var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');

var AppView = React.createClass({

  handleSearch: function(evt) {
    evt.preventDefault();
    var query = ReactDOM.findDOMNode(this.refs.search).value;
    var team = this.props.team ? this.props.team.slug : '';

    var url = urls.get('search:q') + '?query=' + query;
    if (team) {
      url += '&team=' + team;
    }
    app.history.navigate(url, {'trigger': true});
  },

  getInitialState: function() {
    log.info('MediumAppView:getInitialState');
    return {}
  },

  render: function() {
    var qo = qs.parse(location.search);
    var query = qo.query;
    return (
      <section className="app medium">
        <Sidebar handleLayoutClick={this.props.handleLayoutClick} />
        <div className="content-main">
          <Header title={this.props.title}
                  contextView={this.props.headerContextView} />
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
