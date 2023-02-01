import {find, range} from "lodash";
import {getAxesPos, getTilesSnapshot, moveTiles} from "./boardMatrix";
import {Keys} from "../types";

describe('Board matrix util', function () {
  describe(`getTilesSnapshot`, () => {
    it('should return a string snapshot of the passed tiles', function () {
      const mockedTiles = range(4).map(i => ({id: `id_${i}`, col: i, row: i, value: i, pos: i}));
      const snapshot = getTilesSnapshot(mockedTiles);

      expect(snapshot).toEqual(`id_0_0_0_0#id_1_1_1_1#id_2_2_2_2#id_3_3_3_3`);
    });

    it('should not fail if 0 tiles are passed', function () {
      expect(getTilesSnapshot([])).toEqual('');
    });
  });

  describe(`getAxesPos`, () => {
    it('should return the correct serial position for a grid cell', function () {
      expect(getAxesPos(2, 2, 4)).toEqual(2 * 4 + 2);
      expect(getAxesPos(0, 2, 4)).toEqual(2);
      expect(getAxesPos(1, 0, 4)).toEqual(4);
      expect(getAxesPos(5, 1, 2)).toEqual(11);
    });
  });


  describe(`moveTiles`, () => {
    it('should correctly move tiles up', function () {
      const mockedTiles = [
        { id: '1', row: 1, col: 1, value: 2 },
        { id: '2', row: 2, col: 2, value: 2 },
        { id: '3', row: 3, col: 1, value: 2 }
      ];
      const resTiles = moveTiles(mockedTiles, 4, Keys.UP);

      /*
        By ID        By value     Moved UP
        ._._._._.    ._._._._.    ._._._._.
        |_|_|_|_|    |_|_|_|_|    |_|4|2|_|
        |_|1|_|_|    |_|2|_|_| => |_|_|_|_|
        |_|_|2|_|    |_|_|2|_|    |_|_|_|_|
        |_|3|_|_|    |_|2|_|_|    |_|_|_|_|
      */

      expect(find(resTiles, t => t.id === '1'))
        .toEqual({
          id: '1',
          row: 0,
          col: 1,
          stale: true,
          value: 2
        });

      expect(find(resTiles, t => t.id === '2'))
        .toEqual({
          id: '2',
          row: 0,
          col: 2,
          value: 2
        });

      expect(find(resTiles, t => t.id === '3'))
        .toEqual({
          id: '3',
          row: 0,
          col: 1,
          value: 4,
          merged: true
        });
    });

    it('should correctly move tiles right', function () {
      const mockedTiles = [
        { id: '1', row: 1, col: 1, value: 2 },
        { id: '2', row: 2, col: 2, value: 2 },
        { id: '3', row: 3, col: 1, value: 2 }
      ];
      const resTiles = moveTiles(mockedTiles, 4, Keys.RIGHT);

      /*
        By ID        By value     Moved RIGHT
        ._._._._.    ._._._._.    ._._._._.
        |_|_|_|_|    |_|_|_|_|    |_|_|_|_|
        |_|1|_|_|    |_|2|_|_| => |_|_|_|2|
        |_|_|2|_|    |_|_|2|_|    |_|_|_|2|
        |_|3|_|_|    |_|2|_|_|    |_|_|_|2|
      */

      expect(find(resTiles, t => t.id === '1'))
        .toEqual({
          id: '1',
          row: 1,
          col: 3,
          value: 2
        });

      expect(find(resTiles, t => t.id === '2'))
        .toEqual({
          id: '2',
          row: 2,
          col: 3,
          value: 2
        });

      expect(find(resTiles, t => t.id === '3'))
        .toEqual({
          id: '3',
          row: 3,
          col: 3,
          value: 2
        });
    });

    it('should correctly move tiles down', function () {
      const mockedTiles = [
        { id: '1', row: 1, col: 1, value: 2 },
        { id: '2', row: 2, col: 2, value: 2 },
        { id: '3', row: 3, col: 1, value: 2 }
      ];
      const resTiles = moveTiles(mockedTiles, 4, Keys.DOWN);

      /*
        By ID        By value     Moved DOWN
        ._._._._.    ._._._._.    ._._._._.
        |_|_|_|_|    |_|_|_|_|    |_|_|_|_|
        |_|1|_|_|    |_|2|_|_| => |_|_|_|_|
        |_|_|2|_|    |_|_|2|_|    |_|_|_|_|
        |_|3|_|_|    |_|2|_|_|    |_|4|2|_|
      */

      expect(find(resTiles, t => t.id === '1'))
        .toEqual({
          id: '1',
          row: 3,
          col: 1,
          value: 4,
          merged: true
        });

      expect(find(resTiles, t => t.id === '2'))
        .toEqual({
          id: '2',
          row: 3,
          col: 2,
          value: 2
        });

      expect(find(resTiles, t => t.id === '3'))
        .toEqual({
          id: '3',
          row: 3,
          col: 1,
          value: 2,
          stale: true
        });
    });

    it('should correctly move tiles left', function () {
      const mockedTiles = [
        { id: '1', row: 1, col: 1, value: 2 },
        { id: '2', row: 2, col: 2, value: 2 },
        { id: '3', row: 3, col: 1, value: 2 }
      ];
      const resTiles = moveTiles(mockedTiles, 4, Keys.LEFT);

      /*
        By ID        By value     Moved Left
        ._._._._.    ._._._._.    ._._._._.
        |_|_|_|_|    |_|_|_|_|    |_|_|_|_|
        |_|1|_|_|    |_|2|_|_| => |2|_|_|_|
        |_|_|2|_|    |_|_|2|_|    |2|_|_|_|
        |_|3|_|_|    |_|2|_|_|    |2|_|_|_|
      */

      expect(find(resTiles, t => t.id === '1'))
        .toEqual({
          id: '1',
          row: 1,
          col: 0,
          value: 2
        });

      expect(find(resTiles, t => t.id === '2'))
        .toEqual({
          id: '2',
          row: 2,
          col: 0,
          value: 2
        });

      expect(find(resTiles, t => t.id === '3'))
        .toEqual({
          id: '3',
          row: 3,
          col: 0,
          value: 2
        });
    })
  });
});