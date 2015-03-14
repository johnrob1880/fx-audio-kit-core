/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var FxObjectUtils = {};

FxObjectUtils.extend = function (out) {
    out = out || {};
    for (var i = 1, len = arguments.length; i < len; i = i + 1) {
        if (!arguments[i]) { continue; }
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                out[key] = arguments[i][key];
            }
        }
    }

    return out;
};

FxObjectUtils.deepExtend = deepExtend;

function deepExtend (out) {
    out = out || {};

    for (var i = 1, len = arguments.length; i < len; i = i + 1) {
        var obj = arguments[i];
        if (!obj) { continue; }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object')
                    deepExtend(out[key], obj[key]);
                else
                    out[key] = obj[key];
            }
        }
    }

    return out;
}

FxObjectUtils.isArray = function (arr) {
    return Array.isArray(arr);
};

FxObjectUtils.getType = function (obj) {
    return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
};

module.exports = FxObjectUtils;