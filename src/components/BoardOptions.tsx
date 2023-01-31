import React, {useContext, useState} from "react";
import './BoardOptions.css';
import {DEFAULT_STATE} from "../reducers/game.reducer";
import {GameContext} from "../context/game.context";
import {range} from "lodash";

export const BoardOptions = () => {
  const { state, dispatch } = useContext(GameContext);
  const [userBoardSize, setBoardSize] = useState<number>(DEFAULT_STATE.size);
  const [blocksCount, setBlocksCount] = useState<number>(0);

  const onChangeBoardSizeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardSize(Number(e.target.value));
  };

  const onChangeBlockCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setBlocksCount(count);
    dispatch({ type: "TOGGLE_BLOCKS", blocks: count > 0 });

    range(count).forEach(() => dispatch({ type: "ADD_TILE", block: true }));

    dispatch({ type: "ADD_TILE" });
  }

  const changeSize = () => {
    dispatch({ type: "SET_BOARD_SIZE", size: userBoardSize });
    dispatch({ type: "ADD_TILE" });
    setBlocksCount(0);
  }

  return (
    <div className={'BoardOptions'}>
      <h1>2048 <small>by Paolo Moretti</small></h1>
      <div className={'options-container'}>
        <div className="row">
          <h4>Board size</h4>
          <input type="number" size={2} defaultValue={state.size} onChange={onChangeBoardSizeNumber}  />
          <button onClick={changeSize}>Change Size</button>
        </div>

        <div className="row">
          <h4>Blocks</h4>
          {range(4).map(i => (
            <span key={i} className={'radio-group'}>
              <input type="radio" id={`blocks_${i}`} name="blocks" value={i} onChange={onChangeBlockCount} checked={i === blocksCount} />
              <label htmlFor={`blocks_${i}`}>{i}</label>
            </span>
          ))}
        </div>
        {state.size < 4 && <p>Good luck getting to <strong>2048</strong> :))</p>}
      </div>
    </div>
  )
}
