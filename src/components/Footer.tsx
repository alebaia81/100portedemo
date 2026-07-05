import Link from "next/link";
import { Lock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background border-t border-border/40 py-10 px-6 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-2">
        <p className="text-xs sm:text-sm text-muted-text tracking-wide font-light">
          &copy; {currentYear} Burger Lab. Tutti i diritti riservati.
        </p>
        <p className="text-xs sm:text-sm text-muted-text/80 tracking-wide font-light">
          Design &amp; Sviluppo:{" "}
          <a
            href="https://presenzadigitale.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-300 font-medium"
          >
            Presenza Digitale
          </a>
        </p>
        
        {/* Link discreto all'area riservata */}
        <Link
          href="/admin-100p"
          className="flex items-center gap-1 text-[11px] text-muted-text/40 hover:text-accent/80 transition-colors duration-300 mt-2"
          aria-label="Accesso Area Riservata"
        >
          <Lock size={11} />
          <span>Area Riservata</span>
        </Link>
      </div>
    </footer>
  );
}

