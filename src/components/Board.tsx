import React, {useContext, useEffect, useRef, useState} from "react";
import './Board.css';
import {BoardTile, Keys} from "../types";
import {Tile} from "./Tile";
import {range, throttle} from "lodash";
import {getBoardSlotsArray} from "../utils/boardMatrix";
import {GameContext} from "../context/game.context";

export const Board = () => {
  const shouldInit = useRef(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const { state, dispatch } = useContext(GameContext);
  const [tilesArr, setTilesArr] = useState<Array<number>>([]);

  const onKeyPress = async (e: KeyboardEvent) => {
    if (Object.values(Keys).indexOf(e.code as Keys) > -1) {
      dispatch({type: "MOVE", direction: e.code as Keys});
      setTimeout(() => dispatch({ type: "MOVE_END"}), state.transitionMs);
    }
  }

  useEffect(() => {
    if (state.gameOver) {
      setGameOver(true);
      document.removeEventListener('keyup', throttle(onKeyPress, state.transitionMs + 50));
    }
  }, [state.gameOver]);

  useEffect(() => {
    if (state.hasMoved) {
      setTimeout(() =>
        dispatch({ type: "ADD_TILE"}), state.transitionMs
      , state.transitionMs);
    }
  }, [state.hasMoved]);

  useEffect(() => {
    if (shouldInit.current) {
      shouldInit.current = false;
      setTilesArr(getBoardSlotsArray(state.size));
      dispatch({type: "ADD_TILE"});

      document.addEventListener('keyup', throttle(onKeyPress, state.transitionMs + 50));
    }
  }, []);

  useEffect(() => {
    setTilesArr(range(Math.pow(state.size, 2)));
  }, [state.size])

  return (
    <div className={`Board ${gameOver ? 'game-over' : ''}`}>
      <div className="Board-grid" style={{maxWidth: state.size * 100}}>
        {tilesArr.map(index => (
          <div className={'Board-grid-tile-placeholder'} key={index} />
        ))}
        {state.tiles.map((t: BoardTile) =>
          <Tile key={t.id} tile={t} />
        )}
        {state.gameOver && (
          <div className={'game-over-message'}>
            <h2>GAME OVER</h2>
          </div>
        )}
      </div>
    </div>
  )
}
