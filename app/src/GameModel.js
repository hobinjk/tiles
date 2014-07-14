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
  if (!this.tilesNeighboring(free, tile)) {
    return;
  }
  // Swap the tiles
  var tmp = tile.x;
  tile.x = free.x;
  free.x = tmp;
  tmp = tile.y;
  tile.y = free.y;
  free.y = tmp;
};

/**
 * Move a random tile
 * @param {Object?} Tile to exclude from search
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

return GameModel;
});

