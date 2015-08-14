'use strict';

var Token = require('../../lib/token');
// var sinon = require('sinon');

var config = null;
var token = null;

describe('Authentication', function() {
  beforeEach(function() {
    config = {};
  });

  describe('initalising', function() {
    beforeEach(function() {
      token = new Token(config);
    });

    it.skip('should do something', function() {
    });
  });

  describe('methods', function() {
    it.skip('should do something', function() {
    });
  });
});
