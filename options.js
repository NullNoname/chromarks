var opts = null;

$(function() {
  initMessages();
  initData();

  $("#nav").find("li").click(function() {
    var obj = $(this);

    obj.siblings().removeClass("selected").addClass("notSelected");
    obj.addClass("selected").removeClass("notSelected");

    $("#content").find("> div").hide().filter(obj.children("a").first().prop("hash")).show();

    return false;
  }).filter(":last").click();

  $("#bookmarksSortBy").change(function () {
    $("#bookmarksSortOrder").prop("disabled", $(this).val() === "none");
  });

  $("#save").click(function () {
    saveOptions();
  });
  $("input,select").change(function () {
    saveOptions();
  });
});

function initMessages() {
  $("[data-text]").each(function () {
    var el = $(this),
        dataValues = el.data();

    if (dataValues.text) {
      el.text(chrome.i18n.getMessage(dataValues.text));
    }
  });
}

function initData() {
  var checked = 'checked',
      selected = 'selected';

  $("#aboutVersion").text(chrome.runtime.getManifest().version);

  chrome.storage.sync.get({
    'options': {
      'openInNewTab': true,
      'keepPopupOpen': false,
      'sortBy': 'text',
      'sortOrder': 'ASC',
      'showFavIcons': true,
      'showTooltips': true,
      'saveTreeState': false,
      'openBookmarksBar': true,
      'searchDelay': 250,
      'popupWidth': '360',
      'popupHeight': '600'
    }
  }, function (items) {
    opts = items.options;

    $("#bookmarksOpenNewTab").prop(checked, opts.openInNewTab);
    $("#bookmarksKeepPopupOpen").prop(checked, opts.keepPopupOpen);
    $("#bookmarksSortBy").find("option[value='" + opts.sortBy + "']").prop(selected, true);
    $("#bookmarksSortOrder").prop("disabled", opts.sortBy === "none");
    $("#bookmarksSortOrder").find("option[value='" + opts.sortOrder + "']").prop(selected, true);
    $("#bookmarksShowFavIcons").prop(checked, opts.showFavIcons);
    $("#bookmarksShowTooltips").prop(checked, opts.showTooltips);
    $("#bookmarksSaveTreeState").prop(checked, opts.saveTreeState);
    $("#bookmarksOpenBookmarksBar").prop(checked, opts.openBookmarksBar);

    $("#viewWidth").val(opts.popupWidth);
    $("#viewHeight").val(opts.popupHeight);
  });
}

function saveOptions() {
  chrome.storage.sync.set({
    'options': {
      'openInNewTab': $("#bookmarksOpenNewTab").prop('checked'),
      'keepPopupOpen': $("#bookmarksKeepPopupOpen").prop('checked'),
      'sortBy': $("#bookmarksSortBy").val(),
      'sortOrder': $("#bookmarksSortOrder").val(),
      'showFavIcons': $("#bookmarksShowFavIcons").prop('checked'),
      'showTooltips': $("#bookmarksShowTooltips").prop('checked'),
      'saveTreeState': $("#bookmarksSaveTreeState").prop('checked'),
      'openBookmarksBar': $("#bookmarksOpenBookmarksBar").prop('checked'),
      'searchDelay': 250,
      'popupWidth': $("#viewWidth").val(),
      'popupHeight': $("#viewHeight").val()
    }
  }, function () {
    if (chrome.runtime.lastError) {
      $("#notSaved").stop(false, true).fadeIn("fast").fadeOut(4000);
    } else {
      $("#saved").stop(false, true).fadeIn("fast").fadeOut(2500);
    }
  });
}
