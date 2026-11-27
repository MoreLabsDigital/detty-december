
"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { filterEvents } from "@/lib/events";
import { useEvents } from "@/lib/use-events";

import { EventCard } from "@/components/EventCard";
import {
  Filters,
  defaultFilters,
} from "@/components/Filters";

function ExploreContent() {
  const params = useSearchParams();

  const { events, loading } = useEvents();

  const [filters, setFilters] = useState({
    ...defaultFilters,
    category: params.get("category") || "",
  });

  const result = useMemo(
    () => filterEvents(events, filters),
    [events, filters]
  );

  return (
    <main className="interior">
      <div className="page-hero blue">
        <span className="section-kicker">
          THE DECEMBER DIRECTORY / 2026
        </span>

        <h1>
          FIND YOUR
          <br />
          <em>KIND OF</em> DETTY.
        </h1>

        <p>
          From daytime soft life to nights you won&apos;t
          forget. Your next plan starts here.
        </p>
      </div>

      <div className="content-pad">
        <Filters
          filters={filters}
          onChange={setFilters}
        />

        <div className="results-heading">
          <h2>WHAT&apos;S HAPPENING</h2>
          <span>{result.length} RESULTS</span>
        </div>

        {loading ? (
          <div className="empty-day">
            <p>Loading events…</p>
          </div>
        ) : result.length ? (
          <div className="listing-grid">
            {result.map((event) => (
              <EventCard
                event={event}
                key={event.id}
              />
            ))}
          </div>
        ) : (
          <div className="empty-day">
            <h3>NO MATCHES THIS TIME.</h3>
            <p>
              Change your filters to discover more
              possibilities.
            </p>

            <button
              className="button dark"
              onClick={() =>
                setFilters({ ...defaultFilters })
              }
            >
              CLEAR FILTERS
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Explore() {
  return (
    <Suspense
      fallback={
        <main className="interior">
          Loading events…
        </main>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
