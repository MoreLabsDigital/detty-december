
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
import {
  money,
  time,
  type Event,
} from "@/lib/events";

export function EventCard({
  event,
  compact = false,
}: {
  event: Event;
  compact?: boolean;
}) {
  const { plans, toggle } = usePlans();

  const saved = plans.bookmarks.includes(
    event.id
  );

  const planned = plans.itinerary.includes(
    event.id
  );

  const soldOut =
    event.bookingStatus === "sold-out";

  const eventDate = new Date(
    event.start
  );

  const formattedDate =
    eventDate.toLocaleDateString(
      "en-NG",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Africa/Lagos",
      }
    );

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className={`event-card ${
        compact ? "compact" : ""
      }`}
    >
      <div
        className={`event-art art-${event.art}`}
        style={{ position: "relative" }}
      >
        <span className="art-circle" />

        <span className="art-wave">
          〰
        </span>

        <span className="art-word">
          {event.category.toUpperCase()}
        </span>

        {event.imageUrl && (
          <>
            <img
              src={event.imageUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="event-card-image-backdrop"
            />
            <img
              src={event.imageUrl}
              alt={`${event.title} flyer`}
              loading="lazy"
              className="event-card-image"
            />
          </>
        )}

        {soldOut && (
          <img
            src="/images/sold-out.svg"
            alt="SOLD OUT"
            className="event-card-sold-out-stamp"
          />
        )}
      </div>

      <div className="event-body">
        <div className="event-topline">
          <span>
            {event.category.toUpperCase()}
          </span>

          <span>
            {formattedDate.toUpperCase()}
          </span>
        </div>

        <Link
          className="event-title"
          href={`/events/${event.slug}`}
        >
          {event.title}

          <ArrowUpRight size={19} />
        </Link>

        <div className="event-meta">
          <span>
            <MapPin size={13} />

            {event.neighbourhood},{" "}
            {event.city}
          </span>

          <span>
            <Clock size={13} />

            {time(event.start)}
          </span>
        </div>

        <div className="event-bottom">
          <strong>
            {soldOut
              ? "SOLD OUT"
              : money(event.price)}
          </strong>

          <div className="event-buttons">
            <button
              className={
                saved
                  ? "icon-button active"
                  : "icon-button"
              }
              onClick={() =>
                toggle(
                  "bookmarks",
                  event.id
                )
              }
              aria-label={
                saved
                  ? "Remove bookmark"
                  : "Bookmark event"
              }
              title="Bookmark"
            >
              <Bookmark
                size={17}
                fill={
                  saved
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

            <button
              className={
                planned
                  ? "add-button added"
                  : "add-button"
              }
              onClick={() =>
                toggle(
                  "itinerary",
                  event.id
                )
              }
            >
              {planned ? (
                <Check size={15} />
              ) : (
                <Plus size={15} />
              )}

              {planned
                ? "ADDED"
                : "ADD TO PLANS"}
            </button>
          </div>
        </div>

        {!soldOut && event.ticketUrl && (
          <a
            className="buy-ticket-link"
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Buy tickets for ${event.title}`}
          >
            BUY TICKET
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        )}
      </div>
    </motion.article>
  );
}