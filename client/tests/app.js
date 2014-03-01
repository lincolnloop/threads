/* global describe, it, expect, before, after, beforeEach, afterEach, sinon */
'use strict';

var AppView = require('../app/app');

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

  });

});