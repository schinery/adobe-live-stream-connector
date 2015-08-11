'use strict';

var LiveStream = require('../../lib/liveStream');
var sinon = require('sinon');

describe('LiveStream', function() {
  var adobeAuth = null;
  var callback = null;
  var config = null;
  var liveStream = null;

  beforeEach(function() {
    adobeAuth = sinon.stub();
    callback = sinon.stub();
    config = sinon.stub();
  });

  describe('initalising', function() {
    beforeEach(function(){
      liveStream = new LiveStream(adobeAuth, config, callback);
    });

    it('should have an adobeAuth associated', function() {
      liveStream.adobeAuth.should.eql(adobeAuth);
    });

    it('should have a config associated', function() {
      liveStream.config.should.eql(config);
    });

    it('should have a callback associated', function() {
      liveStream.callback.should.eql(callback);
    });

    it('should not be authenticating', function() {
      liveStream.isAuthenticating.should.be.false;
    });

    it('should not be dead', function() {
      liveStream.isDead.should.be.false;
    });

    it('should have a null req value', function() {
      (liveStream.req === null).should.be.true;
    });
  });

  describe('methods', function() {
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
