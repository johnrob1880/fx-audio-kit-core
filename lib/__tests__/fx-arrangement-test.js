/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var FxArrangement;

jest.dontMock('./../objects/fx-class');
jest.dontMock('./../audio/fx-arrangement');

describe("FxArrangement", function () {
   beforeEach(function () {
       FxArrangement = require('./../audio/fx-arrangement');
   });

    it('should set values in constructor', function () {
        var id = "Arrangement Number One";
        var title = "Some Title";
        var artist = "John Doe";

        var arr = new FxArrangement(id, title, artist);
        expect(arr.id).toEqual(id);
        expect(arr.title).toEqual(title);
        expect(arr.artist).toEqual(artist);
    });

    it('should add track to tracks', function () {
        var arr = new FxArrangement("Arrangement", "Title", "Artist");
        arr.addTrack({id: "Track1", title: "Test Track"});
        expect(arr.tracks["Track1"]).toBeDefined();
        expect(arr.tracks["Track1"].title).toEqual("Test Track");
    });

    it('should remove track', function() {
        var arr = new FxArrangement("Arrangement", "Title", "Artist");
        var track = {id: "Track1", title: "Test Track"};
        arr.addTrack(track);
        expect(arr.tracks["Track1"]).toBeDefined();

        arr.removeTrack(track);
        expect(arr.tracks["Track1"]).toBeUndefined();
    });
    
});