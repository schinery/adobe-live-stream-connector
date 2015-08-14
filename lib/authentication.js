'use strict';

var https = require('https');
var querystring = require('querystring');

// Private variables
var authHostname = null;
var clientId = null;
var clientSecret = null;
var authPath = null;

// Builds the Adobe Authenticaton request options
// @private
// @return {Object} Returns a request options object
//
function buildRequestOptions() {
  var options = {
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

  return options;
}

// Requests a new token for the Adobe Authentication API, responding on the
// callback when complete. Use getToken() instead of calling this function
// directly.
//
// @param {Function} callback - the callback to use after attempting to get a
//                              new token
//
function requestToken(callback) {
  var data = '';
  var options = buildRequestOptions();
  var postData = querystring.stringify({
    'grant_type': 'client_credentials'
  });

  var req = https.request(options, function onResponse(res) {
    res.setEncoding('utf8');

    res.on('data', function onData(chunk) {
      data += chunk;
    });
  });

  req.on('close', function onClose() {
    callback(null, data);
  });

  req.on('error', function onError(e) {
    callback('Got request serialization error: ' + e);
  });

  req.write(postData);
  req.end();
}

// Creates an instance of Authentication.
//
// @constructor
// @this {Authentication}
// @param {Object} config - The configuration object with the correct details
//                          to connect to the Adobe Live Stream and Auth API.
//
function Authentication(token, config) {
  this.token = token;
  config = config || {};
  authHostname = config.authHostname || '';
  clientId = config.clientId || '';
  clientSecret = config.clientSecret || '';
  authPath = config.authPath || '';
}

// Requests a token from the token service, reading from cache for efficiency.
//
// @param {Boolean} forceRefresh - specify whether to always get a new auth token
// @param {Function} callback - the callback to use after attempting to get a
//                              new token
//
Authentication.prototype.getToken = function(callback) {
  var self = this;
  var tokenValue = this.token.get();
  var isValidToken = (tokenValue && tokenValue !== '');

  if(isValidToken) {
    return callback(null, tokenValue);
  }

  // this.token.set(null); // clear out old token
  requestToken(function onResponse(err, data) {
    if(err) {
      return callback(err);
    }

    if(data === '') {
      return callback('Did not receive any output from token server.');
    }

    var authResult = null;

    try{
      authResult = JSON.parse(data);
    } catch(err) {
      return callback('Could not parse JSON output. ' + err);
    }

    // Note: Because 'access_token' and 'error_description' are values that
    // come back from the Adobe Authentication API and aren't camelcase we
    // need to disable the JSHint check here.
    //
    // jshint camelcase:false
    if(authResult.error_description) {
      return callback(authResult.error_description);
    }

    self.token.set(authResult.access_token);
    callback(null, authResult.access_token);
    // Re-enable jshint camelcase check
    // jshint camelcase:true
  });
};

// Invalidates the current token, presumably because it didn't authorize the request.
//
Authentication.prototype.invalidateToken = function() {
  this.token.set(null);
};

module.exports = Authentication;
