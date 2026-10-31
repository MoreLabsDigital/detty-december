import Link from "next/link";
import { Leaderboard } from "./Leaderboard";
export function ArcadeSection() {
  return (
    <section className="arcade-promo">
      <div className="arcade-promo-copy">
        <span className="arcade-kicker">
          03 / SOMETHING EXTRA FOR THE ADVENTURE
        </span>
        <h2>
          THE DECEMBER <em>ARCADE.</em>
        </h2>
        <p className="arcade-tagline">
          Take a break from making plans. Play a little.
        </p>
        <p>
          Chase the dots, beat your personal best, and compete for your place on
          the December Silk global leaderboard.
        </p>
        <Link href="/play" className="arcade-primary">
          PLAY NOW ↗
        </Link>
      </div>
      <div className="arcade-promo-right">
        <div className="arcade-preview" aria-hidden="true">
          <span>♪ SNAKE XENZIA</span>
          <div className="arcade-preview-grid">
            <i className="snake-a" />
            <i className="snake-b" />
            <i className="snake-c" />
            <i className="snake-d" />
            <i className="snake-food">✦</i>
          </div>
          <strong>READY, PLAYER ONE?</strong>
        </div>
        <Leaderboard compact />
      </div>
    </section>
  );
}
