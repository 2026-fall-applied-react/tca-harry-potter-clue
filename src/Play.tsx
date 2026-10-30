import { useNavigate } from "react-router";
import { ITEMS, ROOMS, SUSPECTS } from "./GameResults";
import type { GamePlayer, GameResult, Item, Room, Suspect } from "./GameResults";
import { useEffect, useState } from "react";

export const APP_TITLE = "Play";

type PlayProps = {
  addNewGameResult: (r: GameResult) => void;
  setTitle: (t: string) => void;
  currentPlayers: GamePlayer[];
};

export const Play: React.FC<PlayProps> = ({
  addNewGameResult,
  setTitle,
  currentPlayers,
}) => {
  //* REACT HOOKS *//

  useEffect(() => setTitle(APP_TITLE));

  //* DERIVED OR CALCULATED STATE *//

  // Used to create the select options for recording the game result
  const [who, setWho] = useState<Suspect | "">("");
  const [what, setWhat] = useState<Item | "">("");
  const [where, setWhere] = useState<Room | "">("");
  
  const [startTimestamp] = useState(new Date().toISOString());

  const nav = useNavigate();

  //* RETURN JSX *//

  return (
    <div className="flex flex-col">
      {currentPlayers.map((x) => (
        <button
          key={x.player}
          className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
          onClick={() => {
            addNewGameResult({
              players: currentPlayers,
              winner: x.player,
              start: startTimestamp,
              end: new Date().toISOString(),
              mystery: [],
            });
            nav(-2);
          }}
        >
          {x.player} Won
        </button>
      ))}
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Solve The Mystery!</legend>

        <label className="label">Who?</label>
        <input type="text" className="input" placeholder="e.g. Malfoy" />

        <label className="label">What?</label>
        <input type="text" className="input" placeholder="e.g. Mandrake, Vanishing Cabinent etc." />

        <label className="label">Where?</label>
        <input type="text" className="input" placeholder="e.g. Room of Requiement" />
      </fieldset>
    </div>
  );
};
