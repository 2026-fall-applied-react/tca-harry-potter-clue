import "./App.css";
import { HashRouter, Routes, Route } from "react-router";
import { APP_TITLE, Home } from "./Home.tsx";
import { Setup } from "./Setup.tsx";
import { Play } from "./Play.tsx";
import { getGeneralFacts, getLeaderboard, getPreviousPlayers, type GamePlayerSelection, type GameResult } from "./GameResults.ts";
import { useState } from "react";

const dummyGameResults: GameResult[] = [
  {
    winner: "Leona",
    players: [
      {
        player: "Leona",
        character: "Harry Potter",
      },
      {
        player: "Zac",
        character: "Ron Weasley",
      },
      {
        player: "Annali",
        character: "Luna Lovegood",
      },
    ],
        start: "2026-10-03T22:57:36.195Z",
        end: "2026-10-03T23:07:36.195Z",
  },
  {
    winner: "Zac",
    players: [
      {
        player: "Leona",
        character: "Harry Potter",
      },
      {
        player: "Zac",
        character: "Hermione Granger",
      },
      {
        player: "Annali",
        character: "Luna Lovegood",
      },
    ],
      start: "2026-10-03T22:57:36.195Z",
      end: "2026-10-03T23:07:36.195Z",
  },
  {
    winner: "Leona",
    players: [
      {
        player: "Leona",
        character: "Harry Potter",
      },
      {
        player: "Zac",
        character: "Neville Longbottom",
      },
      {
        player: "Annali",
        character: "Luna Lovegood",
      },
    ],
      start: "2026-10-03T22:57:36.195Z",
      end: "2026-10-03T23:07:36.195Z",
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

  const [currentPlayers, setCurrentPlayers] = useState<GamePlayerSelection[]>([]);

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
              element={
              <Home 
                leaderboard={getLeaderboard(gameResults)
                }
                setTitle={
                  setTitle
                }
                generalFacts={
                  getGeneralFacts(gameResults)
                }
                
              />
            }
            />
            <Route path="/setup" element={
              <Setup
                setTitle={
                  setTitle
                }
                previousPlayers={
                  getPreviousPlayers(gameResults)
                }
                setCurrentPlayers={
                  setCurrentPlayers
                }
            />
            } />
            <Route
              path="/play"
              element={<Play 
                addNewGameResult={
                  addNewGameResult
                }
                setTitle={
                  setTitle
                }
                currentPlayers={
                  currentPlayers
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
