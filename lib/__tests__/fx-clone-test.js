/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var FxClass;
var FxClone;
var SimpleClass;

jest.dontMock('./../objects/fx-class');
jest.dontMock('./../objects/fx-clone');

describe('FxClone', function () {
    beforeEach(function () {
        FxClass = require('./../objects/fx-class');
        FxClone = require('./../objects/fx-clone');

        SimpleClass = FxClass.extend({
            constructor: function () {
            },
            className: 'SimpleClass',
            simpleMethod: function () {
                return 'Simple Method';
            },
            setting: 'one'
        });
    });

    it('should require constructor argument', function () {

       expect(function () {
           new FxClone();
       }).toThrow('Clone argument is not an object!');
    });

    it('should inherit properties', function () {
        var inst = { prop1: "prop1", method1: function () { return 'Method 1';}};

        var clone = new FxClone(inst).object;

        expect(clone.prop1).toEqual('prop1');
    });

    it('should inherit methods', function () {
        var inst = { prop1: "prop1", method1: function () { return 'Method 1';}};
        var clone = new FxClone(inst).object;

        expect(clone.method1).toBeDefined();
        expect(clone.method1()).toEqual('Method 1');
    });

    it('should not be a reference', function () {
        var inst = { prop1: "prop1", method1: function () { return 'Method 1';}};
        var clone = new FxClone(inst).object;

        clone.prop1 = "two";

        expect(inst.prop1).toEqual("prop1");
    });
});