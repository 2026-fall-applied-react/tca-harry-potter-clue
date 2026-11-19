import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { HARRY_POTTER_CHARACTERS } from "./GameResults";
import type { Character, GamePlayer } from "./GameResults";

//* TYPE DEFINITIONS AND CONSTANTS *//
export const APP_TITLE = "Setup Game";

// Game has a minimum of 3 and maximum of 6 players
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 6;

type AvailablePlayer = {
  name: string;
  checked: boolean;
  character: Character | "";
};

type SetupProps = {
  setTitle: (t: string) => void;
  previousPlayers: string[];
  setCurrentPlayers: (players: GamePlayer[]) => void;
};

export const Setup: React.FC<SetupProps> = ({
  setTitle,
  previousPlayers,
  setCurrentPlayers,
}) => {
  //* REACT HOOKS *//

  // For holding the name of the person chosing the character
  const [characterPickerPlayer, setCharacterPickerPlayer] = useState<
    string | null
  >(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [availablePlayers, setAvailablePlayers] = useState<AvailablePlayer[]>(
    previousPlayers.map((name) => ({
      name,
      checked: false,
      character: "",
    })),
  );

  const [newPlayerName, setNewPlayerName] = useState("");

  const nav = useNavigate();

  //* DERIVED OR CALCULATED STATE *//

  // Which players are checked/selected yet? How many?
  const selectedPlayers = availablePlayers.filter((player) => player.checked);
  const chosenPlayerCount = selectedPlayers.length;

  // Do all selected players have a character?
  const selectedPlayersHaveCharacters = selectedPlayers.every(
    (player) => player.character !== "",
  );

  // Is the number of players at the limit, based on game rules?
  const isAtPlayerLimit = chosenPlayerCount >= MAX_PLAYERS;

  const validateAndAddPlayer = () => {
    // check for dupe names
    const dupe = availablePlayers.find((x) => x.name === newPlayerName);

    // Determine if the picker should be opened when adding a new player
    const shouldOpenPicker = !isAtPlayerLimit && (!dupe || !dupe.checked);
    const playerToPickFor = dupe?.name ?? newPlayerName;

    // if dupe, don't add, rather just check
    // if (dupe) ...

    // if not a dupe, add it already checked
    // since likely in front of user ready to play
    // else (...)

    setAvailablePlayers((prev) => [
      // handle dupes by just checking them
      ...prev.map((x) =>
        x === dupe
          ? {
              ...x,
              checked: x.checked || !isAtPlayerLimit,
            }
          : x,
      ),

      // now add non dupes
      ...(dupe
        ? []
        : [
            {
              name: newPlayerName,
              checked: !isAtPlayerLimit,
              character: "" as const,
            },
          ]),
    ]);

    if (shouldOpenPicker) {
      openCharacterPicker(playerToPickFor);
    }

    setNewPlayerName("");
  };

  useEffect(() => setTitle(APP_TITLE), [setTitle]);

  const openCharacterPicker = (playerName: string) => {
    setCharacterPickerPlayer(playerName);
    dialogRef.current?.showModal();
  };

  /* RETURN JSX */

  return (
    <div className="flex flex-col">
      {/* Explain Rules */}
      <p>
        Harry Potter Clue has 3-6 players and requires that you choose a
        character.
      </p>
      {/* Button to record game play */}
      <button
        className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
        // Must have at least 3 players, max six to play
        // All selected players must have characters
        disabled={
          chosenPlayerCount < MIN_PLAYERS ||
          chosenPlayerCount > MAX_PLAYERS ||
          !selectedPlayersHaveCharacters
        }
        onClick={() => {
          setCurrentPlayers(
            availablePlayers.flatMap((player) =>
              player.checked && player.character !== ""
                ? [
                    {
                      player: player.name,
                      character: player.character,
                    },
                  ]
                : [],
            ),
          );
          nav("/play");
        }}
      >
        {chosenPlayerCount < 3
          ? "Choose 3-6 Players"
          : `Play With ${chosenPlayerCount} Player(s)`}
      </button>

      {/* Add a new player to existing list */}
      <div className="join mt-3 lg:w-64">
        <input
          className="input join-item w-full"
          placeholder="New Player Name"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          // Accepts Enter as Submitting New Player Name
          onKeyDown={(e) => {
            if (e.key === "Enter" && newPlayerName.length > 0) {
              e.preventDefault();
              validateAndAddPlayer();
            }
          }}
        />
        <button
          className="btn join-item"
          disabled={newPlayerName.length === 0}
          onClick={validateAndAddPlayer}
        >
          Add Player
        </button>
      </div>

      {availablePlayers.map((x) => (
        <p key={x.name} className="my-3">
          <label className="text-lg my-5">
            <input
              type="checkbox"
              className="checkbox checkbox-lg mr-3"
              checked={x.checked}
              disabled={!x.checked && isAtPlayerLimit}
              onChange={(e) => {
                const checked = e.target.checked;

                setAvailablePlayers((players) =>
                  players.map((player) =>
                    player.name === x.name
                      ? {
                          ...player,
                          checked,
                          character: checked ? player.character : "",
                        }
                      : player,
                  ),
                );

                if (checked) {
                  openCharacterPicker(x.name);
                }
              }}
            />
            {x.name}
          </label>

          <select
            className="select ml-3"
            disabled={!x.checked}
            value={x.character}
            onChange={(e) => {
              const character =
                HARRY_POTTER_CHARACTERS.find(
                  (option) => option === e.target.value,
                ) ?? "";
              setAvailablePlayers((players) =>
                players.map((player) =>
                  player.name === x.name ? { ...player, character } : player,
                ),
              );
            }}
          >
            <option value="">Choose a character</option>
            {HARRY_POTTER_CHARACTERS
              // Keep characters that aren't selected by another checked player
              .filter(
                (character) =>
                  !selectedPlayers.some(
                    (player) =>
                      player.name !== x.name && player.character === character,
                  ),
              )
              // Map remaining character values to input box
              .map((character) => (
                <option key={character} value={character}>
                  {character}
                </option>
              ))}
          </select>
        </p>
      ))}

      <dialog
        ref={dialogRef}
        className="modal"
        onClose={() => {
          if (characterPickerPlayer !== null) {
            setAvailablePlayers((players) =>
              players.map((player) =>
                player.name === characterPickerPlayer && player.character === ""
                  ? { ...player, checked: false }
                  : player,
              ),
            );
          }

          setCharacterPickerPlayer(null);
        }}
      >
        <div className="modal-box">
          <h2 className="text-xl font-bold">
            Choose a character for {characterPickerPlayer}
          </h2>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </div>
  );
};
