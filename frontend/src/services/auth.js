import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qwzicqpyogewrbjdakin.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3emljcXB5b2dld3JiamRha2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NDYyOTEsImV4cCI6MjA4OTEyMjI5MX0.RGaOwzhrmIhk7e-7V7yRw54K5tOA-JW47CdNVf5mtow";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── Auth helpers ─────────────────────────────────────────────── */

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getAccessToken() {
  const session = await getSession();
  return session?.access_token ?? null;
}

export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return subscription;
}
