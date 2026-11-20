import "./App.css";
import { HashRouter, Routes, Route } from "react-router";
import { APP_TITLE, Home } from "./Home.tsx";
import { Setup } from "./Setup.tsx";
import { Play } from "./Play.tsx";
import {
  getDurationsByPlayerCount,
  getGeneralFacts,
  getLeaderboard,
  getPreviousPlayers,
  getWinStreaks,
  type GamePlayer,
  type GameResult,
} from "./GameResults.ts";
import { useState, useEffect } from "react";
import localforage from "localforage";

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
    mystery: [
      {
        who: ["Draco Malfoy"],
        what: ["Petrificus Totalus"],
        where: ["Defense Against the Dark Arts"],
      },
    ],
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
    mystery: [
      {
        who: ["Dolores Umbridge"],
        what: ["Mandrake"],
        where: ["Owlery"],
      },
    ],
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
    mystery: [
      {
        who: ["Lucius Malfoy"],
        what: ["Vanishing Cabinet"],
        where: ["Great Hall"],
      },
    ],
  },
];

const DEFAULT_THEME = "gryffindor-light";
const OTHER_THEME = "slytherin-dark";

const App = () => {
  //
  // react hooks, e.g. useState, useEffect, use*
  //

  // const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [gameResults, setGameResults] =
    useState<GameResult[]>(dummyGameResults);

  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme =
        (await localforage.getItem<string>("theme")) ?? DEFAULT_THEME;
      const validTheme =
        savedTheme === OTHER_THEME ? OTHER_THEME : DEFAULT_THEME;

      if (!ignore) {
        setTheme(validTheme);
      }
    };
    let ignore = false;
    loadTheme();

    return () => {
      ignore = true;
    };
  }, []);

  //
  // derived or calculated state and helper functions
  //

  const addNewGameResult = (newGameResult: GameResult) =>
    setGameResults([...gameResults, newGameResult]);

  const [title, setTitle] = useState(APP_TITLE);

  const [currentPlayers, setCurrentPlayers] = useState<GamePlayer[]>([]);

  //
  // returns jsx
  //

  return (
    <div className="min-h-screen" data-theme={theme}>
      <div className="navbar bg-base-100 shadow-sm">
        <p className="font-bold text-xl">{title}</p>

        <label className="swap swap-rotate ml-auto">
          {/* this hidden checkbox controls the state */}
          <input
            type="checkbox"
            checked={theme !== DEFAULT_THEME}
            onChange={async () => {
              const savedTheme = await localforage.setItem<string>(
                "theme",
                theme === DEFAULT_THEME ? OTHER_THEME : DEFAULT_THEME,
              );

              setTheme(savedTheme);
            }}
          />

          {/* lion icon - light */}
          <svg
            className="swap-on h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8.2 6.4 6.1 4.2l.3 4C4.9 9.4 4 11.1 4 13c0 4.4 3.6 8 8 8s8-3.6 8-8c0-1.9-.9-3.6-2.4-4.8l.3-4-2.1 2.2A8.6 8.6 0 0 0 12 5.5a8.6 8.6 0 0 0-3.8.9Z" />
            <path d="M8.3 9.6c.5-1.4 1.9-2.3 3.7-2.3s3.2.9 3.7 2.3v3.7c0 2.5-1.7 4.5-3.7 4.5s-3.7-2-3.7-4.5V9.6Z" />
            <path d="M9.7 11.3h.1M14.2 11.3h.1M10.7 14.2l1.3.8 1.3-.8M12 15v1.2" />
          </svg>
          {/* snake icon - dark */}
          <svg
            className="swap-off h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9.2 5.5c.8-1.8 2.4-2.7 4.3-2.4l3.3.5-2.1 1.7L17 6.7l-3.5.7c-1.1.2-1.8.8-1.8 1.7 0 1 .9 1.6 2.5 2.2 2.2.9 3.8 2.1 3.8 4.3 0 3.1-2.7 5.2-6.2 5.2-3 0-5.4-1.4-5.4-3.5 0-1.9 1.7-3.1 4.3-3.1h2.5" />
            <path d="M12.5 5.2h.1M7.2 17.3c1.4 1 3.3 1.3 5.1.8 1.2-.3 2.1-1 2.1-1.9 0-.8-.7-1.4-1.8-1.9" />
          </svg>

        </label>
      </div>
      <div className="p-3">
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  leaderboard={getLeaderboard(gameResults)}
                  setTitle={setTitle}
                  generalFacts={getGeneralFacts(gameResults)}
                  durationsByPlayerCount={getDurationsByPlayerCount(
                    gameResults,
                  )}
                  winStreaks={getWinStreaks(gameResults)}
                />
              }
            />
            <Route
              path="/setup"
              element={
                <Setup
                  setTitle={setTitle}
                  previousPlayers={getPreviousPlayers(gameResults)}
                  setCurrentPlayers={setCurrentPlayers}
                />
              }
            />
            <Route
              path="/play"
              element={
                <Play
                  addNewGameResult={addNewGameResult}
                  setTitle={setTitle}
                  currentPlayers={currentPlayers}
                />
              }
            />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
};

export default App;
