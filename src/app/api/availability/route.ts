import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/availability
 * Legge la disponibilità e i prezzi da Supabase lato server.
 * Le env vars funzionano a runtime nel Worker Cloudflare senza bisogno di essere embed nel bundle client.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Nessuna configurazione Supabase → restituisce stato vuoto (tutti disponibili)
    return NextResponse.json({ availability: {}, prices: {} });
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('disponibilita_piatti')
      .select('id_piatto, is_available, price');

    if (error || !data) {
      console.error('[API/availability] Supabase error:', error?.message);
      return NextResponse.json({ availability: {}, prices: {} });
    }

    const availability: Record<string, boolean> = {};
    const prices: Record<string, number> = {};

    data.forEach((item) => {
      availability[item.id_piatto] = item.is_available;
      if (item.price !== null && item.price !== undefined) {
        prices[item.id_piatto] = Number(item.price);
      }
    });

    return NextResponse.json(
      { availability, prices },
      {
        headers: {
          // Nessuna cache: vogliamo sempre dati aggiornati
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (e) {
    console.error('[API/availability] Unexpected error:', e);
    return NextResponse.json({ availability: {}, prices: {} });
  }
}
