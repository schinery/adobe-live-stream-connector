'use strict';

var fs = require('fs');

// Private variables
var cacheFile = null;
var value = null;

// Attempts to read the token value from the filesystem.
//
// @return {String} Returns the token value if successfully read.
//
function readFromCache() {
  var data = null;

  try {
    data = fs.readFileSync(cacheFile).toString();
    // console.log('data', data);
  } catch(err) {
    // We can fail silently, put console.log in to appease the JSHint gods
    // TODO: Should we throw an error instead
    console.log('Error reading cache file. ' + err);
  }

  return data !== '' ? data : null;
}

// Attempts to cache the token value to the filesystem.
// @private
// @param {String} newValue The new token value to cache
//
function writeToCache(newValue) {
  var tokenValue = newValue || '';

  try{
    fs.writeFileSync(cacheFile, tokenValue);
  } catch(err) {
    // Fail silently, put console.log in to appease the JSHint gods
    // TODO: Should we throw an error instead
    console.log('Error writing cache file. ' + err);
  }
}

// Creates an instance of Token.
//
// @constructor
// @this {Token}
// @param {Object} config The configuration object with the correct details
//                        to connect to the Adobe Live Stream and Auth API
//
function Token(config) {
  config = config || {};
  cacheFile = config.tokenCacheFile || 'adobe.token';
}

// Get the current token value, either from the value or try and read from
// the cache.
//
// @return {String} Returns the token value.
//
Token.prototype.get = function() {
  return value || readFromCache();
};

// Set the current token value, and call the cache method to save to file.
//
// @param {String} newValue The new token value
// @return {String} Returns the newly set token value.
//
Token.prototype.set = function(newValue) {
  value = newValue;
  writeToCache(newValue);
  return value;
};

module.exports = Token;
