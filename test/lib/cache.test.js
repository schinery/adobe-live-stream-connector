'use strict';

var proxyquire =  require('proxyquire').noCallThru();
var fs = proxyquire('fs', {});

var Cache = require('../../lib/cache');
var sinon = require('sinon');

var cache = null;
var cacheFile = 'adobe.token';
var fsMock = null;
var tokenValue = null;

describe('Cache', function() {
  describe('initalising', function() {
    beforeEach(function(){
      cache = new Cache();
    });

    it('should not have direct access to the cacheFile property', function() {
      (cacheFile.value === undefined).should.eql(true);
    });
  });

  describe('methods', function() {
    describe('read', function() {
      beforeEach(function() {
        fsMock = sinon.mock(fs);
      });

      afterEach(function() {
        fsMock.restore();
      });

      describe('when no value is returned from the cache', function() {
        beforeEach(function() {
          fsMock.expects('readFileSync').
            withArgs(cacheFile).
            once().
            returns(null);

          tokenValue = cache.read();
        });

        it('should return a null value', function() {
          (tokenValue === null).should.eql(true);
        });

        it('should attempt to read a file', function() {
          fsMock.verify();
        });
      });

      describe('when a value is returned from the cache', function() {
        beforeEach(function() {
          fsMock.expects('readFileSync').
            withArgs(cacheFile).
            once().
            returns(new Buffer('foo'));

          cache = new Cache();
          tokenValue = cache.read();
        });

        afterEach(function() {
          fsMock.restore();
        });

        it('should return a value', function() {
          tokenValue.should.eql('foo');
        });

        it('should attempt to read a file', function() {
          fsMock.verify();
        });
      });

      describe('when there are read errors', function() {
        beforeEach(function() {
          fsMock.expects('readFileSync').
            withArgs(cacheFile).
            once().
            throws();

          cache = new Cache();
          tokenValue = cache.read();
        });

        it('should return a null value', function() {
          (tokenValue === null).should.eql(true);
        });

        it('should attempt to read a file', function() {
          fsMock.verify();
        });
      });
    });

    describe('save', function() {
      beforeEach(function() {
        tokenValue = 'bar';

        fsMock = sinon.mock(fs);
      });

      afterEach(function() {
        fsMock.restore();
      });

      describe('when the write to file is successful', function() {
        beforeEach(function() {
          fsMock.expects('writeFileSync').
            withArgs(cacheFile, tokenValue).
            once();

          cache = new Cache();
          cache.save(tokenValue);
        });

        it('should attempt to write to file', function() {
          fsMock.verify();
        });
      });

      describe('when the write to file throws an error', function() {
        beforeEach(function() {
          fsMock.expects('writeFileSync').
            withArgs(cacheFile, tokenValue).
            once().
            throws;

          cache = new Cache();
          cache.save(tokenValue);
        });

        it('should attempt to write to file', function() {
          fsMock.verify();
        });
      });
    });
  });
});
