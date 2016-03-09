var opts = null;
$(function() {
    initMessages();
    initData();
    $("#nav").find("li").click(function() {
        var a = $(this);
        a.siblings().removeClass("selected").addClass("notSelected");
        a.addClass("selected").removeClass("notSelected");
        $("#content").find("> div").hide().filter(a.children("a").first().prop("hash")).show();
        return false
    }).filter(":last").click();
    $('input[name=bookmarksSort]').change(function() {
        $("#bookmarksSortOrder").prop("disabled", $(this).val() === "none")
    });
    $("#save").click(function() {
        saveOptions()
    })
});

function initMessages() {
    $("[data-text]").each(function() {
        var b = $(this),
            a = b.data();
        if (a.text) {
            b.text(chrome.i18n.getMessage(a.text))
        }
    })
}

function initData() {
    var b = "checked",
        a = "selected";
    $("#aboutVersion").text(chrome.runtime.getManifest().version);
    chrome.storage.sync.get({
        options: {
            openInNewTab: true,
            keepPopupOpen: false,
            sortBy: "text",
            sortOrder: "ASC",
            showFavIcons: true,
            showTooltips: true,
            saveTreeState: false,
            openBookmarksBar: true,
            searchDelay: 250,
            popupWidth: "360",
            popupHeight: "600"
        }
    }, function(c) {
        opts = c.options;
        $("#bookmarksOpenNewTab").prop(b, opts.openInNewTab);
        $("#bookmarksKeepPopupOpen").prop(b, opts.keepPopupOpen);
        $('input[name=bookmarksSort]').val([opts.sortBy]);
        $("#bookmarksSortOrder").prop("disabled", opts.sortBy === "none");
        $("#bookmarksSortOrder").prop(b, opts.sortOrder === "DESC");
        $("#bookmarksShowFavIcons").prop(b, opts.showFavIcons);
        $("#bookmarksShowTooltips").prop(b, opts.showTooltips);
        $("#bookmarksSaveTreeState").prop(b, opts.saveTreeState);
        $("#bookmarksOpenBookmarksBar").prop(b, opts.openBookmarksBar);
        $("#viewWidth").val(opts.popupWidth);
        $("#viewHeight").val(opts.popupHeight)
    })
}

function saveOptions() {
    chrome.storage.sync.set({
        options: {
            openInNewTab: $("#bookmarksOpenNewTab").prop("checked"),
            keepPopupOpen: $("#bookmarksKeepPopupOpen").prop("checked"),
            sortBy: $('input[name=bookmarksSort]:checked').val(),
            sortOrder: $("#bookmarksSortOrder").prop("checked") ? "DESC" : "ASC",
            showFavIcons: $("#bookmarksShowFavIcons").prop("checked"),
            showTooltips: $("#bookmarksShowTooltips").prop("checked"),
            saveTreeState: $("#bookmarksSaveTreeState").prop("checked"),
            openBookmarksBar: $("#bookmarksOpenBookmarksBar").prop("checked"),
            searchDelay: 250,
            popupWidth: $("#viewWidth").val(),
            popupHeight: $("#viewHeight").val()
        }
    }, function() {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            $("#notSaved").stop(false, true).fadeIn("fast").fadeOut(4000)
        } else {
            $("#saved").stop(false, true).fadeIn("fast").fadeOut(4000)
        }
    })
};
