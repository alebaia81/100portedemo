import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, MapPin, Phone, Tv, Flame, Users, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tighter">
            L&apos;Hamburgeria <br />
            <span className="text-white italic font-serif">Gourmet</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-text mb-10 leading-relaxed">
            Carni selezionate, birre artigianali e l&apos;atmosfera autentica di un pub che ha fatto la storia locale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu" className="btn-logo-blue text-lg px-10 py-4">
              Ordina Ora
            </Link>
            <a href="#contatti" className="btn-amber-glow text-lg px-10 py-4 text-center">
              Vieni a trovarci
            </a>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <div className="border-b border-border bg-surface/30 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            
            <div className="flex flex-col items-center justify-center md:border-r border-border/50 px-4">
              <div className="p-4 bg-accent/10 rounded-full mb-4 text-accent">
                <Tv size={28} />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-foreground">Sky Sport & Dazn</h3>
              <p className="text-xs text-muted-text mt-2 leading-relaxed">Maxi schermo per <br/>non perderti le partite</p>
            </div>

            <div className="flex flex-col items-center justify-center md:border-r border-border/50 px-4">
              <div className="p-4 bg-accent/10 rounded-full mb-4 text-accent">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-foreground">Asporto & Ritiro</h3>
              <p className="text-xs text-muted-text mt-2 leading-relaxed">Ordina online e ritira <br/>il tuo menù caldo al pub</p>
            </div>

            <div className="flex flex-col items-center justify-center md:border-r border-border/50 px-4">
              <div className="p-4 bg-accent/10 rounded-full mb-4 text-accent">
                <Flame size={28} />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-foreground">Area Fumatori</h3>
              <p className="text-xs text-muted-text mt-2 leading-relaxed">Sala interna <br/>dedicata e confortevole</p>
            </div>

            <div className="flex flex-col items-center justify-center px-4">
              <div className="p-4 bg-accent/10 rounded-full mb-4 text-accent">
                <Users size={28} />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-foreground">Sala Privata</h3>
              <p className="text-xs text-muted-text mt-2 leading-relaxed">Con proiettore per <br/>compleanni e cene aziendali</p>
            </div>

          </div>
        </div>
      </div>

      {/* Chi Siamo Section */}
      <section id="chi-siamo" className="py-24 bg-background border-b border-border scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-sm font-bold uppercase tracking-widest text-accent block">La Nostra Storia</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
                Burger Lab: <br />
                Il Salotto del Gusto <span className="text-accent italic">Gourmet</span>.
              </h2>
              <div className="w-20 h-[2px] bg-accent mt-4" />
            </div>

            {/* Right Column: Paragraph Copy */}
            <div className="lg:col-span-7 space-y-6 text-muted-text text-base md:text-lg leading-relaxed font-light">
              <p>
                Nato come punto di incontro per generazioni, <span className="text-foreground font-medium">Burger Lab</span>{" "}unisce l&apos;anima autentica del pub di provincia alla continua ricerca culinaria. I nostri panini storici raccontano la tradizione locale, mentre gli hamburger gourmet celebrano l&apos;evoluzione del gusto.
              </p>
              <p>
                Prepariamo ogni piatto utilizzando solo tagli pregiati selezionati — come la pregiata <span className="text-accent font-semibold">Chianina IGP</span>, il saporito <span className="text-accent font-semibold">Black Angus</span> irlandese e la rinomata carne di <span className="text-accent font-semibold">Wagyu giapponese</span> — abbinandoli a ingredienti freschi e di qualità.
              </p>
              <p>
                Che sia per una cena in compagnia, per tifare la tua squadra del cuore davanti ai nostri maxi schermi o semplicemente per goderti una birra artigianale spillata a regola d&apos;arte, da Burger Lab trovi sempre un&apos;atmosfera calda, un servizio ospitale ed un sapore indimenticabile.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-bold tracking-widest uppercase text-sm">Feedback</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-accent mb-4">Dicono di noi</h2>
            <p className="text-muted-text">Più di una semplice hamburgeria. Una garanzia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="glass-card p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl border border-accent/30">M</div>
                <div>
                  <h4 className="font-bold">Marco T.</h4>
                  <p className="text-xs text-muted-text">Local Guide</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-sm text-muted-text italic flex-grow">
                {"\"Una garanzia per la serata! Il Wagyu Burger è qualcosa di eccezionale e la selezione di birre artigianali non delude mai. Personale simpatico e locale super accogliente. Consigliatissimo.\""}
              </p>
            </div>

            {/* Review 2 */}
            <div className="glass-card p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300 border-accent/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl border border-accent/30">L</div>
                <div>
                  <h4 className="font-bold">Laura S.</h4>
                  <p className="text-xs text-muted-text">15 recensioni</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-sm text-muted-text italic flex-grow">
                {"\"Punto di ritrovo fisso! Che sia per una cena al volo o per il fine serata, le loro pinse e i mitici 'Panini Storici' sono imbattibili. Ottima anche l'area per guardare le partite.\""}
              </p>
            </div>

            {/* Review 3 */}
            <div className="glass-card p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl border border-accent/30">D</div>
                <div>
                  <h4 className="font-bold">Davide M.</h4>
                  <p className="text-xs text-muted-text">Local Guide</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-sm text-muted-text italic flex-grow">
                {"\"Servizio veloce e qualità altissima. Ho provato il Doppio Manzo e le Patatas Diablo... spettacolo! Il locale ha un'atmosfera fantastica, perfetta per passare una serata tra amici.\""}
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="https://www.google.com/search?q=hamburgeria+gourmet+recensioni" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline font-bold uppercase tracking-widest"
            >
              Leggi tutte le recensioni su Google &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Atmosfera Section */}
      <section className="py-24 bg-surface/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-accent mb-4 block">Atmosfera</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground max-w-2xl">
                Vivi l&apos;esperienza nel nostro salotto rustico.
              </h2>
            </div>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors border-b border-accent pb-1"
            >
              Seguici su Instagram &rarr;
            </a>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
            {/* Tall Left Image */}
            <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group h-[400px] md:h-auto border border-border">
              <img 
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop" 
                alt="Interno rustico del pub" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            {/* Top Right 1 (Beer) */}
            <div className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden relative group h-[250px] md:h-auto border border-border">
              <img 
                src="/images/birra_artigianale.png" 
                alt="Birra artigianale" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Top Right 2 (Burger) */}
            <div className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden relative group h-[250px] md:h-auto border border-border">
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop" 
                alt="Hamburger gourmet" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Bottom Right (Wide) */}
            <div className="md:col-span-2 md:row-span-1 rounded-2xl overflow-hidden relative group h-[300px] md:h-auto border border-border">
              <img 
                src="/images/amici_pub.png" 
                alt="Amici che brindano" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="contatti" className="py-24 border-t border-border bg-surface/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Info & Contacts */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <span className="text-sm font-bold uppercase tracking-widest text-accent">Contatti</span>
                <h2 className="text-5xl md:text-6xl font-serif text-foreground">Vieni a Trovarci</h2>
              </div>

              <div className="space-y-8">
                {/* Indirizzo */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-accent">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-widest text-xs text-muted-text mb-1">Indirizzo</p>
                    <p className="text-foreground text-lg">Via Roma 11</p>
                    <p className="text-muted-text">20121 Milano (MI)</p>
                  </div>
                </div>

                {/* Orari */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-accent">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-widest text-xs text-muted-text mb-1">Orari</p>
                    <p className="text-foreground text-lg">Tutti i giorni: 18:00 - 01:00</p>
                    <p className="text-muted-text">Chiuso il Lunedì</p>
                  </div>
                </div>

                {/* Telefono */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-accent">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-widest text-xs text-muted-text mb-1">Prenotazioni</p>
                    <p className="text-foreground text-lg">+39 333 123 4567</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a href="tel:+393331234567" className="btn-amber-glow inline-block px-10 py-4 text-lg">
                  Prenota un tavolo
                </a>
              </div>
            </div>

            {/* Right Column: Map */}
            <div className="lg:col-span-7 h-[500px] lg:h-[600px] w-full relative rounded-2xl overflow-hidden border border-border glass-card group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2798.2435777610196!2d9.1895697!3d45.4641979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c14ea547af8d%3A0x9597ad8d9ff5f2db!2sPiazza%20del%20Duomo%2C%20Milano!5e0!3m2!1sit!2sit!4v1716060000000!5m2!1sit!2sit" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-80 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
              ></iframe>
              
              {/* Floating Info Box on Map (similar to screenshot) */}
              <a 
                href="https://maps.google.com/?q=Via+Roma+11+Milano"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 left-6 right-6 md:right-auto bg-surface/95 backdrop-blur-md p-4 rounded-xl border border-border shadow-2xl transition-transform transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:border-accent/40 block transition-all duration-300"
              >
                <p className="font-serif text-accent font-bold text-lg">Burger Lab</p>
                <p className="text-xs text-muted-text uppercase tracking-widest mt-1">Clicca per aprire in Maps</p>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Sticky Bottom CTA - solo mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t border-border p-4 flex gap-3">
        <a 
          href="tel:+393331234567"
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-border rounded-lg font-bold text-sm hover:border-accent transition-colors"
        >
          <Phone size={16} /> Chiama
        </a>
        <Link 
          href="/menu"
          className="flex-2 flex-grow flex items-center justify-center gap-2 py-3 btn-logo-blue text-sm"
        >
          <ShoppingBag size={16} /> Ordina Ora
        </Link>
      </div>

      {/* Spacer per sticky bar mobile */}
      <div className="md:hidden h-20" />
    </main>
  );
}
