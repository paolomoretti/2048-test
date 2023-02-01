import React, {useContext} from "react";
import './BoardOptions.css';
import {GameContext} from "../context/game.context";
import BoardOptionBlocks from "./BoardOptionBlocks";
import BoardOptionSize from "./BoardOptionSize";

export const BoardOptions = () => {
  const {state} = useContext(GameContext);

  return (
    <div className={'board-options'}>
      <h1>2048 <small>by Paolo Moretti</small></h1>
      <div className={'options-container'}>
        <div className="row">
          <BoardOptionSize/>
        </div>

        <div className="row">
          <BoardOptionBlocks/>
        </div>

        {state.size < 4 && <p>Good luck getting to <strong>2048</strong> :))</p>}
      </div>
    </div>
  )
}
