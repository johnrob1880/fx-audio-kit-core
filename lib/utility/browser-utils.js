/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var FxBrowserUtils = {};

FxBrowserUtils.supportsTouch = function () {
    return (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) || false;
};

FxBrowserUtils.supportsDragDrop = function () {
    return !FxBrowserUtils.supportsTouch() && (function() {
            var div = document.createElement('div');
            return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
        })();
};