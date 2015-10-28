"use strict";

var _ = require('underscore');
var log = require('loglevel');
var React = require('react');
var ReactDOM = require('react-dom');
var SmallLayout = require('./layout/Small.jsx');
var MediumLayout = require('./layout/Medium.jsx');
var LargeLayout = require('./layout/Large.jsx');
var LayoutStore = require('./layout/LayoutStore');

var dispatcher = {
  // view dispatcher, shortcut for React.renderComponent

  'layout': 'auto',
  'app': undefined,
  'nextSmallProps': undefined,
  'nextLargeProps': undefined,

  small: function(props) {
    // default props.
    // these get reset on every render unless overridden.
    // - loading > header loading anim
    // - headerContextView > (add discussion button, unread items icon, etc..)
    // - animation > page transition for the new view
    var defaultProps = {
      'loading': false,
      'headerContextView': null,
      'animation': 'horizontal',
      'title': '',
      'navLevel': 0,
      'back': null,
      'main': null
    };
    this.nextSmallProps = _.extend(defaultProps, props);
    return this;
  },

  medium: function(props) {
    var defaultProps = {
      // content for the main section
      'main': null,
      // the active team
      'team': null
    };
    this.nextMediumProps = _.extend(defaultProps, props);
    return this;
  },

  large: function(props) {
    var defaultProps = {
      // content for the list section
      'list': null,
      // content for the main section
      'main': null,
      // the active team
      'team': null
    };
    this.nextLargeProps = _.extend(defaultProps, props);
    return this;
  },

  render: function () {
    //
    // Wrapper around React.RenderComponent.
    // > Handles unmountComponent for situations where we're rendering
    // the same component, but with different data (for example different teams)
    // on contentMain. In these situations, re-rendering the component is not the
    // most effective approach, since the whole data structure will change.
    //
    // Usage:
    // dispatcher.render();
    //

    var settings;
    var layoutState = LayoutStore.getState();

    if (layoutState.mode === 'compact') {
      settings = {
        'layout': SmallLayout,
        'props': this.nextSmallProps
      };
    } else if (layoutState.mode === 'full') {
      settings = {
        'layout': LargeLayout,
        'props': this.nextLargeProps
      };
    } else {
      settings = {
        'layout': MediumLayout,
        'props': this.nextMediumProps
      };
    }

    // create app element
    var app = React.createElement(settings.layout, settings.props);
    // render
    ReactDOM.render(app, document.getElementById('main'));
  }
};

LayoutStore.listen(dispatcher.render.bind(dispatcher));

module.exports = dispatcher;
