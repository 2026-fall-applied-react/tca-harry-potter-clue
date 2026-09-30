import { useNavigate } from "react-router";
import type { LeaderboardEntry } from "./GameResults";

type HomeProps = {
    leaderboard: LeaderboardEntry[];
};

export const Home: React.FC<HomeProps> = (
    {
        leaderboard
    }
) => {
    const nav = useNavigate();

    console.log(leaderboard);
    
    return (
        <div>
            <h1>Home</h1>
            <button 
            className="btn btn-soft btn-lg"
            onClick={
                () => nav('/setup')
            }
            >
                Set up a Game
            </button>
        </div>
    );
};