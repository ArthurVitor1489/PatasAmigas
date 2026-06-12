"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  Home, 
  ShoppingBag, 
  Heart, 
  DollarSign, 
  User, 
  Sliders
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { currentUser, cart } = useApp();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const menuItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/loja", label: "Loja", icon: ShoppingBag, badge: totalItems > 0 ? totalItems : undefined },
    { href: "/adocao", label: "Adotar", icon: Heart },
    { href: "/doacoes", label: "Doar", icon: DollarSign },
  ];

  // Client / Admin button details
  const isUserAdmin = currentUser?.role === "admin";
  const userHref = isUserAdmin ? "/admin" : "/cliente";
  const userLabel = isUserAdmin ? "Admin" : "Conta";
  const UserIcon = isUserAdmin ? Sliders : User;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl py-2 px-3 pb-safe-bottom">
      <div className="flex items-center justify-around">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 relative ${
                isActive 
                  ? "text-primary-600 dark:text-primary-500 font-bold scale-105" 
                  : "text-slate-500 dark:text-slate-400 font-medium"
              }`}
            >
              <div className="relative">
                <Icon className="h-5.5 w-5.5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-brand-rose text-white text-[10px] font-extrabold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-wide">{item.label}</span>
            </Link>
          );
        })}
        {/* User Account Item */}
        <Link
          href={userHref}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 ${
            pathname.startsWith(userHref)
              ? "text-primary-600 dark:text-primary-500 font-bold scale-105" 
              : "text-slate-500 dark:text-slate-400 font-medium"
          }`}
        >
          <UserIcon className="h-5.5 w-5.5" />
          <span className="text-[10px] mt-1 tracking-wide">{userLabel}</span>
        </Link>
      </div>
    </nav>
  );
}
