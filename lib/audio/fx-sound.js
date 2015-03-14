/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FxSound
 */

'use strict';

var FxClass = require('./../objects/fx-class');

var FxSound = FxClass.extend({
    constructor: function (id) {
        this.id = id;
        this.isSound = true;
    },
    className: "FxSound",
    // abstract contracts
    play: function () {
    },
    stop: function () {
    },
    pause: function () {
    },
    skip: function () {
    },
    mute: function () {
    },
    unmute: function () {
    },
    loop: function () {
    },
    setVolume: function () {
    },
    length: function () {
        return 0;
    }
});

module.exports = FxSound;