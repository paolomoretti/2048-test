import '@testing-library/jest-dom/extend-expect'
import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {Tile} from "./Tile";
import {BoardTile} from "../types";
import {GameContext} from "../context/game.context";
import {DEFAULT_STATE, GameState} from "../reducers/game.reducer";

const mockTile: BoardTile = {
  id: 'foo',
  row: 0,
  col: 0,
  value: 2
};
const mockContext: GameState = {
  ...DEFAULT_STATE,
  size: 5
}

describe('Tile component', () => {
  test('should show the correct value', async () => {
    const { getByRole } = render(<Tile tile={mockTile} />);

    expect(getByRole('heading').textContent).toEqual('2');
  });

  test('should set the correct position and size', () => {
    const component = (
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={mockTile} />
      </GameContext.Provider>
    )
    const { getByRole } = render(component);

    expect(getByRole('tile')).toHaveStyle(`left: 0%; top: 0%; width: ${100 / mockContext.size}%; height: ${100 / mockContext.size}%`);
  });

  test('should initially apply the highlight class and remove it after animation is complete', async () => {
    render(
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={mockTile} />
      </GameContext.Provider>
    );

    expect(screen.getByRole('tile')).toHaveClass('highlight');

    await waitFor(() => {
      expect(screen.getByRole('tile')).not.toHaveClass('highlight');
    }, { timeout: DEFAULT_STATE.transitionMs + 100});
  });

  test('should update the value whern it changes', async () => {
    const { rerender } = render(
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={mockTile} />
      </GameContext.Provider>
    );

    rerender((
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={{...mockTile, value: 4}} />
      </GameContext.Provider>
    ));

    expect(screen.getByRole('heading').textContent).toBe('4');
  });

  test('should add the highlight class on value change', async () => {
    const { rerender } = render(
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={mockTile} />
      </GameContext.Provider>
    );

    rerender((
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={{...mockTile, value: 4}} />
      </GameContext.Provider>
    ));

    expect(screen.getByRole('tile')).toHaveClass('highlight');
    expect(screen.getByRole('heading').textContent).toBe('4');

    await waitFor(() => {
      expect(screen.getByRole('tile')).not.toHaveClass('highlight');
    }, { timeout: DEFAULT_STATE.transitionMs + 100});
  });

  test('should reposition if row/col changes', async () => {
    const { rerender, getByRole } = render(
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={mockTile} />
      </GameContext.Provider>
    );

    expect(getByRole('tile')).toHaveStyle(`left: 0%; top: 0%;`);

    rerender((
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={{...mockTile, row: 1, col: 2}} />
      </GameContext.Provider>
    ));

    expect(getByRole('tile')).toHaveStyle(`left: ${(100 / mockContext.size) * 2}%; top: ${(100 / mockContext.size) * 1}%`);
  });

  test('should add correct class if tile is a block', async () => {
    const { getByRole } = render(
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={{...mockTile, block: true }} />
      </GameContext.Provider>
    );

    expect(getByRole('tile')).toHaveClass(`tile-block`);
  });

  test('should add a different class depending on the value', async () => {
    const { getByRole } = render(
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={mockTile} />
      </GameContext.Provider>
    );

    expect(getByRole('tile')).toHaveClass(`tile-${mockTile.value}`);
  });

  test('should not go higher than tile-2048', async () => {
    const { getByRole } = render(
      <GameContext.Provider value={{ state: mockContext, dispatch: jest.fn() }}>
        <Tile tile={{...mockTile, value: 100000}} />
      </GameContext.Provider>
    );

    expect(getByRole('tile')).not.toHaveClass(`tile-100000`);
    expect(getByRole('tile')).toHaveClass(`tile-2048`);
  });
});