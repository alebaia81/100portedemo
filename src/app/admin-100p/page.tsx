"use client";

import { useState, useEffect } from "react";
import { verifyPin, toggleProductAvailability, toggleCategoryAvailability, updateProductPrice } from "./actions";
import { supabase } from "@/lib/supabase";
import menuJson from "@/lib/menu.json";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [prices, setPrices] = useState<Record<string, number | null>>({});
  const [editingPrice, setEditingPrice] = useState<Record<string, string>>({});
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  // Raggruppiamo i prodotti per categoria
  const categories = Array.from(new Set(menuJson.map(item => item.category)));
  const groupedProducts = categories.map(category => ({
    category,
    items: menuJson.filter(item => item.category === category)
  }));

  useEffect(() => {
    if (isAuthenticated) {
      const fetchState = async () => {
        const { data } = await supabase.from('disponibilita_piatti').select('id_piatto, is_available, price');
        if (data) {
          const avail: Record<string, boolean> = {};
          const pr: Record<string, number | null> = {};
          data.forEach(item => {
            avail[item.id_piatto] = item.is_available;
            pr[item.id_piatto] = item.price;
          });
          setAvailability(avail);
          setPrices(pr);
        }
      };
      fetchState();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await verifyPin(pin);
    if (result.success) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("PIN Errato");
    }
  };

  // Toggle singolo prodotto
  const toggleAvailability = async (id_piatto: string) => {
    const currentState = availability[id_piatto] !== false;
    const newState = !currentState;
    setAvailability(prev => ({ ...prev, [id_piatto]: newState }));
    const result = await toggleProductAvailability(id_piatto, newState);
    if (!result.success) {
      alert(`Errore: ${result.error}`);
      setAvailability(prev => ({ ...prev, [id_piatto]: currentState }));
    }
  };

  // Toggle intera categoria
  const toggleCategory = async (category: string) => {
    const categoryItems = menuJson.filter(item => item.category === category);
    const ids = categoryItems.map(item => item.id);
    
    // Controlla se almeno un prodotto della categoria è attivo
    const anyActive = ids.some(id => availability[id] !== false);
    const newState = !anyActive; // se ce n'è uno attivo -> disattiva tutti, altrimenti attiva tutti
    
    setLoadingCategory(category);
    
    // Aggiornamento ottimistico
    const prevAvail = { ...availability };
    const newAvail = { ...availability };
    ids.forEach(id => { newAvail[id] = newState; });
    setAvailability(newAvail);
    
    const result = await toggleCategoryAvailability(ids, newState);
    if (!result.success) {
      alert(`Errore: ${result.error}`);
      setAvailability(prevAvail);
    }
    setLoadingCategory(null);
  };

  // Aggiornamento prezzo
  const handlePriceBlur = async (id_piatto: string, originalPrice: number) => {
    const inputVal = editingPrice[id_piatto];
    if (inputVal === undefined) return;
    
    const newPrice = inputVal === '' ? null : parseFloat(inputVal);
    
    // Se il valore è uguale all'originale o è vuoto (reset), aggiorna
    if (newPrice !== null && isNaN(newPrice)) {
      // Valore non valido, ignoriamo
      setEditingPrice(prev => {
        const next = { ...prev };
        delete next[id_piatto];
        return next;
      });
      return;
    }

    setPrices(prev => ({ ...prev, [id_piatto]: newPrice }));
    setEditingPrice(prev => {
      const next = { ...prev };
      delete next[id_piatto];
      return next;
    });
    
    const result = await updateProductPrice(id_piatto, newPrice);
    if (!result.success) {
      alert(`Errore aggiornamento prezzo: ${result.error}`);
    }
  };

  // Controlla se tutta la categoria è attiva
  const isCategoryActive = (category: string) => {
    const items = menuJson.filter(item => item.category === category);
    return items.every(item => availability[item.id] !== false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <form onSubmit={handleLogin} className="glass-card p-8 space-y-6 w-full max-w-sm">
          <h1 className="text-2xl font-serif text-accent text-center">Area Riservata</h1>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <input 
            type="password" 
            placeholder="Inserisci PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg p-3 text-center text-xl tracking-widest focus:border-accent outline-none"
          />
          <button type="submit" className="btn-primary w-full py-3">Accedi</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-serif text-accent">Gestione Menù</h1>
            <p className="text-sm text-muted-text mt-1">Disponibilità e Prezzi in tempo reale</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-muted-text hover:text-foreground border border-border px-4 py-2 rounded-lg hover:border-accent transition-colors">Esci</button>
        </div>

        {/* Menu Navigazione Veloce Categorie */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border py-4 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {groupedProducts.map(group => (
              <a 
                key={group.category}
                href={`#cat-${group.category.replace(/\s+/g, '-')}`}
                className="whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-surface border border-border hover:border-accent text-muted-text hover:text-accent transition-colors"
              >
                {group.category}
              </a>
            ))}
          </div>
        </div>

        {/* Sezioni raggruppate per categoria */}
        {groupedProducts.map((group) => {
          const catActive = isCategoryActive(group.category);
          const isLoading = loadingCategory === group.category;
          
          return (
            <section 
              key={group.category} 
              id={`cat-${group.category.replace(/\s+/g, '-')}`} 
              className="glass-card p-4 md:p-6 scroll-mt-24"
            >
              {/* Header Categoria con toggle "Seleziona Tutto" */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-border">
                <div>
                  <h2 className="text-xl md:text-2xl font-serif text-accent">{group.category}</h2>
                  <p className="text-xs text-muted-text mt-1">{group.items.length} prodotti</p>
                </div>
                <button 
                  onClick={() => toggleCategory(group.category)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border ${
                    catActive 
                      ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' 
                      : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                  } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {isLoading ? '...' : catActive ? '✕ Disattiva Tutti' : '✓ Attiva Tutti'}
                </button>
              </div>

              {/* Lista prodotti */}
              <div className="space-y-3">
                {group.items.map((item) => {
                  const isAvailable = availability[item.id] !== false;
                  const overriddenPrice = prices[item.id];
                  const displayPrice = overriddenPrice !== null && overriddenPrice !== undefined ? overriddenPrice : item.price;
                  const isEditing = editingPrice[item.id] !== undefined;
                  
                  return (
                    <div key={item.id} className={`flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3 rounded-lg border transition-all ${isAvailable ? 'border-border hover:border-accent/30 bg-surface/30' : 'border-border/50 bg-surface/10 opacity-60'}`}>
                      {/* Info prodotto */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm md:text-base truncate">{item.name}</h3>
                        <p className="text-xs text-muted-text truncate">{item.description}</p>
                      </div>
                      
                      {/* Controlli */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Campo Prezzo */}
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-text">€</span>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={isEditing ? editingPrice[item.id] : displayPrice.toFixed(2)}
                            onChange={(e) => setEditingPrice(prev => ({ ...prev, [item.id]: e.target.value }))}
                            onBlur={() => handlePriceBlur(item.id, item.price)}
                            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                            className={`w-20 bg-background border rounded px-2 py-1 text-sm text-right font-mono focus:border-accent outline-none ${
                              overriddenPrice !== null && overriddenPrice !== undefined && overriddenPrice !== item.price
                                ? 'border-accent/50 text-accent' 
                                : 'border-border'
                            }`}
                          />
                        </div>

                        {/* Stato */}
                        <span className={`text-xs font-bold uppercase w-20 text-center ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                          {isAvailable ? 'Attivo' : 'Spento'}
                        </span>
                        
                        {/* Toggle Switch */}
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={isAvailable}
                            onChange={() => toggleAvailability(item.id)}
                          />
                          <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent border border-border"></div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
