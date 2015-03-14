/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxSoundPreset
 */

'use strict';

var FxClass = require('./../objects/fx-class');

var FxSoundPreset = FxClass.extend({
    constructor: function (offsetStart, offsetEnd) {
        this.offsetStart = offsetStart;
        this.offsetEnd = offsetEnd;
    },
    className: "FxSoundPreset"
});

module.exports = FxSoundPreset;