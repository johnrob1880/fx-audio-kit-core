/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxMediaLibrary
 */

'use strict';

var FxClass = require('./../objects/fx-class');
var FxArrayUtils = require('./../utility/array-utils');

var FxMediaLibrary = FxClass.extend({
    constructor: function () {
        this.media = [];
    },
    className: "FxMediaLibrary",
    addMedia: function (media) {
        if (!media.className || media.className !== "FxMedia") {
            throw new Error("Invalid media! Expected typeof FxMedia.");
        }

        this.media.push(media);
    },
    removeMedia: function (media) {
        FxArrayUtils.removeFromArray(this.media, media);
    },
    toJSON: function () {
        return JSON.stringify(this);
    }
});

module.exports = FxMediaLibrary;
