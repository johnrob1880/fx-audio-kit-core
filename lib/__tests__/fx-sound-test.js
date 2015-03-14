/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var FxSound;

jest.dontMock('./../objects/fx-class');
jest.dontMock('./../audio/fx-sound');

describe('FxSound', function () {
    beforeEach(function () {
        FxSound = require('./../audio/fx-sound');
    });

    it('should set id in constructor', function () {
        var id = "soundOne";
        var sound = new FxSound(id);
        expect(sound.id).toEqual(id);
    });

    it('should declare and set isSound property to true', function () {
        var id = "soundOne";
        var sound = new FxSound(id);
        expect(sound.isSound).toEqual(true);
    });

});
