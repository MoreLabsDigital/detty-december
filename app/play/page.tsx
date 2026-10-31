import "./arcade.css";
import "@/components/arcade/arcade-promo.css";
import type { Metadata } from "next";
import { SnakeGame } from "@/components/arcade/SnakeGame";
export const metadata: Metadata = {
  title: "The December Arcade — Snake Xenzia",
  description:
    "Play Snake Xenzia and compete on the December Silk global leaderboard.",
};
export default function PlayPage() {
  return (
    <main className="arcade-page">
      <div className="arcade-page-head">
        <span>THE DECEMBER ARCADE / 001</span>
        <h1>
          THE GAME <em>IS ON.</em>
        </h1>
        <p>Take a break from making plans. Play a little.</p>
      </div>
      <SnakeGame />
    </main>
  );
}
