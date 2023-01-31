import {createContext, Dispatch} from "react";
import {DEFAULT_STATE, GameAction, GameState} from "../reducers/game.reducer";

export interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
};

export const GameContext = createContext<GameContextValue>({
  state: DEFAULT_STATE,
  dispatch: () => null
});