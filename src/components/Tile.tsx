import './Tile.css';
import {useContext, useEffect, useState} from "react";
import {BoardTile} from "../types";
import {GameContext} from '../context/game.context';

interface TileProps {
  tile: BoardTile;
}

export const Tile = ({tile}: TileProps) => {
  const {state} = useContext(GameContext);
  const [style, setStyle] = useState<any>({});
  const [cssClass, setCssClass] = useState<string>(`tile ${tile.block ? 'tile-block' : ''}`);

  const updateCssClasses = (tile: BoardTile, highlight: boolean = false): string => {
    const list = ['tile', `tile-${tile.block ? 'block' : Math.min(tile.value!, 2048)}`];
    if (highlight) {
      list.push('highlight');
    }
    return list.join(' ');
  }

  useEffect(() => {
    const {row, col, stale} = tile;
    const {size} = state;
    setStyle({
      left: (100 / size) * col + '%',
      top: (100 / size) * row + '%',
      width: (100 / size) + '%',
      height: (100 / size) + '%',
      zIndex: stale ? 1 : (row + 1) * (col + 1)
    });
  }, [tile.row, tile.col]);

  useEffect(() => {
    setCssClass(updateCssClasses(tile, true));
    setTimeout(() => setCssClass(updateCssClasses(tile)), state.transitionMs);
  }, [tile.value, state.transitionMs]);

  return (
    <div role={'tile'} className={cssClass} style={style}>
      <div className={'tile-content'}>
        <h2>{tile.value}</h2>
      </div>
    </div>
  )
}