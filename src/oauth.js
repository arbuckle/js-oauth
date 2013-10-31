var oauth = function(){

    // token information that must be populated before any functionality is available.
    var tokens = {
        consumerKey: undefined,
        consumerSecret: undefined,
        accessToken: undefined,
        accessTokenSecret: undefined
    };

    var signatureMethod = "HMAC-SHA1",
        version = "1.0";


    function _get_signature(method, url, data, nonce, timestamp){
        /*
         * Generates a signed HmacSHA1 signature token for use in the request authentication header.
         * Returns the Base64-encoded value of the signed token.
         */

        var baseURL,
            query,
            signature,
            key,
            signingKey = tokens.consumerSecret + "&" + tokens.accessTokenSecret,
            urlElement = document.createElement("a");

        // using a DOM element to parse the provided URL.
        urlElement.href = url;
        baseURL = urlElement.protocol + "//" + urlElement.hostname + urlElement.pathname;
        query = urlElement.search.split("&");
        if (query.length !== 0) {
            query[0] = query[0].substr((1))
        }

        // walking the user-provided data object and adding any key-value pairs.
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                query.push(key + "=" + _urlEncode(data[key]));
            }
        }

        // adding the oauth key-value pairs.
        query.push("oauth_consumer_key=" + _urlEncode(tokens.consumerKey));
        query.push("oauth_nonce=" + _urlEncode(nonce));
        query.push("oauth_signature_method=" + _urlEncode(signatureMethod));
        query.push("oauth_timestamp=" + _urlEncode(timestamp));
        query.push("oauth_token=" + _urlEncode(tokens.accessToken));
        query.push("oauth_version=" + _urlEncode(version));

        query.sort();

        signature = method + "&" + _urlEncode(baseURL) + "&" + _urlEncode(query.join("&"));

        var hash = CryptoJS.HmacSHA1(signature, signingKey);
        return hash.toString(CryptoJS.enc.Base64);
    }

    function _urlEncode(msg) {
        // Javascript does not encode exclamation points for URLs in a way that is compatible with Twitter.
        return encodeURIComponent.call(window, msg).replace(/!/g, "%21");
    }

    function _get_nonce(){
        /*
         * The nonce is a 32-byte semi-unique key used to ensure that the incoming request is unique.
         */

        var i,
            nonce = "",
            pool = "0123456789abcdef",
            max = 32;
        for (i=0; i < max; i ++) {
            nonce += pool[Math.floor(Math.random() * 16)];
        }
        return nonce;
    }

    function get_authentication_header(method, url, data) {

        // setting data to empty object if not populated.
        if (!data) {
            data = {};
        }

        var header = [],
            nonce = _get_nonce(),
            timestamp = Math.floor(new Date().getTime() / 1000),
            signature = _get_signature(method, url, data, nonce, timestamp);

        header.push("oauth_consumer_key=\"" + _urlEncode(tokens.consumerKey) + "\"");
        header.push("oauth_nonce=\"" + _urlEncode(nonce) + "\"");
        header.push("oauth_signature=\"" + _urlEncode(signature) + "\"");
        header.push("oauth_signature_method=\"" + _urlEncode(signatureMethod) + "\"");
        header.push("oauth_timestamp=\"" + _urlEncode(timestamp) + "\"");
        header.push("oauth_token=\"" + _urlEncode(tokens.accessToken) + "\"");
        header.push("oauth_version=\"" + _urlEncode(version) + "\"");

        return "OAuth " + header.join(", ");
    }

    return {
        tokens: tokens,
        auth: get_authentication_header
    }
}();
