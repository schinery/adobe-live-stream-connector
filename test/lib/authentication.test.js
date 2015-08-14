'use strict';

// var proxyquire =  require('proxyquire').noCallThru();
// // var fs = proxyquire('fs', {});

var Authentication = require('../../lib/authentication');
var Token = require('../../lib/token');
var sinon = require('sinon');

var auth = null;
var config = null;
var token = null;
var tokenStub = null;

describe('Authentication', function() {
  beforeEach(function() {
    config = {};
    token = new Token(config);
  });

  describe('initalising', function() {
    beforeEach(function() {
      auth = new Authentication(token, config);
    });

    it('should have a token attached', function() {
      auth.token.should.eql(token);
    });
  });

  describe('methods', function() {
    // describe('buildRequestOptions', function() {
    //   beforeEach(function() {
    //     var authHostname = 'auth.example.com';
    //     var authPath = '/foo';
    //     var clientId = '123';
    //     var clientSecret = 'sshhhh';

    //     expected = {
    //       agent: false,
    //       auth: clientId + ':' + clientSecret,
    //       headers: {
    //         'content-type': 'application/x-www-form-urlencoded'
    //       },
    //       hostname: authHostname,
    //       method: 'POST',
    //       path: authPath,
    //       port: 443
    //     };

    //     config = {
    //       authHostname: authHostname,
    //       authPath: authPath,
    //       clientId: clientId,
    //       clientSecret: clientSecret
    //     };

    //     adobeAuth = new Authentication(config);
    //   });

    //   it('should return a request options object', function() {
    //     adobeAuth.buildRequestOptions().should.eql(expected);
    //   });
    // });

    describe('getToken', function() {
      var callbackSpy;

      describe('when the Token object returns a value', function() {
        beforeEach(function() {
          callbackSpy = sinon.spy();
          tokenStub = sinon.stub(token, 'get').returns('foobar');

          auth = new Authentication(token, config);
          auth.getToken(callbackSpy);
        });

        afterEach(function() {
          tokenStub.restore();
        });

        it('should call the callback with the token', function() {
          callbackSpy.calledOnce.should.eql(true);
          callbackSpy.calledWith(null, 'foobar').should.eql(true);
        });
      });

      describe('when the Token object returns a blank or null value', function() {
        beforeEach(function() {

        });

        describe('when blank', function() {
          it.skip('should do something', function() {
          });
        });

        describe('when null', function() {
          it.skip('should do something', function() {
          });
        });
      });
    });

    describe('invalidateToken', function() {
      var tokenSpy;

      beforeEach(function() {
        tokenStub = sinon.stub(token, 'set');
        tokenSpy = sinon.spy(tokenStub);

        auth = new Authentication(token, config);
        auth.invalidateToken();
      });

      afterEach(function() {
        tokenStub.restore();
      });

      it('should call the token set method with null', function() {
        tokenStub.calledOnce.should.eql(true);
        tokenStub.calledWith(null).should.eql(true);
      });
    });
  });
});
