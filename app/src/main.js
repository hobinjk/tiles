/* globals define */
define(function(require) {
  'use strict';
  var GameModel = require('GameModel');
  var GameView = require('GameView');

  var model = new GameModel(4, 4);
  var width = Math.min(window.innerWidth, window.innerHeight);
  var view = new GameView(model, width, width);

  var lastTile = null;
  for (var i = 0; i < 50; i++) {
    lastTile = model.moveRandom(lastTile);
    view.updateTileModifiers(100);
  }
});
