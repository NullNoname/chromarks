chrome.runtime.sendMessage( 'content.js', function ( config ) {
    if ( typeof( config ) === 'string' ) {
        config = $.parseJSON( config );
    }

    if(config && config.css) {
        var interval = null;
        var intervalCounter = 0;
        var checkPage = function () {
            if(intervalCounter > 4){
                clearInterval(interval);
            }
            ++intervalCounter;
            chrome.runtime.sendMessage('checkPage', function (result) {
                if (result.state == 'ready') {
                    clearInterval(interval);
                    if (result.result && result.result.length) {
                        var style = document.createElement('style');
                        style.innerHTML = config.css;
                        ( document.head || document.documentElement ).appendChild(style);

                        var div = document.createElement('div');
                        div.id = 'chromarks_page_informer';
                        div.innerHTML = 'Page is present in your bookmarks';

                        var a = document.createElement('a');
                        a.innerHTML = 'X';
                        a.className = 'close_magyar_fb_informer';
                        div.appendChild(a);

                        document.body.appendChild(div);

                        var removeChromarksPageInformer = function(){
                            var chromarks_page_informer = document.getElementById("chromarks_page_informer");
                            chromarks_page_informer.parentNode.removeChild( chromarks_page_informer );
                        };

                        a.addEventListener("click", removeChromarksPageInformer, false);

                        setTimeout(removeChromarksPageInformer, 4500);
                    }
                }

            });
        }
        var interval = setInterval(checkPage, 1000);
    }
});