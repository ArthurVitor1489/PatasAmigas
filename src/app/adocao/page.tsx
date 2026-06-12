"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp, Animal } from "@/context/AppContext";
import { Search, Heart, Sparkles, X, Check, Activity, AlertCircle } from "lucide-react";

export default function Adocao() {
  const { animals } = useApp();

  // Filter state
  const [species, setSpecies] = useState("all");
  const [size, setSize] = useState("all");
  const [age, setAge] = useState("all");
  const [search, setSearch] = useState("");

  // Details Modal State
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  // Filter logic
  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      // Species filter
      if (species !== "all" && animal.species !== species) return false;
      
      // Size filter
      if (size !== "all" && animal.size !== size) return false;

      // Age filter
      if (age !== "all") {
        const ageLower = animal.age.toLowerCase();
        if (age === "puppy" && !ageLower.includes("filhote") && !ageLower.includes("meses")) return false;
        if (age === "adult" && !ageLower.includes("adulto") && !ageLower.includes("ano")) return false;
        if (age === "senior" && !ageLower.includes("idoso")) return false;
      }

      // Search term (name, breed, temperament)
      if (search.trim() !== "") {
        const query = search.toLowerCase();
        return (
          animal.name.toLowerCase().includes(query) ||
          animal.breed.toLowerCase().includes(query) ||
          animal.temperament.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [animals, species, size, age, search]);

  return (
    <div className="flex flex-col gap-8 py-4 text-left relative">
      
      {/* Header banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-500/10 via-primary-500/5 to-transparent border border-rose-500/10 p-8 md:p-12">
        <div className="max-w-xl flex flex-col gap-4">
          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 text-xs font-bold rounded-full w-fit flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            Adote uma Vida
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Adotar é um Ato de Amor</h1>
          <p className="text-slate-600 dark:text-slate-350 text-sm md:text-base leading-relaxed">
            Dê uma segunda chance a um cão ou gato resgatado. Todos os nossos pets passam por consultas completas, são vacinados, vermifugados e castrados.
          </p>
        </div>
      </div>

      {/* Catalog & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Panel */}
        <aside className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl h-fit shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-base">Filtros de Adoção</h3>
          </div>

          {/* Search by name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Nome ou Raça</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ex: bolinha, siamês..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Species */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Espécie</label>
            <div className="flex gap-2">
              {[
                { id: "all", label: "Todos" },
                { id: "dog", label: "Cães 🐶" },
                { id: "cat", label: "Gatos 🐱" },
              ].map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setSpecies(sp.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    species === sp.id
                      ? "border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-600 dark:text-slate-350"
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Porte</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
            >
              <option value="all">Todos os Portes</option>
              <option value="small">Porte Pequeno</option>
              <option value="medium">Porte Médio</option>
              <option value="large">Porte Grande</option>
            </select>
          </div>

          {/* Age Group */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Idade aproximada</label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
            >
              <option value="all">Todas as idades</option>
              <option value="puppy">Filhote (menos de 1 ano)</option>
              <option value="adult">Adulto (1 a 7 anos)</option>
              <option value="senior">Idoso (8+ anos)</option>
            </select>
          </div>
        </aside>

        {/* Animals Grid */}
        <main className="lg:col-span-3 flex flex-col gap-8">
          {filteredAnimals.length === 0 ? (
            <div className="glass p-12 text-center rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
              <span className="text-4xl">🐾</span>
              <h3 className="font-bold text-lg">Nenhum animal correspondente</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                Infelizmente nenhum de nossos pets disponíveis coincide com estes filtros. Tente flexibilizar suas escolhas!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimals.map((animal) => (
                <div 
                  key={animal.id}
                  onClick={() => setSelectedAnimal(animal)}
                  className="group glass border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Animal Photo with Status tag */}
                    <div className="relative h-56 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                      <img 
                        src={animal.images[0]} 
                        alt={animal.name} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      {animal.status === "pending" && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-[9px] font-extrabold rounded-md uppercase tracking-wider shadow">
                          Adoção em Andamento
                        </span>
                      )}
                      {animal.status === "adopted" && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500 text-white text-[9px] font-extrabold rounded-md uppercase tracking-wider shadow">
                          Adotado! 🎉
                        </span>
                      )}
                      {animal.featured && animal.status === "available" && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-rose-500 text-white text-[9px] font-extrabold rounded-md uppercase tracking-wider shadow flex items-center gap-0.5">
                          <Sparkles className="h-3 w-3" />
                          Destaque
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col gap-2 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-lg group-hover:text-primary-600 transition-colors">{animal.name}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                          {animal.species === "dog" ? "🐶 Cão" : "🐱 Gato"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{animal.breed}</span> • {animal.age}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Porte {animal.size === "small" ? "Pequeno" : animal.size === "medium" ? "Médio" : "Grande"}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-350 italic line-clamp-2 leading-relaxed mt-1">
                        "{animal.temperament}"
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto">
                    <button
                      type="button"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Conhecer História
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Animal Details Modal */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col p-6 md:p-8 relative gap-6">
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedAnimal(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-brand-rose rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Photo & Health info */}
              <div className="flex flex-col gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-250 dark:border-slate-800">
                  <img 
                    src={selectedAnimal.images[0]} 
                    alt={selectedAnimal.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Health Cards */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5 text-primary-500" />
                    Estado de Saúde
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnimal.health_status.map((status, idx) => (
                      <span key={idx} className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-bold flex items-center gap-1 border border-emerald-500/20">
                        <Check className="h-3.5 w-3.5" />
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black">{selectedAnimal.name}</h2>
                  <span className="px-2.5 py-1 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-lg uppercase">
                    {selectedAnimal.species === "dog" ? "🐶 Cachorro" : "🐱 Gato"}
                  </span>
                </div>

                <div className="flex flex-col text-xs text-slate-400 gap-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <p>Raça: <span className="font-bold text-slate-700 dark:text-slate-200">{selectedAnimal.breed}</span></p>
                  <p>Idade: <span className="font-bold text-slate-700 dark:text-slate-200">{selectedAnimal.age}</span></p>
                  <p>Porte: <span className="font-bold text-slate-700 dark:text-slate-200">{selectedAnimal.size === "small" ? "Pequeno" : selectedAnimal.size === "medium" ? "Médio" : "Grande"}</span></p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-sm">História de Resgate</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                    {selectedAnimal.history}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-sm">Temperamento</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic">
                    "{selectedAnimal.temperament}"
                  </p>
                </div>

                {selectedAnimal.special_needs && (
                  <div className="p-3 bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 rounded-xl flex items-start gap-2 text-xs leading-relaxed">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Cuidados Especiais: </span>
                      {selectedAnimal.special_needs}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 mt-2">
              <button 
                onClick={() => setSelectedAnimal(null)}
                className="px-6 py-3 border border-slate-200 dark:border-slate-850 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all"
              >
                Voltar
              </button>
              
              {selectedAnimal.status === "available" ? (
                <Link
                  href={`/adocao/solicitar/${selectedAnimal.id}`}
                  className="flex-1 py-3 text-center bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/10"
                >
                  <Heart className="h-4 w-4 fill-white" />
                  Iniciar Questionário de Adoção
                </Link>
              ) : (
                <button
                  disabled
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 rounded-xl text-xs font-bold cursor-not-allowed"
                >
                  {selectedAnimal.status === "pending" ? "Adoção em Andamento" : "Adotado! ✓"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
