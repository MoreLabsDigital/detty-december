import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Board } from "@/components/Board";
import { EVENTS } from "@/lib/events";
import { FaStarOfLife } from "react-icons/fa6";
import { EventCard } from "@/components/EventCard";
import { ArcadeSection } from "@/components/arcade/ArcadeSection";


const ITEMS = [
  "GOOD MUSIC",
  "GOOD PEOPLE",
  "GOOD TIMES",
  "LAGOS IN DECEMBER",
];

const Sequence = () => (
  <div className="marquee__group" aria-hidden="true">
    {ITEMS.map((item, i) => (
      <span key={i} className="marquee__item">
        {item}
        <span className="marquee__icon" aria-hidden="true">
          <FaStarOfLife />
        </span>
      </span>
    ))}
  </div>
);

export default function Home() {
  return (
    <main>
      <Hero />
        <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        <Sequence />
        <Sequence />
      </div>
    </div>
      <Board />

<ArcadeSection />

<section className="discover">
        <div className="section-kicker">
          03 / FIND YOUR KIND OF DETTY 
        </div>
        <div className="discover-intro">
          <h2>
            THE CITY
            <br />
            <em>NEVER</em> SLEEPS
          </h2>
          <p>
            Every day has its own story. Pick your scene, find your crowd, and
            let December surprise you.
          </p>
        </div>
        <div className="feature-grid">
          {EVENTS.filter((e) => e.featured)
            .slice(0, 3)
            .map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
        </div>
        <div className="discover-footer">
          <Link className="button dark" href="/explore">
            EXPLORE ALL EVENTS 
          </Link>
          <span>MORE PLANS. MORE MEMORIES. MORE DETTY.</span>
        </div>
      </section>
      <section className="split-banner">
        <span>
          YOUR DECEMBER.
          <br />
          YOUR RULES.
        </span>
        <div>
          <h2>
            LESS FOMO.
            <br />
            <i>MORE</i> LIVING.
          </h2>
          <Link href="/plans">
            MAKE YOUR PLAN 
          </Link>
        </div>
        <div className="banner-spark">✷</div>
      </section>
    </main>
  );
}
