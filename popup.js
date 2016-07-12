var opts = null,
    open = {"currentTab": 0, "newTab": 1, "newWindow": 2, "incognito": 3, "pinnedTab": 4};
var searching = false;

function recentBookmarksIint() {
  plugins = [
    "wholerow",
    "search",
    "contextmenu"
    //"types"
  ];

  if (opts.saveTreeState) {
    plugins.push("state");
  }
  if ((opts.sortBy === 'text') || (opts.sortBy === 'date')) {
    plugins.push("sort");
  }

  var bookmarks = $("#recentBm");
  bookmarks[0].ctxMenu = {
    elements : {
      folder :{
        openNew : true, openNewWindow : true, openIncognito : true
      },
      bookmark :{
        openCurrent : true, openNew : true, openPinned : true, openNewWindow : true, openIncognito : true,
        edit : function(data){
          this.set_text(data.node.id, $("#editName").val());
          $("#bookmarks").jstree('refresh');
          data.thisDlg.dialog("close");
        },
        delete : function(data){
           this.delete_node(data.node);
           $("#bookmarks").jstree('refresh');
           buildTree();
        }
      }
    }
  }

  function buildTree(){
    bookmarks.jstree('destroy');
    loadRecentChildren(function(data){
      bookmarks.jstree({
        "plugins": plugins,
        "core": {
          "themes": {
            "variant": "small",
            'name': 'proton',
            'responsive': true
          },
          "multiple": false,
          "animation": false,
          "worker": false,
          "data": data
        },
        "sort": sortNodesRecent,
        "contextmenu": {
          "show_at_node": false,
          "items": ctxMenuItems
        }
      });
    });
  }
  buildTree();
  bookmarks[0].buildTree = buildTree;
  return bookmarks;
}

