"use client";

import { useState, useEffect } from "react";
import { verifyPin, toggleProductAvailability, toggleCategoryAvailability, updateProductPrice } from "./actions";
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
  const [activeSection, setActiveSection] = useState<string>("");

  const categories = Array.from(new Set(MENU_DATA.map(item => item.category)));

  // Fetch dei dati iniziali da Supabase tramite API route server-side
  useEffect(() => {
    if (isAuthenticated) {
      const fetchState = async () => {
        try {
          const res = await fetch('/api/availability', { cache: 'no-store' });
          if (!res.ok) return;
          const data = await res.json();
          setAvailability(data.availability ?? {});
          setPrices(data.prices ?? {});
        } catch (e) {
          console.error('[Admin] Failed to fetch state:', e);
        }
      };
      fetchState();
    }
  }, [isAuthenticated]);

  // ScrollSpy per evidenziare la categoria corrente sulla sidebar durante lo scrolling
  useEffect(() => {
    if (!isAuthenticated) return;

    const options = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Rileva quando la sezione è nella parte medio-alta
      threshold: 0,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id.replace("cat-", ""));
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    categories.forEach((cat) => {
      const el = document.getElementById(`cat-${encodeURIComponent(cat)}`);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [isAuthenticated, categories]);

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

  // Toggle singola disponibilità
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
    const categoryItems = MENU_DATA.filter(item => item.category === category);
    const ids = categoryItems.map(item => item.id);
    const anyActive = ids.some(id => availability[id] !== false);
    const newState = !anyActive;

    setLoadingCategory(category);
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

  // Aggiornamento prezzo personalizzato al blur dell'input
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

  // Rileva se tutta la categoria è attiva
  const isCategoryActive = (category: string) => {
    const items = MENU_DATA.filter(item => item.category === category);
    return items.every(item => availability[item.id] !== false);
  };

  // Scroll morbido alla sezione cliccata
  const scrollToCategory = (category: string) => {
    const el = document.getElementById(`cat-${encodeURIComponent(category)}`);
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(category);
    }
  };

  // Statistiche generali del menù
  const totalProducts = MENU_DATA.length;
  const activeProducts = MENU_DATA.filter(item => availability[item.id] !== false).length;
  const disabledProducts = totalProducts - activeProducts;
  const customizedPrices = Object.values(prices).filter(p => p !== null).length;

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-accent leading-none">Dashboard Menù</h1>
            <p className="text-xs text-muted-text mt-1 hidden sm:block">Gestisci disponibilità e variazioni di prezzo dei piatti</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAuthenticated(false)} 
              className="text-xs text-muted-text hover:text-foreground border border-border px-4 py-2 rounded-lg hover:border-accent transition-colors"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-text">Piatti Totali</span>
            <span className="text-3xl font-bold mt-2 text-foreground">{totalProducts}</span>
          </div>
          <div className="glass-card p-4 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-green-500">Disponibili</span>
            <span className="text-3xl font-bold mt-2 text-green-400">{activeProducts}</span>
          </div>
          <div className="glass-card p-4 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">Esauriti</span>
            <span className="text-3xl font-bold mt-2 text-red-400">{disabledProducts}</span>
          </div>
          <div className="glass-card p-4 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Prezzi Personalizzati</span>
            <span className="text-3xl font-bold mt-2 text-accent">{customizedPrices}</span>
          </div>
        </section>

        {/* Mobile Sticky Section Menu Dropdown */}
        <div className="md:hidden sticky top-[72px] z-40 bg-background/95 backdrop-blur border-b border-border py-3 -mx-4 px-4 shadow-sm">
          <div className="relative">
            <select
              value={activeSection}
              onChange={(e) => scrollToCategory(e.target.value)}
              className="w-full bg-surface border border-border text-foreground rounded-lg py-3 px-4 pr-10 text-sm font-bold uppercase tracking-wider appearance-none focus:border-accent outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({MENU_DATA.filter(item => item.category === cat).length})
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Grid Layout (Sidebar Navigation & Scrollable content) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Left Sidebar Menu Nav - Desktop Sticky */}
          <aside className="hidden md:block col-span-1">
            <div className="sticky top-24 space-y-1 bg-surface/20 p-4 rounded-xl border border-border/30 shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-text px-3 mb-3">Sezioni</p>
              <nav className="flex flex-col gap-1">
                {categories.map((cat) => {
                  const isActive = activeSection === cat;
                  const catItems = MENU_DATA.filter(item => item.category === cat);
                  const activeCount = catItems.filter(item => availability[item.id] !== false).length;
                  
                  return (
                    <button
                      key={cat}
                      onClick={() => scrollToCategory(cat)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between border ${
                        isActive
                          ? "text-accent bg-accent/5 border-accent/20 font-extrabold shadow-sm"
                          : "text-muted-text hover:text-accent border-transparent hover:bg-surface/30"
                      }`}
                    >
                      <span className="truncate pr-1">{cat}</span>
                      <span className="text-[10px] opacity-70 bg-surface/50 border border-border/40 px-1.5 py-0.5 rounded font-mono">
                        {activeCount}/{catItems.length}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Right Main Panel with All Sections */}
          <main className="col-span-1 md:col-span-3 space-y-12">
            {categories.map((category) => {
              const categoryItems = MENU_DATA.filter(item => item.category === category);
              const catActive = isCategoryActive(category);
              const isLoading = loadingCategory === category;

              return (
                <section 
                  key={category} 
                  id={`cat-${encodeURIComponent(category)}`}
                  className="glass-card p-6 md:p-8 scroll-mt-24"
                >
                  {/* Section Title & Header Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border/40">
                    <div>
                      <h2 className="text-2xl font-serif text-accent">{category}</h2>
                      <p className="text-xs text-muted-text mt-1">{categoryItems.length} piatti totali in questa sezione</p>
                    </div>
                    <button 
                      onClick={() => toggleCategory(category)}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                        catActive 
                          ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' 
                          : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                      } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {isLoading ? '...' : catActive ? '✕ Spegni Sezione' : '✓ Attiva Sezione'}
                    </button>
                  </div>

                  {/* Grid of Product Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {categoryItems.map((item) => {
                      const isAvailable = availability[item.id] !== false;
                      const overriddenPrice = prices[item.id];
                      const displayPrice = overriddenPrice !== null && overriddenPrice !== undefined ? overriddenPrice : item.price;
                      const isEditing = editingPrice[item.id] !== undefined;

                      return (
                        <div 
                          key={item.id} 
                          className={`flex flex-col justify-between p-4 rounded-xl border transition-all ${
                            isAvailable 
                              ? 'border-border/60 hover:border-accent/40 bg-surface/30 shadow-sm' 
                              : 'border-border/30 bg-surface/5 opacity-50'
                          }`}
                        >
                          {/* Info area */}
                          <div className="mb-4">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-sm md:text-base leading-tight text-foreground">{item.name}</h3>
                              {!isAvailable && (
                                <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0">
                                  Spento
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-text mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>

                          {/* Control actions */}
                          <div className="flex items-center justify-between border-t border-border/20 pt-3 mt-auto">
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
                                className={`w-20 bg-background border rounded px-2.5 py-1 text-sm text-right font-mono focus:border-accent outline-none ${
                                  overriddenPrice !== null && overriddenPrice !== undefined && overriddenPrice !== item.price
                                    ? 'border-accent/60 text-accent font-bold bg-accent/5' 
                                    : 'border-border/80'
                                }`}
                              />
                              {overriddenPrice !== null && overriddenPrice !== undefined && (
                                <button
                                  onClick={async () => {
                                    setPrices(prev => ({ ...prev, [item.id]: null }));
                                    await updateProductPrice(item.id, null);
                                  }}
                                  className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase font-sans"
                                  title="Ripristina prezzo originale"
                                >
                                  Reset
                                </button>
                              )}
                            </div>

                            {/* Active Switch */}
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold uppercase ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                                {isAvailable ? 'Attivo' : 'Spento'}
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={isAvailable}
                                  onChange={() => toggleAvailability(item.id)}
                                />
                                <div className="w-10 h-5 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent border border-border"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </main>

        </div>

      </div>
      <ScrollToTop bottomOffset="bottom-6" />
    </div>
  );
}
