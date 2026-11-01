
import { NextResponse } from "next/server";
import { getEvents } from "@/lib/supabase-events";

export const revalidate = 60;

export async function GET() {
  try {
    const events = await getEvents();

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events API error:", error);

    return NextResponse.json(
      { error: "Unable to load events" },
      { status: 500 }
    );
  }
}
