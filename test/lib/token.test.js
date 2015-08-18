'use strict';

// var proxyquire =  require('proxyquire').noCallThru();
// var fs = proxyquire('fs', {});

var Cache = require('../../lib/cache');
var Token = require('../../lib/token');
var sinon = require('sinon');

// var fsMock = null;
// var newTokenValue = null;
var cache = null;
var cacheMock = null;
var token = null;
var tokenValue = null;

describe('Token', function() {
  describe('methods', function() {
    beforeEach(function() {
      cache = new Cache();
      cacheMock = sinon.mock(cache);
    });

    afterEach(function() {
      cacheMock.restore();
    });

    describe('clean', function() {
      beforeEach(function() {
        cacheMock.expects('clean').once();
        cacheMock.expects('read').never();

        token = new Token(cache);
        tokenValue = token.clean();
      });

      it('should attempt to save to the cache', function() {
        cacheMock.verify();
      });

      it('should return a value', function() {
        (tokenValue === null).should.eql(true);
      });
    });

    describe('get', function() {
      describe('when no value is set or returned from the cache', function() {
        beforeEach(function() {
          cacheMock.expects('read').once().returns(null);

          token = new Token(cache);
          tokenValue = token.get();
        });

        it('should return a null value', function() {
          (tokenValue === null).should.eql(true);
        });
      });

      describe('when no value is set but is returned from the cache', function() {
        beforeEach(function() {
          cacheMock.expects('read').once().returns('foo');

          token = new Token(cache);
          tokenValue = token.get();
        });

        it('should return a value', function() {
          tokenValue.should.eql('foo');
        });
      });
    });

    describe('set', function() {
      beforeEach(function() {
        cacheMock.expects('save').withArgs('bar').once();
        cacheMock.expects('read').never();

        token = new Token(cache);
        tokenValue = token.set('bar');
      });

      it('should attempt to save to the cache', function() {
        cacheMock.verify();
      });

      it('should return a value', function() {
        tokenValue.should.eql('bar');
      });

      it('should be retrievable via .get()', function() {
        token.get().should.eql('bar');
      });
    });
  });
});
