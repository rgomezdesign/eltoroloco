import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { ItemSheetProvider } from "@/components/ItemSheet";
import Reveal from "@/components/Reveal";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-bricolage", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "El Toro Loco Grill — Concept redesign", template: "%s — El Toro Loco Grill (concept)" },
  description: "A concept redesign of El Toro Loco Grill’s website and pickup ordering by Roman Gomez. Not affiliated with the restaurant.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="font-sans">
        <CartProvider>
          <ItemSheetProvider>
            {children}
            <Reveal />
          </ItemSheetProvider>
        </CartProvider>
      </body>
    </html>
  );
}
