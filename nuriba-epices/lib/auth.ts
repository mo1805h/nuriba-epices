// ---------------------------------------------------------------------------
// MOCK ADMIN AUTH
// ---------------------------------------------------------------------------
// This is intentionally simple for Phase 1: a single hardcoded admin
// credential checked client-side, with a session flag in localStorage.
//
// This is NOT secure and is NOT meant for production traffic protection —
// it exists so the Admin Dashboard UI/UX can be built and demoed now.
//
// Supabase migration path: replace `loginAdmin` with
// `supabase.auth.signInWithPassword(...)`, replace `isAdminLoggedIn` with a
// check against the Supabase session, and protect /admin/dashboard with a
// proper middleware-based redirect using the Supabase session cookie.
// ---------------------------------------------------------------------------

const ADMIN_SESSION_KEY = "nuriba-admin-session";

// Demo credentials — change before sharing this build with anyone.
const MOCK_ADMIN_EMAIL = "admin@nuribaepices.com";
const MOCK_ADMIN_PASSWORD = "nuriba2026";

export function loginAdmin(email: string, password: string): boolean {
  if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
    window.localStorage.setItem(ADMIN_SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function logoutAdmin() {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}
