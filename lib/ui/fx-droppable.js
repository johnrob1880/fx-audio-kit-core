/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxDroppable
 */

'use strict';

var FxClass = require('./../objects/fx-class');
var clone = require('./../objects/fx-clone');
var FxEventUtils = require('./../utility/event-utils');

var defaultOptions = {
    autoAppend: false,
    overClass: "fx-over"
};

var FxDroppable = FxClass.extend({
    constructor: function (el, options) {
        this.el = el;
        this.opts = new clone(defaultOptions).merge(options).object;
        FxEventUtils.bind('dragover', this.el,  this._dragOver.bind(this));
        FxEventUtils.bind('dragenter', this.el, this._dragEnter.bind(this));
        FxEventUtils.bind('dragleave', this.el, this._dragLeave.bind(this));
        FxEventUtils.bind('drop', this.el, this._drop.bind(this));

        this.hooks = {};
    },
    _dragOver: function (e) {
        e.dataTransfer.dropEffect = "move";
        e.preventDefault && e.preventDefault();
        this.el.classList.add(this.opts.overClass);

        this._fire('dragover', e);

        return false;
    },
    _dragEnter: function (e) {
        console.log('dragenter', this);
        this.el.classList.add(this.opts.overClass);
        this._fire('dragenter', e);
        return false;
    },
    _dragLeave: function (e) {
        this.el.classList.remove(this.opts.overClass);
        this._fire('dragleave', e);
        return false;
    },
    _drop: function (e) {
        e.stopPropagation && e.stopPropagation();
        this.el.classList.remove(this.opts.overClass);
        var item = document.getElementById(e.dataTransfer.getData("Text"));

        if (this.opts.autoAppend && this.el.appendChild) {
            this.el.appendChild(item);
        }

        this._fire('drop', e, item);

        return false;
    },
    hook: function (evtName, fn) {
        if (typeof fn !== "function") {
            throw Error("hook must be a function!");
        }
        if (!this.hooks[evtName]) {
            this.hooks[evtName]  = [fn]
        } else {
            this.hooks[evtName].push(fn);
        }
    },
    _fire: function (evtName, e, data) {
        var eventHooks = this.hooks[evtName];
        if (eventHooks && eventHooks.length > 0) {
            eventHooks.forEach(function (hook) {
                if (data) {
                    hook(e, data);
                } else {
                    hook(e);
                }
            });
        }
    }
});

module.exports = FxDroppable;