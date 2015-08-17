'use strict';

// Private variables
var value = null;

// Creates an instance of Token.
//
// @constructor
// @this {Token}
// @param {Cache} cache - an Cache object
//
function Token(cache) {
  this.cache = cache;
}

// Clear the current token value, and call the cache method to remove the file.
//
// @return {String} Returns the newly cleared token value.
//
Token.prototype.clean = function() {
  value = null;
  this.cache.clean();
  return value;
};

// Get the current token value, either from the value or try and read from
// the cache.
//
// @return {String} Returns the token value.
//
Token.prototype.get = function() {
  return value || this.cache.read();
};

// Set the current token value, and call the cache method to save to file.
//
// @param {String} newValue The new token value
// @return {String} Returns the newly set token value.
//
Token.prototype.set = function(newValue) {
  value = newValue;
  this.cache.save(newValue);
  return value;
};

module.exports = Token;
