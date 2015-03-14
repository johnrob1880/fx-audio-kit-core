/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxAudioApi
 */

'use strict';

var audioContext = require('./fx-audio-context').getContext();
var navigator = window && window.navigator;

var FxAudioApi = {
    getAudioContext: function () { return audioContext; },
    navigator: function () { return navigator; }
};

module.exports = FxAudioApi;