$(function () {
  // Load the options
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
      'popupHeight': '600',
      'deleteWithoutConfirmation': false,
      'textSize': 11,
      'notificationPages': false,
      'recentNum': 15,
      'closeExpandedFolders': true
    }
  },
      function (items) {
    opts = items.options;
    opts.dialogWidth = opts.popupWidth - 60;

    var body = $("body"),
        bookmarks = $("#bookmarks"),
        wrapper = $("#wrapper"),
        title = $("#title"),
        borderWidth,
        plugins = [
          "wholerow",
          "search",
          "contextmenu",
          "types",
          "dnd"
        ];

      if(opts.textSize){
        var style = document.createElement('style');
        style.innerHTML =
            '.font_size_' + opts.textSize + ' #bookmarks{' +
            'font-size: ' + opts.textSize + 'px;' +
            '}' +
            '.font_size_' + opts.textSize + ' #recentBm{' +
            'font-size: ' + opts.textSize + 'px;' +
            '}' +
            '.font_size_' + opts.textSize + ' .jstree-default-small .jstree-node{' +
            'line-height: ' + (parseInt(opts.textSize) + 4) + 'px;' +
            '}';
        ( document.head || document.documentElement ).appendChild(style);

        wrapper.addClass('font_size_' + opts.textSize);
      }


    // Set window width & height
    body
        .css("min-width", opts.popupWidth + "px")
        .css("min-height", opts.popupHeight + "px");

    borderWidth = parseInt(wrapper.css('borderWidth'), 10) * 2;

    wrapper
        .width((body.innerWidth() - borderWidth) + "px")
        .height((body.innerHeight() - borderWidth) + "px");
   // bookmarks.height((wrapper.height() - title.outerHeight(true)) + "px");

    if (opts.saveTreeState) {
      plugins.push("state");
    }
    if ((opts.sortBy === 'text') || (opts.sortBy === 'date')) {
      plugins.push("sort");
    }

    var recentBookmarks =  recentBookmarksIint();

    bookmarks[0].ctxMenu = {
      elements : {
        bookmark :{
          openCurrent : true, openNew : true, openPinned : true, openNewWindow : true, openIncognito : true,
          edit : function(data){
            this.refresh_node(data.node.parent);
            $("#recentBm").jstree('set_text', data.node.id, $("#editName").val())
            data.thisDlg.dialog("close");
          },
          delete : function(data){
            this.refresh_node(data.node.parent);
            $("#recentBm")[0].buildTree();
          }
        }
      }
    }

    bookmarks.jstree({
      "plugins": plugins,
      "core": {
        "themes": {
          "variant": "small",
          'name': 'proton',
          'responsive': true
        },
        "multiple": false,
        "animation": false,
        "worker": false,
        "check_callback": function (op, node, par, pos, more) {
          if(("move_node" === op || "copy_node" === op) && more && more.dnd && "i" == more.pos){
            //always move to other directory
            return true;
          }
          if( ("move_node" === op || "copy_node" === op ) && ((opts.sortBy === 'text') || (opts.sortBy === 'date')) && more && more.dnd ){
            return false;
          }
          return true;
        },
        "data": loadBmChildren
      },
      "sort": sortNodesBookmarks,
      "search": {
        "show_only_matches": true,
        "show_only_matches_children": true,
        "ajax": searchNodes
      },
      "contextmenu": {
        "show_at_node": false,
        "items": ctxMenuItems
      },
      "types": {
        "bookmark": {
          "max_children": 0,
          "max_depth": 0,
          "valid_children": []
        }
      },
      "dnd": {
        "copy": false,
        "large_drop_target": true,
        "large_drag_target": true
      }
    });

    $("#recentBmImg").click(function () {
      var recentBm = $("#recentBm");
      if(recentBm.is(':visible')){
        recentBm.hide();
        $("#bookmarks").show();
        localStorage.lastOpenTab = 'bookmarks';
      }
      else{
        recentBm.show();
        $("#bookmarks").hide();
        localStorage.lastOpenTab = 'recentBm';
      }
      $("#search").val('');
      $("#" + localStorage.lastOpenTab ).jstree(true).search('');
    });

    bookmarks.on("ready.jstree", function (e, data) {
      if(localStorage.lastOpenTab && localStorage.lastOpenTab == 'recentBm'){
        $("#recentBm").show();
        $("#bookmarks").hide();
      }
      else{
        localStorage.lastOpenTab = 'bookmarks';
      }
    });

        var select_node = function(e, data){
      if (data.event && (data.event.type !== "contextmenu")) {
        var tree = data.instance,
            node = data.node;

        if (tree.is_leaf(node)) {
          if (node.original.url) {
            if (opts.openInNewTab) {
              openBookmark(open.newTab, node);
            } else {
              openBookmark(open.currentTab, node);
            }
          }
        } else {
          tree.toggle_node(node);
        }
      }
    };

    bookmarks.on("select_node.jstree", select_node);
    recentBookmarks.on("select_node.jstree", select_node);

    bookmarks.on("move_node.jstree", function (e, data) {
      var new_index = data.position;
      if(data.parent == data.old_parent && data.position > data.old_position){
        new_index++;
      }
      chrome.bookmarks.move(data.node.id, {parentId: data.parent, index : new_index}, function(){
        //console.log(arguments);
      });
    });

	
    bookmarks.on("search.jstree", function (e, data) {
      data.nodes.find(".jstree-node").show();
	  searching = false;
    });

    var after_open = function (e, data) {	
      if(!opts.closeExpandedFolders) return;
	  if(searching) return;
      var parent_node = jQuery.jstree.reference(e.currentTarget).get_node( data.node.parent );
      if(parent_node && parent_node.children){
        for(var i = 0; i < parent_node.children.length; i++){
          var child_node = jQuery.jstree.reference(e.currentTarget).get_node( parent_node.children[i] );
          if(child_node.children && child_node.children.length){
            if(data.node.id != child_node.id){
              jQuery.jstree.reference(e.currentTarget).close_node(child_node, 200);
            }
          }
        }
      }
    }
    bookmarks.on("after_open.jstree", after_open);
      recentBookmarks.on("after_open.jstree", after_open);

    $("#bmManagerImg").click(function () {
      chrome.tabs.create({url: 'chrome://bookmarks', selected: true});
    });

    $("#historyImg").click(function () {
      chrome.tabs.create({url: 'chrome://history', selected: true});
    });

    $("#downloadsImg").click(function () {
      chrome.tabs.create({url: 'chrome://downloads', selected: true});
    });

    $("#optionsImg").click(function () {
      chrome.tabs.create({url: 'chrome://extensions/?options=' + chrome.runtime.id, selected: true});
    });

    $("#search").on('search', function () {
      $("#" + localStorage.lastOpenTab ).jstree(true).search($("#search").val());
    }).focus();
  });

  $("[data-text], [data-textlabel], [data-placeholder], [data-title], [data-alt]").each(function () {
    var el = $(this),
        dataValues = el.data();

    if (dataValues.text) {
      el.text(chrome.i18n.getMessage(dataValues.text));
    }

    if (dataValues.textlabel) {
      el.text(chrome.i18n.getMessage(dataValues.textlabel) + ":");
    }

    if (dataValues.placeholder) {
      el.attr("placeholder", chrome.i18n.getMessage(dataValues.placeholder));
    }

    if (dataValues.title) {
      el.attr("title", chrome.i18n.getMessage(dataValues.title));
    }

    if (dataValues.alt) {
      el.attr("alt", chrome.i18n.getMessage(dataValues.alt));
    }
  });
});


