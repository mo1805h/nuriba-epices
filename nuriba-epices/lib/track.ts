import { supabase } from "@/lib/supabase";

// Lightweight, cookie-free analytics stored in Supabase (site_events).
// No personal data: a random per-tab session id (sessionStorage) + page + traffic source.

export type TrackKind = "pageview" | "add_to_cart" | "whatsapp_order" | "whatsapp_contact";

interface TrackItem {
  name: string;
  quantity: number;
}

function safeSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSessionSet(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function sessionId(): string {
  let id = safeSession("nuriba_sid");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    safeSessionSet("nuriba_sid", id);
  }
  return id;
}

function detectSource(): string {
  const existing = safeSession("nuriba_src");
  if (existing) return existing;

  let source = "direct";
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source");
    const ref = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : "";
    const host = window.location.hostname.toLowerCase();
    const raw = (utm || ref).toLowerCase();

    if (params.get("fbclid")) source = "Facebook";
    else if (params.get("gclid")) source = "Google";
    else if (!raw || raw === host) source = "direct";
    else if (raw.includes("google")) source = "Google";
    else if (raw.includes("instagram")) source = "Instagram";
    else if (raw.includes("tiktok")) source = "TikTok";
    else if (raw.includes("facebook") || raw === "fb" || raw.endsWith("fb.com")) source = "Facebook";
    else if (raw.includes("whatsapp") || raw === "wa.me") source = "WhatsApp";
    else if (raw.includes("bing")) source = "Bing";
    else if (raw.includes("snapchat")) source = "Snapchat";
    else if (raw === "t.co" || raw.includes("twitter") || raw === "x.com") source = "X / Twitter";
    else source = raw.replace(/^www\./, "").slice(0, 40);
  } catch {
    /* ignore */
  }
  safeSessionSet("nuriba_src", source);
  return source;
}

export function track(kind: TrackKind, opts: { items?: TrackItem[]; path?: string } = {}) {
  if (typeof window === "undefined") return;
  try {
    if (window.location.pathname.startsWith("/admin")) return;
    const device = window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
    void supabase
      .from("site_events")
      .insert({
        kind,
        path: (opts.path ?? window.location.pathname).slice(0, 200),
        source: detectSource(),
        session_id: sessionId(),
        device,
        items: opts.items
          ? opts.items.slice(0, 50).map((i) => ({ name: String(i.name).slice(0, 80), quantity: i.quantity }))
          : null,
      })
      .then(() => undefined);
  } catch {
    /* never break the site because of analytics */
  }
}
