import {Axis, BoardTile, Dir, Keys, MoveDef} from "../types";
import {concat, difference, filter, findIndex, join, map, orderBy, pick, range, reject, uniqueId, values} from "lodash";

/**
 * Returns a string identifier for the passed tiles list
 * This is used for comparison before and after moving in a direction to check weather anything has moved
 * @param {array} tiles the list of tiles
 */
export const getTilesSnapshot = (tiles: Array<BoardTile>): string => {
  return join(map(tiles, t => join(values(pick(t, ['id', 'col', 'row', 'value'])), '_')), '#');
}

/**
 * Returns the serial position of a cell
 * @param {number} row the row count
 * @param {number} col the col count
 * @param {number} boardSize the board size
 */
export const getAxesPos = (row: number, col: number, boardSize: number): number => {
  return (row * boardSize) + col;
}

/**
 * Get the serial position of a tile (using row and col)
 * @param {object} tile the tile to get the position for
 * @param {number} boardSize the board size
 */
export const getTileIndexPos = (tile: BoardTile, boardSize: number): number => {
  return getAxesPos(tile.row, tile.col, boardSize);
}

/**
 * Returns a random index from the array
 * @param {array} arr any array
 */
export const getArrayRandomIndex = (arr: Array<any>): number => {
  return parseInt((Math.random() * arr.length).toString(), 10);
}

/**
 * Returns an array of slots based on the size of a (squared) board
 * @param {number} boardSize the board size
 */
export const getBoardSlotsArray = (boardSize: number): Array<number> => {
  return range(Math.pow(boardSize, 2));
}

/**
 * Finds the difference between all board slots array and all occupied slots array
 * @param {array} tiles the current tiles
 * @param {number} boardSize the size of the board
 */
export const getFreeTileSlotsIndex = (tiles: Array<BoardTile>, boardSize: number): Array<number> => {
  const allSlots = getBoardSlotsArray(boardSize);
  return difference(allSlots, map(tiles, t => getTileIndexPos(t, boardSize)));
}

/**
 * Add a tile to the list
 * @param {array} tiles the current tiles list
 * @param {object} tile the new tile to add
 */
export const addTile = (tiles: Array<BoardTile>, tile: BoardTile): Array<BoardTile> => {
  return concat(tiles, tile);
}

/**
 * @return {number} A random number between 2 and 4, with more weight on 2s
 */
export const generateInitialValue = (): number => {
  return Math.max(Math.round(Math.random() * 2) * 2, 2);
}

/**
 * Returns the new tile object given the passed input, calculating row and col position
 * @param {number} pos serial position
 * @param {number} boardSize the size of the board
 * @param {boolean} block is the tile a block
 */
export const createTile = (pos: number, boardSize: number, block: boolean): BoardTile => {
  const col = pos % boardSize;
  const row = Math.floor(pos / boardSize);
  return {
    id: uniqueId('tile_'),
    col,
    row,
    value: !block ? generateInitialValue() : undefined,
    block
  };
}

/**
 * Adds a new tile to the list in a random position.
 * The logic is to get the difference between an array with all possible position and the array of all occupied positions.
 * When we have it, we can than pick a random index from the difference and add a tile to the list
 * @param {Array} tiles the current tiles list
 * @param {number} boardSize the size of the board
 * @param {boolean} block weather the new tile is a block
 */
export const addRandomTile = (tiles: Array<BoardTile>, boardSize: number, block = false): Array<BoardTile> => {
  const freeSlots = getFreeTileSlotsIndex(tiles, boardSize);
  const freeSlotsRandomIndex = getArrayRandomIndex(freeSlots);
  const pos = freeSlots[freeSlotsRandomIndex];

  return addTile(tiles, createTile(pos, boardSize, block));
}

/**
 * Removes states from previous move (stale, merge) and return to default
 * @param {Array} tiles the current board tiles
 * @return {Array}
 */
export const cleanTiles = (tiles: Array<BoardTile>): Array<BoardTile> => {
  return map(reject(tiles, t => t.stale === true), t => {
    t.merged = false;
    return t;
  });
}

export const switchAxis = (axis: Axis): Axis => axis === 'row' ? 'col' : 'row';

/**
 * Return the opposite direction
 * @param {string} axis
 * @return {string}
 */
export const reverseDir = (dir: Dir): Dir => dir === 'asc' ? 'desc' : 'asc';

