/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var FxAudioCapture;

jest.dontMock('./../audio/fx-base-buffer');
jest.dontMock('./../audio/fx-buffer');
jest.dontMock('./../audio/fx-sound');
jest.dontMock('./../objects/fx-class');
jest.dontMock('./../audio/fx-audio-capture');

describe("FxAudioCapture", function () {
   beforeEach(function () {
       FxAudioCapture = require('./../audio/fx-audio-capture');
       require('./../audio/fx-audio-context').__setContext({
           sampleRate: 44100
       });
   });

    it('should do something', function () {
        var context = require('./../audio/fx-audio-context');

        context.__setContext({
            sampleRate: 44100,
            getUserMedia: function () {}
        });

        var capture = new FxAudioCapture(context.getContext());
        expect(capture).toBeDefined();
    });
});