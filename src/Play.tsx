import { useNavigate } from "react-router";
import { ITEMS, ROOMS, SUSPECTS } from "./GameResults";
import type {
  GamePlayer,
  GameResult,
  Item,
  Room,
  Suspect,
} from "./GameResults";
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

  // Used to create the select options for recording the game result's "mystery"
  const [who, setWho] = useState<Suspect | "">("");
  const [what, setWhat] = useState<Item | "">("");
  const [where, setWhere] = useState<Room | "">("");

  const [startTimestamp] = useState(new Date().toISOString());

  const nav = useNavigate();

  const mysteryComplete = who !== "" && what !== "" && where !== "";

  //* RETURN JSX *//

  return (
    <div className="flex flex-col">
      <fieldset className="fieldset text-2xl">
        <legend className="fieldset-legend">The Mystery Revealed!</legend>

        <label className="label">Who?</label>
        <select
          className="select w-full lg:w-64"
          value={who}
          onChange={(e) =>
            setWho(SUSPECTS.find((s) => s === e.target.value) ?? "")
          }
        >
          <option value="">Select a suspect</option>
          {SUSPECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label className="label">What?</label>
        <select
          className="select w-full lg:w-64"
          value={what}
          onChange={(e) =>
            setWhat(ITEMS.find((i) => i === e.target.value) ?? "")
          }
        >
          <option value="">Select an item</option>
          {ITEMS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <label className="label">Where?</label>
        <select
          className="select w-full lg:w-64"
          value={where}
          onChange={(e) =>
            setWhere(ROOMS.find((r) => r === e.target.value) ?? "")
          }
        >
          <option value="">Select a room</option>
          {ROOMS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </fieldset>
      <fieldset className="fieldset text-2xl">
      <legend className="fieldset-legend">Who Solved It?</legend>
      {currentPlayers.map((x) => (
        <button
          key={x.player}
          disabled={!mysteryComplete}
          className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
          onClick={() => {
            // Narrows who/what/where from "T | ''" to "T" for TypeScript
            if (who === "" || what === "" || where === "") return;

            addNewGameResult({
              players: currentPlayers,
              winner: x.player,
              start: startTimestamp,
              end: new Date().toISOString(),
              mystery: [{ who: [who], what: [what], where: [where] }],
            });
            nav(-2);
          }}
        >
          {x.player} Won
        </button>
      ))}
      </fieldset>
    </div>
  );
};
