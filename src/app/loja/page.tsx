"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp, Product } from "@/context/AppContext";
import { Search, SlidersHorizontal, ArrowUpDown, Tag, ShoppingBag, Eye } from "lucide-react";

export default function Loja() {
  const { products, categories, addToCart } = useApp();
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category_id === selectedCategory);
    }

    // Search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortOption]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    
    // Simple visual feedback
    const btn = e.currentTarget as HTMLButtonElement;
    const originalText = btn.innerHTML;
    btn.innerHTML = "Adicionado! ✓";
    btn.classList.add("bg-emerald-600", "text-white");
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove("bg-emerald-600", "text-white");
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col gap-2 text-left md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Loja Virtual Solidária</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Tudo o que seu pet precisa. 100% dos lucros apoiam o resgate de animais de rua.
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-400 text-xs font-bold w-fit">
          Cupom Ativo: <span className="underline">PATAS10</span> (10% OFF)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 flex flex-col gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <SlidersHorizontal className="h-5 w-5 text-primary-500" />
            <h3 className="font-extrabold text-base">Filtros</h3>
          </div>

          {/* Search bar */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Buscar produto</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: caminha, brinquedo..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:border-primary-500"
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => { setSelectedCategory("all"); setCurrentPage(1); }}
                className={`text-left px-3 py-2 text-sm rounded-xl transition-all ${
                  selectedCategory === "all"
                    ? "bg-primary-500 text-white font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                Todas as Categorias
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                  className={`text-left px-3 py-2 text-sm rounded-xl transition-all flex justify-between items-center ${
                    selectedCategory === cat.id
                      ? "bg-primary-500 text-white font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Ordenar por
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="default">Destaques</option>
              <option value="price-asc">Preço: Menor para Maior</option>
              <option value="price-desc">Preço: Maior para Menor</option>
              <option value="name-asc">Nome: A-Z</option>
            </select>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="lg:col-span-3 flex flex-col gap-8">
          {filteredProducts.length === 0 ? (
            <div className="glass p-12 text-center rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
              <span className="text-4xl">🔎</span>
              <h3 className="font-bold text-lg">Nenhum produto encontrado</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                Tente alterar os termos de busca ou remover os filtros aplicados para encontrar o que procura.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => {
                const category = categories.find(c => c.id === product.category_id);
                return (
                  <Link 
                    key={product.id} 
                    href={`/loja/produto/${product.id}`}
                    className="group glass border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-bold uppercase tracking-wider">
                            Esgotado
                          </div>
                        )}
                        {product.featured && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-primary-500 text-white text-[9px] font-bold rounded uppercase tracking-wider shadow">
                            Mais Vendido
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col gap-2 text-left">
                        {category && (
                          <span className="text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 tracking-wider">
                            {category.name}
                          </span>
                        )}
                        <h3 className="font-extrabold text-base line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer price & purchase */}
                    <div className="p-5 pt-0 flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400">Preço Solidário</span>
                        <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                          R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {product.stock > 0 ? (
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="px-4 py-2 bg-primary-100 dark:bg-primary-950/60 hover:bg-primary-600 hover:text-white text-primary-700 dark:text-primary-400 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1 shadow-sm"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Adicionar
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 rounded-xl text-xs font-bold cursor-not-allowed"
                        >
                          Indisponível
                        </button>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`h-9 w-9 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                    currentPage === page
                      ? "bg-primary-600 text-white"
                      : "border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              >
                Próxima
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
