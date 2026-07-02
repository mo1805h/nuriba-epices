import { supabase } from "@/lib/supabase";

export async function loginAdmin(
  email: string,
  password: string
): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return !error;
}

export async function logoutAdmin() {
  await supabase.auth.signOut();
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return data.session !== null;
}
