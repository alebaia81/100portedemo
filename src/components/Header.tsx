"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { Phone, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

const InstagramIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const activeTheme = localStorage.getItem('theme') || 'dark';
    setTheme(activeTheme as any);
    if (activeTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2" onClick={handleLogoClick}>
          <div className="flex flex-col text-left drop-shadow-[0_0_8px_rgba(200,135,58,0.4)]">
            <span className="text-2xl md:text-3xl font-serif font-black tracking-wider text-accent uppercase leading-none">
              Burger
            </span>
            <span className="text-xs md:text-sm font-sans font-bold tracking-[0.25em] text-foreground uppercase leading-none mt-1">
              Lab
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-muted-text">
          <Link href="/#chi-siamo" className="hover:text-accent transition-colors">Chi Siamo</Link>
          <Link href="/#contatti" className="hover:text-accent transition-colors">Dove Siamo</Link>
          <Link href="/menu" className="btn-logo-blue px-5 py-2 tracking-wider">Ordina Ora</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Ordina Ora visibile solo su mobile */}
          <Link 
            href="/menu" 
            className="md:hidden btn-logo-blue px-4 py-2 text-sm tracking-wider"
          >
            Ordina Ora
          </Link>
          
          {/* Pulsante cambio tema globale */}
          <button 
            onClick={toggleTheme}
            className="p-2 bg-surface border border-border rounded-full text-accent hover:scale-110 transition-all duration-300"
            aria-label="Cambia tema chiaro/scuro"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <a 
            href="tel:+393398156719" 
            className="p-2 bg-surface border border-border rounded-full text-accent hover:scale-110 transition-transform"
          >
            <Phone size={18} />
          </a>
          <a 
            href="#" 
            target="_blank"
            className="hidden sm:block p-2 bg-surface border border-border rounded-full text-accent hover:scale-110 transition-transform"
          >
            <InstagramIcon size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}

