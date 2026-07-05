import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

/**
 * Returns the Supabase client, or null if env vars are not configured.
 * Never throws — safe to call in client components.
 */
export function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('[Supabase] env vars not configured — running in offline mode');
    return null;
  }

  try {
    _supabase = createClient(url, key);
  } catch (e) {
    console.error('[Supabase] Failed to create client:', e);
    return null;
  }

  return _supabase;
}

// Backward-compat Proxy — methods are no-ops if client is null
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) {
      // Return a safe no-op function instead of throwing
      return () => ({ data: null, error: new Error('Supabase not configured') });
    }
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return (value as Function).bind(client);
    }
    return value;
  },
});

