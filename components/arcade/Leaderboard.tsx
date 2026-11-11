
"use client";

import { useCallback, useEffect, useState } from "react";

type Entry = {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
};

type LeaderboardResponse = {
  entries?: Entry[];
  error?: string;
};

const labels = [
  "DECEMBER LEGEND",
  "DETTY CHAMPION",
  "ARCADE REGULAR",
];

export function Leaderboard({
  submission,
  onPlayAgain,
  compact = false,
}: {
  submission?: { score: number } | null;
  onPlayAgain?: () => void;
  compact?: boolean;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [rank, setRank] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadScores = useCallback(async () => {
    try {
      const response = await fetch("/api/leaderboard", {
        cache: "no-store",
      });

      const data: LeaderboardResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load scores");
      }

      setEntries(data.entries || []);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load leaderboard"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadScores();
  }, [loadScores]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!submission || submitted || saving) return;

    const playerName = name.trim();

    if (playerName.length < 2 || playerName.length > 24) {
      setError("Enter a name between 2 and 24 characters.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_name: playerName,
          score: submission.score,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Score submission failed");
      }

      setSubmitted(true);
      setRank(result.rank ?? null);

      await loadScores();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save score"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className={`arcade-leaderboard ${compact ? "compact" : ""}`}
      id={compact ? undefined : "arcade-leaderboard"}
    >
      <div className="arcade-rank-head">
        <span>THE HALL OF FAME · GLOBAL RANKINGS</span>

        <h2>
          ARCADE <em>LEADERBOARD.</em>
        </h2>

        <p>
          Compete with players everywhere.
          Can you make the top 20?
        </p>
      </div>

      {submission && !compact && !submitted && (
        <form
          className="arcade-submit"
          onSubmit={submit}
        >
          <label htmlFor="arcade-name">
            YOUR DISPLAY NAME
          </label>

          <div>
            <input
              id="arcade-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              maxLength={24}
              required
              disabled={saving}
              placeholder="YOUR ARCADE NAME"
            />

            <button type="submit" disabled={saving}>
              {saving ? "SAVING..." : "SAVE SCORE →"}
            </button>
          </div>

          <small>
            NO ACCOUNT REQUIRED · SCORES ARE PUBLIC
          </small>
        </form>
      )}

      {error && (
        <p className="arcade-rank-error" role="alert">
          {error}
        </p>
      )}

      {submitted && (
        <p className="arcade-rank-success" role="status">
          SCORE SAVED!
          {rank !== null
            ? ` YOUR CURRENT RANK IS #${rank}.`
            : ""}
        </p>
      )}

      {loading ? (
        <p className="arcade-empty">
          Loading global rankings...
        </p>
      ) : (
        <ol className="arcade-ranking">
          {entries
            .slice(0, compact ? 3 : 20)
            .map((entry, index) => (
              <li
                key={entry.id}
                className={
                  index < 3
                    ? `top top-${index + 1}`
                    : ""
                }
              >
                <div className="arcade-rank-num">
                  #{index + 1}
                </div>

                <div className="arcade-rank-person">
                  <strong>{entry.player_name}</strong>

                  {index < 3 && (
                    <small>{labels[index]}</small>
                  )}
                </div>

                <b>
                  {entry.score.toLocaleString()} PTS
                </b>
              </li>
            ))}

          {!entries.length && (
            <li className="arcade-empty">
              No global scores yet.
              Be the first December legend!
            </li>
          )}
        </ol>
      )}

      {onPlayAgain && (
        <button
          className="arcade-primary"
          onClick={onPlayAgain}
        >
          PLAY AGAIN
        </button>
      )}
    </section>
  );
}
