import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { Character, GamePlayerSelection } from "./GameResults";


export const APP_TITLE = "Setup Game"

// Game has a minimum of 3 and maximum of 6 players
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 6;

// Only allowable characters to play
const characters: Character[] = [
    "Harry Potter",
    "Ron Weasley",
    "Hermione Granger",
    "Ginny Weasley",
    "Luna Lovegood",
    "Neville Longbottom",
];

type AvailablePlayer = {
    name: string;
    checked: boolean;
    character: Character | "";
};

type SetupProps = {
    setTitle: (t: string) => void;
    previousPlayers: string[];
    setCurrentPlayers: (players: GamePlayerSelection[]) => void;
}


export const Setup: React.FC<SetupProps> = ({
    setTitle,
    previousPlayers,
    setCurrentPlayers

}) => {

    //
    // React hooks
    //

    const [availablePlayers, setAvailablePlayers] = useState<AvailablePlayer[]>(
        previousPlayers.map(name => ({
            name,
            checked: false,
            character: "",
        }))
    );

    const [newPlayerName, setNewPlayerName] = useState("");

    const nav = useNavigate();

    //
    // derived or calculated state and helpers
    //

    // Which players are checked/selected yet? How many?
    const selectedPlayers = availablePlayers.filter(player => player.checked);
    const chosenPlayerCount = selectedPlayers.length

    // Do all selected players have a character?
    const selectedPlayersHaveCharacters = selectedPlayers.every(
        player => player.character !== ""
    );

    // Is the number of players at the limit, based on game rules?
    const isAtPlayerLimit = chosenPlayerCount >= MAX_PLAYERS;

    const validateAndAdd = () => {
        // check for dupe names
        const dupe = availablePlayers.find(
            x => x.name === newPlayerName
        );

        // if dupe, don't add, rather just check
        // if (dupe) ...

        // if not a dupe, add it already checked
        // since likely in front of user ready to play
        // else (...)

        setAvailablePlayers(
            prev => [
                // handle dupes by just checking them
                ...prev.map(
                    x => x === dupe
                        ? {
                            ...x,
                            checked: x.checked || !isAtPlayerLimit
                        }
                        : x
                ),

                // now add non dupes
                ...(dupe
                    ? []
                    : [
                        {
                            name: newPlayerName,
                            checked: !isAtPlayerLimit,
                            character: "" as const,
                        }
                    ]
                ),
            ]
        );
        setNewPlayerName("");
    };

    useEffect(() => setTitle(APP_TITLE), [setTitle]);

/*
RETURN JSX
*/

    return (
        <div
            className="flex flex-col"
        >
            <p>Harry Potter Clue has 3-6 players and requires that you choose a character.</p>
            <button
                className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
                // Must have at least 3 players, max six to play
                // All selected players must have characters
                disabled={
                    chosenPlayerCount < MIN_PLAYERS ||
                    chosenPlayerCount > MAX_PLAYERS ||
                    !selectedPlayersHaveCharacters
                }
                onClick={
                    () => {
                        setCurrentPlayers(
                            availablePlayers.flatMap(player =>
                                player.checked && player.character !== ""
                                    ? [{
                                        player: player.name,
                                        character: player.character,
                                    }]
                                    : []
                            )
                        );
                        nav('/play')}}
            >
                {
                    chosenPlayerCount < 3
                    ? "Choose 3-6 Players"
                    : `Play With ${chosenPlayerCount} Player(s)`
                }
            </button>
            <div 
                className="join mt-3 lg:w-64"
            >
                <input 
                    className="input join-item w-full" 
                    placeholder="New Player Name"
                    value={
                        newPlayerName
                    } 
                    onChange={
                        (e) => setNewPlayerName(
                            e.target.value
                        )
                    }
                />
                <button 
                    className="btn join-item"
                    disabled={
                        newPlayerName.length === 0
                    }
                    onClick={
                        validateAndAdd
                    }
                    >
                        Add Player
                </button>
            </div>
            {
                availablePlayers.map(
                    x => (
                        <p 
                            key={x.name}
                            className="my-3"
                        >
                        <label 
                            className="text-lg my-5"
                        >
                            <input 
                                type="checkbox" 
                                className="checkbox checkbox-lg mr-3" 
                                checked={
                                    x.checked
                                }
                                disabled={!x.checked && isAtPlayerLimit}
                            onChange={
                                (e) => setAvailablePlayers(
                                    players => players.map(
                                        player => player.name === x.name
                                        ? {
                                            ...player,
                                            checked: e.target.checked,
                                            character: e.target.checked ? player.character : "",
                                        }
                                        : player
                                    )
                                )
                            }
                            />
                            {x.name}
                        </label>
                        <select
                            className="select ml-3"
                            disabled={!x.checked}
                            value={x.character}
                            onChange={e => {
                                const character = characters.find(
                                    option => option === e.target.value
                                ) ?? "";
                                setAvailablePlayers(players =>
                                    players.map(player =>
                                        player.name === x.name
                                            ? { ...player, character }
                                            : player
                                    )
                                );
                            }}
                        >
                            <option value="">Choose a character</option>
                                {characters
                                    // Keep characters that aren't selected by another checked player
                                    .filter(character =>
                                        !selectedPlayers.some(
                                            player =>
                                                player.name !== x.name &&
                                                player.character === character
                                        )
                                    )
                                    // Map remaining character values to input box
                                    .map(character => (
                                        <option key={character} value={character}>
                                            {character}
                                        </option>
                                    ))}
                        </select>
                    </p>
                ))
            }
        </div>
    );
};