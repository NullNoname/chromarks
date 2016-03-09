var opts = null,
    open = {
        currentTab: 0,
        newTab: 1,
        newWindow: 2,
        incognito: 3,
        pinnedTab: 4
    };
$(function() {
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
    }, function(d) {
        opts = d.options;
        opts.dialogWidth = opts.popupWidth - 60;
        var a = $("body"),
            e = $("#bookmarks"),
            g = $("#wrapper"),
            f = $("#title"),
            c, b = ["wholerow", "sort", "search", "contextmenu", "types", "dnd"];
        a.css("min-width", opts.popupWidth + "px").css("min-height", opts.popupHeight + "px");
        c = parseInt(g.css("borderWidth"), 10) * 2;
        g.width((a.innerWidth() - c) + "px").height((a.innerHeight() - c) + "px");
        e.height((g.height() - f.outerHeight(true)) + "px");
        if (opts.saveTreeState) {
            b.push("state")
        }
        e.jstree({
            plugins: b,
            core: {
                themes: {
                    variant: "small"
                },
                multiple: false,
                animation: false,
                worker: false,
                check_callback: function(l, j, i, k, h) {
                    return !(("move_node" === l || "copy_node" === l) && h && h.dnd && "i" !== h.pos)
                },
                data: loadChildren
            },
            sort: sortNodes,
            search: {
                show_only_matches: true,
                show_only_matches_children: true,
                ajax: searchNodes
            },
            contextmenu: {
                show_at_node: false,
                items: ctxMenuItems
            },
            types: {
                bookmark: {
                    max_children: 0,
                    max_depth: 0,
                    valid_children: []
                }
            },
            dnd: {
                copy: false,
                large_drop_target: true,
                large_drag_target: true
            }
        });
        e.on("select_node.jstree", function(k, j) {
            if (j.event && (j.event.type !== "contextmenu")) {
                var h = j.instance,
                    i = j.node;
                if (h.is_leaf(i)) {
                    if (i.original.url) {
                        if (opts.openInNewTab) {
                            openBookmark(open.newTab, i)
                        } else {
                            openBookmark(open.currentTab, i)
                        }
                    }
                } else {
                    h.toggle_node(i)
                }
            }
        });
        e.on("move_node.jstree", function(i, h) {
            chrome.bookmarks.move(h.node.id, {
                parentId: h.parent
            })
        });
        e.on("search.jstree", function(i, h) {
            h.nodes.find(".jstree-node").show()
        });
        $("#bmManagerImg").click(function() {
            chrome.tabs.create({
                url: "chrome://bookmarks",
                selected: true
            })
        });
        $("#historyImg").click(function() {
            chrome.tabs.create({
                url: "chrome://history",
                selected: true
            })
        });
        $("#downloadsImg").click(function() {
            chrome.tabs.create({
                url: "chrome://downloads",
                selected: true
            })
        });
        $("#optionsImg").click(function() {
            chrome.tabs.create({
                url: "chrome://extensions/?options=" + chrome.runtime.id,
                selected: true
            })
        });
        $("#search").on("search", function() {
            $("#bookmarks").jstree(true).search($("#search").val())
        }).focus()
    });
    $("[data-text], [data-textlabel], [data-placeholder], [data-title], [data-alt]").each(function() {
        var b = $(this),
            a = b.data();
        if (a.text) {
            b.text(chrome.i18n.getMessage(a.text))
        }
        if (a.textlabel) {
            b.text(chrome.i18n.getMessage(a.textlabel) + ":")
        }
        if (a.placeholder) {
            b.attr("placeholder", chrome.i18n.getMessage(a.placeholder))
        }
        if (a.title) {
            b.attr("title", chrome.i18n.getMessage(a.title))
        }
        if (a.alt) {
            b.attr("alt", chrome.i18n.getMessage(a.alt))
        }
    })
});

function generateTitle(a) {
    var b = new Date(a.dateAdded),
        c = a.title + "\n\n";
    c += (a.url ? a.url + "\n\n" : "");
    c += b.toLocaleDateString() + " " + b.toLocaleTimeString();
    return c
}

