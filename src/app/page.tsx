import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import { MENU_DATA } from "@/lib/menu-data";
import { Clock, MapPin, Beer, Utensils, Zap } from "lucide-react";

export default function Home() {
  const promoItems = MENU_DATA.filter((item) => item.promo);
  const regularItems = MENU_DATA.filter((item) => !item.promo);

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 px-4 py-1 rounded-full text-accent text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
            <Zap size={14} /> Novità del Mese
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tighter">
            L&apos;Hamburgeria di <br />
            <span className="text-accent italic font-serif">Castelvetro</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-text mb-10 leading-relaxed">
            Carni selezionate, birre artigianali e l&apos;atmosfera autentica di un pub che ha fatto la storia locale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#menu" className="btn-primary text-lg px-10 py-4">
              Ordina Ora
            </a>
            <a href="#contatti" className="px-10 py-4 bg-surface/50 border border-border rounded-lg font-bold hover:bg-surface transition-all">
              Vieni a trovarci
            </a>
          </div>
        </div>
      </section>

      {/* Specialties / Promos */}
      <section className="py-24 bg-surface/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl mb-2">Le Specialità</h2>
              <p className="text-muted-text">Non lasciarti scappare le promo del mese.</p>
            </div>
            <div className="bg-steak-red/20 text-steak-red border border-steak-red/30 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <Zap size={16} /> Gadget in omaggio con ogni Menù!
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promoItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Menu */}
      <section id="menu" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Il Nostro Menù</h2>
            <div className="w-20 h-1 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="contatti" className="py-24 border-t border-border bg-surface/20">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="space-y-8">
            <h3 className="text-3xl font-serif">Contatti & Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg text-accent">
                  <MapPin />
                </div>
                <div>
                  <p className="font-bold">Via Roma 11</p>
                  <p className="text-sm text-muted-text">Castelvetro Piacentino (PC)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg text-accent">
                  <Clock />
                </div>
                <div>
                  <p className="font-bold">Orari Asporto</p>
                  <p className="text-sm text-muted-text">Aperti ogni sera dalle 18:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-serif">Il Locale</h3>
            <ul className="space-y-3 text-muted-text">
              <li className="flex items-center gap-2"><Beer size={18} className="text-accent" /> Ampia selezione di Birre Artigianali</li>
              <li className="flex items-center gap-2"><Utensils size={18} className="text-accent" /> Area Fumatori Interna</li>
              <li className="flex items-center gap-2"><Zap size={18} className="text-accent" /> Maxi schermo (Sky Sport & Dazn)</li>
              <li className="flex items-center gap-2"><Zap size={18} className="text-accent" /> Sala privata per compleanni</li>
            </ul>
          </div>

          <div className="glass-card p-8 text-center space-y-6">
            <h3 className="text-2xl font-serif italic text-accent">Prenota il tuo tavolo</h3>
            <p className="text-muted-text text-sm">
              Vuoi assicurarti il posto per la partita o per una cena tra amici?
            </p>
            <a href="tel:+393319121091" className="btn-primary w-full inline-block">
              Chiama Ora
            </a>
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      <CartDrawer />

      <footer className="py-12 border-t border-border text-center text-xs text-muted-text uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Cento Porte Pub & Hamburgeria. All rights reserved.
      </footer>
    </main>
  );
}
