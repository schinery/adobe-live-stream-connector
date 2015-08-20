'use strict';

// var proxyquire =  require('proxyquire').noCallThru();
// // var fs = proxyquire('fs', {});

var Authentication = require('../../lib/authentication');
var Token = require('../../lib/token');
var sinon = require('sinon');

var auth = null;
var callbackSpy = null;
var config = null;
var token = null;
var tokenStub = null;

describe('Authentication', function() {
  beforeEach(function() {
    config = {};
    token = new Token(config);
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

      describe('when the Token object returns a null value', function() {
        beforeEach(function() {
          callbackSpy = sinon.spy();
          tokenStub = sinon.stub(token, 'get').returns(null);

          auth = new Authentication(token, config);
          auth.getToken(callbackSpy);
        });

        afterEach(function() {
          tokenStub.restore();
        });

        it.skip('should call the callback with the token', function() {
          callbackSpy.calledOnce.should.eql(true);
          callbackSpy.calledWith(null, 'foobar').should.eql(true);
        });
      });
    });

    describe('removeToken', function() {
      beforeEach(function() {
        tokenStub = sinon.stub(token, 'clean');

        auth = new Authentication(token, config);
        auth.removeToken();
      });

      afterEach(function() {
        tokenStub.restore();
      });

      it('should call the token clear method with null', function() {
        tokenStub.calledOnce.should.eql(true);
      });
    });
  });
});