function loadChildren(a, b) {
    chrome.bookmarks.getChildren((a.id === "#" ? "0" : a.id), function(h) {
        var j = [],
            c, f, d, e, k, g;
        for (g = 0; g < h.length; g++) {
            c = h[g];
            f = c.url;
            d = (f && f.length > 0);
            e = new Date(c.dateAdded);
            k = {
                id: c.id,
                type: (d ? "bookmark" : undefined),
                parent: (c.parentId === "0" ? "#" : c.parentId),
                text: c.title,
                icon: (opts.showFavIcons && d ? "chrome://favicon/" + f : (d ? "icons/bookmark.png" : undefined)),
                children: !d,
                url: f,
                data: {
                    date: e,
                    index: c.index
                },
                state: {
                    opened: ((c.id === "1") && (opts.openBookmarksBar))
                }
            };
            if (opts.showTooltips && d) {
                k.a_attr = {
                    title: generateTitle(c)
                }
            }
            j.push(k)
        }
        b.call(this, j)
    })
}

function sortNodes(b, a) {
    if ((opts.sortBy === "text") || (opts.sortBy === "date")) {
        var e = this.is_leaf(b),
            d = this.is_leaf(a),
            c;
        if (e == d) {
            if (opts.sortBy === "text") {
                c = (this.get_text(b).toLowerCase() > this.get_text(a).toLowerCase() ? 1 : -1)
            } else {
                c = (this.get_node(b).data.date > this.get_node(a).data.date ? 1 : -1)
            }
            return (opts.sortOrder === "ASC" ? c : -1 * c)
        } else {
            return (e && !d ? 1 : -1)
        }
    } else {
        return (this.get_node(b).data.index > this.get_node(a).data.index ? 1 : -1)
    }
}

function searchNodes(a, c) {
    var b = this;
    chrome.bookmarks.search(a, function(d) {
        async.concat(d, function(e, f) {
            getBmTree(e, function(g) {
                f.call(b, null, g)
            })
        }, function(h, g) {
            var e = [],
                f;
            for (f = 0; f < g.length; f++) {
                if (e.indexOf(g[f]) === -1) {
                    e.push(g[f])
                }
            }
            c.call(b, e)
        })
    })
}

function getBmTree(c, e) {
    var b = this,
        d = c.parentId,
        a = [c.id];
    if (d) {
        chrome.bookmarks.get(d, function(f) {
            if (f.length > 0) {
                getBmTree(f[0], function(g) {
                    e.call(b, a.concat(g))
                })
            } else {
                e.call(b, a)
            }
        })
    } else {
        e.call(b, a)
    }
}

function openBookmark(b, a) {
    if (open.newTab === b) {
        chrome.tabs.create({
            url: a.original.url,
            active: false
        });
        if (!opts.keepPopupOpen) {
            window.close()
        }
    } else {
        if (open.currentTab === b) {
            chrome.tabs.getSelected(null, function(c) {
                chrome.tabs.update(c.id, {
                    url: a.original.url
                });
                if (!opts.keepPopupOpen) {
                    window.close()
                }
            })
        } else {
            if (open.newWindow === b) {
                chrome.windows.create({
                    url: a.original.url
                })
            } else {
                if (open.incognito === b) {
                    chrome.windows.create({
                        url: a.original.url,
                        incognito: true
                    })
                } else {
                    if (open.pinnedTab === b) {
                        chrome.tabs.create({
                            url: a.original.url,
                            active: false,
                            pinned: true
                        });
                        if (!opts.keepPopupOpen) {
                            window.close()
                        }
                    }
                }
            }
        }
    }
}

function openBookmarks(c, b, a) {
    if (b.is_loaded(a)) {
        _openBookmarks(c, b, a)
    } else {
        b.load_node(a, function(d) {
            _openBookmarks(c, b, d)
        })
    }
}

function _openBookmarks(f, d, c) {
    var b, a, e = [],
        g;
    for (b = 0, a = c.children.length; b < a; b++) {
        if (d.is_leaf(c.children[b])) {
            g = d.get_node(c.children[b]);
            if (open.newTab === f) {
                chrome.tabs.create({
                    url: g.original.url,
                    selected: false
                })
            } else {
                if ((open.newWindow === f) || (open.incognito === f)) {
                    e.push(g.original.url)
                }
            }
        }
    }
    if (open.newWindow === f) {
        chrome.windows.create({
            url: e
        })
    } else {
        if (open.incognito === f) {
            chrome.windows.create({
                url: e,
                incognito: true
            })
        }
    }
    if (!opts.keepPopupOpen) {
        window.close()
    }
}

