/**
 * Copyright 2015, FxAudioKit
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

require('./audio/normalize');

var FxAudioContext = require('./audio/fx-audio-context');
var FxSound = require('./audio/fx-sound');
var FxSoundPreset = require('./audio/fx-sound-presets');
var FxBufferLoader = require('./audio/fx-buffer-loader');
var FxBuffer = require('./audio/fx-buffer');
var FxBufferExtended = require('./audio/fx-buffer-extended');
var FxAudioCapture = require('./audio/fx=audio-capture');
var FxTimer = require('./audio/fx-timer');
var FxArrangement = require('./audio/fx-arrangement');
var FxTrackItem = require('./audio/fx-track-item');
var FxTrack = require('./audio/fx-track');
var FxMedia = require('./audio/fx-media');
var FxMediaLibrary = require('./audio/fx-media-library');

var FxDroppable = require('./ui/fx-droppable');
var FxDraggable = require('./ui/fx-draggable');
var FxMoveable = require('./ui/fx-moveable');
var FxSortable = require('./ui/fx-sortable');

var FxAudioKitCore = {
   FxAudioContext: FxAudioContext,
    FxSound: FxSound,
    FxSoundPreset: FxSoundPreset,
    FxBufferLoader: FxBufferLoader,
    FxBuffer: FxBuffer,
    FxBufferExtended: FxBufferExtended,
    FxAudioCapture: FxAudioCapture,
    FxTimer: FxTimer,
    FxArrangement: FxArrangement,
    FxTrackItem: FxTrackItem,
    FxTrack: FxTrack,
    FxMedia: FxMedia,
    FxMediaLibrary: FxMediaLibrary,
    FxDraggable: FxDraggable,
    FxDroppable: FxDroppable,
    FxSortable: FxSortable,
    FxMoveable: FxMoveable
};

module.exports = FxAudioKitCore;