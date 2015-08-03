# Adobe Live Stream Connector

A NodeJS wrapper for connecting to the [Adobe Live Stream](https://marketing.adobe.com/developer/documentation/analytics-live-stream/overview-1) API.

Based on the code example [Adobe LiveStream NodeJS Starter](https://github.com/sandersonb/firehose-nodejs-starter) by Brian Sanderson.

## Prerequisites

You will need to have the an Adobe ID and have it [linked to your Analytics account](https://marketing.adobe.com/developer/documentation/authentication-1/auth-link-account-1). You'll also have needed to have [created an application](https://marketing.adobe.com/developer/documentation/authentication-1/auth-register-app-1) to use the Live Stream.

This module currently only works for the [Client Credential](https://marketing.adobe.com/developer/documentation/authentication-1/auth-client-credentials-1#concept_5190CB12025F4B29947AB2CF13435C9C) authentication.

## Installation

```sh
npm install adobe-live-stream-connector
```

## Usage

```js
var AdobeLiveStreamConnector = require('adobe-live-stream-connector');

var connector = new AdobeLiveStreamConnector(config, callback);
connector.connect();
```

The `config` param is an Object of configration options:

```js
var config = {
  clientId: '', // Your Adobe client ID
  clientSecret: '', // Your Adobe client secret
  loopInterval: 1000, // The number of milliseconds to check connection is still alive
  maxConnections: 1, // The maximum connections you want to make to the Live Stream API
  streamUrl: '', // The URL to your Live Stream data
  tokenApiHost: 'api.omniture.com', // The Adobe Authentication URL
  tokenCacheFile: 'adobeAuth.token', // The name of the file to store the access token in
  trustAllSSLCerts: true // Specify whether to trust
}
```

The `callback` param is a method that takes 2 parameters:

```js
function callback(error, response) {
  if(error) {
    // Do something with the error
    console.log('error', error);
  }

  // Do something with the response
  console.log('response', response);
}
```

## Tests

Currently there are no tests! This needs to rectified.

## Release History

1.0.0

Initial launch version.

## License

[MIT](http://opensource.org/licenses/MIT) license

## Contributing

* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it
Fork the project
* Start a feature/bugfix branch
* Commit and push until you are happy with your contribution
* Make sure to add tests for it. This is important so I don't break it in a future version unintentionally