function ctxMenuItems(b) {
    var a = this;
    if (b.original.type === "bookmark") {
        return {
            openCurrent: {
                icon: "/icons/new-tab.png",
                label: chrome.i18n.getMessage("popupCtxMenuCurrentTab"),
                action: function(c) {
                    openBookmark(open.currentTab, a.get_node(c.reference))
                }
            },
            openNew: {
                icon: "/icons/new-tab.png",
                label: chrome.i18n.getMessage("popupCtxMenuNewTab"),
                action: function(c) {
                    openBookmark(open.newTab, a.get_node(c.reference))
                }
            },
            openPinned: {
                icon: "/icons/new-tab.png",
                label: chrome.i18n.getMessage("popupCtxMenuPinnedTab"),
                action: function(c) {
                    openBookmark(open.pinnedTab, a.get_node(c.reference))
                }
            },
            openNewWindow: {
                icon: "/icons/new-tab.png",
                label: chrome.i18n.getMessage("popupCtxMenuNewWindow"),
                action: function(c) {
                    openBookmark(open.newWindow, a.get_node(c.reference))
                }
            },
            openIncognito: {
                icon: "/icons/new-tab.png",
                label: chrome.i18n.getMessage("popupCtxMenuNewIncognito"),
                action: function(c) {
                    openBookmark(open.incognito, a.get_node(c.reference))
                },
                separator_after: true
            },
            edit: {
                icon: "/icons/rename.png",
                label: chrome.i18n.getMessage("popupCtxMenuEdit"),
                action: function(c) {
                    $("#editName").val(a.get_node(c.reference).original.text);
                    $("#editUrl").val(a.get_node(c.reference).original.url);
                    $("#editDialog").dialog({
                        autoOpen: false,
                        modal: true,
                        draggable: true,
                        resizable: false,
                        width: opts.dialogWidth,
                        title: chrome.i18n.getMessage("popupEditBookmark"),
                        buttons: [{
                            text: chrome.i18n.getMessage("popupSave"),
                            click: function() {
                                var e = $(this),
                                    d = a.get_node(c.reference);
                                chrome.bookmarks.update(d.id, {
                                    title: $("#editName").val(),
                                    url: $("#editUrl").val()
                                }, function() {
                                    a.refresh_node(d.parent);
                                    e.dialog("close")
                                })
                            }
                        }, {
                            text: chrome.i18n.getMessage("popupCancel"),
                            click: function() {
                                $(this).dialog("close")
                            }
                        }],
                        focus: function() {
                            $(this).on("keyup", function(d) {
                                if (d.keyCode === 13) {
                                    $(this).parent().find("button:eq(1)").trigger("click");
                                    return false
                                }
                            })
                        }
                    }).dialog("open")
                }
            },
            "delete": {
                icon: "/icons/delete.png",
                label: chrome.i18n.getMessage("popupDelete"),
                action: function(c) {
                    $("#deleteName").text(a.get_node(c.reference).original.text);
                    $("#deleteDialog").dialog({
                        autoOpen: false,
                        modal: true,
                        draggable: true,
                        resizable: false,
                        width: opts.dialogWidth,
                        title: chrome.i18n.getMessage("popupDeleteBookmark"),
                        buttons: [{
                            text: chrome.i18n.getMessage("popupDelete"),
                            click: function() {
                                var e = $(this),
                                    d = a.get_node(c.reference);
                                chrome.bookmarks.remove(d.id, function() {
                                    a.refresh_node(d.parent);
                                    e.dialog("close")
                                })
                            }
                        }, {
                            text: chrome.i18n.getMessage("popupCancel"),
                            click: function() {
                                $(this).dialog("close")
                            },
                            autoFocus: true
                        }]
                    }).dialog("open")
                }
            }
        }
    } else {
        return {
            openNew: {
                icon: "/icons/new-tab.png",
                label: chrome.i18n.getMessage("popupCtxMenuNewTabs"),
                action: function(c) {
                    openBookmarks(open.newTab, a, a.get_node(c.reference))
                }
            },
            openNewWindow: {
                icon: "/icons/new-tab.png",
                label: chrome.i18n.getMessage("popupCtxMenuNewWindow"),
                action: function(c) {
                    openBookmarks(open.newWindow, a, a.get_node(c.reference))
                }
            },
            openIncognito: {
                icon: "/icons/new-tab.png",
                label: chrome.i18n.getMessage("popupCtxMenuNewIncognito"),
                action: function(c) {
                    openBookmarks(open.incognito, a, a.get_node(c.reference))
                },
                separator_after: true
            },
            addBookmark: {
                icon: "/icons/add-bookmark.png",
                label: chrome.i18n.getMessage("popupCtxMenuAddBookmark"),
                action: function(c) {
                    chrome.tabs.query({
                        currentWindow: true,
                        active: true
                    }, function(d) {
                        var e = d[0];
                        $("#editName").val(e.title);
                        $("#editUrl").val(e.url);
                        $("#editDialog").dialog({
                            autoOpen: false,
                            modal: true,
                            draggable: true,
                            resizable: false,
                            width: opts.dialogWidth,
                            title: chrome.i18n.getMessage("popupAddBookmark"),
                            buttons: [{
                                text: chrome.i18n.getMessage("popupSave"),
                                click: function() {
                                    var g = $(this),
                                        f = a.get_node(c.reference);
                                    chrome.bookmarks.create({
                                        parentId: f.id,
                                        title: $("#editName").val(),
                                        url: $("#editUrl").val()
                                    }, function() {
                                        a.refresh_node(f);
                                        g.dialog("close")
                                    })
                                }
                            }, {
                                text: chrome.i18n.getMessage("popupCancel"),
                                click: function() {
                                    $(this).dialog("close")
                                }
                            }],
                            focus: function() {
                                $(this).on("keyup", function(f) {
                                    if (f.keyCode === 13) {
                                        $(this).parent().find("button:eq(1)").trigger("click");
                                        return false
                                    }
                                })
                            }
                        }).dialog("open")
                    })
                },
                separator_after: true
            },
            createFolder: {
                icon: "/icons/folder_add.png",
                label: chrome.i18n.getMessage("popupCreateFolder"),
                action: function(c) {
                    $("#folderDialog").dialog({
                        autoOpen: false,
                        modal: true,
                        draggable: true,
                        resizable: false,
                        width: opts.dialogWidth,
                        title: chrome.i18n.getMessage("popupCreateFolder"),
                        buttons: [{
                            text: chrome.i18n.getMessage("popupSave"),
                            click: function() {
                                var e = $(this),
                                    d = a.get_node(c.reference);
                                chrome.bookmarks.create({
                                    parentId: d.id,
                                    title: $("#folderName").val()
                                }, function() {
                                    a.refresh_node(d);
                                    e.dialog("close")
                                })
                            }
                        }, {
                            text: chrome.i18n.getMessage("popupCancel"),
                            click: function() {
                                $(this).dialog("close")
                            }
                        }],
                        focus: function() {
                            $(this).on("keyup", function(d) {
                                if (d.keyCode === 13) {
                                    $(this).parent().find("button:eq(1)").trigger("click");
                                    return false
                                }
                            })
                        }
                    }).dialog("open")
                }
            },
            edit: {
                icon: "/icons/rename.png",
                label: chrome.i18n.getMessage("popupCtxMenuEdit"),
                action: function(c) {
                    $("#folderName").val(a.get_node(c.reference).original.text);
                    $("#folderDialog").dialog({
                        autoOpen: false,
                        modal: true,
                        draggable: true,
                        resizable: false,
                        width: opts.dialogWidth,
                        title: chrome.i18n.getMessage("popupEditFolder"),
                        buttons: [{
                            text: chrome.i18n.getMessage("popupSave"),
                            click: function() {
                                var e = $(this),
                                    d = a.get_node(c.reference);
                                chrome.bookmarks.update(d.id, {
                                    title: $("#folderName").val()
                                }, function() {
                                    a.refresh_node(d.parent);
                                    e.dialog("close")
                                })
                            }
                        }, {
                            text: chrome.i18n.getMessage("popupCancel"),
                            click: function() {
                                $(this).dialog("close")
                            }
                        }],
                        focus: function() {
                            $(this).on("keyup", function(d) {
                                if (d.keyCode === 13) {
                                    $(this).parent().find("button:eq(1)").trigger("click");
                                    return false
                                }
                            })
                        }
                    }).dialog("open")
                }
            },
            "delete": {
                icon: "/icons/delete.png",
                label: chrome.i18n.getMessage("popupDelete"),
                action: function(c) {
                    $("#deleteName").text(a.get_node(c.reference).original.text);
                    $("#deleteDialog").dialog({
                        autoOpen: false,
                        modal: true,
                        draggable: true,
                        resizable: false,
                        width: opts.dialogWidth,
                        title: chrome.i18n.getMessage("popupDeleteFolder"),
                        buttons: [{
                            text: chrome.i18n.getMessage("popupDelete"),
                            click: function() {
                                var e = $(this),
                                    d = a.get_node(c.reference);
                                chrome.bookmarks.removeTree(d.id, function() {
                                    a.refresh_node(d.parent);
                                    e.dialog("close")
                                })
                            }
                        }, {
                            text: chrome.i18n.getMessage("popupCancel"),
                            click: function() {
                                $(this).dialog("close")
                            },
                            autoFocus: true
                        }]
                    }).dialog("open")
                }
            }
        }
    }
};
