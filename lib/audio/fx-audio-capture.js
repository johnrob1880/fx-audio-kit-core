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
var FxArrayUtils = require('./../utility/array-utils');
var FxBuffer = require('./fx-buffer');
var FxBufferExtended = require('./fx-buffer-extended');
var FxAudioApi = require('./fx-audio-api');

var FxAudioCapture = FxClass.extend({
    constructor: function (context, config) {
        this.context = context;
        this.bufferLength = config && config.bufferLength || 2048;
        this.mono = config && config.mono || false;
        this.sampleRate = this.context.sampleRate || 44100;
        this.recording = false;
        this.recordingLength = 0;
        this.recBuffers = [];
        this.listeners = [];
        this.numberOfChannels = 2;
        this.isReady = false;

        this.init();
    },
    className: "FxAudioCapture",
    ready: function () {
        return this.isReady;
    },
    record: function () {
        this.recording = true;
        console.log('recording');
    },
    stop: function () {
        this.recording = false;
    },
    stoppable: function () {
        return this.recording;
    },
    init: function () {
        var context = this.context;

        for (var channel = 0; channel < this.numberOfChannels; channel++) {
            this.recBuffers[channel] = [];
        }

        FxAudioApi.navigator().getUserMedia({audio: true}, function (localMediaStream) {
            console.log(this);
            this.mediaStream = localMediaStream;
            this.mediaSource = context.createMediaStreamSource(localMediaStream);
            this.volume = this.context.createGain();
            this.mediaSource.connect(this.volume);

            if (!this.context.createScriptProcessor) {
                this.node = this.context.createJavaScriptNode(this.bufferLength, 2, 2);
            } else {
                this.node = this.context.createScriptProcessor(this.bufferLength, 2, 2);
            }

            this.node.onaudioprocess = function (e) {
                if (!this.recording) { return; }

                for (var channel = 0; channel < this.numberOfChannels; channel++) {
                    this.recBuffers[channel].push(new Float32Array(e.inputBuffer.getChannelData(channel)));
                }

                this.recordingLength += this.bufferLength;

            }.bind(this);

            this.volume.connect(this.node);
            this.node.connect(this.context.destination);

            this.isReady = true;

        }.bind(this), function (e) {
            console.error('no live input', e);
        });
    },
    clear: function () {
        this.recordingLength = 0;
        for (var channel = 0; channel < this.numberOfChannels; channel++) {
            this.recBuffers[channel] = [];
        }
    },
    getBuffer: function () {
        var buffers = [
            mergeBuffers(this.recBuffers[0], this.recordingLength),
            mergeBuffers(this.recBuffers[1], this.recordingLength)
        ];

        var newBuffer = this.context.createBuffer(2, this.recordingLength, this.context.sampleRate);
        newBuffer.getChannelData(0).set(buffers[0]);
        newBuffer.getChannelData(1).set(buffers[1]);
        return newBuffer;
    },
    getFxBuffer: function (id) {
        return new FxBuffer(id, this.getBuffer());
    },
    getFxBufferExtended: function (id) {
        return new FxBufferExtended(id, this.getBuffer());
    },
    exportWAV: function (cb, type) {
        type = type || 'audio/wav';
        var leftBuffer = mergeBuffers(this.recBuffers[0], this.recordingLength);
        var rightBuffer = mergeBuffers(this.recBuffers[1], this.recordingLength);
        var interleaved = interleave(leftBuffer, rightBuffer);
        var dataView = encodeWAV(interleaved, false, this.sampleRate);
        var blob = new Blob([dataView], {type: type});
        if (cb && typeof cb === "function") {
            cb(blob);
        }
    },
    exportMonoWAV: function (cb, type) {
        type = type || 'audio/wav';
        var leftBuffer = mergeBuffers(this.recBuffers[0], this.recordingLength);
        var dataView = encodeWAV(leftBuffer, true, this.sampleRate);
        var blob = new Blob([dataView], {type: type });
        if (cb && typeof cb === "function") {
            cb(blob);
        }
    },
    addListener: function (fn) {
        if (typeof fn === "function") {
            this.listeners.push(fn);
        } else {
            throw new Error("Listener is not a function.");
        }
    },
    removeListener: function (fn) {
        this.listeners = FxArrayUtils.removeFromArray(this.listeners, fn);
    },
    _callListeners: function (data) {
        for (var a in this.listeners) {
            if (this.listeners.hasOwnProperty(a)) {
                this.listeners[a].call(this.listeners[a], data);
            }
        }
    }
});

function mergeBuffers(recordedBuffers, recordedLength) {
    var result = new Float32Array(recordedLength),
        offset = 0,
        length = recordedBuffers.length;

    for (var i = 0; i < length; i = i + 1) {
        result.set(recordedBuffers[i], offset);
        offset = offset + recordedBuffers[i].length;
    }
    return result;
}

function interleave(inputLeft, inputRight) {
    var length = inputLeft.length + inputRight.length,
        result = new Float32Array(length),
        index = 0,
        inputIndex = 0;

    while (index < length) {
        result[index++] = inputLeft[inputIndex];
        result[index++] = inputRight[inputIndex];
        inputIndex = inputIndex + 1;
    }
    return result;
}

function writeString (view, offset, string) {
    var length = string.length;
    for (var i = 0; i < length; i = i + 1) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function floatTo16BitPCM(output, offset, input){
    for (var i = 0; i < input.length; i++, offset+=2){
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

function encodeWAV(samples, mono, sampleRate){
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 32 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, mono?1:2, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 4, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);

    return view;
}

module.exports = FxAudioCapture;
