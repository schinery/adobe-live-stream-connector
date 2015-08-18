'use strict';

var fs = require('fs');

// Private variables
var cacheFile = 'adobe.token';

// Creates an instance of Token.
//
// @constructor
// @this {Cache}
//
function Cache() {
}

// Attempts to clear the cache a token from the filesystem.
//
Cache.prototype.clean = function() {
  try{
    fs.unlinkSync(cacheFile);
  } catch(err) {
    // Fail silently, put console.log in to appease the JSHint gods
    // TODO: Should we throw an error instead
    console.log('Clean Cache Error: ' + err);
  }
};

// Attempts to read the token value from the filesystem.
//
// @return {String} Returns the token value if successfully read.
//
Cache.prototype.read = function() {
  var tokenValue = null;

  try {
    tokenValue = fs.readFileSync(cacheFile).toString();
  } catch(err) {
    // Fail silently, put console.log in to appease the JSHint gods
    // TODO: Should we throw an error instead
    console.log('Read Cache Error: ' + err);
  }

  return tokenValue;
};

// Attempts to cache a token value to the filesystem.
//
// @param {String} newValue The new token value to cache
//
Cache.prototype.save = function(tokenValue) {
  try{
    fs.writeFileSync(cacheFile, tokenValue);
  } catch(err) {
    // Fail silently, put console.log in to appease the JSHint gods
    // TODO: Should we throw an error instead
    console.log('Save Cache Error: ' + err);
  }
};

module.exports = Cache;
