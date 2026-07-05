"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey);
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_auth");
  if (!isAdmin || isAdmin.value !== "true") {
    throw new Error("Non autorizzato");
  }
}

export async function verifyPin(pin: string) {
  const envPin = process.env.ADMIN_PIN;
  
  let correctPin = "1234";
  if (envPin && envPin !== "undefined" && envPin !== "null" && envPin.trim() !== "") {
    correctPin = envPin.trim();
  }

  // Confronto con rimozione di eventuali spazi inseriti per errore
  if (pin.trim() === correctPin) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 giorno
      path: "/",
    });
    return { success: true };
  }
  return { success: false };
}



export async function toggleProductAvailability(id_piatto: string, is_available: boolean) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Non autorizzato" };
  }

  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin.from('disponibilita_piatti').upsert({
    id_piatto,
    is_available,
    updated_at: new Date().toISOString()
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Nuova: Toggle di massa per un'intera categoria
export async function toggleCategoryAvailability(productIds: string[], is_available: boolean) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Non autorizzato" };
  }

  const supabaseAdmin = getAdminClient();

  const records = productIds.map(id_piatto => ({
    id_piatto,
    is_available,
    updated_at: new Date().toISOString()
  }));

  const { error } = await supabaseAdmin.from('disponibilita_piatti').upsert(records);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Nuova: Aggiornamento prezzo in tempo reale
export async function updateProductPrice(id_piatto: string, price: number | null) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "Non autorizzato" };
  }

  const supabaseAdmin = getAdminClient();

  const { error } = await supabaseAdmin.from('disponibilita_piatti').upsert({
    id_piatto,
    price,
    updated_at: new Date().toISOString()
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
