/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxBufferExtended
 */

'use strict';

var FxBuffer = require('./fx-buffer');
var FxArrayUtils = require('./../utility/array-utils');

var FxBufferExtended = FxBuffer.extend({
    constructor: function (id, buffer, presets) {

        FxBuffer.call(this, id, buffer, presets);
        this.listeners = [];
        this.fftSize = 1024;
        this.timeData = new Uint8Array(this.fftSize);
        this.setup = false;

    },
    className: "FxBufferExtended",
    play: function (when, offset, callback) {

        var self = this;

        var audioEnded = function () {
            if (callback) {
                callback.call(callback, self);
            }
        }.bind(this);

        FxBuffer.prototype.play.call(this, when, offset, audioEnded);
        this.setupAnalysers();
        this.calculateDecibels();
    },
    setupAnalysers: function () {
        console.log(['setupAnalysers', this]);

        if (!this.source) {
            window.console && console.error('Cannot setup analyser when sourceNode is null.');
            return;
        }

        this.analyser = this.context.createAnalyser();
        this.analyser.connect(this.master);

    },
    calculateDecibels: function () {
        if (this.playbackState !== this.playbackStates.PLAYING) {
            this._callAudio({db: null, percentage: 0});
            return;
        }

        var total = 0,
            i = 0,
            percentage,
            float,
            rms,
            db;

        this.analyser.getByteTimeDomainData(this.timeData);

        while (i < this.fftSize) {
            float = (this.timeData[i++] / 0x80 ) - 1;
            total += (float * float);
        }

        rms = Math.sqrt(total / this.fftSize);
        db = 20 * (Math.log(rms) / Math.log(10));
        db = Math.max(-48, Math.min(db, 0));
        percentage = 100 + (db * 2.083);

        this._callAudio({db: db, percentage: percentage});

        requestAnimationFrame(this.calculateDecibels.bind(this));
    },
    processAudio: function (e) {
        var outputBuffer = e.outputBuffer.getChannelData(0);
        var inputBuffer = e.inputBuffer.getChannelData(0);
        var total = 0,
            i = 0,
            length = inputBuffer.length,
            float,
            rms,
            db,
            percentage;

        while (i < length) {
            float = ( inputBuffer[i++] / 0x80 ) - 1;
            total += (float * float);
        }

        rms = Math.sqrt(total / length);
        db = 20 * (Math.log(rms) / Math.log(10));
        db = Math.max(-48, Math.min(db, 0));

        percentage = 100  + ( db * 2.083);
        //var db = 20 * Math.log(Math.max(max, Math.pow(10, -72/20)))/Math.LN10;

        this._callAudio({db: db, percentage: percentage});
    },
    _callAudio: function (lv) {
        for (var a in this.listeners) {
            if (this.listeners.hasOwnProperty(a)) {
                this.listeners[a].call(this.listeners[a], lv);
            }
        }
    },
    addDecibelsChangeListener: function (fn) {
        this.listeners.push(fn);
    },
    removeDecibelsChangeListener: function (fn) {
        this.listeners = FxArrayUtils.removeItem(this.listeners, fn);
    }
});

module.exports = FxBufferExtended;