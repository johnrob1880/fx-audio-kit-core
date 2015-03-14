/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var FxArrayUtils = {};

FxArrayUtils.removeItem = function (arr, value) {
    var index;
    while((index = arr.indexOf(value)) !== -1) {
        arr.splice(index, 1);
    }
    return arr;
};

module.exports = FxArrayUtils;
