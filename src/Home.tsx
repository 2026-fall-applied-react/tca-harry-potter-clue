import { useNavigate } from "react-router";
import type { DurationByPlayerCountEntry, GeneralFacts, LeaderboardEntry, PlayerStreak } from "./GameResults";
import { MIN_STREAK_LENGTH } from "./GameResults";
import { useEffect, useRef, useState } from "react";

const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className ?? "w-5 h-5"}
    aria-hidden="true"
  >
    {/* wand body, tapered, with a handle band */}
    <path d="M3.2 20.1 13.6 9.7l1.7 1.7L4.9 21.8a1.2 1.2 0 0 1-1.7-1.7Z" />
    <path d="m12.8 8.9 1.4-1.4 2.3 2.3-1.4 1.4Z" opacity="0.55" />
    {/* four-point sparkle at the tip */}
    <path d="M18.5 1.5c.4 2.2 1.1 2.9 3.3 3.3-2.2.4-2.9 1.1-3.3 3.3-.4-2.2-1.1-2.9-3.3-3.3 2.2-.4 2.9-1.1 3.3-3.3Z" />
    <circle cx="21.5" cy="10" r="1" />
    <circle cx="11" cy="3.5" r="1" />
  </svg>
);

export const APP_TITLE = "Harry Potter Clue Companion"

type HomeProps = {
  leaderboard: LeaderboardEntry[];
  setTitle: (t: string) => void;
  generalFacts: GeneralFacts;
  durationsByPlayerCount: DurationByPlayerCountEntry[];
  winStreaks: PlayerStreak[];
};

export const Home: React.FC<HomeProps> = ({ 
  leaderboard: lb, 
  setTitle,
  generalFacts,
  durationsByPlayerCount,
  winStreaks,
 }) => {
  const nav = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  //
  // react hooks
  //

    useEffect(
        () => setTitle(APP_TITLE)
    );

  //
  // calculated or derived state...
  //

  const selectedStreak = winStreaks.find((x) => x.player === selectedPlayer);

  const showDetails = (player: string) => {
    setSelectedPlayer(player);
    dialogRef.current?.showModal();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString();

  const winsTable = (
    title: string,
    wins: PlayerStreak["currentWins"],
    brokenBy?: PlayerStreak["longestBrokenBy"],
  ) => (
    <div className="mt-4">
      <h4 className="font-semibold">{title} ({wins.length} wins)</h4>
      <table className="table table-zebra table-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Character</th>
          </tr>
        </thead>
        <tbody>
          {wins.map((w, i) => (
            <tr key={w.date + i}>
              <td>{i + 1}</td>
              <td>{formatDate(w.date)}</td>
              <td>{w.character}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {brokenBy && (
        <p className="mt-2 text-sm">
          Streak broken by <strong>{brokenBy.winner}</strong> on {formatDate(brokenBy.date)}.
        </p>
      )}
    </div>
  );

  //
  // return jsx
  //

  return (
    <div>
      <button className="btn btn-soft btn-lg w-full lg:w-64" onClick={() => nav("/setup")}>
        Set up a Game
      </button>
            <div className="card w-full bg-base-100 card-md shadow-lg my-5">
        <div className="card-body p-0">
          <h2 className="card-title ml-3 mt-3">
            General
          </h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <tbody>
                    <tr>
                      <td>Last played</td>
                      <th>{generalFacts.lastPlayed}</th>
                    </tr>
                    <tr>
                      <td>Total Games</td>
                      <th>{generalFacts.totalGames}</th>
                    </tr>
                    <tr>
                      <td>Shortest Game</td>
                      <th>{generalFacts.shortestGame}</th>
                    </tr>
                    <tr>
                      <td>Longest Game</td>
                      <th>{generalFacts.longestGame}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
        </div>
      </div>
      <div className="card w-full bg-base-100 card-md shadow-lg my-5">
        <div className="card-body p-0">
          <h2 className="card-title ml-3 mt-3">
            Leaderboard
          </h2>
          {
            lb.length === 0
              ? (
                  <p className="ml-3 mb-5">
                    Setup & play a game to see the leaderboard...
                  </p>
              )
              : (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Wins</th>
                          <th>Losses</th>
                          <th>Avg</th>
                          <th>Player</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                            lb.map(
                                x => (
                                    <tr
                                        key={x.player}
                                    >
                                    <td>{x.wins}</td>
                                    <td>{x.losses}</td>
                                    <td>{x.avg.toFixed(3)}</td>
                                    <td>{x.player}</td>
                                    </tr>
                                )
                            )
                        }
                      </tbody>
                    </table>
                  </div>
              )
          }
        </div>
      </div>
      <div className="card w-full bg-base-100 card-md shadow-lg my-5">
        <div className="card-body p-0">
          <h2 className="card-title ml-3 mt-3">
            Win Streaks
          </h2>
          <p className="ml-3 text-sm opacity-70">
            {MIN_STREAK_LENGTH}+ wins in a row across games a player took part in.
          </p>
          {
            winStreaks.length === 0
              ? (
                  <p className="ml-3 mb-5">
                    Play a game to see win streaks...
                  </p>
              )
              : (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Player</th>
                          <th>Current</th>
                          <th>Longest</th>
                          <th><span className="sr-only">Details</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          winStreaks.map(
                            x => (
                              <tr key={x.player}>
                                <td>{x.player}</td>
                                <td>
                                  {
                                    x.current > 0
                                      ? (
                                          <span className="inline-flex items-center gap-1 font-semibold">
                                            {x.current}
                                            <WandIcon />
                                          </span>
                                        )
                                      : "—"
                                  }
                                </td>
                                <td>{x.longest > 0 ? x.longest : "—"}</td>
                                <td>
                                  {
                                    x.longest > 0 && (
                                      <button
                                        className="btn btn-xs btn-soft"
                                        onClick={() => showDetails(x.player)}
                                      >
                                        Details
                                      </button>
                                    )
                                  }
                                </td>
                              </tr>
                            )
                          )
                        }
                      </tbody>
                    </table>
                  </div>
              )
          }
        </div>
      </div>
      <dialog ref={dialogRef} className="modal" onClose={() => setSelectedPlayer(null)}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            {selectedStreak?.player} — Win Streaks
          </h3>
          {
            selectedStreak && (
              <>
                {selectedStreak.current > 0 && winsTable("Current streak", selectedStreak.currentWins)}
                {winsTable("Longest streak", selectedStreak.longestWins, selectedStreak.longestBrokenBy)}
              </>
            )
          }
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="card w-full bg-base-100 card-md shadow-lg my-5">
        <div className="card-body p-0">
          <h2 className="card-title ml-3 mt-3">
            Game Duration by Player Count
          </h2>
          {
            durationsByPlayerCount.length === 0
              ? (
                  <p className="ml-3 mb-5">
                    Play a game to see average durations...
                  </p>
              )
              : (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Players</th>
                          <th>Games</th>
                          <th>Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                            durationsByPlayerCount.map(
                                x => (
                                    <tr
                                        key={x.players}
                                    >
                                    <td>{x.players}</td>
                                    <td>{x.games}</td>
                                    <td>{x.avg}</td>
                                    </tr>
                                )
                            )
                        }
                      </tbody>
                    </table>
                  </div>
              )
          }
        </div>
      </div>
    </div>
  );
};
