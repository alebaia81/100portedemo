import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cento Porte Hamburgeria | Castelvetro Piacentino (PC)",
  description: "La migliore hamburgeria di Castelvetro Piacentino. Hamburger gourmet con carni Chianina, Angus e Fassona. Ordina asporto via WhatsApp!",
  keywords: ["hamburgeria castelvetro piacentino", "hamburger piacenza", "cento porte pub", "hamburgeria gourmet piacenza"],
  openGraph: {
    title: "Cento Porte Hamburgeria | Castelvetro Piacentino",
    description: "Burger gourmet e birre artigianali a Castelvetro Piacentino.",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${inter.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
