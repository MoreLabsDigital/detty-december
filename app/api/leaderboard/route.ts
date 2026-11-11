
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ScoreEntry = {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
};

function getDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Leaderboard database not configured");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// GET: Retrieve the global top 20 scores
export async function GET() {
  try {
    const supabase = getDatabase();

    const { data, error } = await supabase
      .from("arcade_scores")
      .select("id, player_name, score, created_at")
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(20);

    if (error) {
      console.error("Leaderboard read failed:", error.message);

      return NextResponse.json(
        { error: "Unable to load leaderboard" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { entries: (data || []) as ScoreEntry[] },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Leaderboard configuration error:", error);

    return NextResponse.json(
      { error: "Leaderboard temporarily unavailable" },
      { status: 500 }
    );
  }
}

// POST: Submit a score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const playerName =
      typeof body.player_name === "string"
        ? body.player_name.trim()
        : "";

    const score = body.score;

    if (
      playerName.length < 2 ||
      playerName.length > 24 ||
      !Number.isInteger(score) ||
      score < 0 ||
      score > 3570 ||
      score % 10 !== 0
    ) {
      return NextResponse.json(
        { error: "Invalid name or score" },
        { status: 400 }
      );
    }

    const supabase = getDatabase();

    const { data, error } = await supabase
      .from("arcade_scores")
      .insert({
        player_name: playerName,
        score,
      })
      .select("id, player_name, score, created_at")
      .single();

    if (error) {
      console.error("Score submission failed:", error.message);

      return NextResponse.json(
        { error: "Unable to save score" },
        { status: 500 }
      );
    }

    // Determine rank from all scores, not just top 20
    const { count, error: countError } = await supabase
      .from("arcade_scores")
      .select("*", { count: "exact", head: true })
      .gt("score", score);

    if (countError) {
      console.error("Rank lookup failed:", countError.message);
    }

    return NextResponse.json(
      {
        entry: data,
        rank: countError ? null : (count ?? 0) + 1,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Leaderboard submission failed:", error);

    return NextResponse.json(
      { error: "Could not submit score" },
      { status: 500 }
    );
  }
}
