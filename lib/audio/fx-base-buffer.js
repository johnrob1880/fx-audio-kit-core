/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxBaseBuffer
 */

'use strict';

var FxSound = require('./fx-sound');
var FxSoundPreset = require('./fx-sound-presets');
var FxClone = require('./../objects/fx-clone');

var presetDefaults = new FxSoundPreset(0, 0);

var FxBaseBuffer = FxSound.extend({
    constructor: function (id, buffer, presets) {
        // check type
        if (Object.prototype.toString.call(buffer) !== "[object AudioBuffer]") {
            throw new Error("requires a buffer of type AudioBuffer. see https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer")
        }

        // call base
        FxSound.call(this, id);

        this.buffer = buffer;
        this.presets = new FxClone(presetDefaults).object;
    },
    className: "FxBaseBuffer",
    length: function () {
        return 0;
    }
});

module.exports = FxBaseBuffer;