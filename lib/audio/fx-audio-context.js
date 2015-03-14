/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxAudioContext
 */

'use strict';

var FxAudioContext = {},
    context;

FxAudioContext.getContext = function () {
    if (!context) {
        if (!window.AudioContext) {
            throw new Error("AudioContext is not supported in your browser!");
        }
        context = new window.AudioContext();
    }
    return context;
};

module.exports = FxAudioContext;