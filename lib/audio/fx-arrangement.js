/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxAudioCapture
 */

'use strict';

var FxClass = require('./../objects/fx-class');

var FxArrangement = FxClass.extend({
    constructor: function (id, title, artist) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this._trackCount = 0;
        this.tracks = {};
    },
    className: "FxArrangement",
    addTrack: function (track) {
        this.tracks[track.id] = track;
        this.trackCount = this._trackCount + 1;
    },
    removeTrack: function (track) {
        delete this.tracks[track.id];
        this.trackCount = this._trackCount - 1;
    },
    numberOfTracks: function () {
        return this._trackCount;
    }
});

module.exports = FxArrangement;