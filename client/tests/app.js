/* global describe, it, expect, before, after, beforeEach, afterEach, sinon */
'use strict';

var React = require('react');
var AppView = require('../app/app');
var store = require('../app/store');

describe('AppView', function() {

  var app, xhr, requests;

  before(function () {
    // Monkey-patch xhr for testing
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function (req) { requests.push(req); };
  });

  after(function () {
    xhr.restore();
  });

  beforeEach(function() {
    // Refresh with a new instance before each test
    app = AppView();
  });

  afterEach(function() {
    // Clean up
    requests = [];
  });

  describe('#getInitialState()', function() {

    it('should return necessary keys for app initialization', function() {
      var state = app.getInitialState();
      expect(state).to.have.property('topNav');
      expect(state).to.have.property('content');
      expect(state).to.have.property('initialized');
      expect(state).to.have.property('authenticated');
    });

  });

  describe('#componentWillMount()', function() {

    it('sets up routes that trigger different app states', function() {
      var router = require('../app/router');

      // Initially, there should be no events
      expect(router).to.not.have.property('_events');

      app.componentWillMount();

      // Now, the events should be established
      expect(router).to.have.property('_events');

      function checkRoute(route, target) {
        expect(router._events).to.have.property(route);
        expect(router._events[route]).to.have.length(1);
        expect(router._events[route][0]).to.have.property('callback', target);
      }

      // Check each route
      checkRoute('route:index', app.index);
      checkRoute('route:signIn', app.signIn);
      checkRoute('route:signOut', app.signOut);
      checkRoute('route:team:detail', app.teamDetail);
      checkRoute('route:team:create', app.discussionCreate);
      checkRoute('route:discussion:detail', app.discussionDetail);
    });

  });

  describe('#componentDidMount()', function() {

    /*
     * TODO: This test fails because there are lingering event handlers on
     * window, despite my best efforts to clean them up between tests. We may
     * want to use a custom event system instead.
     */

    // it('adds event listeners for fetch results', function() {
    //   var successEvent = document.createEvent('HTMLEvents');
    //   successEvent.initEvent('store:fetchSuccess', true, true);
    //   var failureEvent = document.createEvent('HTMLEvents');
    //   failureEvent.initEvent('store:fetchFailed', true, true);

    //   // It's not easy to list event handlers added with addEventListener, so
    //   // we're going to patch the methods and trigger the events to verify that
    //   // they are there.
    //   sinon.spy(app, 'startSuccess');
    //   sinon.spy(app, 'startFailed');

    //   app.componentDidMount();

    //   window.dispatchEvent(successEvent);
    //   expect(app.startSuccess.called).to.be.true;
    //   expect(app.startFailed.called).to.be.false;

    //   window.dispatchEvent(failureEvent);
    //   expect(app.startFailed.called).to.be.true;

    //   app.startSuccess.restore();
    //   app.startFailed.restore();
    // });

    it('triggers a fetch on the store', function() {
      sinon.spy(store, 'fetch');

      app.componentDidMount();

      expect(store.fetch.called).to.be.true;

      store.fetch.restore();
    });

  });

  describe('#render()', function() {

    beforeEach(function() {
      // Mount the component so that the state is available to the render
      // method
      React.renderComponent(app, document.getElementById('main'));
    });

    afterEach(function() {
      // Unmount the component to clean up between each test
      React.unmountComponentAtNode(document.getElementById('main'));
    });

    it('initially renders with no sidebar', function() {
      var dom = app.render();

      expect(dom.props.className).to.equal('main');
      expect(dom.props.children).to.have.length(2);

      var sidebar = dom.props.children[0];
      expect(sidebar.props.id).to.equal('sidebar');
      expect(sidebar.props.children).to.be.empty;
    });

  });

});
