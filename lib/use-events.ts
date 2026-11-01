"use client";
import { useEffect, useState } from "react";
import { EVENTS, type Event } from "@/lib/events";
export function useEvents() {
  const [events, setEvents] = useState<Event[]>(EVENTS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetch("/api/events", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Event feed failed");
        return r.json();
      })
      .then((json: { events?: Event[] }) => {
        if (active && Array.isArray(json.events)) setEvents(json.events);
      })
      .catch((err) => console.warn(err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return { events, loading };
}
