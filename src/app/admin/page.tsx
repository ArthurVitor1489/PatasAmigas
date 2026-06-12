"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp, Product, Animal } from "@/context/AppContext";
import { 
  TrendingUp, 
  Heart, 
  ShoppingBag, 
  DollarSign, 
  Sliders, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  Calendar,
  AlertCircle,
  Activity,
  Users
} from "lucide-react";

export default function AdminPanel() {
  const { 
    currentUser, 
    login,
    products, 
    animals, 
    orders, 
    donations, 
    adoptionRequests,
    categories,
    createProduct,
    updateProduct,
    deleteProduct,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    updateAdoptionRequestStatus,
    updateOrderStatus
  } = useApp();

  // Active Panel section: 'dashboard' | 'products' | 'animals' | 'adoptions' | 'orders' | 'donations'
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "animals" | "adoptions" | "orders" | "donations">("dashboard");

  // Edit/Create Modals State
  const [productForm, setProductForm] = useState<any | null>(null); // if not null, shows product form
  const [animalForm, setAnimalForm] = useState<any | null>(null);   // if not null, shows animal form

  // Handle access restriction
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="max-w-md mx-auto py-20 text-center flex flex-col items-center gap-6">
        <div className="h-16 w-16 bg-rose-100 dark:bg-rose-950 rounded-full flex items-center justify-center text-rose-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Acesso Restrito ao Administrador</h2>
          <p className="text-sm text-slate-500">
            Você precisa estar logado com uma conta administrativa para acessar este painel.
          </p>
        </div>
        <button
          onClick={() => login("admin@patas.org", "admin")}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
        >
          Entrar como Administrador de Teste
        </button>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const salesTotal = orders.reduce((sum, o) => sum + o.total, 0);
  const donationsTotal = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalImpactFunds = 8420 + salesTotal + donationsTotal;
  const pendingAdoptions = adoptionRequests.filter(r => r.status === "pending").length;

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock) return;

    const formatted = {
      ...productForm,
      price: parseFloat(productForm.price),
      stock: parseInt(productForm.stock),
      weight: parseFloat(productForm.weight) || 100,
      featured: productForm.featured === "true" || productForm.featured === true,
      images: [productForm.imageUrl || "https://images.unsplash.com/photo-1541599540903-216a46ca1fc0?w=600&auto=format&fit=crop&q=80"]
    };

    if (productForm.id) {
      updateProduct(formatted);
    } else {
      createProduct(formatted);
    }

    setProductForm(null);
  };

  const handleAnimalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalForm.name || !animalForm.age || !animalForm.breed) return;

    const formatted = {
      ...animalForm,
      featured: animalForm.featured === "true" || animalForm.featured === true,
      health_status: animalForm.health_status_raw ? animalForm.health_status_raw.split(",").map((s: string) => s.trim()) : ["Vacinado", "Castrado"],
      images: [animalForm.imageUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80"]
    };

    if (animalForm.id) {
      updateAnimal(formatted);
    } else {
      createAnimal(formatted);
    }

    setAnimalForm(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 py-4 text-left">
      
      {/* Sidebar Admin menu */}
      <aside className="md:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Sliders className="h-5 w-5 text-primary-500" />
          <h3 className="font-extrabold text-base">Painel ONG</h3>
        </div>

        <nav className="flex flex-col gap-1.5">
          {[
            { id: "dashboard", label: "Dashboard", icon: Activity },
            { id: "products", label: "Gerenciar Produtos", icon: ShoppingBag },
            { id: "animals", label: "Gerenciar Animais", icon: Heart },
            { id: "adoptions", label: "Pedidos de Adoção", icon: Heart },
            { id: "orders", label: "Pedidos de Vendas", icon: ShoppingBag },
            { id: "donations", label: "Histórico Doações", icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setProductForm(null); setAnimalForm(null); }}
                className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-primary-500 text-white font-extrabold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col gap-6">
        
        {/* SECTION 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-black">Dashboard Administrativo</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[
                { label: "Vendas na Loja", val: `R$ ${salesTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, color: "text-emerald-500" },
                { label: "Total Doações", val: `R$ ${donationsTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, color: "text-rose-500" },
                { label: "Fundos Totais", val: `R$ ${totalImpactFunds.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, color: "text-primary-500" },
                { label: "Adoções Pendentes", val: pendingAdoptions, color: "text-amber-500" },
              ].map((stat, i) => (
                <div key={i} className="glass p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  <span className={`text-xl font-extrabold tracking-tight ${stat.color}`}>{stat.val}</span>
                </div>
              ))}
            </div>

            {/* Recent Items Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-medium">
              
              {/* Recent Orders */}
              <div className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Últimas Vendas</h3>
                <div className="flex flex-col gap-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-900 pb-2">
                      <div className="text-left">
                        <span className="font-bold block text-slate-800 dark:text-slate-150">{order.id}</span>
                        <span className="text-[10px] text-slate-400">{order.user_email}</span>
                      </div>
                      <span className="font-extrabold text-primary-600">R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Adoptions */}
              <div className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Pedidos de Adoção Recentes</h3>
                <div className="flex flex-col gap-3">
                  {adoptionRequests.slice(0, 3).map((req) => (
                    <div key={req.id} className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-900 pb-2">
                      <div className="text-left">
                        <span className="font-bold block text-slate-800 dark:text-slate-150">Pet: {req.animal_name}</span>
                        <span className="text-[10px] text-slate-400">Solicitante: {req.user_name}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[9px] font-bold uppercase tracking-wider">{req.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: PRODUCTS CRUD */}
        {activeTab === "products" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black">Gerenciador de Produtos</h2>
              {!productForm && (
                <button
                  onClick={() => setProductForm({ name: "", price: "", stock: "5", category_id: categories[0]?.id || "", description: "", weight: "500", dimensions: "30x20x10 cm", featured: false, imageUrl: "" })}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Cadastrar Produto
                </button>
              )}
            </div>

            {/* Product form details */}
            {productForm ? (
              <form onSubmit={handleProductSubmit} className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                <h3 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                  {productForm.id ? "Editar Produto" : "Novo Produto"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nome do Produto</label>
                    <input 
                      type="text" 
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Categoria</label>
                    <select
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Preço (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Estoque inicial</label>
                    <input 
                      type="number" 
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">URL Imagem</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Descrição</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Salvar Produto
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setProductForm(null)}
                    className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              /* Products List */
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-850 font-bold uppercase text-[10px] text-slate-450 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Produto</th>
                      <th className="p-4">Preço</th>
                      <th className="p-4">Estoque</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={prod.images[0]} className="h-9 w-9 rounded object-cover" alt="" />
                            <span className="font-bold">{prod.name}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold">R$ {prod.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded font-bold ${prod.stock < 5 ? "bg-rose-500/10 text-rose-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                            {prod.stock} un
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setProductForm({ ...prod, imageUrl: prod.images[0] })}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                              title="Editar"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded text-brand-rose"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: ANIMALS CRUD */}
        {activeTab === "animals" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black">Gerenciador de Animais</h2>
              {!animalForm && (
                <button
                  onClick={() => setAnimalForm({ name: "", species: "dog", breed: "SRD", age: "6 meses", size: "medium", temperament: "Dócil e Brincalhão", history: "", health_status_raw: "Vacinado, Castrado", imageUrl: "" })}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Cadastrar Animal
                </button>
              )}
            </div>

            {animalForm ? (
              <form onSubmit={handleAnimalSubmit} className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                <h3 className="font-bold text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                  {animalForm.id ? "Editar Animal" : "Novo Animal"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nome do Pet</label>
                    <input 
                      type="text" 
                      required
                      value={animalForm.name}
                      onChange={(e) => setAnimalForm({ ...animalForm, name: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Espécie</label>
                    <select
                      value={animalForm.species}
                      onChange={(e) => setAnimalForm({ ...animalForm, species: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="dog">Cachorro</option>
                      <option value="cat">Gato</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Raça</label>
                    <input 
                      type="text" 
                      value={animalForm.breed}
                      onChange={(e) => setAnimalForm({ ...animalForm, breed: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Idade Aproximada</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: 8 meses, 2 anos"
                      value={animalForm.age}
                      onChange={(e) => setAnimalForm({ ...animalForm, age: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Porte</label>
                    <select
                      value={animalForm.size}
                      onChange={(e) => setAnimalForm({ ...animalForm, size: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="small">Pequeno</option>
                      <option value="medium">Médio</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">URL da Imagem</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={animalForm.imageUrl}
                      onChange={(e) => setAnimalForm({ ...animalForm, imageUrl: e.target.value })}
                      className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Saúde (Separado por vírgula)</label>
                  <input 
                    type="text" 
                    placeholder="Vacinado, Castrado, Vermifugado"
                    value={animalForm.health_status_raw}
                    onChange={(e) => setAnimalForm({ ...animalForm, health_status_raw: e.target.value })}
                    className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">História</label>
                  <textarea
                    rows={3}
                    value={animalForm.history}
                    onChange={(e) => setAnimalForm({ ...animalForm, history: e.target.value })}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Salvar Animal
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAnimalForm(null)}
                    className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              /* Animal list */
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-850 font-bold uppercase text-[10px] text-slate-450 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Animal</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {animals.map((an) => (
                      <tr key={an.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={an.images[0]} className="h-9 w-9 rounded object-cover" alt="" />
                            <div>
                              <span className="font-bold block">{an.name}</span>
                              <span className="text-[10px] text-slate-400">{an.breed} • {an.age}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider ${
                            an.status === "available"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : an.status === "adopted"
                              ? "bg-indigo-500/10 text-indigo-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}>
                            {an.status === "available" ? "Disponível" : an.status === "adopted" ? "Adotado" : "Pendente"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setAnimalForm({ ...an, imageUrl: an.images[0], health_status_raw: an.health_status.join(", ") })}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
                              title="Editar"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteAnimal(an.id)}
                              className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded text-brand-rose"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: ADOPTIONS MODERATOR */}
        {activeTab === "adoptions" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black">Moderar Solicitações de Adoção</h2>
            
            {adoptionRequests.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Nenhuma solicitação de adoção no histórico.</p>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-850 font-bold uppercase text-[10px] text-slate-450 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Pet</th>
                      <th className="p-4">Solicitante</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {adoptionRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-4 font-bold">{req.animal_name}</td>
                        <td className="p-4">
                          <div>
                            <span className="font-bold block">{req.user_name}</span>
                            <span className="text-[10px] text-slate-400">{req.user_email} • {req.answers?.phone}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider ${
                            req.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : req.status === "rejected"
                              ? "bg-rose-500/10 text-rose-600"
                              : req.status === "interview"
                              ? "bg-indigo-500/10 text-indigo-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}>
                            {req.status === "pending" ? "Pendente" : req.status === "interview" ? "Entrevista" : req.status === "approved" ? "Aprovado" : "Rejeitado"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {req.status === "pending" || req.status === "interview" ? (
                            <div className="flex justify-center gap-1.5">
                              <button
                                onClick={() => updateAdoptionRequestStatus(req.id, "approved")}
                                className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold"
                                title="Aprovar Adoção"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => updateAdoptionRequestStatus(req.id, "interview")}
                                className="px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-[10px] font-bold"
                                title="Agendar Entrevista"
                              >
                                Entrevista
                              </button>
                              <button
                                onClick={() => updateAdoptionRequestStatus(req.id, "rejected")}
                                className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded text-[10px] font-bold"
                                title="Rejeitar Solicitação"
                              >
                                Rejeitar
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[10px]">Concluído</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: ORDERS MODERATOR */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black">Gerenciar Pedidos de Vendas</h2>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-850 font-bold uppercase text-[10px] text-slate-450 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Pedido ID</th>
                    <th className="p-4">Comprador</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Mudar Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-bold">{order.id}</td>
                      <td className="p-4">{order.user_email}</td>
                      <td className="p-4 font-bold">R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider ${
                          order.status === "paid" || order.status === "delivered"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : order.status === "cancelled"
                            ? "bg-rose-500/10 text-rose-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="px-2 py-1 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded text-[11px]"
                        >
                          <option value="pending">Pendente</option>
                          <option value="paid">Pago</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregue</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 6: DONATIONS LOG */}
        {activeTab === "donations" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black">Histórico Financeiro de Doações</h2>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-850 font-bold uppercase text-[10px] text-slate-450 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Doador</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {donations.map((don) => (
                    <tr key={don.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4 font-bold">{don.user_name}</td>
                      <td className="p-4 uppercase text-[10px] font-bold text-slate-400">
                        {don.type === "one_time" ? "Única" : `Recorrente (${don.frequency})`}
                      </td>
                      <td className="p-4 font-bold text-emerald-600 dark:text-emerald-500">R$ {don.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td className="p-4 text-slate-400">{new Date(don.created_at).toLocaleDateString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
