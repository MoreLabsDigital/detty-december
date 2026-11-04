
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

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  return {
    title: event?.title || "Event not found",
    description: event?.description,
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
      <div className="detail-intro">
        <Link href="/explore">
          ← BACK TO EVENTS
        </Link>

        <span>EVENT DETAILS</span>
      </div>

      <div className="detail-grid">
        <div>
          <div
            className={`detail-art event-art art-${event.art}`}
          >
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={`${event.title} event flyer`}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 2,
                }}
              />
            ) : (
              <span className="art-circle" />
            )}

            <span className="art-wave">〰</span>

            <span className="art-word">
              {event.category.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="detail-info">
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

          <h1>{event.title}</h1>

          <p className="detail-description">
            {event.description}
          </p>

          <div className="detail-facts">
            <div>
              <span>WHEN</span>

              <strong>
                {formattedDate} · {time(event.start)}
                {" – "}
                {time(event.end)} WAT
              </strong>
            </div>

            <div>
              <span>WHERE</span>

              <strong>
                {event.venue}, {event.neighbourhood},{" "}
                {event.city}
              </strong>
            </div>

            <div>
              <span>PRICE</span>
              <strong>{money(event.price)}</strong>
            </div>

            <div>
              <span>ORGANISER</span>
              <strong>{event.organiser}</strong>
            </div>

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

          <EventActions event={event} />
        </div>
      </div>
    </main>
  );
}
