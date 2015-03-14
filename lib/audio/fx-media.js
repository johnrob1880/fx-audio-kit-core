/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxMedia
 */

'use strict';

var FxClass = require('./../objects/fx-class');

var FxMedia = FxClass.extend({
    constructor: function (title, url) {
        this.title = title;
        this.url = url;
    },
    className: "FxMedia"
});

exports.FxMedia = FxMedia;