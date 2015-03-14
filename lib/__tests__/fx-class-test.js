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
var SimpleClass;
var ExtendedClass;

jest.dontMock('./../objects/fx-class');

describe('FxClass', function () {
    beforeEach(function () {
        FxClass = require('./../objects/fx-class');

        SimpleClass = FxClass.extend({
            constructor: function () {

            },
            className: 'SimpleClass',
            simpleMethod: function () {
                return 'Simple Method';
            }
        });

        ExtendedClass = SimpleClass.extend({
            constructor: function () {

            },
            className: 'ExtendedClass',
            extendedMethod: function () {
                return 'Extended Method';
            }
        })
    });

    it('should require constructor argument', function () {
        expect(function () {
            var Klass = FxClass.extend({
                className: "Klass"
            });
        }).toThrow();
    });

    it('extend should return prototype constructor', function () {
        var Klass = FxClass.extend({
            constructor: function () {

            }
        });

        expect(Klass).toBeDefined();
    });

    it('extending from FxClass should not add methods to prototype', function () {
       var Klass = FxClass.extend({
           constructor: function () {
           }
       });

        var inst = new Klass();

        expect(inst.prototype).toBeUndefined();
    });

    it('should inherit members', function () {

        var extendedInstance = new ExtendedClass();

        expect(extendedInstance.simpleMethod).toBeDefined();

        var ret = extendedInstance.simpleMethod();

        expect(ret).toEqual('Simple Method');
    });

    it('should have super property when extended', function () {
        var extendedInstance = new ExtendedClass();

        expect(extendedInstance.constructor.super).toBeDefined();
        expect(extendedInstance.constructor.super.className).toEqual('SimpleClass');
    });

    it('should inherit extend method', function () {
        var extendedInstance = new ExtendedClass();

        expect(extendedInstance.extend).toBeDefined();
    })
});

