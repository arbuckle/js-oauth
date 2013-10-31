js-oauth
========

OAuth 1.0 Authorization Header Builder

So you want to authenticate a request to an OAuth service using Javascript?

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
    console.log(oauth.auth("GET", url));
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