function generateTitle(result) {
  var date = new Date(result.dateAdded),
      title = result.title + "\n\n";
  title += (result.url ? result.url + "\n\n" : "");
  title += date.toLocaleDateString() + " " + date.toLocaleTimeString();

  return title;
}

function createMark(result){
  var url = result.url;
  var hasUrl = (result.url && url.length > 0) ? true : false;
  var date = new Date(result.dateAdded);

  return  {
    "id": result.id,
    "type": (hasUrl ? "bookmark" : undefined),
    "parent": (result.parentId === "0" ? "#" : result.parentId),
    "text": result.title,
    "icon": (opts.showFavIcons && hasUrl ? 'chrome://favicon/' + url : (hasUrl ? 'icons/bookmark.png': undefined)),
    "children": !hasUrl,
    "url": url,
    "data": {
      "date": date,
      "index": result.index
    },
    "state": {
      "opened": ((result.id === "1") && (opts.openBookmarksBar))
    }
  };
}

function loadChildren(results, callback) {
    var marks = [],
        result,
        url,
        hasUrl,
        date,
        mark,
        i;

    for (i = 0; i < results.length; i++) {
      result = results[i];
      mark = createMark(result);

      if (opts.showTooltips && hasUrl) {
        mark.a_attr = {"title": generateTitle(result)};
      }

      marks.push(mark);
    }

    callback.call(this, marks);
}

function localeFormatDate(date){
  var options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  };
  return date.toLocaleString(navigator.language, options);
}

function loadBmChildren(node, callback) {
  chrome.bookmarks.getChildren((node.id === '#' ? '0' : node.id), function (results) {
    loadChildren(results, callback);
  });
}



function loadRecentChildren(callback) {
  var num = parseInt(opts.recentNum || 15);
  chrome.bookmarks.getRecent( num, function (results) {

    var maxId = 0;
    for (var i = 0; i < results.length; i++) {
      maxId = results[i].id > maxId ? results[i].id : maxId;
    }
    var topMarks = [];

    var dateAdded = {};

    for (var i = 0; i < results.length; i++) {
      var date = new Date(results[i].dateAdded);
      var dateIndex = date.getDate() + date.getMonth() + date.getFullYear();
      if(!dateAdded[dateIndex]){
        maxId++;
        dateAdded[dateIndex] = {
          id : maxId
        };
        var mark = createMark({
          dateAdded: results[i].dateAdded,
          id: maxId.toString(),
          index: 0,
          parentId: "0",
          title: localeFormatDate(date)
        });
        delete(mark.parent);
        mark.children = [];
        var index = topMarks.push(mark);
        dateAdded[dateIndex].index = --index;
      }
      var parentIndex = dateAdded[dateIndex].index;
      results[i].parentId = dateAdded[dateIndex].id;
      var markIn = createMark(results[i])
      delete(markIn.parent);
      topMarks[parentIndex].children.push(
          markIn
      )
    }
    callback(topMarks);
  });
}

