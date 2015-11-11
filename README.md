# chromarks
This branch is mirror of Chromarks 2.6.0 which added bunch of dangerous permissions.

## File structure changes from 2.5.0
* renamed:js/background.js -> background.js
* renamed:js/options.js -> options.js
* renamed:index.html -> popup.html
* renamed:js/popup.js -> popup.js
* renamed:js/jquery-2.1.4.min.js -> jquery.js (Not 100% sure about this one)
* deleted:_locales/en/messages.json
* deleted:license.txt
* new file:background.html
* new file:content.js

## Known BAD changes
* The following permissions are added which is a very dangerous sign: `[ "activeTab", "alarms", "browsingData", "clipboardWrite", "contextMenus", "cookies", "declarativeContent", "fontSettings", "gcm", "identity", "idle", "management", "notifications", "pageCapture", "power", "proxy", "sessions", "system.cpu", "system.display", "system.memory", "system.storage", "tabCapture", "tts", "unlimitedStorage", "webRequest", "webRequestBlocking", "*://*/*" ]`
* Offical site URL changed from chromarks.COM to chromarks.NET. The .NET site has nothing but a link to chrome store (no update history or anything) which is a pretty bad sign.
* background.js is heavily modified. In 2.5.0 it contained a code to open update history page after updating the extension to a new version. In 2.6.0 it contains some codes that may send your bookmark URL to brainlog.top, clearbrain.top, and/or lookforward.top in a regular HTTP.
* license.txt is removed. Fortunately the options menu still states it's GPLv3.
* content.js is added, which contain codes that injects the annoying 'Page is present in your bookmarks' notification to the pages you are browsing. Why this "feature" was added is unclear, other than demonstrating the ability of code injecting.

## Known GOOD change
* Most Javascript files and CSS files have human-friendly indent now.

## Other known changes
* It seems jquery version is changed. async might use diffenent version too but I'm not sure about this. jsTree is still 3.2.1, but now with human-friendly indent.
* "tabs" permission is removed.
* _locales/en/messages.json is removed. Every text is now hardcoded.
* Google Analytics is removed, probably because of *.top urls mentioned above.

## License
License is GNU General Public License version 3. The license.txt has been removed from this version but the options menu retains GPLv3 notice.
https://www.gnu.org/licenses/gpl.html
