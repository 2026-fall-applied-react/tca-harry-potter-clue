import { useNavigate } from "react-router";
import type { GameResult } from "./GameResults";
import { useEffect } from "react";

export const APP_TITLE = "Play"

type PlayProps = {
    addNewGameResult: (r: GameResult) => void;
    setTitle: (t: string) => void;
}

export const Play: React.FC<PlayProps> = ({
    addNewGameResult,
    setTitle,
}) => {

    //
    // React hooks
    //

    useEffect(
         () => setTitle(APP_TITLE)
    );

    // 
    // Derived or calculated state
    //

    //
    // Returning jsx
    //

    const nav = useNavigate();

    return (
        <div>
            <button 
            className="btn btn-soft btn-lg"
                        onClick={
                () => {
                    addNewGameResult({
                        winner: "Arlo",
                        players: [
                            { player: "Arlo", character: "Hermione Granger", curses: 0 },
                            { player: "Zac", character: "Harry Potter", curses: 0 },
                            { player: "Leona", character: "Neville Longbottom", curses: 0 },
                            { player: "Annali", character: "Ron Weasley", curses: 0 },
                        ]
                    });
                    nav(-2);
                }
            }
            >
                Game Over
            </button>
        </div>
    );
};