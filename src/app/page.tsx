"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { 
  Heart, 
  ShoppingBag, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Calendar,
  CheckCircle2,
  Users,
  ChevronRight,
  TrendingUp,
  Award,
  BookOpen
} from "lucide-react";

export default function Home() {
  const { products, animals, donations, orders } = useApp();

  // Pick featured animals (max 3 available)
  const featuredAnimals = animals.filter(a => a.status === "available").slice(0, 3);
  
  // Pick featured products (max 4)
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  // Dynamic statistics
  const totalRescued = animals.length + 142; // base offset
  const totalAdopted = animals.filter(a => a.status === "adopted").length + 98;
  const totalCastrations = 320;
  const totalFamilies = 84;
  
  // Calculate dynamic funds raised (from donations + orders)
  const donationsTotal = donations.reduce((sum, d) => sum + d.amount, 0);
  const salesTotal = orders.reduce((sum, o) => sum + o.total, 0);
  const totalFunds = 8420.00 + donationsTotal + salesTotal;

  // Testimonials state
  const testimonials = [
    {
      id: 1,
      name: "Camila Souza",
      role: "Adotante da Pipoca",
      content: "Adotar a Pipoca foi a melhor decisão da minha vida. A ONG deu todo o suporte, explicou sobre adoção responsável e hoje nossa casa está cheia de alegria!",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      name: "Guilherme Santos",
      role: "Doador e Padrinho do Apolo",
      content: "Acompanho o trabalho da ONG e vejo a prestação de contas mensal de forma muito clara. É gratificante saber exatamente para onde vão nossas doações.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      name: "Juliana Lima",
      role: "Compradora da Loja Pet",
      content: "Comprei a caminha soft e o moletom. A qualidade é incrível e o melhor de tudo é saber que 100% do lucro apoia o resgate de novos cães e gatinhos.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="flex flex-col gap-20 py-4">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500/10 via-primary-50/5 to-transparent border border-primary-500/10 p-8 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 rounded-full text-xs font-bold text-primary-700 dark:text-primary-400 w-fit">
              <Sparkles className="h-4 w-4" />
              Amor, Resgate & Cuidado Animal
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Dê um novo lar para quem só sabe <span className="text-primary-600 dark:text-primary-400">amar</span>.
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              Somos uma associação sem fins lucrativos dedicada ao resgate, reabilitação e adoção de animais abandonados. Encontre seu melhor amigo ou apoie nossa causa.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link 
                href="/adocao" 
                className="flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/35 hover:-translate-y-0.5"
              >
                <Heart className="h-5 w-5 fill-white" />
                Quero Adotar
              </Link>
              <Link 
                href="/loja" 
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl font-bold transition-all duration-300 shadow-md hover:-translate-y-0.5"
              >
                <ShoppingBag className="h-5 w-5" />
                Comprar na Loja
              </Link>
              <Link 
                href="/doacoes" 
                className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5"
              >
                <DollarSign className="h-5 w-5 text-primary-600" />
                Fazer Doação
              </Link>
            </div>
          </div>
          {/* Hero Banner Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-primary-400/20 blur-3xl rounded-full scale-75 -z-10"></div>
            <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-slate-800/40 shadow-2xl max-w-md md:max-w-lg">
              <img 
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80" 
                alt="Cãozinho feliz adotado" 
                className="w-full h-80 md:h-[420px] object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center text-white">
                  🐾
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pipoca adotada!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Hoje vive em São Paulo com a Camila.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NUMBERS THAT TRANSFORM LIVES */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Números que transformam vidas</h2>
          <p className="text-slate-500 dark:text-slate-400">Cada centavo arrecadado e cada adoção muda a realidade de animais desamparados.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { label: "Animais Resgatados", val: totalRescued, icon: Sparkles, color: "text-emerald-500" },
            { label: "Animais Adotados", val: totalAdopted, icon: Heart, color: "text-rose-500" },
            { label: "Castrações Feitas", val: totalCastrations, icon: CheckCircle2, color: "text-sky-500" },
            { label: "Famílias Apoiadas", val: totalFamilies, icon: Users, color: "text-indigo-500" },
            { label: "Valor Arrecadado", val: `R$ ${totalFunds.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-amber-500", cols: 2 },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className={`glass p-6 rounded-2xl flex flex-col gap-2 border border-slate-100 dark:border-slate-800/50 shadow-sm hover:scale-102 hover:border-primary-500/20 transition-all duration-300 ${stat.cols ? "col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span className="text-2xl font-extrabold tracking-tight">{stat.val}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2 text-left">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-primary-500" />
              Produtos em destaque
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Toda a receita gerada com a venda de produtos é revertida para resgates e medicamentos.</p>
          </div>
          <Link href="/loja" className="flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Ver Loja Completa
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group glass border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-primary-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow">
                    Solidário
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
              </div>
              <div className="p-5 pt-0 flex items-center justify-between mt-auto">
                <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
                <Link 
                  href={`/loja/produto/${product.id}`}
                  className="px-3.5 py-2 bg-primary-100 hover:bg-primary-600 text-primary-700 hover:text-white rounded-xl text-xs font-bold transition-all duration-200"
                >
                  Comprar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ANIMALS AVAILABLE FOR ADOPTION */}
      <section className="flex flex-col gap-8">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2 text-left">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
              Procurando um lar amoroso
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Todos os nossos animais são entregues castrados, vacinados e cheios de carinho para dar.</p>
          </div>
          <Link href="/adocao" className="flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Conhecer todos os pets
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAnimals.map((animal) => (
            <div key={animal.id} className="group glass border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img 
                    src={animal.images[0]} 
                    alt={animal.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {animal.health_status.slice(0, 2).map((status, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        ✓ {status}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-xl">{animal.name}</h3>
                    <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {animal.species === "dog" ? "🐶 Cão" : "🐱 Gato"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{animal.breed}</span> • {animal.age} • Porte {animal.size === "small" ? "Pequeno" : animal.size === "medium" ? "Médio" : "Grande"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed italic">
                    "{animal.temperament}"
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0 flex gap-3 mt-auto">
                <Link 
                  href={`/adocao/solicitar/${animal.id}`}
                  className="flex-1 py-3 text-center bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-md shadow-primary-500/10"
                >
                  Adotar
                </Link>
                <Link 
                  href="/doacoes"
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-sm font-bold transition-all duration-200 text-center"
                  title="Apadrinhar este animal"
                >
                  Apadrinhar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Quem apoia, aprova</h2>
          <p className="text-slate-500 dark:text-slate-400">Confira o relato de quem já adotou, doou ou comprou na nossa loja solidária.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div key={test.id} className="glass p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic mb-6">
                "{test.content}"
              </p>
              <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-800/50 pt-4">
                <img 
                  src={test.image} 
                  alt={test.name} 
                  className="h-10 w-10 rounded-full object-cover border border-primary-500/20"
                />
                <div>
                  <h4 className="font-bold text-sm">{test.name}</h4>
                  <p className="text-[10px] uppercase font-semibold text-primary-600 dark:text-primary-400 tracking-wider">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRANSPARENCY SECTION */}
      <section className="glass border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-400 w-fit">
              <ShieldCheck className="h-4 w-4" />
              Transparência Pública Ativa
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Prestação de Contas Aberta</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Toda contribuição financeira é direcionada para alimentação, consultas cirúrgicas, vacinas e resgate de animais. Publicamos relatórios de fluxo de caixa periodicamente para garantir que você saiba exatamente o impacto de sua ajuda.
            </p>
            <div className="grid grid-cols-2 gap-6 my-2">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 mt-1 rounded bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600">✓</div>
                <div>
                  <h4 className="font-bold text-sm">Medicamentos & Clínicas</h4>
                  <p className="text-xs text-slate-500">65% dos fundos arrecadados</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 mt-1 rounded bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600">✓</div>
                <div>
                  <h4 className="font-bold text-sm">Rações & Nutrição</h4>
                  <p className="text-xs text-slate-500">25% dos fundos arrecadados</p>
                </div>
              </div>
            </div>
            <Link 
              href="/doacoes" 
              className="flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors w-fit"
            >
              Acessar prestação de contas completa
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Transparency Graphic Mock */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Destinação de Recursos</span>
              <span className="text-xs font-semibold text-primary-600">Este Mês</span>
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { label: "Veterinários & Medicamentos", percent: 65, color: "bg-emerald-500" },
                { label: "Rações & Suprimentos", percent: 25, color: "bg-sky-500" },
                { label: "Manutenção do Canil/Gatil", percent: 7, color: "bg-indigo-500" },
                { label: "Resgates & Logística", percent: 3, color: "bg-amber-500" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{item.label}</span>
                    <span>{item.percent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4">
              <Award className="h-4 w-4 text-emerald-500" />
              Auditoria ativa via Supabase PostgreSQL.
            </div>
          </div>
        </div>
      </section>

      {/* 7. BLOG & CAMPANHAS BRIEF */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-lg uppercase tracking-wider w-fit">
              Campanha Ativa
            </span>
            <h3 className="font-extrabold text-2xl">Campanha Agasalho Pet: Proteja do Frio</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              O inverno está chegando e precisamos de cobertores, roupinhas e ração de alta caloria para os cães idosos que sentem mais frio. Cada caminha ou roupinha comprada na nossa loja solidária este mês adiciona um cobertor direto para o abrigo!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <Link 
              href="/loja"
              className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Comprar Roupinhas
            </Link>
            <Link 
              href="/doacoes"
              className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-colors"
            >
              Doar Agasalho (R$ 20)
            </Link>
          </div>
        </div>
        <div className="glass p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="h-10 w-10 bg-primary-100 dark:bg-primary-950 rounded-xl flex items-center justify-center text-primary-600">
              <BookOpen className="h-5.5 w-5.5" />
            </div>
            <h3 className="font-extrabold text-xl">Dicas & Conscientização</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Leia em nosso blog artigos educativos elaborados por veterinários parceiros sobre saúde, vacinação, cuidados e alimentação ideal para seu pet.
            </p>
          </div>
          <Link 
            href="/blog"
            className="flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors mt-6"
          >
            Acessar Artigos do Blog
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
