
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  money,
  time,
  dayOf,
} from "@/lib/events";

import { useEvents } from "@/lib/use-events";
import { usePlans } from "@/components/PlanProvider";
import { conflicts, exportIcs } from "@/lib/plans";

import {
  Trash2,
  Download,
  CalendarDays,
  List,
  AlertTriangle,
} from "lucide-react";

export default function PlansPage() {
  const { plans, toggle, ready } = usePlans();
  const { events: allEvents, loading } = useEvents();

  const [mode, setMode] = useState<
    "list" | "calendar"
  >("list");

  const events = allEvents
    .filter((event) =>
      plans.itinerary.includes(event.id)
    )
    .sort((a, b) =>
      a.start.localeCompare(b.start)
    );

  const days = [
    ...new Set(events.map(dayOf)),
  ];

  const total = events.every(
    (event) => event.price !== null
  )
    ? events.reduce(
        (sum, event) =>
          sum + (event.price || 0),
        0
      )
    : null;

  return (
    <main className="interior">
      <div className="page-hero pink">
        <div className="section-kicker">
          YOUR PERSONAL DECEMBER JOURNAL
        </div>

        <h1>
          YOUR DECEMBER,
          <br />
          <em>ALL PLANNED.</em>
        </h1>

        <p>
          A little planning. A lot of
          unforgettable moments.
        </p>
      </div>

      <div className="content-pad">
        <div className="plans-stats">
          <div>
            <strong>
              {ready ? events.length : "—"}
            </strong>
            <span>EVENTS PLANNED</span>
          </div>

          <div>
            <strong>
              {ready ? days.length : "—"}
            </strong>
            <span>DAYS OUT</span>
          </div>

          <div>
            <strong>
              {ready
                ? total === null
                  ? "—"
                  : money(total)
                : "—"}
            </strong>

            <span>EST. TICKET SPEND*</span>
          </div>
        </div>

        <p className="fine-print">
          *Only known ticket prices are included.
          Transport, food, fees, and other costs
          are excluded.
        </p>

        <div className="plans-toolbar">
          <h2>THE GAME PLAN</h2>

          <div>
            <button
              className={
                mode === "list"
                  ? "tab active"
                  : "tab"
              }
              onClick={() =>
                setMode("list")
              }
            >
              <List size={16} />
              LIST
            </button>

            <button
              className={
                mode === "calendar"
                  ? "tab active"
                  : "tab"
              }
              onClick={() =>
                setMode("calendar")
              }
            >
              <CalendarDays size={16} />
              CALENDAR
            </button>

            <button
              className="button dark small"
              disabled={!events.length}
              onClick={() =>
                exportIcs(events)
              }
            >
              <Download size={16} />
              EXPORT .ICS
            </button>
          </div>
        </div>

        {!ready || loading ? (
          <p>
            Loading your saved plans…
          </p>
        ) : !events.length ? (
          <div className="empty-day">
            <h3>
              YOUR STORY STARTS HERE.
            </h3>

            <p>
              Nothing planned yet. Explore
              the board and add some adventures
              to your itinerary.
            </p>

            <Link
              className="button dark"
              href="/#board"
            >
              EXPLORE DECEMBER ↗
            </Link>
          </div>
        ) : mode === "list" ? (
          <div className="plan-list">
            {days.map((day) => (
              <div
                className="plan-day"
                key={day}
              >
                <div className="plan-date">
                  DEC{" "}
                  <strong>
                    {String(day).padStart(2, "0")}
                  </strong>
                </div>

                <div>
                  {events
                    .filter(
                      (event) =>
                        dayOf(event) === day
                    )
                    .map((event) => {
                      const overlaps =
                        events.some(
                          (other) =>
                            other.id !== event.id &&
                            conflicts(
                              other,
                              event
                            )
                        );

                      return (
                        <article
                          className="plan-entry"
                          key={event.id}
                        >
                          <div>
                            <span>
                              {event.category.toUpperCase()}
                              {" · "}
                              {time(event.start)}
                              {" · "}
                              {event.neighbourhood}
                            </span>

                            <h3>
                              <Link
                                href={`/events/${event.slug}`}
                              >
                                {event.title} ↗
                              </Link>
                            </h3>

                            <p>
                              {event.venue}
                              {" · "}
                              {money(event.price)}
                            </p>

                            {overlaps && (
                              <p className="conflict">
                                <AlertTriangle
                                  size={14}
                                />
                                Potential schedule
                                conflict — check
                                event times.
                              </p>
                            )}
                          </div>

                          <button
                            title="Remove from plans"
                            aria-label={`Remove ${event.title} from plans`}
                            onClick={() =>
                              toggle(
                                "itinerary",
                                event.id
                              )
                            }
                          >
                            <Trash2 size={19} />
                          </button>
                        </article>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="plan-calendar">
            {Array.from(
              { length: 31 },
              (_, index) => (
                <div
                  key={index}
                  className={
                    days.includes(index + 1)
                      ? "has-plan"
                      : ""
                  }
                >
                  <strong>
                    {index + 1}
                  </strong>

                  {events
                    .filter(
                      (event) =>
                        dayOf(event) ===
                        index + 1
                    )
                    .map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.slug}`}
                      >
                        {event.title}
                      </Link>
                    ))}
                </div>
              )
            )}
          </div>
        )}

        <p className="fine-print">
          Your plans are saved on this device
          only. ICS export downloads a calendar
          file; it does not automatically book
          tickets or create reminders.
        </p>
      </div>
    </main>
  );
}
