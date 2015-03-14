/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

jest.dontMock('./../utility/array-utils');

var ArrayUtils;

describe("FxArrayUtils", function () {
    beforeEach(function () {
       ArrayUtils = require('./../utility/array-utils');
    });

    it('should remove primitive type from array', function () {
        var items = ['one', 'two', 'three'];

        var arr = ArrayUtils.removeItem(items, 'two');

        expect(arr.length).toEqual(2);
        expect(arr[0]).toBe('one');
        expect(arr[1]).toBe('three');
    });

    it('should remove object type from array', function () {
        var obj1 = {name: 'one'};
        var obj2 = {name: 'two'};
        var items = [obj1, obj2];

        var arr = ArrayUtils.removeItem(items, obj1);

        expect(arr.length).toEqual(1);
        expect(arr[0].name).toBe('two');
    });
});