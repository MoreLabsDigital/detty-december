import { supabase } from "@/lib/supabase";
import { EVENTS, type Event } from "@/lib/events";

type Row = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  venue: string | null;
  address: string | null;
  city: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  price_min: number | null;
  currency: string;
  image_url: string | null;
  ticket_url: string | null;
  organizer: string | null;
  source: string;
  created_at: string;
  updated_at: string;
};
function plainUrl(value: string | null): string | null {
  if (!value) return null;
  const markdown = value.match(/^\[https?:\/\/[^\]]+\]\((https?:\/\/[^)]+)\)$/);
  const candidate = markdown ? markdown[1] : value;
  try {
    const url = new URL(candidate);
    return ["https:", "http:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}
function category(value: string | null): Event["category"] {
  const s = (value || "").toLowerCase();
  if (/concert|music|live/.test(s)) return "Music";
  if (/party|night|club|rave/.test(s)) return "Nightlife";
  if (/art|exhibit|gallery/.test(s)) return "Arts";
  if (/food|dining/.test(s)) return "Food";
  return "Experiences";
}
function dateTime(day: string, clock: string | null, fallback: string): string {
  const t = (clock || fallback).slice(0, 8);
  return `${day}T${t.length === 5 ? t + ":00" : t}+01:00`;
}
export function mapSupabaseEvent(r: Row): Event {
  const start = dateTime(r.event_date, r.start_time, "12:00:00");
  // If the end time is earlier than the start time, assume an overnight event.
  const startClock = (r.start_time || "12:00:00").slice(0, 8);
  const endClock = (r.end_time || "").slice(0, 8);
  let endDay = r.event_date;
  if (endClock && endClock < startClock) {
    const d = new Date(`${r.event_date}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    endDay = d.toISOString().slice(0, 10);
  }
  const end = dateTime(
    endDay,
    r.end_time || null,
    r.end_time ? "15:00:00" : "23:59:00",
  );
  const neighborhood =
    r.address?.split(",")[0]?.trim() ||
    r.venue?.split(",").slice(1).join(",").trim() ||
    r.city;
  return {
    id: `supabase:${r.id}`,
    slug: r.slug,
    title: r.title,
    description: r.description || "Event details coming soon.",
    category: category(r.category),
    tags: [r.category || "event", "lagos", r.source].map((x) =>
      x.toLowerCase(),
    ),
    start,
    end,
    timezone: "Africa/Lagos",
    venue: r.venue || "Venue to be announced",
    address: r.address || [r.venue, r.city].filter(Boolean).join(", "),
    neighbourhood: neighborhood,
    city: r.city,
    price: r.price_min,
    currency: "NGN",
    ticketUrl: plainUrl(r.ticket_url),
    organiser: r.organizer || "Organiser not specified",
    bookingStatus: "unknown",
    verificationStatus: "listed",
    featured: false,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    art: 0,
    imageUrl: plainUrl(r.image_url),
    source: r.source,
  };
}
export async function getEvents(): Promise<Event[]> {
  if (!supabase) {
    console.warn(
      "Supabase is not configured. Using existing curated events."
    );

    return EVENTS;
  }

  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        "id,title,slug,description,category,venue,address,city,event_date,start_time,end_time,price_min,currency,image_url,ticket_url,organizer,source,created_at,updated_at",
      )
      .eq("is_published", true)
      .gte("event_date", "2026-12-01")
      .lte("event_date", "2026-12-31")
      .order("event_date", { ascending: true })
      .limit(500);
    if (error) {
      console.error("Supabase events query failed:", error.message);
      return EVENTS;
    }
    const db = (data || []).map((row) => mapSupabaseEvent(row as Row));
    const slugs = new Set(db.map((e) => e.slug));
    return [...db, ...EVENTS.filter((e) => !slugs.has(e.slug))];
  } catch (e) {
    console.error("Event feed unavailable:", e);
    return EVENTS;
  }
}
export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const events = await getEvents();
  return events.find((e) => e.slug === slug);
}
