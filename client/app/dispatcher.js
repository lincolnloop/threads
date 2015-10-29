"use strict";

var _ = require('underscore');
var log = require('loglevel');
var React = require('react');
var ReactDOM = require('react-dom');
var CompactLayout = require('./layout/Compact.jsx');
var FullLayout = require('./layout/Full.jsx');
var LayoutStore = require('./layout/LayoutStore');

var dispatcher = {
  // view dispatcher, shortcut for React.renderComponent

  'layout': 'auto',
  'app': undefined,
  'nextCompactProps': undefined,
  'nextFullProps': undefined,

  compact: function(props) {
    var defaultProps = {
      // content for the main section
      'main': null,
      // the active team
      'team': null
    };
    this.nextCompactProps = _.extend(defaultProps, props);
    return this;
  },

  full: function(props) {
    var defaultProps = {
      // content for the list section
      'list': null,
      // content for the main section
      'main': null,
      // the active team
      'team': null
    };
    this.nextFullProps = _.extend(defaultProps, props);
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

    if (layoutState.mode === 'full') {
      settings = {
        'layout': FullLayout,
        'props': this.nextFullProps
      };
    } else {
      settings = {
        'layout': CompactLayout,
        'props': this.nextCompactProps
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
