import React, {useContext, useEffect, useMemo, useRef} from "react";
import './Board.css';
import {BoardTile, Keys} from "../types";
import {Tile} from "./Tile";
import {throttle} from "lodash";
import {GameContext} from "../context/game.context";
import {getBoardSlotsArray} from "../utils/boardMatrix";
import WinnerMessage from "./WinnerMessage";
import GameOverMessage from "./GameOverMessage";
import TilePlaceholder from "./TilePlaceholder";

export const Board = () => {
  const shouldInit = useRef(true);
  const {state, dispatch} = useContext(GameContext);
  const tilesArr = useMemo(() => getBoardSlotsArray(state.size), [state.size]);
  const gameOver = useMemo(() => state.gameOver, [state.gameOver]);
  const boardStyle = useMemo(() => ({maxWidth: `${state.size * 110}px`}), [state.size]);

  const throttledKeyHandler = useMemo(() => {
    const onKeyPress = async (e: KeyboardEvent) => {
      if (Object.values(Keys).indexOf(e.code as Keys) > -1) {
        dispatch({type: "MOVE", direction: e.code as Keys});

        setTimeout(() => dispatch({type: "MOVE_END"}), state.transitionMs);
      }
    }
    return throttle(onKeyPress, state.transitionMs + 100);
  }, [state.transitionMs, dispatch]);

  useEffect(() => {
    if (state.gameOver) {
      document.removeEventListener('keyup', throttledKeyHandler);
    } else {
      document.addEventListener('keyup', throttledKeyHandler);
    }
  }, [state.gameOver, throttledKeyHandler]);

  useEffect(() => {
    if (state.hasMoved) {
      setTimeout(() =>
          dispatch({type: "ADD_TILE"}), state.transitionMs
        , state.transitionMs);
    }
  }, [state.hasMoved, state.transitionMs, dispatch]);

  useEffect(() => {
    if (shouldInit.current) {
      shouldInit.current = false;
      dispatch({type: "ADD_TILE"});
    }
  }, []);

  return (
    <div className={`board ${gameOver ? 'game-over' : ''}`}>
      <div className="board-grid-container" style={boardStyle}>
        <div className="board-grid">
          {tilesArr.map(index =>
            <TilePlaceholder key={index}/>
          )}
          {state.tiles.map((t: BoardTile) =>
            <Tile key={t.id} tile={t}/>
          )}
          {state.gameOver && <GameOverMessage/>}
        </div>
        {state.winner && <WinnerMessage/>}
      </div>
    </div>
  )
}
