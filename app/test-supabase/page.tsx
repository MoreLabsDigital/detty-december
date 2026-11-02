
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function TestSupabase() {
  // Handle missing Supabase configuration
  if (!supabase) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>December Silk — Supabase Test</h1>
        <p style={{ color: "red" }}>
          Supabase is not configured. Check your environment variables.
        </p>
      </main>
    );
  }

  // Fetch published events
  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      slug,
      description,
      category,
      venue,
      address,
      city,
      event_date,
      start_time,
      end_time,
      price_min,
      price_max,
      currency,
      image_url,
      ticket_url,
      organizer,
      source
    `)
    .eq("is_published", true)
    .order("event_date", { ascending: true })
    .limit(10);

  return (
    <main style={{ padding: "40px" }}>
      <h1>December Silk — Supabase Test</h1>

      {error ? (
        <p style={{ color: "red" }}>
          Error: {error.message}
        </p>
      ) : (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
