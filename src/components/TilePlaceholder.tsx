import React, {useContext, useMemo} from "react";
import {GameContext} from "../context/game.context";
import "./TilePlaceholder.css";

export default function () {
  const {state} = useContext(GameContext);
  const placeholderStyle = useMemo(() => {
    const size = 100 / state.size;
    return {width: `${size}%`, paddingTop: `${size}%`};
  }, [state.size]);

  return (
    <div className={'board-grid-tile-placeholder'} style={placeholderStyle}/>
  )
}