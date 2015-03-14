/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxXhrUtils
 */

'use strict';

var Promise = require('es6-promise').Promise;
var FxAudioContext = require('./../audio/audio-context');

var FxXhrUtils = {};

FxXhrUtils.getArrayBuffer = function (url) {
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'arraybuffer';
        xhr.send();

        function handler() {
            if (this.readyState === this.DONE) {
                if (this.status === 200) {
                    _decodeAudio(this.response).then(function (buffer) {
                        resolve(buffer);
                    }, function (err) {
                        reject(err);
                    });
                } else {
                    reject(new Error('getArrayBuffer: `' + url + '` failed with status: [' + this.status + ']'));
                }
            }
        }
    });
};

FxXhrUtils.getJson = function (url) {
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
        function handler() {
            if (this.readyState === this.DONE) {
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
                }
            }
        }
    });
};

function _decodeAudio (arrayBuffer) {
    return new Promise(function (resolve, reject) {
        FxAudioContext.getContext().decodeAudioData(arrayBuffer, function (buffer) {
            resolve(buffer);
        }, function (e) {
            reject("Error decoding", e);
        });
    });
}

module.exports = FxXhrUtils;