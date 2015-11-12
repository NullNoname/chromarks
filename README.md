# chromarks
I recommend you to NOT INSTALL THIS. If you already have Chromarks 2.6.0 installed from the Chrome Store, UNINSTALL NOW, GIVE IT A 1 STAR RATING WITH A WARNING COMMENT, AND PLEASE REPORT ABUSE TO GOOGLE!!

This branch is mirror of Chromarks 2.6.0 released in November 10, 2015, which added bunch of dangerous permissions and malicious codes.

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
### manifest.json
* The following permissions are added which is a very dangerous sign, because it allows the extension to moniter your web browsing activities: `[ "activeTab", "alarms", "browsingData", "clipboardWrite", "contextMenus", "cookies", "declarativeContent", "fontSettings", "gcm", "identity", "idle", "management", "notifications", "pageCapture", "power", "proxy", "sessions", "system.cpu", "system.display", "system.memory", "system.storage", "tabCapture", "tts", "unlimitedStorage", "webRequest", "webRequestBlocking", "*://*/*" ]`
* Javascript eval() is completely allowed in manifest.json (unsafe-eval), which can be used to execute Javascript codes fetched from outside. Google strongly discourage this setting: https://developer.chrome.com/extensions/contentSecurityPolicy#relaxing-eval

### background.js
* background.js is heavily modified. In 2.5.0 it contained a code to open update history page after updating the extension to a new version. In 2.6.0 it contains some codes that may send your bookmark URL to brainlog.top, clearbrain.top, and/or lookforward.top in a regular HTTP. brainlog.top is accessed when the extension is installed and this URL returns some javascript codes that can possibly used for malicious purpose.

### content.js
* content.js is added, which contain codes that injects the annoying 'Page is present in your bookmarks' notification to the pages you are browsing. Why this "feature" was added is unclear, other than demonstrating the ability of code injecting.

### Options Menu
* Offical site URL changed from chromarks.COM to chromarks.NET. The .NET site has nothing but a link to chrome store (no update history or anything) which is a pretty bad sign.
* Link to version history page is removed from the options because chromarks.NET does not have an equivalent.
* PayPal donation link in the options menu is removed.
* Options are not saved. The Save button to actually save your changes is missing.
* license.txt is removed. The options menu still states it's GPLv3, but the name of original author James Nuzzi is completely deleted.

## Other known changes
* Most Javascript files have human-friendly indent now. While this enables us to read the code easily, it lacks comments so it might have been formatted by whoever created Chromarks 2.6.0.
* CSS files are also have human-friendly indent, but with comments. The comments are likely added by whoever created Chromarks 2.6.0.
* It seems jquery version is changed. async might use diffenent version too but I'm not sure about this. jsTree is still 3.2.1, but now with human-friendly indent.
* "tabs" permission is removed.
* _locales/en/messages.json is removed. Every text is now hardcoded.
* Google Analytics is removed, probably because of *.top urls mentioned above.

## License
License is GNU General Public License version 3. The license.txt has been removed from this version but the options menu retains GPLv3 notice.
https://www.gnu.org/licenses/gpl.html

## What happened to Chromarks, anyway?
This is just my speculation, but the author's account might have been hacked by Russian or Netherlands hackers and they uploaded this version.
If you access brainlog.top's root page (which I don't recommend) it returns a text/plain page with 4 script tags, all of which is located in "stupiko.ru", a drive-by-downloads site according to Norton: https://safeweb.norton.com/report/show_mobile?name=stupiko.ru

It is also possible that the author sold his soul to the hackers, but this is less likely considing the legitimate official site of chromarks (chromarks.com) is still alive as of November 12, 2015.
