"use client";

import React from "react";
import Link from "next/link";
import { Heart, MessageSquare, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5511999998888?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20como%20ajudar%20a%20ONG!", "_blank");
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-24 md:pb-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand/About */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 bg-primary-500 rounded-xl flex items-center justify-center text-white">
                <Heart className="h-5.5 w-5.5 fill-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">Patas Amigas</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transformando a vida de animais resgatados através de cuidado, carinho e adoção responsável. Apoie nossa causa!
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary-600 hover:text-white rounded-xl transition-all duration-300 text-slate-400" aria-label="Instagram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary-600 hover:text-white rounded-xl transition-all duration-300 text-slate-400" aria-label="Facebook">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Links de Transparência */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 tracking-wide flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary-400" />
              Transparência
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/doacoes" className="hover:text-primary-400 transition-colors"> Prestação de Contas </Link>
              </li>
              <li>
                <Link href="/doacoes" className="hover:text-primary-400 transition-colors"> Relatórios Financeiros </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors"> Estatuto Social </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors"> Política de LGPD e Privacidade </a>
              </li>
            </ul>
          </div>

          {/* Parceiros / Apoio */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 tracking-wide">Parceiros de Resgate</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>🏥 Clínica Vet Amigo</li>
              <li>🐶 Rações PetMax</li>
              <li>🧬 Lab Patas (Exames)</li>
              <li>🛁 Banho & Tosa Estilo Animal</li>
            </ul>
          </div>

          {/* Contato & Endereço */}
          <div>
            <h4 className="text-white font-bold text-base mb-5 tracking-wide">Fale Conosco</h4>
            <p className="text-sm leading-relaxed mb-3">
              São Paulo - SP<br />
              contato@patasamigas.org<br />
              (11) 99999-8888
            </p>
            <p className="text-xs text-slate-500">
              CNPJ: 12.345.678/0001-99
            </p>
          </div>
        </div>

        <hr className="border-slate-800 my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} Associação Protetora Patas Amigas. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Termos de Uso</a>
            <a href="#" className="hover:text-slate-400">Privacidade</a>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center animate-bounce cursor-pointer group"
        title="Fale conosco no WhatsApp"
      >
        <MessageSquare className="h-6.5 w-6.5 fill-white text-emerald-500" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-sm font-semibold tracking-wide transition-all duration-500 whitespace-nowrap">
          Falar com a ONG
        </span>
      </button>
    </footer>
  );
}
