/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var FxDomUtils = {};

FxDomUtils.hasClassName = function (el, name) {
    if (!el.className) { return false; }
    return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(el.className);
};

FxDomUtils.addClassName = function (el, name) {
    if (el.classList) {
        el.classList.add(name);
        return;
    }
    if (!el.className) { return; }
    if (!hasClassName(el, name)) {
        el.className = el.className ? [el.className, name].join(' ') : name;
    }
};

FxDomUtils.removeClassName = function (el, name) {
    if (el.classList) {
        el.classList.remove(name);
        return;
    }
    if (!el.className) { return; }
    if (hasClassName(el, name)) {
        var c = el.className;
        el.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), " ").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
};

FxDomUtils.isBelow = function (el1, el2) {
    var parent = el1.parentNode;
    if (el2.parentNode != parent) {
        return false;
    }

    var cur = el1.previousSibling;
    while (cur && cur.nodeType !== 9) {
        if (cur === el2) {
            return true;
        }
        cur = cur.previousSibling;
    }
    return false;
};

FxDomUtils.moveElementNextTo = function (el1, el2) {
    if (FxDomUtils.isBelow(el1, el2)) {
        el2.parentNode.insertBefore(el1, el2);
    }
    else {
        el2.parentNode.insertBefore(el1, el2.nextSibling);
    }
};

FxDomUtils.moveUpToChildNode = function (parent, child) {
    var cur = child;
    if (cur == parent) { return null; }

    while (cur) {
        if (cur.parentNode === parent) {
            return cur;
        }

        cur = cur.parentNode;
        if ( !cur || !cur.ownerDocument || cur.nodeType === 11 ) {
            break;
        }
    }
    return null;
};

module.exports = FxDomUtils;

