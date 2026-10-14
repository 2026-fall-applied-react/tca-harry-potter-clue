import { useNavigate } from "react-router";
import type { GamePlayerSelection, GameResult } from "./GameResults";
import { useEffect, useState } from "react";

export const APP_TITLE = "Play"

type PlayProps = {
    addNewGameResult: (r: GameResult) => void;
    setTitle: (t: string) => void;
    currentPlayers: GamePlayerSelection[];
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
        <div
        className="flex flex-col"
        >
            {
                currentPlayers.map(
                    x => (
                    <button 
                    key={x.player}
                    className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
                                onClick={
                        () => {
                            addNewGameResult({
                                players: currentPlayers,
                                winner: x.player,
                                start: startTimestamp,
                                end: new Date().toISOString(),
                            });
                            nav(-2);
                        }
                    }
                    >
                        {x.player} Won
                    </button>
                    )
                )
            }
        </div>
    );
};