//
// type definitions/type aliases
//

// Allowable Harry Potter Characters
export type Character =
    | "Harry Potter"
    | "Ron Weasley"
    | "Hermione Granger"
    | "Ginny Weasley"
    | "Luna Lovegood"
    | "Neville Longbottom"
    ;

// Each player instance - including what character they choose to start
// And, what number of curses they have at the end of the game
export type GamePlayer = {
    player: string;
    character: Character;
    curses: number;
}

// Results from the game
export type GameResult = {
    winner: string;
    players: GamePlayer[];
};

// Each listing on the leaderboard
export type LeaderboardEntry = {
    wins: number;
    losses: number;
    avg: number; // we'll need to make a string for rounding and display
    player: string;
}

//
// public functions
//

export const getLeaderboard = (
    games: GameResult[],
): LeaderboardEntry[] => getPreviousPlayers(
    games
    ).map(
        x => ({
            ...getLeaderboardEntry(
                games,
                x
            )
        })
    )
    .sort(
        (a, b) => (
            a.avg === b.avg
            ? a.wins === 0 && b.wins === 0
                ? (a.wins + a.losses) - (b.wins + b.losses) // 0 wins, more losses, lower on the leaderboard
                : (b.wins + b.losses) - (a.wins + a.losses) // more games, with a win, and tied avg, means higher on the leaderboard
            : b.avg - a.avg
        )
    )
;

//
// helper functions
//

const getLeaderboardEntry = (
    games: GameResult[],
    player: string,
): LeaderboardEntry => {

    const numberOfPlayerGames = games.filter(
        x => x.players.some(
            // Players is an array of GamePlayer objects, so adjusting coding demo to select the player only
            y => y.player === player
        )
    ).length;

    const numberOfPlayerWins = games.filter(
        x => x.winner === player
    ).length;

    return {
        wins: numberOfPlayerWins,
        losses: numberOfPlayerGames - numberOfPlayerWins,
        avg: numberOfPlayerGames >0
        ? numberOfPlayerWins/numberOfPlayerGames
        : 0,
        player: player
    };
};

// get unique players who have been part of any game and sort them alphabetically
const getPreviousPlayers = (
    games: GameResult[],
): string[] => games
   // just the players as a string array
   .flatMap(
        x => x.players
   )
   // extract the player property
   .map(
        x => x.player,
   )
   // unique players
   .filter(
        (x, i, a) => i == a.findIndex(
            y => y === x
        )
   )
   // sorted alphabetically
   .sort(
    (a, b) => a.localeCompare(b)
   )

;