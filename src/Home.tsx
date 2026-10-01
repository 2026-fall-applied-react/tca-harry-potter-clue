import { useNavigate } from "react-router";
import type { LeaderboardEntry } from "./GameResults";
import { useEffect } from "react";

export const APP_TITLE = "Harry Potter Clue Companion"

type HomeProps = {
  leaderboard: LeaderboardEntry[];
  setTitle: (t: string) => void;
};

export const Home: React.FC<HomeProps> = ({ leaderboard: lb, setTitle }) => {
  const nav = useNavigate();

  //
  // react hooks
  //

    useEffect(
        () => setTitle(APP_TITLE)
    );

  //
  // calculated or derived state...
  //

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
          <h2 className="card-title ml-3 mt-3">Leaderboard</h2>
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
        </div>
      </div>
    </div>
  );
};