function sortNodes(node1, node2, opts) {
  if ((opts.sortBy === 'text') || (opts.sortBy === 'date')) {
    var isLeafNode1 = this.is_leaf(node1),
        isLeafNode2 = this.is_leaf(node2),
        sortOrder;

    if (isLeafNode1 == isLeafNode2) {
      if (opts.sortBy === 'text') {
        sortOrder = (this.get_text(node1).toLowerCase() > this.get_text(node2).toLowerCase() ? 1 : -1);
      } else {
        sortOrder = (this.get_node(node1).data.date > this.get_node(node2).data.date ? 1 : -1);
      }

      return (opts.sortOrder === 'ASC' ? sortOrder : -1 * sortOrder);
    } else {
      return (isLeafNode1 && !isLeafNode2 ? 1 : -1);
    }
  } else {
    return (this.get_node(node1).data.index > this.get_node(node2).data.index ? 1 : -1)
  }
}

function sortNodesBookmarks(node1, node2) {
  return sortNodes.call(this,
    node1,
    node2,
    {
      'sortBy': opts.sortBy,
      'sortOrder': opts.sortOrder
    }
  );
}
function sortNodesRecent(node1, node2) {
  return sortNodes.call(this,
      node1,
      node2,
      {
        'sortBy': 'date',
        'sortOrder': 'DESC'
      }
  );
}




function searchNodes(searchString, callback) {
  var that = this;
	searching = true;
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

          callback.call(that, bmList);
        }
    );
  });
}


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


function openBookmark(openIn, node) {
  if (open.newTab === openIn) {
    chrome.tabs.create({url: node.original.url, active: false});

    if (!opts.keepPopupOpen) {
      window.close();
    }
  } else if (open.currentTab === openIn) {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.update(tab.id, {url: node.original.url});

      if (!opts.keepPopupOpen) {
        window.close();
      }
    });
  } else if (open.newWindow === openIn) {
    chrome.windows.create({url: node.original.url});
  } else if (open.incognito === openIn) {
    chrome.windows.create({url: node.original.url, incognito: true});
  } else if (open.pinnedTab === openIn) {
      chrome.tabs.create({url: node.original.url, active: false, pinned: true});

      if (!opts.keepPopupOpen) {
        window.close();
      }
  }
}


function openBookmarks(openIn, inst, folder) {
  if (inst.is_loaded(folder)) {
    _openBookmarks(openIn, inst, folder);
  } else {
    inst.load_node(folder, function (node) {
      _openBookmarks(openIn, inst, node);
    });
  }
}


function _openBookmarks(openIn, inst, folder) {
  var i,
      len,
      urls = [],
      child;

  for (i = 0, len = folder.children.length; i < len; i++) {
    if (inst.is_leaf(folder.children[i])) {
      child = inst.get_node(folder.children[i]);

      if (open.newTab === openIn) {
        chrome.tabs.create({url: child.original.url, selected: false});
      } else if ((open.newWindow === openIn) || (open.incognito === openIn)) {
        urls.push(child.original.url);
      }
    }
  }

  if (open.newWindow === openIn) {
    chrome.windows.create({url: urls});
  } else if (open.incognito === openIn) {
    chrome.windows.create({url: urls, incognito: true});
  }

  if (!opts.keepPopupOpen) {
    window.close();
  }
}


