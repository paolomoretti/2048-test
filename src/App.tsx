import React, {useMemo, useReducer} from 'react';
import './App.css';
import {Board} from "./components/Board";
import {BoardOptions} from "./components/BoardOptions";
import {DEFAULT_STATE, gameReducer} from "./reducers/game.reducer";
import {GameContext} from "./context/game.context";

function App() {
  const [state, dispatch] = useReducer(gameReducer, DEFAULT_STATE);
  const contextValue = useMemo(() => {
    return {state, dispatch};
  }, [state, dispatch]);

  return (
    <div className="App">
      <GameContext.Provider value={contextValue}>
        <BoardOptions/>
        <Board/>
      </GameContext.Provider>
    </div>
  );
}

export default App;
