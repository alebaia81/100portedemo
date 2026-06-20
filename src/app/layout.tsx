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
  title: "Burger Lab | L'Hamburgeria Gourmet",
  description: "Hamburgeria Gourmet e Birreria Artigianale. Hamburger gourmet con ingredienti selezionati e carni pregiate. Ordina asporto via WhatsApp!",
  keywords: ["hamburgeria gourmet", "hamburger gourmet", "birreria artigianale", "burger lab"],
  openGraph: {
    title: "Burger Lab | L'Hamburgeria Gourmet",
    description: "Burger gourmet e birre artigianali di qualità superiore.",
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
