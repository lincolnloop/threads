'use strict';

var _ = require('underscore');
var classnames = require('classnames');
var app = require('../AppRouter');
var ReactDOM = require('react-dom');
var log = require('loglevel');
var qs = require('query-string');
var React = require('react');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var OrganizationList = require('../teams/OrganizationList.jsx');
var store = require('../store');
var LayoutStore = require('./LayoutStore');
var teamUtils = require('../teams/utils');
var urls = require('../urls');
var Sidebar = require('./Sidebar.jsx');
var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');

var AppView = React.createClass({

  handleSearch(evt) {
    evt.preventDefault();
    var query = ReactDOM.findDOMNode(this.refs.search).value;
    var team = this.props.team ? this.props.team.slug : '';

    var url = urls.get('search:q') + '?query=' + query;
    if (team) {
      url += '&team=' + team;
    }
    app.history.navigate(url, {'trigger': true});
  },

  stateChanged() {
    this.setState({'showNav': LayoutStore.getState().showNav});
  },

  getInitialState() {
    log.info('MediumAppView:getInitialState');
    return {
      'showNav': true
    }
  },

  render() {
    var qo = qs.parse(location.search);
    var query = qo.query;
    var layoutClasses = classnames({
      'app': true,
      'medium': true,
      'medium-nav': this.state.showNav
    });
    return (
      <section className={layoutClasses}>
        <Sidebar handleLayoutClick={this.props.handleLayoutClick} />
        <div className="content-main">
          <Header title={this.props.title}
                  nav={this.props.nav}
                  back={this.props.back}
                  contextView={this.props.headerContextView} />
          {this.props.main}
        </div>
      </section>
    );
  },

  componentDidUpdate() {
    var contentNodes = document.getElementsByClassName('content');
    if (contentNodes.length) {
      // scroll document to top when doing a page transition
      // TODO: Apply this to the new content page only
      window.scrollTo(0,0);
    }
  },

 componentDidMount() {
    LayoutStore.listen(this.stateChanged);
  },

  componentWillUnmount() {
    LayoutStore.unlisten(this.stateChanged);
  }


});

window.store = store;

module.exports = AppView;
