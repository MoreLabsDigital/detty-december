import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
export type Session = { seed: number; issued: number; nonce: string };
const secret = () => {
  const key = process.env.ARCADE_SIGNING_SECRET;
  if (!key || key.length < 32)
    throw new Error("ARCADE_SIGNING_SECRET must be at least 32 characters");
  return key;
};
export function makeSession() {
  const payload: Session = {
    seed: randomBytes(4).readUInt32BE(0),
    issued: Date.now(),
    nonce: randomBytes(16).toString("hex"),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret())
    .update(body)
    .digest("base64url");
  return { token: `${body}.${signature}`, seed: payload.seed };
}
export function parseSession(token: string): Session | null {
  if (token.length > 1024) return null;
  const [body, sig, ...extra] = token.split(".");
  if (!body || !sig || extra.length) return null;
  const expected = createHmac("sha256", secret()).update(body).digest();
  let got: Buffer;
  try {
    got = Buffer.from(sig, "base64url");
  } catch {
    return null;
  }
  if (got.length !== expected.length || !timingSafeEqual(got, expected))
    return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
    if (
      !Number.isInteger(p.seed) ||
      p.seed < 0 ||
      p.seed > 0xffffffff ||
      typeof p.nonce !== "string" ||
      !/^[0-9a-f]{32}$/.test(p.nonce) ||
      !Number.isFinite(p.issued) ||
      p.issued > Date.now() + 5000 ||
      Date.now() - p.issued > 30 * 60_000
    )
      return null;
    return p;
  } catch {
    return null;
  }
}
export function dbConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw Error("Leaderboard backend not configured");
  return { url: url.replace(/\/$/, ""), key };
}
export function dbHeaders(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}
