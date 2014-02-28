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
        expect(router._events[route][0].callback).to.equal(target);
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

});
