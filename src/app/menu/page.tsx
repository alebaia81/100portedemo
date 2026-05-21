"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { MENU_DATA } from "@/lib/menu-data";
import { useMenuAvailability } from "@/hooks/useMenuAvailability";

export default function MenuPage() {
  const { availability, prices } = useMenuAvailability();
  
  // Otteniamo le categorie uniche
  const categories = Array.from(new Set(MENU_DATA.map(item => item.category)));

  // Raggruppiamo i prodotti per categoria, applicando i prezzi override
  const groupedProducts = categories.map(category => ({
    category,
    items: MENU_DATA.filter(item => item.category === category).map(item => ({
      ...item,
      price: prices[item.id] !== undefined ? prices[item.id] : item.price,
    }))
  }));

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [displayCategory, setDisplayCategory] = useState<string>("");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    if (categories.length > 0) {
      let initialCat = categories[0];
      if (typeof window !== "undefined" && window.location.hash) {
        const decodedHash = decodeURIComponent(window.location.hash.replace("#", ""));
        if (categories.includes(decodedHash)) {
          initialCat = decodedHash;
        }
      }
      setActiveCategory(initialCat);
      setDisplayCategory(initialCat);
    }
  }, []);

  const handleCategoryChange = (newCat: string) => {
    if (newCat === activeCategory || isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveCategory(newCat);
    
    // Aggiorna l'hash dell'URL senza scorrere la pagina
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${encodeURIComponent(newCat)}`);
    }
    
    // Avvia la transizione dei dati dopo il fade-out
    setTimeout(() => {
      setDisplayCategory(newCat);
      setIsTransitioning(false);
    }, 150); // 150ms per l'effetto fade-out
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Mobile Dropdown (Sticky Top sotto l'header) */}
      <div className="md:hidden sticky top-20 z-20 bg-background/95 backdrop-blur-md border-b border-border shadow-md py-3 px-4">
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest text-[#b1c7f1] appearance-none focus:outline-none focus:border-[#b1c7f1]/60 shadow-lg cursor-pointer"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat} className="bg-background text-foreground font-bold uppercase tracking-widest">
                {cat}
              </option>
            ))}
          </select>
          {/* Custom Chevron Icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#b1c7f1]">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Desktop (Sticky Left) */}
          <aside className="hidden md:block md:col-span-1 sticky top-28 self-start space-y-4 border-r border-border/30 pr-6">
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-text/80">Categorie</h3>
            </div>
            <nav className="flex flex-col gap-1.5">
              {categories.map((cat, idx) => {
                const isActive = cat === activeCategory;
                return (
                  <button
                    key={idx}
                    onClick={() => handleCategoryChange(cat)}
                    className={`group flex items-center text-left py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 relative ${
                      isActive 
                        ? "text-[#b1c7f1] bg-[#b1c7f1]/5 font-extrabold shadow-sm border border-[#b1c7f1]/20" 
                        : "text-muted-text hover:text-[#b1c7f1] hover:bg-surface/30 border border-transparent"
                    }`}
                  >
                    {/* Indicatore dorato a sinistra */}
                    {isActive && (
                      <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#b1c7f1] rounded-full" />
                    )}
                    <span className={isActive ? "translate-x-1.5 transition-transform" : "group-hover:translate-x-1 transition-transform"}>
                      {cat}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Area Piatti (Colonna Principale) */}
          <div className="col-span-1 md:col-span-3">
            <div className={`transition-all duration-150 ease-in-out ${
              isTransitioning 
                ? "opacity-0 translate-y-4" 
                : "opacity-100 translate-y-0"
            }`}>
              {groupedProducts
                .filter(group => group.category === displayCategory)
                .map((group, idx) => (
                  <section key={idx} className="min-h-[50vh]">
                    <div className="mb-10 flex items-center justify-between border-b border-border/30 pb-6">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-serif text-accent mb-2">{group.category}</h2>
                        <div className="w-16 h-1 bg-accent" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-text bg-surface/80 border border-border/60 px-4 py-2 rounded-full shadow-sm">
                        {group.items.length} {group.items.length === 1 ? "Prodotto" : "Prodotti"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {group.items.map((item) => (
                        <ProductCard key={item.id} product={item} isAvailable={availability[item.id] !== false} />
                      ))}
                    </div>
                  </section>
                ))}
            </div>
          </div>

        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop bottomOffset="bottom-24 md:bottom-6" />
    </main>
  );
}
