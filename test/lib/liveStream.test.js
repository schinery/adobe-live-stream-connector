'use strict';

var LiveStream = require('../../lib/liveStream');
var sinon = require('sinon');

describe('LiveStream', function() {
  var auth = null;
  var callback = null;
  var config = null;
  var liveStream = null;

  beforeEach(function() {
    auth = sinon.stub();
    callback = sinon.stub();
    config = sinon.stub();
  });

  describe('methods', function() {
    beforeEach(function(){
      liveStream = new LiveStream(auth, config, callback);
    });

    describe('authenticate', function() {
      it.skip('should do something', function() {
      });
    });

    describe('buildRequestOptions', function() {
      it.skip('should do something', function() {
      });
    });

    describe('connect', function() {
      it.skip('should do something', function() {
      });
    });

    describe('die', function() {
      it.skip('should do something', function() {
      });
    });

    describe('run', function() {
      it.skip('should do something', function() {
      });
    });
  });
});
