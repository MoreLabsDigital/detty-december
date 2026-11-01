"use client";
import { useEffect, useState } from "react";
const STORAGE_KEY = "december-silk-local-scores";
type Entry = {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
};
const labels = ["DECEMBER LEGEND", "DETTY CHAMPION", "ARCADE REGULAR"];
function readScores(): Entry[] {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data)
      ? data
          .filter(
            (v: Entry) =>
              typeof v.score === "number" && typeof v.player_name === "string",
          )
          .sort((a: Entry, b: Entry) => b.score - a.score)
          .slice(0, 20)
      : [];
  } catch {
    return [];
  }
}
export function Leaderboard({
  submission,
  onPlayAgain,
  compact = false,
}: {
  submission?: { score: number } | null;
  onPlayAgain?: () => void;
  compact?: boolean;
}) {
  const [entries, setEntries] = useState<Entry[]>([]),
    [name, setName] = useState(""),
    [rank, setRank] = useState<number | null>(null),
    [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    setEntries(readScores());
  }, []);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!submission || submitted) return;
    const entry: Entry = {
      id: crypto.randomUUID(),
      player_name: name.trim().slice(0, 24),
      score: submission.score,
      created_at: new Date().toISOString(),
    };
    if (entry.player_name.length < 2) return;
    const next = [...readScores(), entry].sort((a, b) => b.score - a.score);
    const position = next.findIndex((v) => v.id === entry.id) + 1;
    const top = next.slice(0, 20);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(top));
    } catch {}
    setEntries(top);
    setRank(position);
    setSubmitted(true);
  }
  return (
    <section
      className={`arcade-leaderboard ${compact ? "compact" : ""}`}
      id={compact ? undefined : "arcade-leaderboard"}
    >
      <div className="arcade-rank-head">
        <span> THE HALL OF FAME · THIS DEVICE</span>
        <h2>
          ARCADE <em>LEADERBOARD.</em>
        </h2>
        <p>Beat your best. Your scores are saved in this browser.</p>
      </div>
      {submission && !compact && !submitted && (
        <form className="arcade-submit" onSubmit={submit}>
          <label htmlFor="arcade-name">YOUR DISPLAY NAME</label>
          <div>
            <input
              id="arcade-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              maxLength={24}
              required
              placeholder="YOUR ARCADE NAME"
            />
            <button type="submit">SAVE SCORE →</button>
          </div>
          <small>NO ACCOUNT REQUIRED • SAVED LOCALLY ON THIS DEVICE</small>
        </form>
      )}
      {submitted && (
        <p className="arcade-rank-success" role="status">
          SCORE SAVED! YOUR LOCAL RANK IS #{rank}.
        </p>
      )}
      <ol className="arcade-ranking">
        {entries.slice(0, compact ? 3 : 20).map((entry, index) => (
          <li
            key={entry.id}
            className={index < 3 ? `top top-${index + 1}` : ""}
          >
            <div className="arcade-rank-num">#{index + 1}</div>
            <div className="arcade-rank-person">
              <strong>{entry.player_name}</strong>
              {index < 3 && <small>{labels[index]}</small>}
            </div>
            <b>{entry.score.toLocaleString()} PTS</b>
          </li>
        ))}
        {!entries.length && (
          <li className="arcade-empty">
            No local scores yet. Be the first December legend!
          </li>
        )}
      </ol>
      {onPlayAgain && (
        <button className="arcade-primary" onClick={onPlayAgain}>
          PLAY AGAIN 
        </button>
      )}
    </section>
  );
}
