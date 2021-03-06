'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var qs = require('query-string');
var zepto = require('browserify-zepto');
var log = require('loglevel');
var React = require('react');
var ReactDOM = require('react-dom');
var OrganizationList = require('../teams/OrganizationList.jsx');
var store = require('../store');
var teamUtils = require('../teams/utils');
var urls = require('../urls');
var ListHeader = require('./ListHeader.jsx');
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
    log.info('LargeAppView:getInitialState');
    return {
      'layout': 'auto'
    }
  },

  render: function() {
    return (
      <section className="app large">
        <Sidebar ref="sidebar" handleLayoutClick={this.props.handleLayoutClick} />
        <nav ref="list" className="list-main">
          <header className="col-header">
            <form className="list-search" onSubmit={this.handleSearch}>
              {this.props.team ?
                <span className="list-search-team">{this.props.team.name}</span>
              : null}
              <input type="text"
                     ref="search"
                     className="list-search-input"
                     placeholder="Search" />
            </form>
          </header>
          {this.props.list}
        </nav>
        <div className="content-main">
          <Header title={this.props.title}
                  contextView={this.props.headerContextView} />
          {this.props.discussionIntro}
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
    // ---------------
    // Active team
    // ---------------
    // TODO: Check if the active node has changed before doing anything
    // 1. reset current active
    var sidebarNode = ReactDOM.findDOMNode(this.refs.sidebar);
    zepto('.active', sidebarNode).removeClass('active');
    if (teamSlug) {
      // 2. set active team
      zepto('[data-slug="' + teamSlug + '"]').addClass('active');
    }
  },

  componentWillReceiveProps: function() {
    var qo = qs.parse(location.search);
    this.setState({
      'query': qo.query
    });
    if (!qo.query) {
      ReactDOM.findDOMNode(this.refs.search).value = '';
    }
  }
});

window.store = store;

module.exports = AppView;
