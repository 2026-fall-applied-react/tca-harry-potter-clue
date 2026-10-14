import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { Character, GamePlayerSelection } from "./GameResults";


export const APP_TITLE = "Setup Game"

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

    const chosenPlayerCount = availablePlayers.filter(
        x => x.checked
    ).length

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
                            checked: true
                        }
                        : x
                ),

                // now add non dupes
                ...(dupe
                    ? []
                    : [
                        {
                            name: newPlayerName,
                            checked: true,
                            character: "" as const,
                        }
                    ]
                ),
            ]
        );
        setNewPlayerName("");
    };

    //
    // return the jsx
    //

    useEffect(() => setTitle(APP_TITLE), [setTitle]);

    return (
        <div
            className="flex flex-col"
        >
            <button
                className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
                disabled={
                    chosenPlayerCount < 3
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
                    ? "Choose at least 3 players"
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
                            onChange={
                                (e) => setAvailablePlayers(
                                    players => players.map(
                                        player => player.name === x.name
                                        ? {
                                            ...player,
                                            checked: e.target.checked,
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
                            {characters.map(character => (
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