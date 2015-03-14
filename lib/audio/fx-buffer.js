/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxBuffer
 */

'use strict';

var FxBaseBuffer = require('./fx-base-buffer');
var FxClone = require('./../objects/fx-clone');

var playbackStates = {
    CONNECTED: "CONNECTED",
    DISCONNECTED : "DISCONNECTED",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
    STOPPED: "STOPPED"
};

var FxBuffer = FxBaseBuffer.extend({
    constructor: function (id, buffer, presets) {

        FxBaseBuffer.call(this, id, buffer, presets);
        this.playbackState = playbackStates.DISCONNECTED;
        this.startTime = this.startOffset = 0;
        //this.timer = new FxTimer(1000);
        this.onEndedTimer = undefined;
        this.volume = 1;
        this.endTime = this.buffer.duration * 1000;
        this.source = undefined;

        //FxMessageChannel.audioLoaded(this);
    },
    className: "FxBuffer",
    playbackStates: new FxClone(playbackStates).object,
    connect: function (audioContext, masterGain) {

        this.context = audioContext;
        this.master = masterGain;

        if (!this.context || !this.master) {
            this.playbackState = playbackStates.DISCONNECTED;
            return;
        }

        this.playbackState = playbackStates.CONNECTED;
        //FxMessageChannel.audioConnected(this);
    },
    disconnect: function () {
        this.gain.disconnect(0);
        this.source.disconnect(0);
        this.gain = undefined;
        this.source = undefined;
        this.playbackState = playbackStates.DISCONNECTED;
    },
    length: function () {
        if (!this.buffer) {
            return 0;
        }
        return this.buffer.duration;
    },
    setTime: function (time) {
        var wasPlaying = this.playbackState == playbackStates.PLAYING;

        if (wasPlaying) {
            this.stop();
        }
        this.startOffset = time;

        if (wasPlaying) {
            this.play();
        }
    },
    play: function (when, offset, callback) {

        FxBaseBuffer.prototype.play.call(this, when, offset, callback);

        if (this.playbackState === playbackStates.DISCONNECTED) {
            throw new Error("cannot play, buffer is not connected.");
        }

        this.startTime = this.context.currentTime;

        if (!when) { when = 0; }
        if (!offset) { offset = 0;}

        when = this.startTime + when;
        this.endTime = this.endTime + when;

        this.source = this.context.createBufferSource();
        this.gain = this.context.createGain();
        this.source.buffer = this.buffer;
        this.source.connect(this.gain);

        var start = typeof this.source.start === 'function' ? this.source.start : this.source.noteOn;

        start.call(this.source, when, this.startOffset % this.source.buffer.duration);

        if (callback) {
            this.onEndedTimer = $timeout(function () {
                callback.call(callback, this);
            }.bind(this), ((this.length() - this.startOffset) + when - this.startTime) * 1000);
        }

        if (this.muted) {
            this.gain.gain.value = 0;
        } else if (this.volume) {
            this.gain.gain.value = this.volume;
        }

        this.gain.connect(this.master);
        this.playbackState = playbackStates.PLAYING;

    },
    loop: function () {

        FxBaseBuffer.prototype.loop.call(this);

        this.play(0, 0, function () {
            this.stop();
            this.loop();
        }.bind(this));
    },
    stop: function () {

        FxBaseBuffer.prototype.stop.call(this);

        if (this.onEndedTimer) {
            $timeout.cancel(this.onEndedTimer);
        }
        var stop = typeof this.source.stop === 'function' ? this.source.stop : this.source.noteOff;
        stop.call(this.source, 0);

        this.startOffset = 0;
        this.playbackState = playbackStates.STOPPED;
        //FxMessageChannel.audioStopped(this);
    },
    pause: function () {

        FxBaseBuffer.prototype.pause.call(this);

        if (this.onEndedTimer) {
            $timeout.cancel(this.onEndedTimer);
        }
        if (this.playbackState !== playbackStates.PLAYING) {
            return;
        }
        var stop = typeof this.source.stop === 'function' ? this.source.stop : this.source.noteOff;
        stop.call(this.source);

        this.startOffset += this.context.currentTime - this.startTime;
        this.playbackState = playbackStates.PAUSED;
        //FxMessageChannel.audioPaused(this);
    },
    skip: function (value) {

        FxBaseBuffer.prototype.skip.call(this, value);

        var currentTime = this.currentPosition(),
            wasPlaying = this.playbackState === playbackStates.PLAYING;

        if (wasPlaying) {
            this.stop();
        }

        this.startOffset = currentTime + value;
        this.endTime = this.endTime - (value * 1000);

        if (wasPlaying) {
            if (this.startOffset < 0) {
                this.startOffset = 0;
                this.endTime = this.buffer.duration * 1000;
            }
            if (this.startOffset < this.buffer.duration) {
                this.play(0);
            }
        }
    },
    setVolume: function (level) {

        FxBaseBuffer.prototype.setVolume.call(this, level);

        if (!this.gain) { return; }
        this.volume = level;
        this.gain.gain.value = level;
    },
    mute: function () {

        FxBaseBuffer.prototype.mute.call(this);

        if (!this.gain) { return; }
        this.muted = true;
        this.gain.gain.value = 0;
    },
    unmute: function () {

        FxBaseBuffer.prototype.unmute.call(this);

        if (!this.muted) { return; }
        this.muted = false;
        this.gain.gain.value = this.volume;
    },
    currentPosition: function () {
        return this.startOffset + ((this.playbackState === this.playbackStates.PLAYING)
                ? this.context.currentTime - this.startTime : 0);
    },
    playable: function() {
        return this.playbackState !== this.playbackStates.PLAYING
            && this.playbackState !== this.playbackStates.DISCONNECTED
            && this.length() > 0;
    },
    stoppable: function () {
        return this.playbackState === this.playbackStates.PLAYING;
    },
    pauseable: function () {
        return this.playbackState === this.playbackStates.PLAYING;
    }
});

module.exports = FxBuffer;