'use strict';

var AdobeLiveStreamConnector = require('../../lib/adobeLiveStreamConnector');
var sinon = require('sinon');

describe('AdobeLiveStreamConnector', function() {
  var connector = null;
  var config = null;
  var callback = null;

  beforeEach(function(){
    config = sinon.stub();
    callback = sinon.stub();
  });

  describe('initalising', function() {
    beforeEach(function(){
      connector = new AdobeLiveStreamConnector(config, callback);
    });

    it('should have a config associated', function() {
      connector.config.should.eql(config);
    });

    it('should have a callback associated', function() {
      connector.callback.should.eql(callback);
    });
  });

  describe('methods', function() {
    describe('connect', function() {
      it.skip('should do something', function() {
      });
    });
  });
});
