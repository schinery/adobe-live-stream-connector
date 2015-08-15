'use strict';

var proxyquire =  require('proxyquire').noCallThru();
var fs = proxyquire('fs', {});

var Token = require('../../lib/token');
var sinon = require('sinon');

var fsMock = null;
var token = null;

describe('Token', function() {
  describe('initalising', function() {
    beforeEach(function(){
      token = new Token();
    });

    it('should not have direct access to the value property', function() {
      (token.value === undefined).should.eql(true);
    });
  });

  describe('methods', function() {
    describe('get', function() {
      var cacheFile = null;
      var tokenValue = null;

      beforeEach(function() {
        cacheFile = 'adobe.token';

        fsMock = sinon.mock(fs);
      });

      afterEach(function() {
        fsMock.restore();
      });

      describe('when no value is set or returned from the cache', function() {
        beforeEach(function() {
          fsMock.expects('readFileSync').
            withArgs(cacheFile).
            once().
            returns(null);

          tokenValue = token.get();
        });

        it('should return a null value', function() {
          (tokenValue === null).should.eql(true);
        });

        it('should attempt to read a file', function() {
          fsMock.verify();
        });
      });

      describe('when no value is set but is returned from the cache', function() {
        beforeEach(function() {
          fsMock.expects('readFileSync').
            withArgs(cacheFile).
            once().
            returns(new Buffer('foo'));

          token = new Token();
          tokenValue = token.get();
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

      describe('when no value is set and the cache read errors', function() {
        beforeEach(function() {
          fsMock.expects('readFileSync').
            withArgs(cacheFile).
            once().
            throws();

          token = new Token();
          tokenValue = token.get();
        });

        it('should return a null value', function() {
          (tokenValue === null).should.eql(true);
        });

        it('should attempt to read a file', function() {
          fsMock.verify();
        });
      });

      describe('when a value is already set', function() {
        beforeEach(function() {
          fsMock.expects('readFileSync').
            withArgs(cacheFile).
            never();

          // Mocking the set action
          fsMock.expects('writeFileSync').
            withArgs(cacheFile, 'foo').
            once();

          token = new Token();
          token.set('foo');
          tokenValue = token.get();
        });

        it('should return a null value', function() {
          tokenValue.should.eql('foo');
        });

        it('should attempt to read a file', function() {
          fsMock.verify();
        });
      });
    });

    describe('set', function() {
      var cacheFile = null;
      var newTokenValue = null;
      var tokenValue = null;

      beforeEach(function() {
        cacheFile = 'adobe.token';
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

          token = new Token();
          newTokenValue = token.set(tokenValue);
        });

        it('should attempt to write to file', function() {
          fsMock.verify();
        });

        it('should return the newly set token value', function() {
          newTokenValue.should.eql(tokenValue);
        });
      });

      describe('when the write to file throws an error', function() {
        beforeEach(function() {
          fsMock.expects('writeFileSync').
            withArgs(cacheFile, tokenValue).
            once().
            throws;

          token = new Token();
          newTokenValue = token.set(tokenValue);
        });

        it('should attempt to write to file', function() {
          fsMock.verify();
        });

        it('should still return the newly set token value', function() {
          newTokenValue.should.eql(tokenValue);
        });
      });
    });
  });
});
