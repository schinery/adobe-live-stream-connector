'use strict';

// Adobe Authentication
//
// Communicates with the Adobe API token servers and caches
// tokens locally.
//
var fs = require('fs');
var https = require('https');
var querystring = require('querystring');

// Constructs a new AdobeAuth object.
//
// @param {Object} config - The configuration object with the correct details
//                          to connect to the Adobe Live Stream and Auth API.
//
function AdobeAuth(config) {
  this.config = config;
  this.token = null;
}

// Builds the Adobe Authenticaton request options
//
// @return {Object} Returns a request options object
//
AdobeAuth.prototype.buildRequestOptions = function() {
  var options = {
    agent: false,
    auth: this.config.clientId + ':' + this.config.clientSecret,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    hostname: this.config.authHostname,
    method: 'POST',
    path: this.config.authPath,
    port: 443
  };

  return options;
};

// Attempts to persist the obtained token to the filesystem.
//
AdobeAuth.prototype.cacheToken = function() {
  var tokenCacheFile = this.config.tokenCacheFile;
  var token = this.token;

  fs.writeFile(tokenCacheFile, token, function writeTokenFile(err) {
    if(err) {
      // TODO: Should probably throw an error or pass one to a callback here.
      console.log('Cached token file could not be created or overwritten. ' + err);
      return true;
    }

    console.log('Successfully written ' + token + ' to ' + tokenCacheFile);
  });
};

// Requests a token from the token service, reading from cache for efficiency.
//
// @param {Boolean} forceRefresh - specify whether to always get a new auth token
// @param {Function} callback - the callback to use after attempting to get a
//                              new token
//
AdobeAuth.prototype.getToken = function(forceRefresh, callback) {
  if(this.token === null || forceRefresh) {
    return this.requestToken(callback);
  }

  if(callback) {
    callback(null, this.token);
  }
};

// Attempts to read the token from the filesystem. Will return the token value if
// successfully read and over 20 charaters long.
//
// @return {String} Returns the token if successfully loaded.
//
AdobeAuth.prototype.readCachedToken = function() {
  var data = null;

  try {
    data = fs.readFileSync(this.config.tokenCacheFile);
  } catch(error) {
    // We can fail silently
    console.log(error);
  }

  return (data && data.length > 20) ? data : null;
};

// Requests a new token for the Adobe Authentication API, responding on the
// callback when complete. Use getToken() instead of calling this function
// directly.
//
// @param {Function} callback - the callback to use after attempting to get a
//                              new token
//
AdobeAuth.prototype.requestToken = function(callback) {
  this.token = null; // clear out old token

  var auth = this;
  var buffer = '';
  var options = this.buildRequestOptions();
  var postData = querystring.stringify({
    'grant_type': 'client_credentials'
  });

  var req = https.request(options, function onResponse(res) {
    res.setEncoding('utf8');

    res.on('data', function onData(chunk) {
      buffer += chunk;
    });
  });

  req.on('close', function onClose() {
    var authResult = null;
    var reqError = null;

    if(buffer === '') {
      reqError = 'Did not receive any output from token server.';
    } else {
      try {
        authResult = JSON.parse(buffer);
      } catch(err) {
        reqError = 'Could not parse JSON output ' + err;
      }

      // Note: Because 'access_token' and 'error_description' are values that
      // come back from the Adobe Authentication API and aren't camelcase we
      // need to disable the JSHint check here.
      //
      // jshint camelcase:false
      if(authResult && authResult.access_token) {
        auth.token = authResult.access_token;
        auth.cacheToken();
      }

      if(authResult && authResult.error) {
        reqError = authResult.error_description;
      }
      // Re-enable jshint camelcase check
      // jshint camelcase:true
    }

    if(callback) {
      callback(reqError, auth.token);
    }
  });

  req.on('error', function onError(e) {
    if(callback) {
      callback('Got request serialization error: ' + e);
    }
  });

  req.write(postData);
  req.end();
};

// Invalidates the current token, presumably because it didn't authorize the request.
//
AdobeAuth.prototype.invalidateToken = function() {
  this.token = null;
};

module.exports = AdobeAuth;
