import { useNavigate } from "react-router";
import { useEffect } from "react";

export const APP_TITLE = "Setup Game"

type SetupProps = {
    setTitle: (t: string) => void;
}


export const Setup: React.FC<SetupProps> = ({setTitle}) => {

    const nav = useNavigate();

      //
      // react hooks
      //
    
    useEffect(
            () => setTitle(APP_TITLE)
    );

    return (
        <div>
            <button 
            className="btn btn-soft btn-lg"
                        onClick={
                () => nav('/play')
            }
            >
                Play The Game
            </button>
        </div>
    );
};