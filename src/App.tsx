import "./App.css";
import {
  HashRouter,
  Routes,
  Route
} from 'react-router'
import { Home } from './Home.tsx';
import { Setup } from './Setup.tsx';
import { Play } from './Play.tsx';
import type { GameResult } from "./GameResults.ts";

const GameResults: GameResult[] = [
    {
        winner: "Leona",
        players: [
            {
                player: "Leona",
                character: "Harry Potter",
                curses: 2
            },
            {
                player: "Zac",
                character: "Ron Weasley",
                curses: 1
            },
            {
                player: "Annali",
                character: "Luna Lovegood",
                curses: 4
            }
        ]
    },
    {
        winner: "Zac",
        players: [
            {
                player: "Leona",
                character: "Harry Potter",
                curses: 2
            },
            {
                player: "Zac",
                character: "Hermione Granger",
                curses: 1
            },
            {
                player: "Annali",
                character: "Luna Lovegood",
                curses: 1
            }
        ]
    },
    {
        winner: "Leona",
        players: [
            {
                player: "Leona",
                character: "Harry Potter",
                curses: 0
            },
            {
                player: "Zac",
                character: "Neville Longbottom",
                curses: 1
            },
            {
                player: "Annali",
                character: "Luna Lovegood",
                curses: 1
            }
        ]
    },
];

const App = () =>  {

  return (
    <div className="p-3">
     <HashRouter>
      <Routes>
        <Route
          path='/'
          element={
            <Home />
          }
        />
        <Route
          path='/setup'
          element={
            <Setup />
          }
        />
        <Route
          path='/play'
          element={
            <Play />
          }
        />
      </Routes>
     </HashRouter>
    </div>
  );
}

export default App;
