'use strict';

// var proxyquire =  require('proxyquire').noCallThru();
// var fs = proxyquire('fs', {});

var Cache = require('../../lib/cache');
var Token = require('../../lib/token');
var sinon = require('sinon');

// var fsMock = null;
// var newTokenValue = null;
var cache = null;
var token = null;
var tokenValue = null;

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
      describe('when no value is set or returned from the cache', function() {
        beforeEach(function() {
          cache = new Cache();
          sinon.stub(cache, 'read').returns(null);

          token = new Token(cache);
          tokenValue = token.get();
        });

        it('should return a null value', function() {
          (tokenValue === null).should.eql(true);
        });
      });

      describe('when no value is set but is returned from the cache', function() {
        beforeEach(function() {
          cache = new Cache();
          sinon.stub(cache, 'read').returns('foo');

          token = new Token(cache);
          tokenValue = token.get();
        });

        it('should return a value', function() {
          tokenValue.should.eql('foo');
        });
      });

      describe('when a value is already set', function() {
        beforeEach(function() {
          cache = new Cache();
          sinon.stub(cache, 'read').returns('foo');

          token = new Token(cache);
          tokenValue = token.get();
        });

        it.skip('should return a value', function() {
          tokenValue.should.eql('bar');
        });
      });
    });

    // describe('set', function() {
    //   beforeEach(function() {
    //     tokenValue = 'bar';

    //     fsMock = sinon.mock(fs);
    //   });

    //   afterEach(function() {
    //     fsMock.restore();
    //   });

    //   describe('when the write to file is successful', function() {
    //     beforeEach(function() {
    //       fsMock.expects('writeFileSync').
    //         withArgs(cacheFile, tokenValue).
    //         once();

    //       token = new Token();
    //       newTokenValue = token.set(tokenValue);
    //     });

    //     it('should attempt to write to file', function() {
    //       fsMock.verify();
    //     });

    //     it('should return the newly set token value', function() {
    //       newTokenValue.should.eql(tokenValue);
    //     });
    //   });

    //   describe('when the write to file throws an error', function() {
    //     beforeEach(function() {
    //       fsMock.expects('writeFileSync').
    //         withArgs(cacheFile, tokenValue).
    //         once().
    //         throws;

    //       token = new Token();
    //       newTokenValue = token.set(tokenValue);
    //     });

    //     it('should attempt to write to file', function() {
    //       fsMock.verify();
    //     });

    //     it('should still return the newly set token value', function() {
    //       newTokenValue.should.eql(tokenValue);
    //     });
    //   });
    // });
  });
});
