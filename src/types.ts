export enum Keys {
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight'
}

export type Axis = 'row' | 'col';
export type Dir = 'asc' | 'desc';

export interface MoveDef {
  axis: Axis;
  tiles: Array<BoardTile>;
  stepDir: Dir;
  edge: number;
}

export interface BoardTile {
  id: string;
  col: number;
  row: number;
  value?: number;
  merged?: boolean;
  stale?: boolean;
  block?: boolean;
}