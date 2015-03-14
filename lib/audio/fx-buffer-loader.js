/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxBufferLoader
 */

'use strict';

var FxXhrUtils = require('./../utility/xhr-utils');

var Promise = require('es6-promise').Promise;

var _cache = {},
    _deferreds = {};

var FxBufferLoader = {
    load: load,
    loadAll: loadAll,
    clearCache: clearCache,
    removeFromCache: removeFromCache
};

function load (url) {

    return _deferreds[url] || new Promise(function (resolve, reject) {
            if (_cache[url]) {
                resolve(_cache[url]);
            } else {
                _deferreds[url] = this;

                FxXhrUtils.getArrayBuffer(url).then(function (data) {
                    _cache[url] = data;
                    _deferreds[url] = undefined;
                    resolve(data);
                }, function (err) {
                    reject(err);
                });
            }
        });
}

function loadAll (urls, xhr) {
    var promises = [];

    for(var i = 0,len = urls.length; i < len; i = i + 1) {
        var url = urls[i];

        var promise = load(url, xhr);
        promises.push(promise);
    }

    return Promise.all(promises);
}

function clearCache () {
    _cache = [];
    _deferreds = [];
}
function removeFromCache (url) {
    if (_cache[url]) {
        _cache[url] = undefined;
    }
    if (_deferreds[url]) {
        _deferreds[url] = undefined;
    }
}

module.exports = FxBufferLoader;