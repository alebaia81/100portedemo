"use client";

import { useState, useEffect } from "react";
import { verifyPin, toggleProductAvailability, toggleCategoryAvailability, updateProductPrice } from "./actions";
import { supabase } from "@/lib/supabase";
import { MENU_DATA } from "@/lib/menu-data";
import ScrollToTop from "@/components/ScrollToTop";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [prices, setPrices] = useState<Record<string, number | null>>({});
  const [editingPrice, setEditingPrice] = useState<Record<string, string>>({});
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  
  // State for active category filtering
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [transitioning, setTransitioning] = useState(false);
  const [displayCategory, setDisplayCategory] = useState<string>("");

  // Unique sorted list of categories
  const categories = Array.from(new Set(MENU_DATA.map(item => item.category)));

  // Sync hash in URL with active category
  useEffect(() => {
    if (categories.length > 0) {
      const defaultCategory = categories[0];
      const handleHashChange = () => {
        const hash = window.location.hash.replace("#cat-", "");
        const decodedHash = decodeURIComponent(hash);
        if (categories.includes(decodedHash)) {
          setActiveCategory(decodedHash);
        } else {
          setActiveCategory(defaultCategory);
        }
      };

      handleHashChange();
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, []);

  // Handle activeCategory changes with smooth transitions
  useEffect(() => {
    if (activeCategory) {
      if (!displayCategory) {
        setDisplayCategory(activeCategory);
      } else {
        setTransitioning(true);
        const timer = setTimeout(() => {
          setDisplayCategory(activeCategory);
          setTransitioning(false);
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [activeCategory]);

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

  // Toggle single product
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

  // Toggle entire category
  const toggleCategory = async (category: string) => {
    const categoryItems = MENU_DATA.filter(item => item.category === category);
    const ids = categoryItems.map(item => item.id);
    
    // Check if at least one product in category is active
    const anyActive = ids.some(id => availability[id] !== false);
    const newState = !anyActive;
    
    setLoadingCategory(category);
    
    // Optimistic update
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

  // Update price on blur
  const handlePriceBlur = async (id_piatto: string, originalPrice: number) => {
    const inputVal = editingPrice[id_piatto];
    if (inputVal === undefined) return;
    
    const newPrice = inputVal === '' ? null : parseFloat(inputVal);
    
    if (newPrice !== null && isNaN(newPrice)) {
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

  // Check if entire category is active
  const isCategoryActive = (category: string) => {
    const items = MENU_DATA.filter(item => item.category === category);
    return items.every(item => availability[item.id] !== false);
  };

  const handleCategorySelect = (category: string) => {
    window.location.hash = `cat-${category}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <form onSubmit={handleLogin} className="glass-card p-8 space-y-6 w-full max-w-sm">
          <h1 className="text-2xl font-serif text-accent text-center">Area Riservata</h1>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <div className="relative">
            <input 
              type={showPin ? "text" : "password"}
              placeholder="Inserisci PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg p-3 text-center text-xl tracking-widest focus:border-accent outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-accent transition-colors p-1"
              aria-label={showPin ? "Nascondi PIN" : "Mostra PIN"}
            >
              {showPin ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <button type="submit" className="btn-primary w-full py-3">Accedi</button>
        </form>
      </div>
    );
  }

  const activeCategoryItems = MENU_DATA.filter(item => item.category === displayCategory);
  const catActive = isCategoryActive(displayCategory);
  const isLoading = loadingCategory === displayCategory;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-serif text-accent">Gestione Menù</h1>
            <p className="text-sm text-muted-text mt-1">Disponibilità e Prezzi in tempo reale</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-muted-text hover:text-foreground border border-border px-4 py-2 rounded-lg hover:border-accent transition-colors">Esci</button>
        </div>

        {/* Mobile Sticky Selector */}
        <div className="md:hidden sticky top-[0px] z-40 bg-background/95 backdrop-blur border-b border-border py-3 -mx-4 px-4">
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="w-full bg-surface border border-border text-foreground rounded-lg py-3 px-4 pr-10 text-sm font-bold uppercase tracking-wider appearance-none focus:border-accent outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Grid Layout (Sidebar on Desktop, Content on Right) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden md:block col-span-1">
            <div className="sticky top-8 space-y-1 bg-surface/10 p-4 rounded-xl border border-border/30">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-text px-3 mb-3">Categorie</p>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-3.5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                    activeCategory === cat
                      ? "text-accent bg-accent/5 border-l-4 border-l-accent border-y-transparent border-r-transparent pl-3"
                      : "text-muted-text hover:text-accent border-transparent hover:bg-surface/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Active Category Editor Section */}
          <main className="col-span-1 md:col-span-3">
            <div className={`transition-all duration-150 transform ${
              transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}>
              {displayCategory && (
                <section className="glass-card p-4 md:p-6">
                  
                  {/* Category Header with Toggle All Switch */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
                    <div>
                      <h2 className="text-xl md:text-2xl font-serif text-accent">{displayCategory}</h2>
                      <p className="text-xs text-muted-text mt-1">{activeCategoryItems.length} prodotti</p>
                    </div>
                    <button 
                      onClick={() => toggleCategory(displayCategory)}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                        catActive 
                          ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' 
                          : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                      } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {isLoading ? '...' : catActive ? '✕ Disattiva Tutti' : '✓ Attiva Tutti'}
                    </button>
                  </div>

                  {/* List of Products in Selected Category */}
                  <div className="space-y-3">
                    {activeCategoryItems.map((item) => {
                      const isAvailable = availability[item.id] !== false;
                      const overriddenPrice = prices[item.id];
                      const displayPrice = overriddenPrice !== null && overriddenPrice !== undefined ? overriddenPrice : item.price;
                      const isEditing = editingPrice[item.id] !== undefined;
                      
                      return (
                        <div key={item.id} className={`flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 rounded-lg border transition-all ${
                          isAvailable 
                            ? 'border-border hover:border-accent/30 bg-surface/30 shadow-sm' 
                            : 'border-border/30 bg-surface/5 opacity-60'
                        }`}>
                          
                          {/* Info Product */}
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-bold text-sm md:text-base leading-snug">{item.name}</h3>
                            <p className="text-xs text-muted-text mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>
                          
                          {/* Editor Controls */}
                          <div className="flex items-center justify-between sm:justify-start gap-4 flex-shrink-0 border-t border-border/30 pt-3 sm:pt-0 sm:border-none">
                            
                            {/* Price Field */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-text font-mono">€</span>
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
                                    ? 'border-accent/50 text-accent font-bold' 
                                    : 'border-border'
                                }`}
                              />
                            </div>

                            {/* Status State Label */}
                            <span className={`text-xs font-bold uppercase w-16 text-center ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                              {isAvailable ? 'Attivo' : 'Spento'}
                            </span>
                            
                            {/* Custom Switch Toggle */}
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
              )}
            </div>
          </main>

        </div>

      </div>
      <ScrollToTop bottomOffset="bottom-6" />
    </div>
  );
}
