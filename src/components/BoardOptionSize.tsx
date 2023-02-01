import React, {useContext, useState} from "react";
import {GameContext} from "../context/game.context";
import "./BoardOptionSize.css";
import {DEFAULT_STATE} from "../reducers/game.reducer";

export default function () {
  const {state, dispatch} = useContext(GameContext);
  const [userBoardSize, setBoardSize] = useState<number>(DEFAULT_STATE.size);

  const onChangeBoardSizeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardSize(Number(e.target.value));
  };

  const changeSize = () => {
    dispatch({type: "SET_BOARD_SIZE", size: userBoardSize});
    dispatch({type: "ADD_TILE"});
  }

  return (
    <>
      <h4 className={'option-title'}>Board size</h4>
      <input className={'option-input'} type="number" size={2} defaultValue={state.size}
             onChange={onChangeBoardSizeNumber}/>
      <button className={'option-button'} onClick={changeSize}>Change Size</button>
    </>
  )
}