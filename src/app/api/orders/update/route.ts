import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * POST /api/orders/update
 * Aggiorna lo stato di avanzamento di un ordine.
 */
export async function POST(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase non configurato' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID o Stato mancanti' }, { status: 400 });
    }

    const validStatuses = ['ricevuto', 'preparazione', 'pronto', 'completato', 'annullato'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Stato non valido' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ordini')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API/orders/update] Update error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (e: any) {
    console.error('[API/orders/update] Unexpected error:', e);
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
