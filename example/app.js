'use strict';

var config = require('./config');
var AdobeLiveStreamConnector = require('../lib/adobeLiveStreamConnector');

var connector = new AdobeLiveStreamConnector(config, callback);
connector.connect();

function callback(error, data) {
  if(error) {
    console.log('Callback error:', error);
    return true;

    // Do something else with the error
    // if(liveStreamConnector.dead) {
    //   process.exit(2);
    // }
  }

  console.log('Callback: ', data);
}
