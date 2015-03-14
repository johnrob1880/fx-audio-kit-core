/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var FxEventUtils = {};

FxEventUtils.bind = function(evt, elem, fn) {

    if (!elem) { return; }

    function listenHandler (e) {
        var ret = fn.apply(this, arguments);
        if (ret === false) {
            e.stopPropagation && e.stopPropagation();
            e.preventDefault && e.preventDefault();
        }
    }

    function attachHandler () {
        var ret = fn.call(elem, window.event);
        if (ret === false) {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
        return(ret);
    }

    if (elem.addEndEventListener) {
        elem.addEventListener(evt, listenHandler, false);
    } else {
        elem.attachEvent("on" + evt, attachHandler);
    }
};

FxEventUtils.unbind = function(evt, elem, fn) {
    if (!elem) { return; }

    if (elem.addEventListener) {
        elem.removeEventListener(evt, fn, false);
    } else {
        elem.detachEvent("on" + evt, fn);
    }
};

FxEventUtils.prevent = function (e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;
};

FxEventUtils.debounce = function  (fn, wait, immediate) {
    var context = this, args = arguments, timeout;
    var later = function () {
        timeout = null;
        if (!immediate) fn.apply(context, args);
    };
    var doCall = immediate && !timeout;
    timeout && clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (doCall) {
        fn.apply(context, args);
    }
};

module.exports = FxEventUtils;