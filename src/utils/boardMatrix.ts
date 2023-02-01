import {Axis, BoardTile, Dir, Keys, MoveDef} from "../types";
import {concat, difference, filter, findIndex, join, map, orderBy, pick, range, reject, uniqueId, values} from "lodash";

export const getTilesSnapshot = (tiles: Array<BoardTile>): string => {
  return join(map(tiles, t => join(values(pick(t, ['id', 'col', 'row', 'value'])), '_')), '#');
}

export const getAxesPos = (row: number, col: number, boardSize: number): number => {
  return (row * boardSize) + col;
}

export const getTileIndexPos = (tile: BoardTile, boardSize: number): number => {
  return getAxesPos(tile.row, tile.col, boardSize);
}

export const getArrayRandomIndex = (arr: Array<any>): number => {
  return parseInt((Math.random() * arr.length).toString(), 10);
}

export const getBoardSlotsArray = (boardSize: number): Array<number> => {
  return range(Math.pow(boardSize, 2));
}

export const getFreeTileSlotsIndex = (tiles: Array<BoardTile>, boardSize: number): Array<number> => {
  const allSlots = getBoardSlotsArray(boardSize);
  return difference(allSlots, map(tiles, t => getTileIndexPos(t, boardSize)));
}

export const addTile = (tiles: Array<BoardTile>, tile: BoardTile): Array<BoardTile> => {
  return concat(tiles, tile);
}

export const generateInitialValue = (): number => {
  return Math.max(Math.round(Math.random() * 2) * 2, 2);
}

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
export const addRandomTile = (tiles: Array<BoardTile>, boardSize: number, block = false): Array<BoardTile> => {
  const freeSlots = getFreeTileSlotsIndex(tiles, boardSize);
  const freeSlotsRandomIndex = getArrayRandomIndex(freeSlots);
  const pos = freeSlots[freeSlotsRandomIndex];

  return addTile(tiles, createTile(pos, boardSize, block));
}

export const cleanTiles = (tiles: Array<BoardTile>): Array<BoardTile> => {
  return map(reject(tiles, t => t.stale === true), t => {
    t.merged = false;
    return t;
  });
}

export const switchAxis = (axis: Axis): Axis => axis === 'row' ? 'col' : 'row';
export const reverseDir = (dir: Dir): Dir => dir === 'asc' ? 'desc' : 'asc';
export const dirToNum = (dir: Dir): number => dir === 'asc' ? 1 : -1;

export const moveTiles = (currentTiles: Array<BoardTile>, boardSize: number, direction: Keys): Array<BoardTile> => {
  // Keys.UP default
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
      const tileDirSiblings = filter<BoardTile>(tiles, t => findPredicate(t, tiles));
      let fwdTile: BoardTile = orderBy<BoardTile>(tileDirSiblings, moveDef.axis, reverseDir(moveDef.stepDir))[0];

      if (!fwdTile) {
        // No tiles ahead, let's move to the edge
        tiles[i][moveDef.axis] = moveDef.edge;
      } else if (fwdTile.block || fwdTile.merged || fwdTile.stale || fwdTile.value !== tiles[i].value) {
        // The tile ahead was already merged or is of different value, tile should move adjacent
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