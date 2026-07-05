import { useState, useEffect, useRef } from 'react';

interface MenuState {
  availability: Record<string, boolean>;
  prices: Record<string, number>;
}

/**
 * Hook che carica e aggiorna disponibilità e prezzi dal server (API route).
 * Usa il server Cloudflare Worker per leggere da Supabase, eliminando la
 * dipendenza dalle variabili NEXT_PUBLIC_* nel bundle client.
 * Esegue un refetch ogni 10 secondi per riflettere modifiche dall'admin.
 */
export function useMenuAvailability(): MenuState {
  const [state, setState] = useState<MenuState>({
    availability: {},
    prices: {},
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/availability', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setState({
        availability: data.availability ?? {},
        prices: data.prices ?? {},
      });
    } catch (e) {
      console.warn('[useMenuAvailability] Failed to fetch availability:', e);
    }
  };

  useEffect(() => {
    // Carica subito al mount
    fetchAvailability();

    // Polling ogni 10 secondi per aggiornamenti live dall'admin
    intervalRef.current = setInterval(fetchAvailability, 10_000);

    // Refetch quando la tab torna in focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAvailability();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return state;
}
