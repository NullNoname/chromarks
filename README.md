# Chromarks Plus 1.1
This branch is mirror of Chromarks Plus 1.1 released in June 15, 2016. Currently it appears mostly harmless unlike Chromarks 2.6.0 and 2.6.1, but I'm mirroring it in the case it becomes malicious. This extension was uploaded by a user named "denegromaria", although the options screen does not have any credits.

## Tracking
background.js has the following code. It uses Google Analytics once per browser session to notify the author's account `UA-79198833-1` that the extension has been activated . More about the Google Analytics in extensions can be found here: https://developer.chrome.com/extensions/tut_analytics

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-79198833-1']);
    _gaq.push(['_trackPageview']);
    
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

Do note that this extension do not have any Privacy Policies (or even an official site, unlike Chromarks 2.6.*) so more analytics may be added in future versions.

I recommend you to add `0.0.0.0 ssl.google-analytics.com` to your hosts file (`C:/Windows/System32/drivers/etc/hosts` or `/etc/hosts`) to stay safe.

## Bugs and questionable changes
* "Bookmark Current Tab" shows a Add Bookmark dialog but name and URL fields are not filled. This is because the "tabs" permission, which is required to fetch the current tab's URL and title, is missing from this extension's manifest.
* The search feature only highlights the matched bookmarks, unlike the original Chromarks which also hid bookmarks that did not match.
* Options screen always displays "Options saved" text even before you click the Save button.

## File structure changes from Chromarks 2.6.1
* modified:background.html
* modified:background.js
* modified:content.js
* modified:css/options.css
* modified:css/popup.css
* modified:icons/add-bookmark.png
* modified:icons/bookmark-manager.png
* modified:icons/delete.png
* modified:icons/download.png
* modified:icons/folder_add.png
* modified:icons/history.png
* modified:icons/icon-128.png
* modified:icons/icon-16.png
* deleted:icons/icon-19.png
* modified:icons/icon-48.png
* modified:icons/new-tab.png
* modified:icons/options.png
* modified:icons/search.png
* deleted:jquery.js
* modified:manifest.json
* modified:options.html
* modified:options.js
* modified:popup.html
* modified:popup.js
* new file:content.css
* new file:icons/current-tab.png
* new file:icons/icon-24.png
* new file:icons/incognito-window.png
* new file:icons/new-window.png
* new file:icons/pinned-tab.png
* new file:icons/recent-bookmarks.png
* new file:jquery.min.js
* new file:js/bootstrap.min.js
* new file:manifest.json~
* new file:options.html~
* new file:popup.html~
* new file:themes/proton/

## License
License is GNU General Public License version 3 according to the options menu.
https://www.gnu.org/licenses/gpl.html
