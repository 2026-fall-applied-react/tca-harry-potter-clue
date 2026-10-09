import { useNavigate } from "react-router";
import type { GameResult } from "./GameResults";
import { useEffect, useState } from "react";

export const APP_TITLE = "Play"

type PlayProps = {
    addNewGameResult: (r: GameResult) => void;
    setTitle: (t: string) => void;
    currentPlayers: string[];
}

export const Play: React.FC<PlayProps> = ({
    addNewGameResult,
    setTitle,
    currentPlayers,
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

    const [startTimestamp] = useState(
        new Date().toISOString()
    );

    const nav = useNavigate();

    return (
        <div>
            {
                currentPlayers.map(
                    x => (
                    <button 
                    className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
                                onClick={
                        () => {
                            addNewGameResult({
                                winner: "x",
                                start: startTimestamp,
                                end: new Date().toISOString(),
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
                        {x} Won
                    </button>
                    )
                )
            }
        </div>
    );
};