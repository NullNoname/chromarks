# Chromarks 2.6.1
Getting a green 'Page is present in your bookmarks' banner? Got redirect to lnkr.us or free-merchants.com? If yes, do you have Chromarks 2.6.0 or newer installed? If so... YOU ARE AT A SERIOUS SECURITY RISK! GIVE IT A 1 STAR RATING WITH A WARNING COMMENT, UNINSTALL IT, AND PLEASE REPORT ABUSE TO GOOGLE!! Chromarks was taken over by the malware vendors. Look at "What happened to Chromarks, anyway?" at the end of this page.

This branch is mirror of Chromarks 2.6.1 released in November 19, 2015, which contain dangerous permissions and malicious codes. I recommend you to NOT INSTALL THIS. Chromarks 2.6.0, released in November 10, 2015, was the first malicious version. As of May 8, 2016, Chromarks 2.6.1 was removed from the Chrome store.

If you loved original Chromarks (or Chrookmarks), please consider manually installing my unofficial branch which is based on the last-good version (2.5.0):
https://github.com/NullNoname/chromarks/tree/unofficial

## File structure changes from 2.5.0 to 2.6.0
* renamed:js/background.js -> background.js
* renamed:js/options.js -> options.js
* renamed:index.html -> popup.html
* renamed:js/popup.js -> popup.js
* renamed:js/jquery-2.1.4.min.js -> jquery.js (Not 100% sure about this one)
* deleted:_locales/en/messages.json
* deleted:license.txt
* new file:background.html
* new file:content.js

## Known BAD changes from 2.5.0 to 2.6.0
### manifest.json
* The following permissions are added which is a very dangerous sign, because it allows the extension to moniter your web browsing activities: `[ "activeTab", "alarms", "browsingData", "clipboardWrite", "contextMenus", "cookies", "declarativeContent", "fontSettings", "gcm", "identity", "idle", "management", "notifications", "pageCapture", "power", "proxy", "sessions", "system.cpu", "system.display", "system.memory", "system.storage", "tabCapture", "tts", "unlimitedStorage", "webRequest", "webRequestBlocking", "*://*/*" ]`
* Javascript eval() is completely allowed in manifest.json (unsafe-eval), which can be used to execute Javascript codes fetched from outside. Google strongly discourage this setting: https://developer.chrome.com/extensions/contentSecurityPolicy#relaxing-eval

### background.js
* background.js is heavily modified. In 2.5.0 it contained a code to open update history page after updating the extension to a new version. In 2.6.0 it contains some codes that may access to brainlog.top, clearbrain.top, and/or lookforward.top in a regular HTTP. brainlog.top is accessed when the extension is installed and this URL returns some javascript codes that can possibly used for malicious purpose.
* If you access brainlog.top's root page (which I don't recommend) it returns a text/plain page with 4 script tags, all of which is located in "stupiko.ru", a drive-by-downloads site according to Norton: https://safeweb.norton.com/report/show_mobile?name=stupiko.ru

### content.js
* content.js is added, which contain codes that injects the annoying 'Page is present in your bookmarks' notification to the pages you are browsing. Why this "feature" was added is unclear, other than demonstrating the ability of code injecting.

### Options Menu
* Offical site URL changed from chromarks.COM to chromarks.NET. The .NET site has nothing but a link to chrome store (no update history or anything) which is a pretty bad sign.
* Link to version history page is removed from the options because chromarks.NET does not have an equivalent.
* PayPal donation link in the options menu is removed.
* Options are not saved. The Save button to actually save your changes is missing. It was fixed in version 2.6.1.
* license.txt is removed. The options menu still states it's GPLv3, but the name of original author James Nuzzi is completely deleted.

## Other known changes from 2.5.0 to 2.6.0
* Most Javascript files have human-friendly indent now. While this enables us to read the code easily, it lacks comments so it might have been formatted by whoever created Chromarks 2.6.0.
* CSS files are also have human-friendly indent, but with comments. The comments are likely added by whoever created Chromarks 2.6.0.
* It seems jquery version is changed. async might use diffenent version too but I'm not sure about this. jsTree is still 3.2.1, but now with human-friendly indent.
* "tabs" permission is removed.
* _locales/en/messages.json is removed. Every text is now hardcoded.
* Google Analytics is removed, probably because of *.top urls mentioned above.

## Changes from 2.6.0 to 2.6.1
* Please note I've downloaded 2.6.1 from Crx4Chrome (http://www.crx4chrome.com/crx/760/) in order to check the code without installing the official Chromarks again. Because of this, there are indent changes to manifest.json and file size differences in icons/icon-*.png.
* manifest.json: The only actual change in manifest.json is the version bump. (2.6.0 -> 2.6.1)
* options.html: Options Save button is restored.
* options.js: Options Save feature is restored, and the "Options saved" notification disappears faster. (2500ms instead of 4000ms)

## License
License is GNU General Public License version 3. The license.txt has been removed from this version but the options menu retains GPLv3 notice.
https://www.gnu.org/licenses/gpl.html

## History of events
* On November 10, 2015, the first malicious version, 2.6.0, of Chromarks was released. The old official site "chromarks.com" was unaffected at this point. The update history page of chromarks.com mentioned only up to 2.5.0.

* On November 14, 2015, the Contact page on chromarks.com (chromarks.com/contact) has been removed, but my topic on its forum (chromarks.com/forum/technical-support/31-psa-chromarks-2-6-0-in-chrome-store-is-malicious) was left unaffected (it had around 100 views the last time I checked).

* On November 19, 2015, Chromarks 2.6.1 was released which restored Save button, but otherwise no changes and still dangerous. On the same day, the entire chromarks.com was replaced with a message "This site has been moved to chromarks.net" and its forum is also gone.

* Starting from 2016, users in Chrome Store reports redirection to lnkr.us or free-merchants.com.

* As of May 8, 2016, Chromarks 2.6.1 was removed from the Chrome store. The chromarks.NET site remain and still linked to the now-defunct Chrome store page.

## What happened to Chromarks, anyway?
On March 2016, a very similar takeover has happened to a popular Chrome extension "Better History" (https://github.com/better-history/better-history/issues/330) and it comes with the same redirection scheme to lnkr.us (https://www.reddit.com/r/Malware/comments/4cw9fz/lnkrus_redirect_malware_report/).

Because of Chromarks' takeover being near identical to Better History's, I can conclude that the original Chromarks author James Nuzzi sold this extension to malware vendors, likely advault.net or its affiliates.

Sadly, it turns out the case like this is not too unusual: http://www.makeuseof.com/tag/x-malicious-browser-extensions-help-hackers-target-victims/

Chrome Web Store will require the developers to be more transparent about the user's privacy (https://yro.slashdot.org/story/16/04/15/1910230/google-updates-chrome-web-store-policy-requires-devs-to-be-more-transparent-about-user-data). Starting from July 15th, 2016, extensions that don't comply with the new Chrome Web Store policy will be removed. The Chromarks's options menu or the website (chromarks.NET) do not have any Privacy Policy pages.

The malicious version of Chromarks was deleted from Chrome Store as of May 8, 2016, either by its authors or Google.
