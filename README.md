# Chromarks 2.6.0 and 2.6.1 WARNING
Getting a green 'Page is present in your bookmarks' banner? Got redirect to lnkr.us or free-merchants.com? If yes, do you have Chromarks 2.6.0 or 2.6.1 installed? If so... YOU ARE AT A SERIOUS SECURITY RISK! UNINSTALL NOW!!

You can read what 2.6.0 and 2.6.1 do in the following branch: https://github.com/NullNoname/chromarks/tree/2.6.0

# Chromarks 2.5.0 Mirror
This repository is a mirror of Chrome extension "Chromarks" version 2.5.0. This is the last version before bunch of dangerous permissions added along with malicious codes.

This extension can be installed in Chrome's developer mode by using the "Load unpacked extension" button.
More Info: https://developer.chrome.com/extensions/getstarted#unpacked

## Tracking
This extension uses Google Analytics to track how many times the bookmark popup has been activated, and how many times each of toolbar buttons has been clicked. These events are sent to an account named `UA-378143-9`.

The following codes are from popup.js, beautified by http://jsbeautifier.org/.

### Initialize Tracking
    _gaq = _gaq || [];
    _gaq.push(["_setAccount", "UA-378143-9"]);
    _gaq.push(["_trackPageview"]);
    (function() {
        var b = document.createElement("script");
        b.type = "text/javascript";
        b.async = true;
        b.src = "https://ssl.google-analytics.com/ga.js";
        var a = document.getElementsByTagName("script")[0];
        a.parentNode.insertBefore(b, a)
    })();

### Toolbar Buttons Clicked Tracking
        $("#bmManagerImg").click(function() {
            _gaq.push(["_trackEvent", this.id, "clicked"]);
            chrome.tabs.create({
                url: "chrome://bookmarks",
                selected: true
            })
        });
        $("#historyImg").click(function() {
            _gaq.push(["_trackEvent", this.id, "clicked"]);
            chrome.tabs.create({
                url: "chrome://history",
                selected: true
            })
        });
        $("#downloadsImg").click(function() {
            _gaq.push(["_trackEvent", this.id, "clicked"]);
            chrome.tabs.create({
                url: "chrome://downloads",
                selected: true
            })
        });
        $("#optionsImg").click(function() {
            _gaq.push(["_trackEvent", this.id, "clicked"]);
            chrome.tabs.create({
                url: "chrome://extensions/?options=" + chrome.runtime.id,
                selected: true
            })
        });
        $("#search").on("search", function() {
            _gaq.push(["_trackEvent", this.id, "on"]);
            $("#bookmarks").jstree(true).search($("#search").val())
        }).focus()

## License
License is GNU General Public License version 3, as noted in license.txt.
https://www.gnu.org/licenses/gpl.html

## Branches and more
There is a "Chromarks Detoxified" branch that disables analytics and has small fixes.
https://github.com/NullNoname/chromarks/tree/unofficial

The original author has a GitHub account and a full source code repository, but it hasn't updated since Chrookmarks 1.5.0:
https://github.com/cruisencode/Chrookmarks
