define(function(require) {
  var Engine = require('famous/core/Engine');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Easing = require('famous/transitions/Easing');

  function GameView(model, width, height) {
    this.model = model;
    this.width = width;
    this.height = height;
    this.tileWidth = Math.ceil(width / model.width);
    this.tileHeight = Math.ceil(height / model.height);
    this.mainContext = Engine.createContext();
    this.createTiles();
  }

  /**
   * Create titles for the view
   */
  GameView.prototype.createTiles = function() {
    var tileSize = [this.tileWidth, this.tileHeight];

    this.tileModifiers = [];
    this.tileSurfaces = [];
    var modelTiles = this.model.getTiles();

    var self = this;
    function onSurfaceClick(obj) {
      var id;
      for (var i = 0; i < obj.target.classList.length; i++) {
        var cls = obj.target.classList[i];
        if (cls.slice(0, 'tile-'.length) === 'tile-') {
          id = cls;
        }
      }
      if (!id) {
        return;
      }
      self.model.move(id);
      self.updateTileModifiers(200);
    }

    for (var i = 0; i < modelTiles.length; i++) {
      var tile = modelTiles[i];
      var tileX = this.mapModelX(tile.x);
      var tileY = this.mapModelY(tile.y);
      var tileModifier = new StateModifier();

      var tileSurface = new Surface({
        size: tileSize,
        classes: ['tile', tile.id],
        properties: {
          backgroundPosition: (-tileX) + 'px ' + (-tileY) + 'px',
          backgroundSize: this.width + 'px ' + this.height + 'px'
        }
      });

      tileSurface.on('click', onSurfaceClick);

      this.tileModifiers.push(tileModifier);
      this.tileSurfaces.push(tileModifier);

      this.mainContext.add(tileModifier).add(tileSurface);
    }
    self.updateTileModifiers(0);
  };

  /**
   * Remap a tile's x coordinate into a view x
   * @param {number} tileX
   * @return {number}
   */
  GameView.prototype.mapModelX = function(tileX) {
    return tileX * this.tileWidth;
  };

  /**
   * Remap a tile's y coordinate into a view y
   * @param {number} tileY
   * @return {number}
   */
  GameView.prototype.mapModelY = function(tileY) {
    return tileY * this.tileHeight;
  };

  GameView.prototype.updateTileModifiers = function(duration) {
    var tiles = this.model.getTiles();
    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      var tileX = this.mapModelX(tile.x);
      var tileY = this.mapModelY(tile.y);

      this.tileModifiers[i].setTransform(
        Transform.translate(tileX, tileY, 0),
        {duration: duration, curve: Easing.inOutExpo}
      );
    }
  };

  return GameView;
});
