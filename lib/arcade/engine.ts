export const COLS = 18;
export const ROWS = 20;
export const POINTS = 10;
export type Vec = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";
export type Change = { tick: number; direction: Direction };
export type Game = {
  snake: Vec[];
  food: Vec | null;
  direction: Direction;
  pending: Direction;
  score: number;
  tick: number;
  seed: number;
  status: "playing" | "over" | "won";
};
const movements: Record<Direction, Vec> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
export const opposite = (a: Direction, b: Direction) =>
  movements[a].x + movements[b].x === 0 &&
  movements[a].y + movements[b].y === 0;
export function randomNext(seed: number) {
  return (Math.imul(seed, 1664525) + 1013904223) >>> 0;
}
function spawn(snake: Vec[], seed: number): { food: Vec | null; seed: number } {
  const occupied = new Set(snake.map((v) => v.y * COLS + v.x));
  const free: number[] = [];
  for (let i = 0; i < COLS * ROWS; i++) if (!occupied.has(i)) free.push(i);
  if (!free.length) return { food: null, seed };
  const next = randomNext(seed);
  const pos = free[next % free.length];
  return { food: { x: pos % COLS, y: Math.floor(pos / COLS) }, seed: next };
}
export function initialGame(seed: number): Game {
  const snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  const next = spawn(snake, seed);
  return {
    snake,
    food: next.food,
    direction: "right",
    pending: "right",
    score: 0,
    tick: 0,
    seed: next.seed,
    status: "playing",
  };
}
export function turn(game: Game, direction: Direction): Game {
  if (opposite(game.direction, direction)) return game;
  return { ...game, pending: direction };
}
export function step(game: Game): Game {
  if (game.status !== "playing") return game;
  const d = opposite(game.direction, game.pending)
    ? game.direction
    : game.pending;
  const v = movements[d],
    head = { x: game.snake[0].x + v.x, y: game.snake[0].y + v.y };
  const eating =
    !!game.food && head.x === game.food.x && head.y === game.food.y;
  const body = eating ? game.snake : game.snake.slice(0, -1);
  const hit =
    head.x < 0 ||
    head.y < 0 ||
    head.x >= COLS ||
    head.y >= ROWS ||
    body.some((p) => p.x === head.x && p.y === head.y);
  if (hit)
    return {
      ...game,
      tick: game.tick + 1,
      direction: d,
      pending: d,
      status: "over",
    };
  const snake = [head, ...game.snake.slice(0, eating ? undefined : -1)];
  const next = eating
    ? spawn(snake, game.seed)
    : { food: game.food, seed: game.seed };
  return {
    ...game,
    snake,
    food: next.food,
    seed: next.seed,
    score: game.score + (eating ? POINTS : 0),
    tick: game.tick + 1,
    direction: d,
    pending: d,
    status: next.food ? "playing" : "won",
  };
}
export function level(score: number) {
  return 1 + Math.floor(score / 50);
}
export function speed(score: number) {
  return Math.max(85, 190 - (level(score) - 1) * 13);
}
// Replays direction changes on each simulation tick. Both browser and server use this engine.
export function replay(seed: number, changes: Change[], ticks: number): Game {
  let game = initialGame(seed);
  let ci = 0;
  for (let t = 1; t <= ticks; t++) {
    while (ci < changes.length && changes[ci].tick === t) {
      game = turn(game, changes[ci].direction);
      ci++;
    }
    game = step(game);
    if (game.status !== "playing") break;
  }
  return game;
}
