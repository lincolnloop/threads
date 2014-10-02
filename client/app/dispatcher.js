"use strict";

var _ = require('underscore');
var log = require('loglevel');
var React = require('react');
var SmallLayout = require('./layout/Small.jsx');
var MediumLayout = require('./layout/Medium.jsx');
var LargeLayout = require('./layout/Large.jsx');

var dispatcher = {
  // view dispatcher, shortcut for React.renderComponent

  'layout': 'auto',
  'app': undefined,
  'nextSmallProps': undefined,
  'nextLargeProps': undefined,

  handleLayoutClick: function(evt) {
    if (evt.target.dataset.layout) {
      this.render(evt.target.dataset.layout);
    }
    event.preventDefault();
    return false;
  },

  small: function(props) {
    // default props. 
    // these get reset on every render unless overridden.
    // - loading > header loading anim
    // - headerContextView > (add discussion button, unread items icon, etc..)
    // - animation > page transition for the new view
    var defaultProps = {
      'handleLayoutClick': this.handleLayoutClick.bind(this),
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
      // change layout callback
      'handleLayoutClick': this.handleLayoutClick.bind(this),
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
      // change layout callback
      'handleLayoutClick': this.handleLayoutClick.bind(this),
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

  render: function (nextLayout) {
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
    var layout = nextLayout ? nextLayout : this.layout;

    if ((window.innerWidth < 600 && layout === 'auto') || layout === 'compact') {
      settings = {
        'layout': SmallLayout,
        'props': this.nextSmallProps
      };
    } else if ((window.innerWidth > 1200 && layout === 'auto') || layout === 'full') {
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

    if (!this.app || (nextLayout !== undefined && this.layout !== nextLayout)) {
      this.app = React.renderComponent(
        settings.layout(settings.props),
        document.getElementById('main')
      );
    } else {
        this.app.setProps(settings.props);
    }

    this.layout = layout;
  }
};

module.exports = dispatcher;
