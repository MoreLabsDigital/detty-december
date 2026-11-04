
"use client";

import { useEvents } from "@/lib/use-events";
import { EventCard } from "@/components/EventCard";

export function FeaturedEvents() {
  const { events, loading } = useEvents();

  const featured = events
    .filter((event) => event.featured)
    .slice(0, 3);

  const display = featured.length
    ? featured
    : events.slice(0, 3);

  if (loading) {
    return <p>Loading events…</p>;
  }

  if (!display.length) {
    return <p>No published events yet.</p>;
  }

  return (
    <>
      {display.map((event) => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}
    </>
  );
}
