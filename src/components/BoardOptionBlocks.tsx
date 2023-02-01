import {range} from "lodash";
import React, {useContext, useEffect, useState} from "react";
import {GameContext} from "../context/game.context";
import "./BoardOptionBlocks.css";

export default function BoardOptionBlocks() {
  const {state, dispatch} = useContext(GameContext);
  const [blocksCount, setBlocksCount] = useState<number>(0);

  useEffect(() => {
    setBlocksCount(!state.withBlocks ? 0 : blocksCount)
  }, [state.withBlocks, blocksCount])

  const onChangeBlockCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setBlocksCount(count);
    dispatch({type: "TOGGLE_BLOCKS", blocks: count > 0});

    // Add as many blocks as the count is
    range(count).forEach(() => dispatch({type: "ADD_TILE", block: true}));

    dispatch({type: "ADD_TILE"});
  }

  return (
    <>
      <h4 className={'radio-title'}>Blocks</h4>
      {range(5).map(i => (
        <span key={i} className={'radio-group'}>
          <input type="radio" id={`blocks_${i}`} name="blocks" value={i} onChange={onChangeBlockCount}
                 checked={i === blocksCount}/>
          <label htmlFor={`blocks_${i}`}>{i}</label>
        </span>
      ))}
    </>
  )
}