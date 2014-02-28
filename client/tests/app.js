/* global describe, it, expect, beforeEach */
'use strict';

var AppView = require('../app/app');

describe('AppView', function() {

  var app;

  beforeEach(function() {
    // Refresh with a new instance before each test
    app = AppView();
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
