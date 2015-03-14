/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule FxTimer
 */

'use strict';

var FxClass = require('./../objects/fx-class');

var FxTimer = FxClass.extend({
    constructor: function (frameRate) {
        this.reset(true);
        this.frameRate = frameRate || 1000;
    },
    className: "FxTimer",
    start: function () {
        this.doStop = false;
        this.startTime = Date.now();
        this.timer();
    },
    pause: function () {
        this.doPause = true;
    },
    stop: function () {
        this.doStop = true;
    },
    fireAt: function (time, handler) {
        this.actions[time] = handler;
        var actions = this.actions;

        return {
            cancel: function () {
                delete actions[time];
            }
        }
    },
    cancelAt: function (time) {
        this.cancelAtTime = time;
    },
    onTick: function (handler) {
        this.handler = handler;
    },
    tick: function () {
        if (!this.handler) { return; }
        this.handler.call(this.handler, this.counter * this.frameRate);
    },
    reset: function (resetActions) {

        this.startTime = 0;
        this.prevTime = 0;
        this.doPause = false;
        this.doStop = false;
        this.counter = 0;

        if (resetActions) {
            this.actions = {};
        }
    },
    timer: function () {
        if (this.doPause) {
            this.doPause = false;
            return;
        }
        if (this.doStop) {
            this.doStop = false;
            this.reset(false);
            return;
        }

        window.requestAnimationFrame(this.timer.bind(this));

        var nextTime = Date.now();

        if (nextTime - this.prevTime >= this.frameRate) {
            this.prevTime = nextTime;
            this.counter++;

            // make action time a multiple of the frame rate.
            var actionTime = this.counter * this.frameRate;

            var action = this.actions[actionTime],
                currentTime = this.prevTime - this.startTime;

            if (action) {
                // invoke and remove action
                action.call(action, currentTime);
                delete this.actions[this.prevTime];
            }

            if (this.handler) {
                this.tick.call(this);
            }

            if (currentTime > this.cancelAtTime) {
                this.doStop();
            }
        }
    }
});

module.exports = FxTimer;
