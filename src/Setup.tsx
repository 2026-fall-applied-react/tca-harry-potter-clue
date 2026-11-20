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

  const [characterIndex, setCharacterIndex] = useState(0);

  const nav = useNavigate();

  useEffect(() => setTitle(APP_TITLE), [setTitle]);

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

  // What are the available characters at the point of selection?
  const availableCharacters = HARRY_POTTER_CHARACTERS.filter(
    (character) =>
      !selectedPlayers.some(
        (player) =>
          player.name !== characterPickerPlayer &&
          player.character === character,
      ),
  );

  // Opens the Character Picker Modal
  const openCharacterPicker = (playerName: string) => {
    const player = availablePlayers.find(
      (availablePlayer) => availablePlayer.name === playerName,
    );
    const choices = HARRY_POTTER_CHARACTERS.filter(
      (character) =>
        !selectedPlayers.some(
          (selectedPlayer) =>
            selectedPlayer.name !== playerName &&
            selectedPlayer.character === character,
        ),
    );
    const currentCharacterIndex = player?.character
      ? choices.indexOf(player.character)
      : 0;

    setCharacterPickerPlayer(playerName);
    setCharacterIndex(currentCharacterIndex >= 0 ? currentCharacterIndex : 0);
    dialogRef.current?.showModal();
  };

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

      {/* Map new player and their checkbox - checked - to the list of players without character selected */}
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

                {
                  /* Open character picker modal */
                }
                if (checked) {
                  openCharacterPicker(x.name);
                }
              }}
            />
            {x.name}
          </label>

          {x.checked && (
            <button
              type="button"
              className="btn btn-sm ml-3"
              onClick={() => openCharacterPicker(x.name)}
            >
              {x.character || "Choose character"}
            </button>
          )}
        </p>
      ))}

      {/* Dialog box/modal for selecting characters */}
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
          <h2 className="text-xl font-bold mb-4">
            Choose a character for {characterPickerPlayer}
          </h2>
          <div className="card bg-base-200 w-full">
            <div className="card-body items-center text-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-base-300">
                <span className="text-5xl font-bold">
                  {availableCharacters[characterIndex]?.charAt(0)}
                </span>
              </div>

              <h3 className="card-title mt-3">
                {availableCharacters[characterIndex]}
              </h3>

              <div
                className={
                  availableCharacters.length > 1
                    ? "mt-3 grid w-full grid-cols-3 gap-3"
                    : "mt-3 flex w-full justify-center"
                }
              >
                {availableCharacters.length > 1 && (
                  <button
                    type="button"
                    className="btn w-full"
                    onClick={() =>
                      setCharacterIndex(
                        (index) =>
                          (index - 1 + availableCharacters.length) %
                          availableCharacters.length,
                      )
                    }
                  >
                    Previous
                  </button>
                )}

                {/* Select Character Button */}
                <button
                  type="button"
                  className="btn btn-primary btn-lg w-full px-6"
                  disabled={!availableCharacters[characterIndex]}
                  onClick={() => {
                    const character = availableCharacters[characterIndex];
                    if (!character || characterPickerPlayer === null) {
                      return;
                    }

                    setAvailablePlayers((players) =>
                      players.map((player) =>
                        player.name === characterPickerPlayer
                          ? { ...player, character }
                          : player,
                      ),
                    );

                    dialogRef.current?.close();
                  }}
                >
                  Choose
                </button>

                {/* Next Button */}
                {availableCharacters.length > 1 && (
                  <button
                    type="button"
                    className="btn w-full"
                    onClick={() =>
                      setCharacterIndex(
                        (index) => (index + 1) % availableCharacters.length,
                      )
                    }
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Buttons to close out of the modal, one visible, one insible but
          allows you to just click out of modal */}
          <div className="modal-action">
            <form method="dialog">
              <button type="submit" className="btn">
                Close
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit" aria-label="Close character picker">
            Close
          </button>
        </form>
      </dialog>
    </div>
  );
};
