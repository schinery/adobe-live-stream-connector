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

// Attempts to read the token value from the filesystem.
//
// @return {String} Returns the token value if successfully read.
//
Cache.prototype.read = function() {
  var data = null;

  try {
    data = fs.readFileSync(cacheFile).toString();
    data = (data !== null ? data : '');
  } catch(err) {
    // Fail silently, put console.log in to appease the JSHint gods
    // TODO: Should we throw an error instead
  }

  return data;
};

// Attempts to cache a token value to the filesystem. If null is passed in then
// the token value will be set to blank.
//
// @param {String} newValue The new token value to cache
//
Cache.prototype.save = function(newValue) {
  var tokenValue = newValue || '';

  try{
    fs.writeFileSync(cacheFile, tokenValue);
  } catch(err) {
    // Fail silently, put console.log in to appease the JSHint gods
    // TODO: Should we throw an error instead
  }
};

module.exports = Cache;
