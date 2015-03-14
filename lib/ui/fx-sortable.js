/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxSortable
 */

'use strict';

var FxClass = require('./../objects/fx-class');
var FxDomUtils = require('./../utility/dom-utils');
var FxBrowserUtils = require('./../utility/browser-utils');
var FxObjectUtils = require('./../utility/object-utils');
var FxEventUtils = require('./../utility/event-utils');

var OVER_CLASS = "fx-sortable-over";
var DRAGGING_CLASS = "fx-sortable-dragging";
var CHILD_CLASS = "fx-sortable-child";

var defaultOptions = {
    warp: false,
    onStop: function () {},
    onStart: function () {},
    onChange: function () {}
};

var FxSortable = FxClass.extend({
    constructor: function (el, options) {
        this.el = el;
        this.options = FxObjectUtils.extend({}, defaultOptions, options);
        this.supportsTouch = FxBrowserUtils.supportsTouch();
        this.supportsDragDrop = FxBrowserUtils.supportsDragDrop();
        this.currentlyDraggingElement = null;
        this.currentlyDraggingTarget = null;

        if (this.supportsDragDrop) {
            FxEventUtils.bind('dragstart', this.el, this.dragStart.bind(this));
            FxEventUtils.bind('dragenter', this.el, this.dragEnter.bind(this));
            FxEventUtils.bind('dragleave', this.el, this.dragLeave.bind(this));
            FxEventUtils.bind('drop', this.el, this.drop.bind(this));
            FxEventUtils.bind('dragover', this.el, this.dragOver.bind(this));
            FxEventUtils.bind('dragend', this.el, this.dragEnd.bind(this));
        } else {
            FxEventUtils.bind(this.supportsTouch ? 'touchstart' : 'mousedown', this.el, this.dragStart.bind(this));
        }

        Array.prototype.forEach.call(this.el.childNodes, function (index, el) {
            if (el.nodeType === 1) {
                el.setAttribute("draggable", "true");
            }
        })
    },
    className: "FxSortable",
    dragStart: delegate.call(this, function (e, context) {
        if (this.supportsTouch) { FxEventUtils.prevent(e); }
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("Text", "*");
        }
        this.currentlyDraggingElement = context;
        FxDomUtils.addClassName(context, DRAGGING_CLASS);
        Array.prototype.forEach.call(this.el.childNodes, function (index, el) {
            if (el.nodeType === 1) {
                FxDomUtils.addClassName(el, CHILD_CLASS);
            }
        });

        this.setFakeHandlers('bind')
    }),
    dragOver: delegate.call(this, function (e) {
        if (!this.currentlyDraggingElement) {
            return true;
        }
        e.preventDefault && e.preventDefault();
        return false;
    }),
    dragEnd: delegate.call(this, function (e, context) {
        this.options.onChange && this.options.onChange(context, this.currentlyDraggingElement);
        this.currentlyDraggingElement = null;
        this.currentlyDraggingTarget = null;
        if (this.el.childNodes) {
            Array.prototype.forEach.call(this.el.childNodes, function (index, child) {
                FxDomUtils.removeClassName(child, OVER_CLASS);
                FxDomUtils.removeClassName(child, DRAGGING_CLASS);
                FxDomUtils.removeClassName(child, CHILD_CLASS);
                dragEnterData(child, false);
            });
        }

        this.setFakeHandlers('unbind');

    }),
    dragLeave: delegate.call(this, function (e, context) {
        var previousCounter = dragEnterData(context);
        dragEnterData(context, previousCounter - 1);

        if (!dragEnterData(context)) {
            FxDomUtils.removeClassName(context, OVER_CLASS);
            dragEnterData(context, false);
        }
    }),
    dragEnter: delegate.call(this, function (e, context) {
        if (!this.currentlyDraggingElement || this.currentlyDraggingElement == null) {
            return true;
        }

        var previousCounter = dragEnterData(context);
        dragEnterData(context, previousCounter + 1);

        if (previousCounter === 0) {
            FxDomUtils.addClassName(context, OVER_CLASS);

            if (!this.options.warp) {
                FxDomUtils.moveElementNextTo(this.currentlyDraggingElement, context);
            }
        }

        return false;
    }),
    touchMove: delegate.call(this, function (e, context) {
        if (!this.currentlyDraggingElement ||
            this.currentlyDraggingElement === context ||
            this.currentlyDraggingTarget === context) {
            return true;
        }
        if (this.el.childNodes) {
            Array.prototype.forEach.call(this.el.childNodes, function (index, child) {
                FxDomUtils.removeClassName(child, OVER_CLASS);
            });
        }

        this.currentlyDraggingTarget = context;

        if (!this.options.warp) {
            FxDomUtils.moveElementNextTo(this.currentlyDraggingElement, context);
        } else {
            FxDomUtils.addClassName(context, OVER_CLASS);
        }

        return FxEventUtils.prevent(e);
    }),
    drop: delegate.call(this, function (e, context) {
        if (e.type === 'drop') {
            FxEventUtils.prevent(e);
        }
        if (context === this.currentlyDraggingElement) {
            return;
        }
        if (this.options.warp) {
            var thisSibling = this.currentlyDraggingElement.nextSibling;
            context.parentNode.insertBefore(this.currentlyDraggingElement, context);
            context.parentNode.insertBefore(context, thisSibling);
        }
    }),
    setFakeHandlers: function (b) {
        if (!this.supportsDragDrop) {
            if (this.supportsTouch) {
                FxEventUtils[b]('touchmove', this.el, this.touchMove);
            } else {
                FxEventUtils[b]('mouseover', this.el, this.dragEnter);
                FxEventUtils[b]('mouseout', this.el, this.dragLeave);
            }
        }

        FxEventUtils[b](this.supportsTouch ? 'touchend' : 'mouseup', this.el, this.drop);
        FxEventUtils[b](this.supportsTouch ? 'touchend' : 'mouseup', document, this.dragEnd);
        FxEventUtils[b]('selectstart', document, FxEventUtils.prevent);
    }
});

function delegate (fn) {
    return function(e) {
        var touch = (this.touchSupport && e.touches && e.touches[0]) || { };
        var target = touch.target || e.target;

        // Fix event.target for a touch event
        if (this.touchSupport && document.elementFromPoint) {
            target = document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - document.body.scrollTop);
        }

        if (FxDomUtils.hasClassName(target, CHILD_CLASS)) {
            fn && fn.apply(this, [e, target]);
        }
        else if (target !== this.el) {

            // If a child is initiating the event or ending it, then use the container as context for the callback.
            var context = FxDomUtils.moveUpToChildNode(this.el, target);
            if (context) {
                fn && fn.apply(this, [e, context]);
            }
        }
    };
}

function dragEnterData (el, val) {
    if (arguments.length === 1) {
        return parseInt(el.getAttribute("data-child-dragenter"), 10) || 0;
    } else if (!val) {
        el.removeAttribute && el.removeAttribute("data-child-dragenter");
    } else {
        el.setAttribute && el.setAttribute("data-child-dragenter", Math.max(0, val));
    }
}

module.exports = FxSortable;
