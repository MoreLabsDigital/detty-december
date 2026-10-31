"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  COLS,
  ROWS,
  initialGame,
  turn,
  step,
  level,
  speed,
  opposite,
  type Direction,
  type Game,
} from "@/lib/arcade/engine";
import { Leaderboard } from "./Leaderboard";
const BEST = "december-silk-snake-best";
function beep(
  kind: "start" | "eat" | "pause" | "over" | "record",
  enabled: boolean,
) {
  if (!enabled) return;
  try {
    const w = window as Window & { webkitAudioContext?: typeof AudioContext };
    const Audio = w.AudioContext || w.webkitAudioContext;
    if (!Audio) return;
    const ctx = new Audio();
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = "square";
    o.frequency.value = {
      start: 520,
      eat: 750,
      pause: 310,
      over: 145,
      record: 990,
    }[kind];
    g.gain.setValueAtTime(0.035, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.12);
    o.onended = () => {
      void ctx.close();
    };
  } catch {}
}
function SnakeBoard({ game }: { game: Game }) {
  const cells = new Map(game.snake.map((v, i) => [v.y * COLS + v.x, i]));
  return (
    <div
      className="arcade-board"
      role="img"
      aria-label={`Snake board, score ${game.score}`}
      style={{ gridTemplateColumns: `repeat(${COLS},minmax(0,1fr))` }}
    >
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const snake = cells.get(i);
        const food =
          game.food?.x === i % COLS && game.food?.y === Math.floor(i / COLS);
        return (
          <div
            key={i}
            className={`arcade-cell ${snake === 0 ? "head" : snake !== undefined ? "body" : food ? "food" : ""}`}
          />
        );
      })}
    </div>
  );
}
export function SnakeGame() {
  const [game, setGame] = useState<Game>(() => initialGame(123));
  const gameRef = useRef(game);
  const [phase, setPhase] = useState<"initial" | "playing" | "paused" | "over">(
    "initial",
  );
  const phaseRef = useRef(phase);
  const [best, setBest] = useState(0);
  const [sound, setSound] = useState(false);
  const nextDirection = useRef<Direction | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [newRecord, setNewRecord] = useState(false);
  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(BEST)) || 0);
    } catch {}
  }, []);
  const finish = useCallback(
    (final: Game) => {
      setPhase("over");
      phaseRef.current = "over";
      beep("over", sound);
      setBest((prev) => {
        if (final.score > prev) {
          try {
            localStorage.setItem(BEST, String(final.score));
          } catch {}
          setNewRecord(true);
          beep("record", sound);
          return final.score;
        }
        return prev;
      });
    },
    [sound],
  );
  const start = useCallback(() => {
    const seed = crypto.getRandomValues(new Uint32Array(1))[0];
    const next = initialGame(seed);
    gameRef.current = next;
    setGame(next);
    nextDirection.current = null;
    setNewRecord(false);
    setPhase("playing");
    phaseRef.current = "playing";
    beep("start", sound);
  }, [sound]);
  const direction = useCallback((d: Direction) => {
    if (phaseRef.current !== "playing") return;
    const current = gameRef.current;
    const effective = nextDirection.current ?? current.direction;
    if (opposite(current.direction, d) || opposite(effective, d)) return;
    nextDirection.current = d;
  }, []);
  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") {
      phaseRef.current = "paused";
      setPhase("paused");
      beep("pause", sound);
    } else if (phaseRef.current === "paused") {
      phaseRef.current = "playing";
      setPhase("playing");
      beep("pause", sound);
    }
  }, [sound]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement
      )
        return;
      const map: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const d = map[e.key] || map[e.key.toLowerCase()];
      if (d) {
        if (phaseRef.current === "playing") {
          e.preventDefault();
          direction(d);
        }
      } else if (
        e.code === "Space" &&
        ["playing", "paused"].includes(phaseRef.current)
      ) {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [direction, togglePause]);
  useEffect(() => {
    if (phase !== "playing") return;
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const advance = () => {
      if (cancelled || phaseRef.current !== "playing") return;
      let old = gameRef.current;
      const queued = nextDirection.current;
      nextDirection.current = null;
      if (queued && !opposite(old.direction, queued)) {
        const candidate = turn(old, queued);
        old = candidate;
      }
      const next = step(old);
      gameRef.current = next;
      setGame(next);
      if (next.score > old.score) beep("eat", sound);
      if (next.status !== "playing") {
        finish(next);
        return;
      }
      timeout = setTimeout(advance, speed(next.score));
    };
    timeout = setTimeout(advance, speed(gameRef.current.score));
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [phase, sound, finish]);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t = e.changedTouches[0],
      dx = t.clientX - touch.current.x,
      dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
    direction(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up",
    );
  };
  return (
    <div className="arcade-layout">
      <div className="arcade-machine">
        <div className="arcade-machine-top">
          <span>✳ SNAKE XENZIA / LAGOS EDITION</span>
          <button onClick={() => setSound((v) => !v)} aria-pressed={sound}>
            {sound ? "♪ SOUND ON" : "♪ SOUND OFF"}
          </button>
        </div>
        <div className="arcade-stats">
          <div>
            <small>SCORE</small>
            <strong>{game.score.toString().padStart(3, "0")}</strong>
          </div>
          <div>
            <small>PERSONAL BEST</small>
            <strong>{best.toString().padStart(3, "0")}</strong>
          </div>
          <div>
            <small>LEVEL</small>
            <strong>{level(game.score)}</strong>
          </div>
          <div>
            <small>STATUS</small>
            <strong className="arcade-status">{phase.toUpperCase()}</strong>
          </div>
        </div>
        <div
          className="arcade-board-wrap"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={(e) => {
            if (phase === "playing") e.preventDefault();
          }}
        >
          <SnakeBoard game={game} />
          {phase !== "playing" && (
            <div className="arcade-overlay">
              <div className="arcade-overlay-card">
                <span>DECEMBER SILK PRESENTS</span>
                <h2>
                  {phase === "initial"
                    ? "SNAKE XENZIA"
                    : phase === "paused"
                      ? "PAUSED!"
                      : "GAME OVER"}
                </h2>
                <p>
                  {phase === "initial"
                    ? "Eat the dots. Dodge yourself. Rule December."
                    : phase === "paused"
                      ? "Your December adventure is on hold."
                      : `YOU SCORED ${game.score} POINTS!`}
                </p>
                {phase === "over" && (
                  <p>
                    {newRecord ? "✦ NEW PERSONAL BEST!" : "One more round?"}
                  </p>
                )}
                <button
                  className="arcade-primary"
                  onClick={phase === "paused" ? togglePause : start}
                >
                  {phase === "initial"
                    ? "PLAY GAME"
                    : phase === "paused"
                      ? "RESUME"
                      : "PLAY AGAIN →"}
                </button>
                {phase === "paused" && (
                  <button className="arcade-secondary" onClick={start}>
                    RESTART
                  </button>
                )}
                {phase === "over" && (
                  <a href="#arcade-leaderboard">VIEW LEADERBOARD ↓</a>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="arcade-bottom-actions">
          <button
            onClick={togglePause}
            disabled={phase !== "playing" && phase !== "paused"}
          >
            {phase === "paused" ? "▶ RESUME" : "Ⅱ PAUSE"}
          </button>
          <button onClick={start}>↻ RESTART</button>
        </div>
        <div className="arcade-dpad" aria-label="Touch direction controls">
          <button
            className="up"
            onClick={() => direction("up")}
            aria-label="Up"
          >
            ↑
          </button>
          <button
            className="left"
            onClick={() => direction("left")}
            aria-label="Left"
          >
            ←
          </button>
          <button
            className="down"
            onClick={() => direction("down")}
            aria-label="Down"
          >
            ↓
          </button>
          <button
            className="right"
            onClick={() => direction("right")}
            aria-label="Right"
          >
            →
          </button>
        </div>
        <p className="arcade-tip">
          SWIPE OR USE ARROWS / WASD • SPACE TO PAUSE • EAT ✦ TO GROW
        </p>
      </div>
      <Leaderboard
        key={phase === "over" ? `done-${game.tick}` : "ready"}
        submission={phase === "over" ? { score: game.score } : null}
        onPlayAgain={start}
      />
    </div>
  );
}
