"use client";

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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Sticky Category Navigation */}
      <div className="sticky top-20 z-20 bg-background/95 backdrop-blur-md border-b border-border shadow-md">
        <div className="container mx-auto px-6 py-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-4 md:gap-8 min-w-max">
            {categories.map((cat, idx) => (
              <a 
                key={idx} 
                href={`#cat-${idx}`}
                className="text-sm font-bold uppercase tracking-widest text-muted-text hover:text-accent transition-colors whitespace-nowrap"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="py-12">
        {groupedProducts.map((group, idx) => (
          <section key={idx} id={`cat-${idx}`} className="pt-24 -mt-16 mb-16">
            <div className="container mx-auto px-6">
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-accent mb-2">{group.category}</h2>
                <div className="w-16 h-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((item) => (
                  <ProductCard key={item.id} product={item} isAvailable={availability[item.id] !== false} />
                ))}
              </div>
            </div>
          </section>
        ))}
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
