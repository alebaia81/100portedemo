import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface MenuState {
  availability: Record<string, boolean>;
  prices: Record<string, number>;
}

export function useMenuAvailability(): MenuState {
  const [state, setState] = useState<MenuState>({
    availability: {},
    prices: {},
  });

  useEffect(() => {
    // 1. Carica lo stato iniziale della disponibilità e prezzi da Supabase
    const fetchState = async () => {
      const { data, error } = await supabase
        .from('disponibilita_piatti')
        .select('id_piatto, is_available, price');
      
      if (!error && data) {
        const availability: Record<string, boolean> = {};
        const prices: Record<string, number> = {};
        data.forEach((item) => {
          availability[item.id_piatto] = item.is_available;
          if (item.price !== null && item.price !== undefined) {
            prices[item.id_piatto] = Number(item.price);
          }
        });
        setState({ availability, prices });
      }
    };

    fetchState();

    // 2. Sottoscrizione ai cambiamenti in tempo reale (Supabase Real-Time)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'disponibilita_piatti',
        },
        (payload) => {
          const newRecord = payload.new as { id_piatto: string; is_available: boolean; price: number | null };
          if (newRecord && newRecord.id_piatto) {
            setState((prev) => ({
              availability: {
                ...prev.availability,
                [newRecord.id_piatto]: newRecord.is_available,
              },
              prices: newRecord.price !== null && newRecord.price !== undefined
                ? { ...prev.prices, [newRecord.id_piatto]: Number(newRecord.price) }
                : (() => {
                    const { [newRecord.id_piatto]: _, ...rest } = prev.prices;
                    return rest;
                  })(),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return state;
}