function ctxMenuItems(node) {
  var that = this;

  var ctxMenuElements = {
    bookmark : {
      "openCurrent": {
        "icon": "/icons/current-tab.png",
        "label": 'Open in current tab',
        "action": function (data) {
          openBookmark(open.currentTab, that.get_node(data.reference));
        }
      },
      "openNew": {
        "icon": "/icons/new-tab.png",
        "label": 'Open in new tab',
        "action": function (data) {
          openBookmark(open.newTab, that.get_node(data.reference));
        }
      },
      "openPinned": {
        "icon": "/icons/pinned-tab.png",
        "label": 'Open in pinned tab',
        "action": function (data) {
          openBookmark(open.pinnedTab, that.get_node(data.reference));
        }
      },
      "openNewWindow": {
        "icon": "/icons/new-window.png",
        "label": 'Open in new window',
        "action": function (data) {
          openBookmark(open.newWindow, that.get_node(data.reference));
        }
      },
      "openIncognito": {
        "icon": "/icons/incognito-window.png",
        "label": 'Open in Incognito window',
        "action": function (data) {
          openBookmark(open.incognito, that.get_node(data.reference));
        },
        "separator_after": true
      },
      "edit": {
        "icon": "/icons/rename.png",
        "label": 'Edit',
        "action": function (data) {
          //$("#editName").val(that.get_node(data.reference).original.text);
          $("#editName").val(that.get_node(data.reference).text);
          $("#editUrl").val(that.get_node(data.reference).original.url);
          $("#editDialog").dialog({
            autoOpen: false,
            modal: true,
            draggable: true,
            resizable: false,
            width: opts.dialogWidth,
            title: 'Edit Bookmark',
            buttons: [
              {
                text: 'Save',
                click: function () {
                  var thisDlg = $(this),
                      node = that.get_node(data.reference);

                  chrome.bookmarks.update(node.id, {
                    title: $("#editName").val(),
                    url: $("#editUrl").val()
                  }, function () {
                    var elements = that.element[0].ctxMenu.elements;
                    if(elements.bookmark && typeof elements.bookmark.edit == 'function'){
                      elements.bookmark.edit.call(that, {
                        node : node,
                        thisDlg : thisDlg
                      });
                    }
                  });
                }
              },
              {
                text: 'Cancel', click: function () {
                $(this).dialog("close");
              }
              }
            ],
            focus: function() {
              $(this).on("keyup", function(e) {
                if (e.keyCode === 13) {
                  $(this).parent().find("button:eq(1)").trigger("click");
                  return false;
                }
              });
            }
          }).dialog("open");
        }
      },
      "delete": {
        "icon": "/icons/delete.png",
        "label": 'Delete',
        "action": function (data) {
          var deleteFunction = function(node){
            chrome.bookmarks.remove(node.id, function () {
               var elements = that.element[0].ctxMenu.elements;
               if(elements.bookmark && typeof elements.bookmark.delete == 'function'){
                 elements.bookmark.delete.call(that, {
                   node : node
                 });
               }
              /*that.refresh_node(node.parent);
              thisDlg.dialog("close");**/
            });
          };
          if(opts.deleteWithoutConfirmation){
            var node = that.get_node(data.reference);
            deleteFunction(node);
            return;
          }
          $("#deleteName").text(that.get_node(data.reference).original.text);
          $("#deleteDialog").dialog({
            autoOpen: false,
            modal: true,
            draggable: true,
            resizable: false,
            width: opts.dialogWidth,
            title: 'Delete Bookmark',
            buttons: [
              {
                text: 'Delete',
                click: function () {
                  var thisDlg = $(this),
                  node = that.get_node(data.reference);
                  deleteFunction(node);

                  thisDlg.dialog("close");
                }
              },
              {
                text: 'Cancel', click: function () {
                $(this).dialog("close");
              }, autoFocus: true
              }
            ]
          }).dialog("open");
        }
      }
    },
    folder : {
      "openNew": {
        "icon": "/icons/new-tab.png",
        "label": 'Open in new tab',
        "action": function (data) {
          openBookmarks(open.newTab, that, that.get_node(data.reference));
        }
      },
      "openNewWindow": {
        "icon": "/icons/new-window.png",
        "label": 'Open in new window',
        "action": function (data) {
          openBookmarks(open.newWindow, that, that.get_node(data.reference));
        }
      },
      "openIncognito": {
        "icon": "/icons/incognito-window.png",
        "label": 'Open in Incognito window',
        "action": function (data) {
          openBookmarks(open.incognito, that, that.get_node(data.reference));
        },
        "separator_after": true
      },
      "addBookmark": {
        "icon": "/icons/add-bookmark.png",
        "label": 'Bookmark Current Tab',
        "action": function (data) {
          chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
            var tab = tabs[0];

            $("#editName").val(tab.title);
            $("#editUrl").val(tab.url);
            $("#editDialog").dialog({
              autoOpen: false,
              modal: true,
              draggable: true,
              resizable: false,
              width: opts.dialogWidth,
              title: 'Add Bookmark',
              buttons: [
                {
                  text: 'Save',
                  click: function () {
                    var thisDlg = $(this),
                        parent = that.get_node(data.reference);

                    chrome.bookmarks.create({
                      parentId: parent.id,
                      title: $("#editName").val(),
                      url: $("#editUrl").val()
                    }, function () {
                      that.refresh_node(parent);
                      thisDlg.dialog("close");
                    });
                  }
                },
                {
                  text: 'Cancel',
                  click: function () {
                    $(this).dialog("close");
                  }
                }
              ],
              focus: function() {
                $(this).on("keyup", function(e) {
                  if (e.keyCode === 13) {
                    $(this).parent().find("button:eq(1)").trigger("click");
                    return false;
                  }
                });
              }
            }).dialog("open");
          });
        },
        "separator_after": true
      },
      "createFolder": {
        "icon": "/icons/folder_add.png",
        "label": 'Create New Folder',
        "action": function (data) {
          $("#folderDialog").dialog({
            autoOpen: false,
            modal: true,
            draggable: true,
            resizable: false,
            width: opts.dialogWidth,
            title: 'Create New Folder',
            buttons: [
              {
                text: 'Save',
                click: function () {
                  var thisDlg = $(this),
                      node = that.get_node(data.reference);

                  chrome.bookmarks.create({parentId: node.id, title: $("#folderName").val()}, function () {
                    that.refresh_node(node);
                    thisDlg.dialog("close");
                  });
                }
              },
              {
                text: 'Cancel', click: function () {
                $(this).dialog("close");
              }
              }
            ],
            focus: function() {
              $(this).on("keyup", function(e) {
                if (e.keyCode === 13) {
                  $(this).parent().find("button:eq(1)").trigger("click");
                  return false;
                }
              });
            }
          }).dialog("open");
        }
      },
      "edit": {
        "icon": "/icons/rename.png",
        "label": 'Edit',
        "action": function (data) {
          $("#folderName").val(that.get_node(data.reference).original.text);
          $("#folderDialog").dialog({
            autoOpen: false,
            modal: true,
            draggable: true,
            resizable: false,
            width: opts.dialogWidth,
            title: 'Edit Folder',
            buttons: [
              {
                text: 'Save',
                click: function () {
                  var thisDlg = $(this),
                      node = that.get_node(data.reference);

                  chrome.bookmarks.update(node.id, {title: $("#folderName").val()}, function () {
                    that.refresh_node(node.parent);
                    thisDlg.dialog("close");
                  });
                }
              },
              {
                text: 'Cancel', click: function () {
                $(this).dialog("close");
              }
              }
            ],
            focus: function() {
              $(this).on("keyup", function(e) {
                if (e.keyCode === 13) {
                  $(this).parent().find("button:eq(1)").trigger("click");
                  return false;
                }
              });
            }
          }).dialog("open");
        }
      },
      "delete": {
        "icon": "/icons/delete.png",
        "label": 'Delete',
        "action": function (data) {
          $("#deleteName").text(that.get_node(data.reference).original.text);
          $("#deleteDialog").dialog({
            autoOpen: false,
            modal: true,
            draggable: true,
            resizable: false,
            width: opts.dialogWidth,
            title: 'Delete Folder',
            buttons: [
              {
                text: 'Delete',
                click: function () {
                  var thisDlg = $(this),
                      node = that.get_node(data.reference);

                  chrome.bookmarks.removeTree(node.id, function () {
                    that.refresh_node(node.parent);
                    thisDlg.dialog("close");
                  });
                }
              },
              {
                text: 'Cancel', click: function () {
                $(this).dialog("close");
              }, autoFocus: true
              }
            ]
          }).dialog("open");
        }
      }
    }
  };

  var originalType = node.original.type === "bookmark"
    ? 'bookmark'
    : 'folder';
  var result = {};
  if(that.element[0].ctxMenu.elements[originalType]){
    for(var i in that.element[0].ctxMenu.elements[originalType]){
      result[i] = ctxMenuElements[originalType][i];
    }
  }
  else{
    result = ctxMenuElements[originalType];
  }
  return result;
}
