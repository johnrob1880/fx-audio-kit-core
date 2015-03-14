/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var FxClass = require('./fx-class');

function cloneObject (obj) {
    var copy;

    if (null == obj || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i = i + 1) {
            copy[i] = cloneObject(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr) && obj[attr] !== null) {
                copy[attr] = cloneObject(obj[attr]);
            }
        }
        return copy;
    }
    throw new Error("Unable to clone. Type is not supported!");
}

function mergeObject (obj1, obj2) {
    for (var p in obj2) {
        try {
            if ( obj2[p].constructor == Object ) {
                obj1[p] = merge(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        } catch(e) {
            // new property
            obj1[p] = obj2[p];
        }
    }

    return obj1;
}

var FxClone = FxClass.extend({
    constructor: function (obj) {
        if (null == obj || typeof obj !== 'object') {
            throw new Error('Clone argument is not an object!');
        }
        this.object = cloneObject(obj);
    },
    merge: function (obj) {
        this.object = mergeObject(this.object, obj);
    }
});

module.exports = FxClone;