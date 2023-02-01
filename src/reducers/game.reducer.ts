import {BoardTile, Keys} from "../types";
import {addRandomTile, cleanTiles, getTilesSnapshot, hasMoves, moveTiles} from "../utils/boardMatrix";
import {find} from "lodash";

export type GameState = {
  size: number;
  tiles: Array<BoardTile>;
  transitionMs: number;
  withBlocks: boolean;
  hasMoved: boolean;
  lastMoveEnded: boolean;
  gameOver: boolean;
  winner: boolean;
}
export type GameAction =
  | { type: "SET_BOARD_SIZE"; size: number; }
  | { type: "TOGGLE_BLOCKS"; blocks: boolean; }
  | { type: "MOVE"; direction: Keys; }
  | { type: "MOVE_END"; }
  | { type: "ADD_TILE"; block?: boolean; };

export const DEFAULT_STATE = {
  tiles: [],
  withBlocks: false,
  size: 6,
  transitionMs: 150,
  hasMoved: false,
  lastMoveEnded: false,
  gameOver: false,
  winner: false
};

export function gameReducer(state: GameState, action: GameAction) {
  switch (action.type) {
    case "TOGGLE_BLOCKS":
      return {
        ...DEFAULT_STATE,
        size: state.size,
        withBlocks: action.blocks
      };

    case "SET_BOARD_SIZE":
      return {
        ...DEFAULT_STATE,
        size: action.size
      };

    case "ADD_TILE":
      const tiles = addRandomTile(state.tiles, state.size, action.block);
      return {
        ...state,
        hasMoved: false,
        tiles: tiles,
        gameOver: !hasMoves(tiles, state.size) && !state.winner
      }

    case "MOVE":
      const preSnapshot = getTilesSnapshot(state.tiles);
      const movedTiles = moveTiles(state.tiles, state.size, action.direction);
      const hasChanged = preSnapshot !== getTilesSnapshot(state.tiles);

      return {
        ...state,
        hasMoved: hasChanged,
        tiles: movedTiles
      };

    case "MOVE_END":
      return {
        ...state,
        hasMoved: false,
        tiles: cleanTiles(state.tiles),
        winner: !!find(state.tiles, t => t.value! >= 2048)
      }

    default:
      return state;
  }
}