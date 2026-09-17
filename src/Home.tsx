import { useNavigate } from "react-router";

export const Home = () => {
    const nav = useNavigate();
    
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