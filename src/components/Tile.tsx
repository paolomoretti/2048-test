import './Tile.css';
import {useEffect, useRef, useState} from "react";
import {BoardTile} from "../types";

interface TileProps {
  tile: BoardTile;
}

export const Tile = ({tile}: TileProps) => {
  const elRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<any>({});
  const {row, col, value} = tile;

  useEffect(() => {
    if (elRef.current) {
      setTimeout(() =>
        elRef.current!.classList.remove('popup-animation')
      , 500);
    }
  }, [])
  useEffect(() => {
    setStyle({
      ...style,
      // opacity: 1,
      left: (col * 100) + 'px',
      top: row * 100 + 'px',
      zIndex: tile.stale ? 1 : (row + 1) * (col + 1)
    });
  }, [tile.row, tile.col]);

  useEffect(() => {
    elRef.current!.classList.add('highlight');
    elRef.current!.classList.add(`tile-${tile.value}`);
    setTimeout(() => {
      elRef.current!.classList.remove('highlight');
    }, 50)
  }, [tile.value]);

  return (
    <div ref={elRef} className={`Tile tile-${tile.block ? 'block' : tile.value}`} style={style}>
      <div className={'Tile-content'}>
        <h1>{value}</h1>
        {/*<code>{tile.id}</code>*/}
        {/*<code className={'pos'}>{tile.pos}</code>*/}
      </div>
    </div>
  )
}