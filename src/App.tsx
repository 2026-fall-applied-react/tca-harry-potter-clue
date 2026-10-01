import "./App.css";
import { HashRouter, Routes, Route } from "react-router";
import { APP_TITLE, Home } from "./Home.tsx";
import { Setup } from "./Setup.tsx";
import { Play } from "./Play.tsx";
import { getLeaderboard, type GameResult } from "./GameResults.ts";
import { useState } from "react";

const dummyGameResults: GameResult[] = [
  {
    winner: "Leona",
    players: [
      {
        player: "Leona",
        character: "Harry Potter",
        curses: 2,
      },
      {
        player: "Zac",
        character: "Ron Weasley",
        curses: 1,
      },
      {
        player: "Annali",
        character: "Luna Lovegood",
        curses: 4,
      },
    ],
  },
  {
    winner: "Zac",
    players: [
      {
        player: "Leona",
        character: "Harry Potter",
        curses: 2,
      },
      {
        player: "Zac",
        character: "Hermione Granger",
        curses: 1,
      },
      {
        player: "Annali",
        character: "Luna Lovegood",
        curses: 1,
      },
    ],
  },
  {
    winner: "Leona",
    players: [
      {
        player: "Leona",
        character: "Harry Potter",
        curses: 0,
      },
      {
        player: "Zac",
        character: "Neville Longbottom",
        curses: 1,
      },
      {
        player: "Annali",
        character: "Luna Lovegood",
        curses: 1,
      },
    ],
  },
];

const App = () => {
  //
  // react hooks, e.g. useState, useEffect, use*
  //

  // const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [gameResults, setGameResults] =
    useState<GameResult[]>(dummyGameResults);

  //
  // derived or calculated state and helper functions
  //

  const addNewGameResult = (newGameResult: GameResult) =>
    setGameResults([...gameResults, newGameResult]);

  const [title, setTitle] = useState(APP_TITLE);

  //
  // returns jsx
  //

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <p className="font-bold text-xl">{title}</p>
      </div>
      <div className="p-3">
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={<Home 
                leaderboard={getLeaderboard(gameResults)
                }
                setTitle={
                  setTitle
                }
              />}
            />
            <Route path="/setup" element={<Setup
                setTitle={
                  setTitle
                }
            />} />
            <Route
              path="/play"
              element={<Play 
                addNewGameResult={
                  addNewGameResult
                }
                setTitle={
                  setTitle
                }
                />}
            />
          </Routes>
        </HashRouter>
      </div>
    </>
  );
};

export default App;
