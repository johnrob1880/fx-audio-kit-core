/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxMoveable
 */

'use strict';

var FxClass = require('./../objects/fx-class');
var FxEventUtils = require('./../utility/event-utils');

var FxMoveable = FxClass.extend({
    constructor: function (el, constraints) {
        this.el = el;
        this.left = 0;
        this.top = 0;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.diffX = 0;
        this.diffY = 0;
        this.originalZIndex = el.style.zIndex;
        this.constraints = constraints || { x: false, y: false, parent: null };
        this.parentEl = undefined;
        if (this.constraints.parent) {
            if (typeof this.constraints.parent === 'object') {
                this.parentEl = this.constraints.parent.length ? this.constraints.parent[0] : this.constraints.parent;
            } else {
                this.parentEl = document.querySelector(this.constraints.parent);
            }
        }

        this.originalParentPosition = this.parentEl && this.parentEl.style.position;
        this.originalPosition = this.el.style.position;

        this.mouseDownFn = this._mouseDown.bind(this);
        this.bodyMouseUpFn = this._bodyMouseUp.bind(this);
        this.mouseMoveFn = this._mouseMove.bind(this);
        this.mouseUpFn = this._mouseUp.bind(this);
        this.resizeFn = this._resize.bind(this);

        this.el.style.position = 'absolute';
        this.el.classList.add('fx-moveable');
        this.el.classList.add('fx-noselect');

        if (this.parentEl) {
            this.parentEl.classList.add('fx-moveable-container');
            this.parentEl.classList.add('fx-noselect');

            this.parentEl.style.position = 'relative';

            this._setBounds();
        }

        FxEventUtils.bind('mousedown', this.el, this.mouseDownFn);
        // track mouseup on document
        FxEventUtils.bind('mouseup', document.body, this.bodyMouseUpFn);
        FxEventUtils.bind('resize', window, this.resizeFn);

        this.listeners = {
            onEnd: [],
            onMove: []
        };
    },
    _setBounds: function () {
        this.parentBounds = this.parentEl.getBoundingClientRect();
        this.bounds = this.el.getBoundingClientRect();

        this.maxLeft = this.parentBounds.width - this.bounds.width - 1;
        this.minLeft = 1;
        this.maxTop = this.parentBounds.height - this.bounds.height - 1;
        this.minTop = 1;
    },
    _bodyMouseUp: function () {
        this.mouseIsDown = false;
    },
    _mouseDown: function (e) {
        this.mouseIsDown = true;
        this.el.classList.add('fx-moveable-active');
        this.el.style.zIndex = 9999;

        e = e || window.event;
        if (e.pageX && this.startX === 0) {
            this.startX = e.pageX;
        } else if (e.clientX && this.startX === 0) {
            this.startX = e.clientX;
        }

        if (e.pageY && this.startY === 0) {
            this.startY = e.pageY;
        } else if (e.clientY && this.startY === 0) {
            this.startY = e.clientY;
        }

        FxEventUtils.bind('mousemove', document.body, this.mouseMoveFn);
        FxEventUtils.bind('mouseup', document.body, this.mouseUpFn);
    },
    _mouseUp: function () {
        this.el.classList.remove('fx-moveable-active');
        this.el.style.zIndex = this.originalZIndex;
        this._cancelMove();
        this._callListeners('onEnd', { left: this.left, top: this.top, el: this.el });
    },
    _mouseMove: function (e) {
        if (e.which === 0 || !this.mouseIsDown) {
            return this._mouseUp(e);
        }

        e = e || window.event;
        if (e.pageX) {
            this.endX = e.pageX;
        } else if (e.clientX) {
            this.endX = e.clientX;
        }
        if (e.pageY) {
            this.endY = e.pageY;
        } else if (e.clientY) {
            this.endY = e.clientY;
        }

        this.diffX = this.endX - this.startX;
        this.diffY = this.endY - this.startY;

        var left, top;

        if (!this.constraints.x) {
            left = this.diffX;
        }
        if (!this.constraints.y) {
            top = this.diffY;
        }

        if (left > this.maxLeft) { left = this.maxLeft; }
        if (left < this.minLeft) { left = this.minLeft; }
        if (top > this.maxTop) { top = this.maxTop; }
        if (top < this.minTop) { top = this.minTop; }

        this.left = left || 0;
        this.top = top || 0;

        this.el.style.left = left + 'px';
        this.el.style.top = top + 'px';

        this._callListeners('onMove', { left: this.left, top: this.top, el: this.el });
    },
    _resize: function () {
        // reset bounds
        this._setBounds();
        // reset startX position
        this.startX = 0;
    },
    _cancelMove: function () {
        FxEventUtils.unbind('mousemove', document.body, this.mouseMoveFn);
        FxEventUtils.unbind('mouseup', document.body, this.mouseUpFn);
        this.mouseIsDown = false;
    },
    _callListeners: function (event, data) {
        var listenEvents = this.listeners[event];
        if (!listenEvents || listenEvents.length === 0) { return; }

        for (var a in listenEvents) {
            if (listenEvents.hasOwnProperty(a)) {
                listenEvents[a].call(listenEvents[a], data);
            }
        }
    },
    onMoveEnd: function (fn) {
        this.listeners.onEnd.push(fn);
    },
    onMove: function (fn) {
        this.listeners.onMove.push(fn);
    },
    destroy: function () {
        this._cancelMove();
        FxEventUtils.unbind('mousedown', this.el, this.mouseDownFn);
        // track mouseup on document
        FxEventUtils.unbind('mouseup', document.body, this.bodyMouseUpFn);

        this.el.classList.remove('fx-moveable');
        this.el.classList.remove('fx-moveable-active');
        this.el.classList.remove('fx-noselect');

        this.el.style.position = this.originalPosition;

        if (this.parentEl) {
            this.parentEl.classList.remove('fx-moveable-container');
            this.parentEl.classList.remove('fx-noselect');
            this.parentEl.style.position = this.originalParentPosition;
        }
    }
});

module.exports = FxMoveable;