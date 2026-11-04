
"use client";

import {
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  ArrowLeft,
  ArrowRight,
  X,
  CalendarDays,
} from "lucide-react";

import { dayOf } from "@/lib/events";
import { useEvents } from "@/lib/use-events";
import { EventCard } from "./EventCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const coords = Array.from(
  { length: 31 },
  (_, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;

    return {
      x: 10 + (row % 2 === 0 ? col : 4 - col) * 20,
      y: 7 + row * 14.25,
    };
  }
);

const route = coords
  .map(
    (p, i) =>
      `${i ? "L" : "M"} ${p.x * 10} ${p.y * 10}`
  )
  .join(" ");

export function Board() {
  const { events: allEvents, loading } = useEvents();

  const [selected, setSelected] = useState<
    number | null
  >(null);

  const [listing, setListing] = useState(false);

  const wrap = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const decemberEvents = useMemo(
    () =>
      allEvents.filter((event) =>
        event.start.startsWith("2026-12-")
      ),
    [allEvents]
  );

  const countsByDay = useMemo(() => {
    const map = new Map<number, number>();

    for (const event of decemberEvents) {
      const day = dayOf(event);

      map.set(day, (map.get(day) ?? 0) + 1);
    }

    return map;
  }, [decemberEvents]);

  const featuredByDay = useMemo(() => {
    const set = new Set<number>();

    for (const event of decemberEvents) {
      if (event.featured) {
        set.add(dayOf(event));
      }
    }

    return set;
  }, [decemberEvents]);

  useEffect(() => {
    if (listing) return;

    if (typeof window === "undefined") return;

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(".board-heading", {
        scrollTrigger: {
          trigger: ".board-heading",
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
      });

      gsap.from(".board-route", {
        scrollTrigger: {
          trigger: ".board-container",
          start: "top 75%",
        },
        strokeDashoffset: 2300,
        strokeDasharray: 2300,
        duration: 2,
        ease: "power2.out",
      });
    }, wrap);

    return () => ctx.revert();
  }, [listing]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener("keydown", close);

    return () =>
      window.removeEventListener("keydown", close);
  }, []);

  const events =
    selected !== null
      ? decemberEvents.filter(
          (event) => dayOf(event) === selected
        )
      : [];

  function change(delta: number) {
    setSelected((current) => {
      const day = current ?? 1;

      return Math.min(
        31,
        Math.max(1, day + delta)
      );
    });
  }

  return (
    <section
      id="board"
      ref={wrap}
      className="board-section"
    >
      <div className="section-kicker">
        02 / YOUR MONTH STARTS HERE
      </div>

      <div className="board-heading">
        <div>
          <span className="scribble">
            THE MAIN EVENT
          </span>

          <h2>
            31 DAYS.
            <br />
            <em>ONE WILD</em> RIDE.
          </h2>
        </div>

        <p>
          A December adventure, one square at a time.
          Pick a day. Find your people. Make it a
          story.
        </p>
      </div>

      <div className="board-controls">
        <span>
          <i className="legend-dot" /> DAYS WITH EVENTS{" "}
          <i className="legend-star">★</i> FEATURED
        </span>

        <button
          onClick={() => setListing((value) => !value)}
        >
          <CalendarDays size={17} />

          {listing
            ? "SHOW THE BOARD"
            : "LIST VIEW"}
        </button>
      </div>

      {listing ? (
        <div className="date-list">
          {Array.from(
            { length: 31 },
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setSelected(index + 1)
                }
                className={
                  selected === index + 1
                    ? "selected"
                    : ""
                }
              >
                DEC {index + 1}

                <span>
                  {countsByDay.get(index + 1) ?? 0}{" "}
                  events
                </span>
              </button>
            )
          )}
        </div>
      ) : (
        <div className="board-container">
          <svg
            className="board-svg"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={route}
              stroke="#101010"
              strokeWidth="51"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity=".12"
            />

            <path
              className="board-route"
              d={route}
              stroke="#F36DBB"
              strokeWidth="32"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5 58"
            />

            <path
              d="M 160 200 L 340 70 M 660 640 L 880 500 M 280 840 L 490 700"
              stroke="#4355E8"
              strokeWidth="15"
              strokeDasharray="10 11"
              strokeLinecap="round"
            />

            <g
              fill="none"
              stroke="#101010"
              strokeWidth="5"
            >
              <circle
                cx="850"
                cy="70"
                r="36"
              />

              <circle
                cx="850"
                cy="70"
                r="20"
              />

              <path d="M 820 70h60M850 35v70" />
            </g>

            <text
              x="72"
              y="400"
              fontSize="80"
              fill="#11B8C4"
              transform="rotate(-17 72 400)"
            >
              ✳
            </text>

            <text
              x="750"
              y="880"
              fontSize="95"
              fill="#FF773D"
            >
              ✴
            </text>
          </svg>

          {coords.map((position, index) => {
            const day = index + 1;

            const count =
              countsByDay.get(day) ?? 0;

            const featured =
              featuredByDay.has(day);

            return (
              <button
                key={day}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                className={`date-tile ${
                  selected === day
                    ? "selected"
                    : ""
                } ${
                  count ? "has-events" : ""
                }`}
                onClick={() =>
                  setSelected(day)
                }
                aria-label={`December ${day}, 2026: ${count} events`}
                aria-pressed={
                  selected === day
                }
              >
                <span>DEC</span>

                <strong>
                  {String(day).padStart(2, "0")}
                </strong>

                {featured ? (
                  <b className="date-featured">
                    ★
                  </b>
                ) : count > 0 ? (
                  <i className="date-event-dot" />
                ) : null}
              </button>
            );
          })}

          <div className="board-decoration deco-one">
            THE
            <br />
            GOOD
            <br />
            STUFF
          </div>

          <div className="board-decoration deco-two">
            NO
            <br />
            BORING
            <br />
            DAYS!
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key="backdrop"
            className="panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setSelected(null)
            }
          >
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={`Events for December ${selected}`}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="event-panel"
              initial={{
                x: 120,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: 120,
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              <div className="panel-head">
                <span>
                  THE DECEMBER DIARIES / 2026
                </span>

                <button
                  aria-label="Close event panel"
                  onClick={() =>
                    setSelected(null)
                  }
                >
                  <X />
                </button>
              </div>

              <div className="panel-title">
                <span>DECEMBER</span>

                <strong>
                  {String(selected).padStart(
                    2,
                    "0"
                  )}
                </strong>
              </div>

              <div className="panel-nav">
                <button
                  disabled={selected === 1}
                  onClick={() =>
                    change(-1)
                  }
                >
                  <ArrowLeft size={16} />
                  PREV
                </button>

                <p>
                  {events.length} EVENT
                  {events.length === 1
                    ? ""
                    : "S"}
                </p>

                <button
                  disabled={selected === 31}
                  onClick={() =>
                    change(1)
                  }
                >
                  NEXT
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="panel-scroll">
                {loading ? (
                  <div className="empty-day">
                    <p>Loading events…</p>
                  </div>
                ) : events.length ? (
                  events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      compact
                    />
                  ))
                ) : (
                  <div className="empty-day">
                    <h3>
                      IT&apos;S A BLANK CANVAS.
                    </h3>

                    <p>
                      No events on this date.
                      Try another square or
                      explore the whole month.
                    </p>

                    <button
                      className="button dark"
                      onClick={() => {
                        setSelected(null);
                        router.push("/explore");
                      }}
                    >
                      EXPLORE ALL EVENTS
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
