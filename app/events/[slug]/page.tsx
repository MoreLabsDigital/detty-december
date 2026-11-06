
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { money, time } from "@/lib/events";
import { getEventBySlug } from "@/lib/supabase-events";
import { EventActions } from "@/components/EventActions";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

// Generate metadata for each event
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event not found",
      description: "This event could not be found.",
    };
  }

  return {
    title: event.title,
    description: event.description,
  };
}

export default async function EventPage({
  params,
}: Props) {
  const { slug } = await params;

  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  // Format the event date
  const formattedDate = new Date(
    event.start
  ).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });

  return (
    <main className="interior detail-page">

      {/* BACK NAVIGATION */}
      <div className="detail-intro">
        <Link href="/explore">
          ← BACK TO EVENTS
        </Link>

        <span>EVENT DETAILS</span>
      </div>

      <div className="detail-grid">

        {/* EVENT IMAGE */}
        <div
          style={{
            width: "100%",
            minWidth: 0,
          }}
        >
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={`${event.title} event flyer`}
              loading="eager"
              style={{
                display: "block",
                width: "150%",
                maxWidth: "500px",
                height: "500px",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              className={`detail-art event-art art-${event.art}`}
            >
              <span className="art-circle" />
              <span className="art-wave">
                〰
              </span>
              <span className="art-word">
                {event.category.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* EVENT DETAILS */}
        <div className="detail-info">

          {/* CATEGORY */}
          <div className="section-kicker">
            {event.category.toUpperCase()} /{" "}
            {new Date(event.start)
              .toLocaleDateString("en-NG", {
                month: "long",
                year: "numeric",
                timeZone: "Africa/Lagos",
              })
              .toUpperCase()}
          </div>

          {/* EVENT TITLE */}
          <h1>{event.title}</h1>

          {/* DESCRIPTION */}
          <p className="detail-description">
            {event.description}
          </p>

          {/* EVENT INFORMATION */}
          <div className="detail-facts">

            {/* DATE AND TIME */}
            <div>
              <span>WHEN</span>

              <strong>
                {formattedDate}
                {" · "}
                {time(event.start)}
                {" – "}
                {time(event.end)} WAT
              </strong>
            </div>

            {/* LOCATION */}
            <div>
              <span>WHERE</span>

              <strong>
                {event.venue}
                {event.neighbourhood
                  ? `, ${event.neighbourhood}`
                  : ""}
                {event.city
                  ? `, ${event.city}`
                  : ""}
              </strong>
            </div>

            {/* PRICE */}
            <div>
              <span>PRICE</span>

              <strong>
                {money(event.price)}
              </strong>
            </div>

            {/* ORGANISER */}
            <div>
              <span>ORGANISER</span>

              <strong>
                {event.organiser}
              </strong>
            </div>

            {/* TICKET LINK */}
            <div>
              <span>TICKETS</span>

              <strong>
                {event.ticketUrl ? (
                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GET TICKETS ↗
                  </a>
                ) : (
                  "TICKET LINK NOT AVAILABLE"
                )}
              </strong>
            </div>

          </div>

          {/* EVENT ACTIONS */}
          <EventActions event={event} />

        </div>
      </div>
    </main>
  );
}
