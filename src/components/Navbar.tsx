"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Grid,
  LogOut,
  Sliders,
  DollarSign
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, currentUser, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Sync theme
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/loja", label: "Loja Virtual" },
    { href: "/adocao", label: "Adoção" },
    { href: "/doacoes", label: "Doações" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-md py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
              <Heart className="h-6 w-6 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-primary-600 dark:text-primary-500">Patas</span>
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-200">Amigas</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400 ${
                    isActive 
                      ? "text-primary-600 dark:text-primary-500" 
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
              aria-label="Alternar Tema"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Shopping Cart */}
            <Link 
              href="/loja/carrinho"
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-rose text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Account / Admin Dashboard */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link 
                  href={currentUser.role === "admin" ? "/admin" : "/cliente"}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {currentUser.role === "admin" ? <Sliders className="h-4 w-4 text-primary-500" /> : <User className="h-4 w-4 text-primary-500" />}
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-brand-rose hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/cliente"
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 hover:-translate-y-0.5"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link 
              href="/loja/carrinho"
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-rose text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-200 dark:border-slate-800 py-4 px-6 absolute top-full left-0 right-0 shadow-lg">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-semibold py-2 transition-colors ${
                    isActive 
                      ? "text-primary-600 dark:text-primary-500" 
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <hr className="border-slate-200 dark:border-slate-800 my-1" />
            {currentUser ? (
              <div className="flex flex-col gap-3">
                <Link 
                  href={currentUser.role === "admin" ? "/admin" : "/cliente"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 py-2"
                >
                  {currentUser.role === "admin" ? <Sliders className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  Painel de {currentUser.role === "admin" ? "Admin" : "Cliente"}
                </Link>
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="flex items-center gap-2 text-brand-rose font-semibold py-2 text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Sair da Conta
                </button>
              </div>
            ) : (
              <Link 
                href="/cliente"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 bg-primary-600 text-white rounded-xl font-bold shadow-md shadow-primary-500/10"
              >
                Minha Conta
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
