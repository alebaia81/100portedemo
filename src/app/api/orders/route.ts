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
 * GET /api/orders
 * Restituisce l'elenco di tutti gli ordini ordinati per data decrescente.
 */
export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase non configurato' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from('ordini')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Mostra gli ultimi 100 ordini

    if (error) {
      console.error('[API/orders] Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (e: any) {
    console.error('[API/orders] Unexpected error:', e);
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}

/**
 * POST /api/orders
 * Registra un nuovo ordine ricevuto dal carrello.
 */
export async function POST(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase non configurato' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { 
      customer_name, 
      order_type, 
      address, 
      pickup_time, 
      payment_method, 
      cash_amount, 
      total, 
      items 
    } = body;

    if (!customer_name || !order_type || !pickup_time || !payment_method || total === undefined || !items) {
      return NextResponse.json({ error: 'Dati mancanti o incompleti' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ordini')
      .insert({
        customer_name,
        order_type,
        address: address || null,
        pickup_time,
        payment_method,
        cash_amount: cash_amount || null,
        total: Number(total),
        items,
        status: 'ricevuto'
      })
      .select()
      .single();

    if (error) {
      console.error('[API/orders] Insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (e: any) {
    console.error('[API/orders] Unexpected error:', e);
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
