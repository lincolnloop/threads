"use strict";

var _ = require('underscore');
var log = require('loglevel');
var React = require('react');
var AppView = require('./components/app.jsx');

var dispatcher = {
  // view dispatcher, shortcut for React.renderComponent

  'app': undefined,

  render: function (view) {
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
      this.app = React.renderComponent(AppView(null, view), document.getElementById('main'));
    } else {
      log.info('dispatcher.update');
      this.app.setProps(_.extend({
        'children': view
      }, view.props));
    }
  }
};

module.exports = dispatcher;