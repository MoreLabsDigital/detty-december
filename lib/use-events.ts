
"use client";

import { useEffect, useState } from "react";
import type { Event } from "@/lib/events";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/events", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Event feed failed");
        }

        return response.json();
      })
      .then((json: { events?: Event[] }) => {
        if (active && Array.isArray(json.events)) {
          setEvents(json.events);
        }
      })
      .catch((error) => {
        console.error("Unable to load events:", error);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { events, loading };
}
