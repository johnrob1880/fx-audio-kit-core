/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxDraggable
 */

'use strict';

var FxClass = require('./../objects/fx-class');
var FxEventUtils = require('./../utility/event-utils');

var FxDraggable = FxClass.extend({
    constructor: function (el, onDragStart, onDragEnd, dragData) {
        this.el = el;
        this.onDragStart = onDragStart;
        this.onDragEnd = onDragEnd;
        this.el.setAttribute('draggable', '');
        this.dragData = dragData || this.el.id;
        FxEventUtils.bind('dragstart', this.el,  this._dragStart.bind(this));
        FxEventUtils.bind('dragend', this.el, this._dragEnd.bind(this));
    },
    _dragStart: function (e) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("Text", this.dragData);
        this.el.classList.add("fx-drag");
        if (this.onDragStart) {
            this.onDragStart.call(this, e, this.el);
        }
        return false;
    },
    _dragEnd: function (e) {
        this.el.classList.remove("fx-drag");
        if (this.onDragEnd) {
            this.onDragEnd.call(this, e, this.el);
        }
        return false;
    }
});

module.exports = FxDraggable;
