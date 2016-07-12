function getBmTree(item, callback) {
    var that = this,
        parentId = item.parentId,
        bmList = [item.id];

    if (parentId) {
        chrome.bookmarks.get(parentId, function (results) {
            if (results.length > 0) {
                getBmTree(results[0], function (newList) {
                    callback.call(that, bmList.concat(newList));
                });
            } else {
                callback.call(that, bmList);
            }
        });
    } else {
        callback.call(that, bmList);
    }
}

function searchNodes(searchString, callback) {
    var that = this;

    chrome.bookmarks.search(searchString, function (results) {
        async.concat(
            results,
            function (result, callback) {
                getBmTree(result, function (newList) {
                    callback.call(that, null, newList);
                });
            },
            function (err, results) {
                var bmList = [],
                    i;

                for (i = 0; i < results.length; i++) {
                    if (bmList.indexOf(results[i]) === -1) {
                        bmList.push(results[i]);
                    }
                }

                callback(bmList);
            }
        );
    });
}

var bgBookmarks = {};
var opts = {};
function loadOpts(){
    chrome.storage.sync.get({
            'options': {notificationPages: false}
        },
        function (items) {
            opts = items.options;
        });
}
loadOpts();

chrome.runtime.onMessage.addListener(function ( request, sender, sendResponse ) {
    if(request == 'options'){
        loadOpts();
    }
    if(request == 'checkPage' && opts.notificationPages){
        if(!sender.url)
        {
            sendResponse( {
                state   : 'ready',
                result  : []
            } );
        }
        else {
            if( !bgBookmarks[sender.url] ) {
                bgBookmarks[sender.url] = {
                    state   : 'pending',
                    result  : []
                };
                sendResponse( bgBookmarks[sender.url] );
                searchNodes (sender.url, function(result){
                    bgBookmarks[sender.url] = {
                        state   : 'ready',
                        result  : result
                    };
                });
            }
            else {
                sendResponse( bgBookmarks[sender.url] );
                if( bgBookmarks[sender.url].state == 'ready' ) {
                    delete( bgBookmarks[sender.url] );
                }
            }
        }
    }
} );
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-79198833-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();