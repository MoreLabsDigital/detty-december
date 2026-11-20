
"use client";

import { useEvents } from "@/lib/use-events";
import { EventCard } from "@/components/EventCard";

export function FeaturedEvents() {
  const { events, loading } = useEvents();

  // Only show events selected in the admin
  // and already published.
  const featured = events
    .filter((event) => event.featured === true)
    .slice(0, 3);

  if (loading) {
    return <p>Loading featured events…</p>;
  }

  if (!featured.length) {
    return <p>No featured events yet.</p>;
  }

  return (
    <>
      {featured.map((event) => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}
    </>
  );
}
