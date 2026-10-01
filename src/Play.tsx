import { useNavigate } from "react-router";
import type { GameResult } from "./GameResults";

type PlayProps = {
    addNewGameResult: (r: GameResult) => void;
}

export const Play: React.FC<PlayProps> = ({
    addNewGameResult,
}) => {

    const nav = useNavigate();

    return (
        <div>
            <h1>Play</h1>
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