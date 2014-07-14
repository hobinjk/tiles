define(function() {

/**
 * Create a game divided into width*height-1 tiles.
 * @param {number} width
 * @param {number} height
 * @constructor
 */
  function GameModel(width, height) {
    this.width = width;
    this.height = height;

    this.tiles = [];
    this.tilesById = {};

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var id = x + '-' + y;
        if (x === width - 1 && y === height - 1) {
          // add the free tile in the bottom right corner
          id = 'free';
        }
        id = 'tile-' + id;
        var tile = {
          id: id,
          x: x,
          y: y
        };

        this.tiles.push(tile);
        this.tilesById[tile.id] = tile;
      }
    }
  }

  /**
   * @return {Array} All current game tiles
   */
  GameModel.prototype.getTiles = function() {
    return this.tiles;
  };

  /**
   * Attempt to move a tile
   * @param {String} tileId Identifier of tile to move
   */
  GameModel.prototype.move = function(tileId) {
    var free = this.tilesById['tile-free'];
    var tile = this.tilesById[tileId];
    if (free.x === tile.x && free.y !== tile.y) {
      var deltaY = tile.y > free.y ? -1 : 1;
      var startY = tile.y;
      var columnTiles = [];
      for (var y = startY; y !== free.y; y += deltaY) {
        columnTiles.push(this.tileAt(tile.x, y));
      }
      for (var colI = 0; colI < columnTiles.length; colI++) {
        columnTiles[colI].y += deltaY;
      }
      free.y = startY;
    }

    if (free.y === tile.y && free.x !== tile.x) {
      var deltaX = tile.x > free.x ? -1 : 1;
      var startX = tile.x;
      var rowTiles = [];
      for (var x = startX; x !== free.x; x += deltaX) {
        rowTiles.push(this.tileAt(x, tile.y));
      }
      for (var rowI = 0; rowI < rowTiles.length; rowI++) {
        rowTiles[rowI].x += deltaX;
      }
      free.x = startX;
    }
  };

  /**
   * Move a random tile
   * @param {Object?} excludedTile Tile to exclude from search
   * @return {Object} Tile moved
   */
  GameModel.prototype.moveRandom = function(excludedTile) {
    var free = this.tilesById['tile-free'];
    var potentialTiles = [];
    for (var i = 0; i < this.tiles.length; i++) {
      var tile = this.tiles[i];
      if (tile !== excludedTile && this.tilesNeighboring(free, tile)) {
        potentialTiles.push(tile);
      }
    }
    var randomIndex = Math.floor(Math.random() * potentialTiles.length);
    var actualTile = potentialTiles[randomIndex];
    this.move(actualTile.id);
    return actualTile;
  };

  /**
   * @param {Object} tileA
   * @param {Object} tileB
   * @return {boolean} If the two tiles are neighbors
   */
  GameModel.prototype.tilesNeighboring = function(tileA, tileB) {
    var dist = this.tileDistance(tileA, tileB);
    // Ignore non-neighboring or identical tiles
    if (dist > 1 || dist === 0) {
      return false;
    }
    return true;
  };

  /**
   * @param {Object} tileA
   * @param {Object} tileB
   * @return {number} Distance between tiles
   */
  GameModel.prototype.tileDistance = function(tileA, tileB) {
    return Math.abs(tileA.x - tileB.x) + Math.abs(tileA.y - tileB.y);
  };

  /**
   * @param {number} x x coordinate of tile
   * @param {number} y y coordinate of tile
   * @return {Object} Tile at coordinates
   */
  GameModel.prototype.tileAt = function(x, y) {
    for (var i = 0; i < this.tiles.length; i++) {
      var tile = this.tiles[i];
      if (tile.x === x && tile.y === y) {
        return tile;
      }
    }
    return null;
  };

  return GameModel;
});
