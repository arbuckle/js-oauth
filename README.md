js-oauth
========

So you want to authenticate a request to an OAuth service using Javascript?

This library can be used to create an OAuth 1.0-compliant authentication header for use with requests to an OAuth-secured
web service.  This was built specifically for use against Twitter's 1.1 API, so no guarantees are made that it implements
OAuth support correctly for all use cases, or that it is implemented correctly at all.


OAuth 1.0
---------

The way this works is pretty simple.  A call to oauth.auth() is made, providing an HTTP method and a URL.

- A "nonce" and a timestamp are immediately created.
- The URL is parsed into its constituent components:  protocol://hostname/path; search=string
- A bunch of keys, the nonce, the search string, and other information is percent-encoded and concatenated into a long string, ordered alphabetically by key
- The long string is then concatenated with the HTTP method and base URL.
- The string is then encrypted using the HMAC-SHA1 algorithm and signed using a combo of secret tokens.
- This "signature" is then base-64 encoded and included in the HTTP header, which itself is a concatenated string comprised of the nonce, timestamp, and keys.
- The prepared header is returned
- You make an ajax request using your favorite library and the header.


Usage
-----

    // This is the endpoint that you're looking to authenticate with
    var url = "http://api.catto5k.com/web-service?page=1&user=garfield";

    // The endpoint should have a mechanism for issuing your OAuth keys.
    // This OAuth library needs to be initialized with all of the keys in order to work properly
    oauth.tokens.consumerKey = "consumer-key";
    oauth.tokens.consumerSecret = "consumer-secret";
    oauth.tokens.accessToken = "oauth-access-token";
    oauth.tokens.accessTokenSecret = "oauth-access-token-secret";

    // Get the header with a call to oauth.auth()
    // Accepts three arguments:  oauth.auth(method, url, data)
    // Data is a hash/dict for use with POST requests.  Not tested.
    header = oauth.auth("GET", url);

    // Using jQuery to send out the ajax request.
    $.ajax({
        url: url,
        method: "GET",
        headers: {
            "Authorization": header
        },
        success: function(data) {
            console.log(data);
        },
        error: function(){
            console.log(arguments)
        }
    });


### Included Libraries / Dependencies
Included in this repository are the Hmac-SHA1 and Base64 encoding libraries from the CryptoJS project.
https://code.google.com/p/crypto-js/