/**
 * Converts a direction string to the equivalent number
 * @param {string} dir
 * @return {number}
 */
export const dirToNum = (dir: Dir): number => dir === 'asc' ? 1 : -1;

/**
 * Method to analyse the tiles and board size and check if there are possible moves (ie. merge 2 tiles) or empty spots
 * @param {Array} tiles array of current tiles
 * @param {number} boardSize the size of the board
 * @return {boolean}
 */
export const hasMoves = (tiles: Array<BoardTile>, boardSize: number): boolean => {
  if (tiles.length < Math.pow(boardSize, 2)) {
    return true;
  }
  for (const tile of tiles.filter(t => !t.block)) {
    const siblings = tiles.filter(t =>
      t.value === tile.value &&
      (
        (Math.abs(t.col) === tile.col + 1 && t.row === tile.row) ||
        (Math.abs(t.row) === tile.row + 1 && t.col === tile.col)
      )
    )
    if (siblings.length > 0) {
      return true
    }
  }
  return false;
}

/**
 * This is the core function, responsible for moving the tiles
 * Here is a summary of the logic:
 * 1. order the existing tiles starting from the direction edge
 *    - If going UP, the TOP edge, going RIGHT the Right edge etc.
 * 2. cycle through the tiles in the opposite direction. The idea is to start from those that have to move first, so that
 *    next tiles have an up-to-date state to check if they need to merge or just move
 * 3. check if a tile has another tile ahead in the direction of travel
 *    - if not, then it has to move to the edge ahead
 *    - if there is a tile, but the tile is either a block (blocks are treated like tiles with different behaviour), or
 *      has different value, or it was already merged (so no further merge for the same move) or it was stale (meaning
 *      it was merged, and it has to be deleted) then we need to move just before this tile
 *    - if the next tile is none of the above and has same value, then we merge, marking the tile ahead as stale, the current
 *      tile as merged and doubling its value
 * @param {Array} currentTiles array of tiles to move
 * @param {number} boardSize the size of the board
 * @param {string} direction the direction of travel
 * @return {Array} ordered tiles
 */
export const moveTiles = (currentTiles: Array<BoardTile>, boardSize: number, direction: Keys): Array<BoardTile> => {
  // Keys.UP is default
  const moveDef: MoveDef = {
    axis: 'row',
    tiles: [],
    stepDir: 'asc',
    edge: 0
  }

  switch (direction) {
    case Keys.DOWN:
      moveDef.stepDir = 'desc';
      moveDef.edge = boardSize - 1;
      break;

    case Keys.LEFT:
      moveDef.axis = 'col';
      break;

    case Keys.RIGHT:
      moveDef.axis = 'col';
      moveDef.stepDir = 'desc';
      moveDef.edge = boardSize - 1;
      break
  }

  const tiles = orderBy<BoardTile>(currentTiles, moveDef.axis, moveDef.stepDir);

  for (let i = 0; i < tiles.length; i++) {
    if (!tiles[i].block) {
      const cAxis = switchAxis(moveDef.axis);
      const findPredicate = (t: BoardTile, list: Array<BoardTile>) => {
        return t[cAxis] === list[i][cAxis] && (t[moveDef.axis] - list[i][moveDef.axis]) * dirToNum(moveDef.stepDir) * -1 > 0;
      }
      // This is the list of all tiles ahead of the current tile
      const tileDirSiblings = filter<BoardTile>(tiles, t => findPredicate(t, tiles));
      // This is the next tile ahead
      let fwdTile: BoardTile = orderBy<BoardTile>(tileDirSiblings, moveDef.axis, reverseDir(moveDef.stepDir))[0];

      if (!fwdTile) {
        // No tiles ahead, let's move to the edge
        tiles[i][moveDef.axis] = moveDef.edge;
      } else if (fwdTile.block || fwdTile.merged || fwdTile.stale || fwdTile.value !== tiles[i].value) {
        // The tile ahead was already merged or is of different value (or it's a block), tile should move adjacent
        tiles[i][moveDef.axis] = fwdTile[moveDef.axis] + dirToNum(moveDef.stepDir);
      } else {
        // The tile should merge with the tile ahead, removing the old tile when done (using the stale flag)
        tiles[i][moveDef.axis] = fwdTile[moveDef.axis];
        tiles[i].value! *= 2;
        tiles[i].merged = true;
        tiles[findIndex(tiles, t => t.id === fwdTile.id)].stale = true;
      }
    }
  }

  return tiles;
}
