'use strict';

var proxyquire =  require('proxyquire').noCallThru();
var fs = proxyquire('fs', {});

var AdobeAuth = require('../../lib/adobeAuth');
var sinon = require('sinon');

var adobeAuth = null;
var config = null;
var consoleSpy = null;
var expected = null;
var fsStub = null;

describe('AdobeAuth', function() {
  beforeEach(function() {
    config = {};
  });

  describe('initalising', function() {
    beforeEach(function() {
      adobeAuth = new AdobeAuth(config);
    });

    it('should have a config associated', function() {
      adobeAuth.config.should.eql(config);
    });

    it('should have a null token value', function() {
      (adobeAuth.token === null).should.be.true;
    });
  });

  describe('methods', function() {
    describe('buildRequestOptions', function() {
      beforeEach(function() {
        var authHostname = 'auth.example.com';
        var authPath = '/foo';
        var clientId = '123';
        var clientSecret = 'sshhhh';

        expected = {
          agent: false,
          auth: clientId + ':' + clientSecret,
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          hostname: authHostname,
          method: 'POST',
          path: authPath,
          port: 443
        };

        config = {
          authHostname: authHostname,
          authPath: authPath,
          clientId: clientId,
          clientSecret: clientSecret
        };

        adobeAuth = new AdobeAuth(config);
      });

      it('should return a request options object', function() {
        adobeAuth.buildRequestOptions().should.eql(expected);
      });
    });

    describe('cacheToken', function() {
      beforeEach(function() {
        config = {
          tokenCacheFile: 'foo.token'
        };

        consoleSpy = sinon.spy(console, 'log');
        fsStub = sinon.stub(fs, 'writeFile');

        adobeAuth = new AdobeAuth(config);
        adobeAuth.token = 'foo';
      });

      afterEach(function() {
        consoleSpy.restore();
        fsStub.restore();
      });

      describe('when no error is thrown', function() {
        beforeEach(function() {
          fsStub.withArgs('foo.token', 'foo').callsArgWith(2, null);
          adobeAuth.cacheToken();
        });

        it('should console out', function() {
          consoleSpy.calledOnce.should.eql(true);
          consoleSpy.calledWith('Successfully written foo to foo.token').should.eql(true);
        });
      });

      describe('when an error is thrown', function() {
        beforeEach(function() {
          fsStub.withArgs('foo.token', 'foo').callsArgWith(2, 'Boom!');
          adobeAuth.cacheToken();
        });

        it('should attempt to write the token to file', function() {
          consoleSpy.calledOnce.should.eql(true);
          consoleSpy.calledWith('Cached token file could not be created or overwritten. Boom!').should.eql(true);
        });
      });
    });

    describe('getToken', function() {
      it.skip('should do something', function() {
      });
    });

    describe('readCachedToken', function() {
      it.skip('should do something', function() {
      });
    });

    describe('requestToken', function() {
      it.skip('should do something', function() {
      });
    });

    describe('invalidateToken', function() {
      it.skip('should do something', function() {
      });
    });
  });
});
