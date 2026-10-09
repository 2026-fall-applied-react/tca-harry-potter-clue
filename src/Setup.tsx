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

    const [availablePlayers, setAvailablePlayers] = useState<AvailablePlayer[]>(
        previousPlayers.map(name => ({
            name,
            checked: false,
            character: "",
        }))
    );

    const nav = useNavigate();

    //
    // react hooks
    //

    useEffect(() => setTitle(APP_TITLE), [setTitle]);

    return (
        <div>
            <button
                className="btn btn-soft btn-lg mt-3 w-full lg:w-64"
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
                Play The Game
            </button>
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