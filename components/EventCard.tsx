"use client";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Bookmark,
  Plus,
  Check,
  ArrowUpRight,
  MapPin,
  Clock,
} from "lucide-react";
import { usePlans } from "./PlanProvider";
import { money, time, type Event } from "@/lib/events";
export function EventCard({
  event,
  compact = false,
}: {
  event: Event;
  compact?: boolean;
}) {
  const { plans, toggle } = usePlans();
  const saved = plans.bookmarks.includes(event.id);
  const planned = plans.itinerary.includes(event.id);
  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className={`event-card ${compact ? "compact" : ""}`}
    >
      <div className={`event-art art-${event.art}`}>
        <span className="art-circle" />
        {/* <span className="art-sun">✳</span> */}
        <span className="art-wave">〰</span>
        <span className="art-word">{event.category.toUpperCase()}</span>
        <span className="demo-ribbon">DEMO EVENT</span>
      </div>
      <div className="event-body">
        <div className="event-topline">
          <span>{event.category.toUpperCase()}</span>
          <span>DEC {Number(event.start.slice(8, 10))} · 2026</span>
        </div>
        <Link className="event-title" href={`/events/${event.slug}`}>
          {event.title}
          <ArrowUpRight size={19} />
        </Link>
        <div className="event-meta">
          <span>
            <MapPin size={13} />
            {event.neighbourhood}, Lagos
          </span>
          <span>
            <Clock size={13} />
            {time(event.start)}
          </span>
        </div>
        <div className="event-bottom">
          <strong>{money(event.price)}</strong>
          <div className="event-buttons">
            <button
              className={saved ? "icon-button active" : "icon-button"}
              onClick={() => toggle("bookmarks", event.id)}
              aria-label={saved ? "Remove bookmark" : "Bookmark event"}
              title="Bookmark"
            >
              <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
            </button>
            <button
              className={planned ? "add-button added" : "add-button"}
              onClick={() => toggle("itinerary", event.id)}
            >
              {planned ? <Check size={15} /> : <Plus size={15} />}{" "}
              {planned ? "ADDED" : "ADD TO PLANS"}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
