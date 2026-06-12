import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ONG Patas Amigas | Proteção, Adoção e Loja Pet Solidária",
  description: "A ONG Patas Amigas resgata, cuida e promove a adoção responsável de cães e gatos. Visite nossa loja solidária e apoie doando ou apadrinhando.",
  keywords: ["ong pet", "adoção de cachorro", "adoção de gato", "doação para animais", "loja pet solidaria", "apadrinhar cachorro"],
  openGraph: {
    title: "ONG Patas Amigas | Proteção, Adoção e Loja Pet Solidária",
    description: "Ajude-nos a transformar vidas. Adote, doe, apadrinhe ou compre produtos pet na nossa loja virtual solidária.",
    images: ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&auto=format&fit=crop&q=80"],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <AppProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
