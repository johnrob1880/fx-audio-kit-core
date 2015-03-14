/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxTrackItem
 */

'use strict';

var FxClass = require('./../objects/fx-class');

var FxTrackItem = FxClass.extend({
    constructor: function (id, sound, position) {
        this.id = id;
        this.sound = sound;
        this.position = position;
    },
    className: "FxTrackItem"
});

module.exports = FxTrackItem;