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

  describe('methods', function() {
    beforeEach(function(){
      connector = new AdobeLiveStreamConnector(config, callback);
    });

    describe('connect', function() {
      it.skip('should do something', function() {
      });
    });
  });
});
