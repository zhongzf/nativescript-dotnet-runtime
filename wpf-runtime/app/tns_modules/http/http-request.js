/**
 * Android specific http request implementation.
 */
//var imageSource = require("image-source");
var types = require("utils/types");
var platform = require("platform");
var requestIdCounter = 0;
var pendingRequests = {};
var completeCallback = new com.tns.Async.CompleteCallback({
    onComplete: function (result, context) {
        onRequestComplete(context, result);
    }
});
function onRequestComplete(requestId, result) {
    var callbacks = pendingRequests[requestId];
    delete pendingRequests[requestId];
    if (result.error) {
        callbacks.rejectCallback(new Error(result.error.toString()));
        return;
    }
    var headers = {};
    if (result.headers) {
        var jHeaders = result.headers;
        var length = jHeaders.size();
        var i;
        var pair;
        for (i = 0; i < length; i++) {
            pair = jHeaders.get(i);
            headers[pair.key] = pair.value;
        }
    }
    callbacks.resolveCallback({
        content: {
            raw: result.raw,
            toString: function () { return result.responseAsString; },
            toJSON: function () { return JSON.parse(result.responseAsString); }/*,
            toImage: function () {
                return new Promise(function (resolveImage, rejectImage) {
                    if (result.responseAsImage != null) {
                        resolveImage(imageSource.fromNativeSource(result.responseAsImage));
                    }
                    else {
                        rejectImage(new Error("Response content may not be converted to an Image"));
                    }
                });
            }*/
        },
        statusCode: result.statusCode,
        headers: headers
    });
}
function buildWebRequestOptions(options) {
    if (!types.isString(options.url)) {
        throw new Error("Http request must provide a valid url.");
    }
    var webRequestOptions = {};
    webRequestOptions.url = options.url;
    if (types.isString(options.method)) {
        webRequestOptions.method = options.method;
    }
    if (options.content) {
        webRequestOptions.content = options.content;
    }
    if (types.isNumber(options.timeout)) {
        webRequestOptions.timeout = options.timeout;
    }
    if (options.headers) {
        var webHeaderCollection = new System.Net.WebHeaderCollection();
        for (var key in options.headers) {
            webHeaderCollection.add(key, options.headers[key] + "");
        }
        webRequestOptions.headers = webHeaderCollection;
    }
    //var screen = platform.screen.mainScreen;
    //webRequestOptions.screenWidth = screen.widthPixels;
    //webRequestOptions.screenHeight = screen.heightPixels;
    return webRequestOptions;
}
function request(options) {
    if (!types.isDefined(options)) {
        return;
    }
    return new Promise(function (resolve, reject) {
        try {
            var webRequestOptions = buildWebRequestOptions(options);
            var callbacks = {
                resolveCallback: resolve,
                rejectCallback: reject
            };
            pendingRequests[requestIdCounter] = callbacks;
            var request = System.Net.WebRequest.CreateHttp(webRequestOptions.url);
            request.Headers = webRequestOptions.headers;
            request.Timeout = webRequestOptions.timeout;
            request.ContentType = webRequestOptions.content;
            // TODO:
            var response = request.GetResponseAsync();
            //com.tns.Async.Http.MakeRequest(javaOptions, completeCallback, new java.lang.Integer(requestIdCounter));
            requestIdCounter++;
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.request = request;
