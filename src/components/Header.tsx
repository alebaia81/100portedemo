import Link from "next/link";
import { Phone, Instagram } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-serif font-bold tracking-tighter text-accent">
            100 PORTE
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] -mt-1 text-muted-text">
            Hamburgeria Pub
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-muted-text">
          <Link href="#menu" className="hover:text-accent transition-colors">Il Menù</Link>
          <Link href="#asporto" className="hover:text-accent transition-colors">Asporto</Link>
          <Link href="#contatti" className="hover:text-accent transition-colors">Dove Siamo</Link>
        </nav>

        <div className="flex items-center gap-4">
          <a 
            href="tel:+393398156719" 
            className="p-2 bg-surface border border-border rounded-full text-accent hover:scale-110 transition-transform"
          >
            <Phone size={18} />
          </a>
          <a 
            href="https://www.instagram.com/centoportepub" 
            target="_blank"
            className="p-2 bg-surface border border-border rounded-full text-accent hover:scale-110 transition-transform"
          >
            <Instagram size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}
