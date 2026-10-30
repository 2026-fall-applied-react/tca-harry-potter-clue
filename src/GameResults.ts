import { durationFormatter } from "human-readable";

//* TYPE DEFINITIONS AND ALIASES *//

// Allowable Harry Potter Characters
export type Character =
  | "Harry Potter"
  | "Ron Weasley"
  | "Hermione Granger"
  | "Ginny Weasley"
  | "Luna Lovegood"
  | "Neville Longbottom";

// Suspects, or the "who"
export type Suspect =
  | "Draco Malfoy"
  | "Bellatrix Lestrange"
  | "Lucius Malfoy"
  | "Peter Pettigrew"
  | "Dolores Umbridge"
  | "Crabbe & Goyle";

// Where it could have happened
export type Room =
    | "Great Hall"
    | "Hospital Wing"
    | "Room of Requirement"
    | "Potions Classroom"
    | "Trophy Room"
    | "Divination Classroom"
    | "Owlery"
    | "Library"
    | "Defense Against the Dark Arts";

// What item the suspect used to commit the crime
export type Item = 
    | "Impedimenta"
    | "Petrificus Totalus"
    | "Mandrake"
    | "Sleeping Draught"
    | "Vanishing Cabinet"
    | "Portkey";  

// Together, the who, what and where form the mystery to be solved
export type Mystery = {
  who: Suspect[];
  what: Item[];
  where: Room[];
};

// Each player instance - including what character they choose to start
export type GamePlayer = {
  player: string;
  character: Character;
};

// Results from the game, pulls in array of GamePlayer objects for players
export type GameResult = {
  winner: string;
  players: GamePlayer[];
  mystery: Mystery[];
  start: string;
  end: string;
};

// Each listing on the leaderboard
export type LeaderboardEntry = {
  wins: number;
  losses: number;
  avg: number; // we'll need to make a string for rounding and display
  player: string;
};

// Types and fallback for general facts like last game played, total number of games,
// longest and shortest game
export type GeneralFacts = {
  lastPlayed: string;
  totalGames: number;
  shortestGame: string;
  longestGame: string;
};

//* DURATION FORMATTERS *//
const formatGameDuration = durationFormatter<string>();

const formatLastPlayed = durationFormatter<string>({
  allowMultiples: ["y", "mo", "d"],
});

export const getGeneralFacts = (games: GameResult[]): GeneralFacts => {
  // bail early if no game results
  if (games.length === 0) {
    return {
      lastPlayed: "N/A",
      totalGames: 0,
      shortestGame: "N/A",
      longestGame: "N/A",
    };
  }

  // Calculations for General facts relating to game duration and recent game
  const nowForCalcs = Date.now();

  const gamesLastPlayedInMS = games.map((x) => nowForCalcs - Date.parse(x.end));

  const mostRecentGameInMs = Math.min(...gamesLastPlayedInMS);

  const gameDurationsInMS = games.map(
    (x) => Date.parse(x.end) - Date.parse(x.start),
  );

  return {
    lastPlayed: `${formatLastPlayed(mostRecentGameInMs)} days ago`,
    totalGames: games.length,
    shortestGame: formatGameDuration(Math.min(...gameDurationsInMS)),
    longestGame: formatGameDuration(Math.max(...gameDurationsInMS)),
  };
};

// Average game duration for each player count
export type DurationByPlayerCountEntry = {
  players: number;
  games: number;
  avg: string;
};

export const getDurationsByPlayerCount = (
  games: GameResult[],
): DurationByPlayerCountEntry[] =>
  games
    // unique player counts
    .map((x) => x.players.length)
    .filter((x, i, a) => a.indexOf(x) === i)
    // in player count order
    .sort((a, b) => a - b)
    .map((count) => {
      const durationsInMS = games
        .filter((x) => x.players.length === count)
        .map((x) => Date.parse(x.end) - Date.parse(x.start));

      return {
        players: count,
        games: durationsInMS.length,
        avg: formatGameDuration(
          durationsInMS.reduce((a, b) => a + b, 0) / durationsInMS.length,
        ),
      };
    });

//* PUBLIC FUNCTIONS *//

// Build leaderboard and sort leaders based on game results
export const getLeaderboard = (games: GameResult[]): LeaderboardEntry[] =>
  getPreviousPlayers(games)
    .map((x) => ({
      ...getLeaderboardEntry(games, x),
    }))
    .sort((a, b) =>
      a.avg === b.avg
        ? a.wins === 0 && b.wins === 0
          ? a.wins + a.losses - (b.wins + b.losses) // 0 wins, more losses, lower on the leaderboard
          : b.wins + b.losses - (a.wins + a.losses) // more games, with a win, and tied avg, means higher on the leaderboard
        : b.avg - a.avg,
    );

// Get unique players who have been part of any game and sort them alphabetically
export const getPreviousPlayers = (games: GameResult[]): string[] =>
  games
    // just the players as a string array
    .flatMap((x) => x.players)
    // extract the player property
    .map((x) => x.player)
    // unique players
    .filter((x, i, a) => i === a.findIndex((y) => y === x))
    // sorted alphabetically
    .sort((a, b) => a.localeCompare(b));

//* HELPER FUNCTIONS *//

// Get each "row" in the leaderboard for building it in getLeaderboard
const getLeaderboardEntry = (
  games: GameResult[],
  player: string,
): LeaderboardEntry => {
  const numberOfPlayerGames = games.filter((x) =>
    x.players.some(
      // Players is an array of GamePlayer objects, so grabbing player name only
      (y) => y.player === player,
    ),
  ).length;

  const numberOfPlayerWins = games.filter((x) => x.winner === player).length;

  return {
    wins: numberOfPlayerWins,
    losses: numberOfPlayerGames - numberOfPlayerWins,
    avg: numberOfPlayerGames > 0 ? numberOfPlayerWins / numberOfPlayerGames : 0,
    player: player,
  };
};
