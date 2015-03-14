/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxTrack
 */

'use strict';

var FxClass = require('./../objects/fx-class');
var FxTrackItem = require('./fx-track-item');
var clone = require('./../objects/fx-clone');

var playbackStates = {
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
    STOPPED: "STOPPED"
};

var FxTrack = FxClass.extend({
    constructor: function () {
        this.trackItems = [];
        this.playbackStates = new clone(playbackStates).object;
        this.playbackState = this.playbackStates.STOPPED;
    },
    className: "FxTrack",
    add: function (sound, position) {
        if (!sound.isSound) {
            throw new Error("requires a derivative of type FxSound!")
        }
        if (typeof position !== "number") {
            throw new Error("position must be numeric!");
        }

        var id = sound.id,
            trackItem = new FxTrackItem(id, sound, position);

        this.trackItems.push(trackItem);
        return trackItem;
    },
    remove: function (index) {

        var out = [];
        for (var i = 0, len = this.trackItems.length; i < len; i++) {
            if (i !== index) { out.push(this.trackItems[i]); }
        }

        this.trackItems = out;
    },
    clear: function () {
        this.trackItems = [];
    },
    play: function (when, offset, callback) {
        console.log(['track playing', when, offset, this, this.trackItems]);
        var trackIndex = 0,
            numberOfTracks = this.trackItems.length;

        for (var i in this.trackItems) {
            if (this.trackItems.hasOwnProperty(i)) {
                var item = this.trackItems[i];
                console.log(['playing sound in track', item.position, when]);
                item.sound.play(item.position + when, 0, function (b) {
                    b.stop();
                    trackIndex++;
                    if (trackIndex === numberOfTracks) {
                        this.stop();
                        callback && callback.call(callback, this);
                    }
                }.bind(this));
            }
        }
        this.playbackState = playbackStates.PLAYING;
    },
    loop: function () {
        this.play(0, 0, function () {
            this.stop();
            this.loop();
        }.bind(this));
    },
    pause: function () {
        for (var i in this.trackItems) {
            if (this.trackItems.hasOwnProperty(i)) {
                var item = this.trackItems[i];
                item.sound.pause();
            }
        }
        this.playbackState = playbackStates.PAUSED;
    },
    stop: function () {
        for (var i in this.trackItems) {
            if (this.trackItems.hasOwnProperty(i)) {
                var item = this.trackItems[i];
                item.sound.stop();
            }
        }
        this.playbackState = playbackStates.STOPPED;
    },
    mute: function () {
        for (var i in this.trackItems) {
            if (this.trackItems.hasOwnProperty(i)) {
                var item = this.trackItems[i];
                item.sound.mute();
            }
        }
    },
    unmute: function () {
        for (var i in this.trackItems) {
            if (this.trackItems.hasOwnProperty(i)) {
                var item = this.trackItems[i];
                item.sound.unmute();
            }
        }
    },
    numberOfTracks: function () {
        return this.trackItems && this.trackItems.length || 0;
    },
    playable: function() {
        return this.playbackState !== this.playbackStates.PLAYING
            && this.numberOfTracks() > 0;
    },
    stoppable: function () {
        return this.playbackState === this.playbackStates.PLAYING;
    },
    pauseable: function () {
        return this.playbackState === this.playbackStates.PLAYING;
    }
});

module.exports = FxTrack;