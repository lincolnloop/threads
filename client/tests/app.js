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
      // var router = require('./router');

      // TODO: Test before

      app.componentWillMount();

      // TODO: Test after
    });

  });

});
