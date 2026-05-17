import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

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
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="100 Porte Pub"
            width={200}
            height={60}
            className="h-11 md:h-14 w-auto object-contain mix-blend-screen invert hue-rotate-180 drop-shadow-[0_0_8px_rgba(200,135,58,0.6)]"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-muted-text">
          <Link href="/menu" className="hover:text-accent transition-colors">Il Menù</Link>
          <Link href="/#contatti" className="hover:text-accent transition-colors">Dove Siamo</Link>
          <Link href="/menu" className="bg-accent text-background px-5 py-2 rounded-lg hover:bg-accent/90 transition-colors font-bold tracking-wider">Ordina Ora</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Ordina Ora visibile solo su mobile */}
          <Link 
            href="/menu" 
            className="md:hidden bg-accent text-background px-4 py-2 rounded-lg text-sm font-bold tracking-wider hover:bg-accent/90 transition-colors"
          >
            Ordina Ora
          </Link>
          <a 
            href="tel:+393398156719" 
            className="p-2 bg-surface border border-border rounded-full text-accent hover:scale-110 transition-transform"
          >
            <Phone size={18} />
          </a>
          <a 
            href="https://www.instagram.com/centoporte_pub/" 
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
