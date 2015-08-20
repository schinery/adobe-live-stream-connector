'use strict';

var fs = require('fs');
var sinon = require('sinon');

var Cache = require('../../lib/cache');

var cache = null;
var cacheFile = 'adobe.token';
var fsMock = null;
var tokenValue = null;

describe('Cache', function() {
  describe('methods', function() {
    beforeEach(function() {
      fsMock = sinon.mock(fs);
    });

    afterEach(function() {
      fsMock.restore();
    });

    describe('clear', function() {
      describe('when the clean is successful', function() {
        beforeEach(function() {
          fsMock.expects('unlinkSync').
            withArgs(cacheFile).
            once();

          cache = new Cache();
          cache.clean();
        });

        it('should attempt to delete the cache file', function() {
          fsMock.verify();
        });
      });

      describe('when there are unlink errors', function() {
        beforeEach(function() {
          fsMock.expects('unlinkSync').
            withArgs(cacheFile).
            once().
            throws();

          cache = new Cache();
          cache.clean();
        });

        it('should attempt to delete the file', function() {
          fsMock.verify();
        });
      });
    });

    describe('read', function() {
      describe('when the read is successful', function() {
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
            throws();

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
