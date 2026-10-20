"use client";
import { Bookmark, Check, Plus, Share2 } from "lucide-react";
import { usePlans } from "./PlanProvider";
import type { Event } from "@/lib/events";
export function EventActions({ event }: { event: Event }) {
  const { plans, toggle } = usePlans();
  const bookmarked = plans.bookmarks.includes(event.id);
  const added = plans.itinerary.includes(event.id);
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, url });
      } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      alert("Event link copied to clipboard.");
    }
  }
  return (
    <div className="detail-actions">
      <button
        className="button yellow"
        onClick={() => toggle("itinerary", event.id)}
      >
        {added ? <Check /> : <Plus />}{" "}
        {added ? "REMOVE FROM PLANS" : "ADD TO MY PLANS"}
      </button>
      <button
        className="button outline-dark"
        onClick={() => toggle("bookmarks", event.id)}
      >
        <Bookmark size={17} fill={bookmarked ? "currentColor" : "none"} />
        {bookmarked ? "BOOKMARKED" : "SAVE"}
      </button>
      <button className="button outline-dark" onClick={share}>
        <Share2 size={17} /> SHARE
      </button>
    </div>
  );
}
