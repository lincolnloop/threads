"use strict";

var _ = require('underscore');
var log = require('loglevel');
var React = require('react');
var AppView = require('./components/App.jsx');

var dispatcher = {
  // view dispatcher, shortcut for React.renderComponent

  'app': undefined,

  setProps: function(props) {
    this.app.setProps(props);
  },

  render: function (props, children) {
    var defaultProps = {
      'headerContextView': null,
      'animation': 'horizontal'
    };
    /*
     * Wrapper around React.RenderComponent.
     * > Handles unmountComponent for situations where we're rendering
     * the same component, but with different data (for example different teams)
     * on contentMain. In these situations, re-rendering the component is not the
     * most effective approach, since the whole data structure will change.
     *
     * Usage:
     * dispatcher.render(MyReactView({}));
     *
     */
    if (!this.app) {
      log.info('dispatcher.start');
      this.app = React.renderComponent(AppView(props, children), document.getElementById('main'));
    } else {
      log.info('dispatcher.update', props);
      if (props) {
        _.extend(defaultProps, props);
      }
      if (children) {
        _.extend(defaultProps, {'children': children});
      }
      this.setProps(defaultProps);
    }
  }
};

module.exports = dispatcher;