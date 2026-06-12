"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp, Article } from "@/context/AppContext";
import { ArrowLeft, BookOpen, Calendar, User, ChevronRight, X } from "lucide-react";

export default function Blog() {
  const { articles } = useApp();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="flex flex-col gap-8 py-4 text-left relative">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary-500" />
          Blog Patas Amigas
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Dicas de cuidados, guias de saúde animal, histórias emocionantes de resgates e transparência da nossa associação.
        </p>
      </div>

      {/* Articles Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((art) => (
          <div 
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="group glass border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="relative h-60 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col gap-3">
                {/* Meta details */}
                <div className="flex items-center gap-4 text-[10px] text-slate-450 uppercase font-bold tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(art.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    {art.author}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-xl group-hover:text-primary-600 transition-colors leading-tight">
                  {art.title}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 mt-auto">
              <span className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Ler Artigo Completo
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal View */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 md:p-8 relative gap-6">
            
            {/* Close */}
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="flex flex-col gap-6 text-left">
              {/* Cover Image */}
              <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Author Meta */}
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl sm:text-3xl font-black leading-tight">{selectedArticle.title}</h2>
                
                <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(selectedArticle.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4 text-slate-400" />
                    Por: {selectedArticle.author}
                  </span>
                </div>
              </div>

              {/* Article text body */}
              <article className="text-sm leading-relaxed text-slate-650 dark:text-slate-300 flex flex-col gap-4 whitespace-pre-wrap">
                {selectedArticle.content}
              </article>
            </div>

            {/* Back action */}
            <div className="flex border-t border-slate-100 dark:border-slate-800 pt-6 mt-2 justify-end">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Fechar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
