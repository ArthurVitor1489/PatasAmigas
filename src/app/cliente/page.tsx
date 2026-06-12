"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { 
  ShoppingBag, 
  Heart, 
  DollarSign, 
  User, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Key,
  ShieldCheck
} from "lucide-react";

export default function Cliente() {
  const { 
    currentUser, 
    login, 
    logout, 
    orders, 
    donations, 
    adoptionRequests 
  } = useApp();

  // Login form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"client" | "admin">("client");

  // Dashboard active tab: 'orders' | 'donations' | 'adoptions' | 'profile'
  const [activeTab, setActiveTab] = useState<"orders" | "donations" | "adoptions" | "profile">("orders");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Login using context logic
    login(email, loginRole);
  };

  // If NOT logged in, show Login/Signup forms
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-10 text-left">
        <div className="glass p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="text-center flex flex-col gap-1.5">
            <span className="text-3xl">👤</span>
            <h1 className="text-2xl font-black">Acessar Área do Cliente</h1>
            <p className="text-xs text-slate-500">
              Faça login para gerenciar seus pedidos, acompanhar suas doações ou gerenciar apadrinhamentos e solicitações de adoção.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">E-mail *</label>
              <input 
                type="email" 
                required
                placeholder="Ex: joao@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Senha *</label>
              <input 
                type="password" 
                placeholder="Digite sua senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
              />
            </div>

            {/* Simulated Roles selection */}
            <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Simular tipo de conta</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input 
                    type="radio" 
                    name="loginRole" 
                    checked={loginRole === "client"}
                    onChange={() => setLoginRole("client")}
                    className="accent-primary-600"
                  />
                  Cliente
                </label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input 
                    type="radio" 
                    name="loginRole" 
                    checked={loginRole === "admin"}
                    onChange={() => setLoginRole("admin")}
                    className="accent-primary-600"
                  />
                  Administrador (ONG)
                </label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-500/10"
            >
              Entrar na Conta
            </button>
          </form>

          {/* Quick instructions / credentials suggestion */}
          <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-1.5">
            <span className="font-bold flex items-center gap-1 text-slate-700 dark:text-slate-200">
              <Key className="h-3.5 w-3.5 text-primary-500" />
              Acesso Rápido de Testes:
            </span>
            <p>• Para Administrador: digite <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px] font-bold">admin@patas.org</span> e qualquer senha.</p>
            <p>• Para Cliente Comum: digite qualquer outro email.</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter lists related to current logged in user
  const userOrders = orders.filter((o) => o.user_id === currentUser.id || o.user_email === currentUser.email);
  const userDonations = donations.filter((d) => d.user_id === currentUser.id || d.user_name === currentUser.name);
  const userAdoptions = adoptionRequests.filter((a) => a.user_id === currentUser.id || a.user_email === currentUser.email);

  return (
    <div className="flex flex-col gap-8 py-4 text-left">
      
      {/* Header Account Information */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Área do Cliente</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Olá, {currentUser.name}!</h1>
          <p className="text-xs text-slate-500">Logado como: {currentUser.email} ({currentUser.role})</p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === "admin" && (
            <Link 
              href="/admin"
              className="px-4 py-2 text-xs font-bold bg-primary-100 hover:bg-primary-600 text-primary-700 hover:text-white rounded-xl border border-primary-200 dark:border-primary-850 transition-all shadow-sm"
            >
              Painel Admin ⚙️
            </Link>
          )}
          <button 
            onClick={logout}
            className="px-4 py-2 text-xs font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors"
          >
            Sair da Conta
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto gap-2">
        {[
          { id: "orders", label: "Meus Pedidos", icon: ShoppingBag, count: userOrders.length },
          { id: "donations", label: "Minhas Doações", icon: DollarSign, count: userDonations.length },
          { id: "adoptions", label: "Solicitações de Adoção", icon: Heart, count: userAdoptions.length },
          { id: "profile", label: "Meus Dados", icon: User, count: 0 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 font-bold text-sm transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600 dark:text-primary-400 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-350"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded-full text-[10px] text-slate-500 font-bold border dark:border-slate-800">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex flex-col gap-6">
        
        {/* TAB 1: ORDERS */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-4">
            {userOrders.length === 0 ? (
              <div className="glass p-12 text-center rounded-2xl border border-slate-100 dark:border-slate-900 flex flex-col items-center gap-3">
                <ShoppingBag className="h-10 w-10 text-slate-400" />
                <h3 className="font-bold text-base">Nenhum pedido de compra</h3>
                <p className="text-xs text-slate-500">
                  Você ainda não realizou compras na nossa loja virtual solidária.
                </p>
                <Link href="/loja" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/10">
                  Acessar Loja
                </Link>
              </div>
            ) : (
              userOrders.map((order) => (
                <div 
                  key={order.id}
                  className="glass border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
                >
                  {/* Order header information */}
                  <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
                    <div className="flex gap-4">
                      <div>
                        <span className="text-slate-400 block uppercase font-bold text-[10px]">Nº do Pedido</span>
                        <span className="font-bold text-slate-900 dark:text-white">{order.id}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase font-bold text-[10px]">Realizado em</span>
                        <span className="font-bold text-slate-900 dark:text-white">{new Date(order.created_at).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase font-bold text-[10px]">Valor Total</span>
                        <span className="font-extrabold text-primary-600 dark:text-primary-400">R$ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-wider flex items-center gap-1 ${
                      order.status === "paid" || order.status === "delivered"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : order.status === "cancelled"
                        ? "bg-rose-500/10 text-rose-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {order.status === "paid" && <CheckCircle className="h-3 w-3" />}
                      {order.status === "pending" && <Clock className="h-3 w-3" />}
                      {order.status === "shipped" && "🚚"}
                      {order.status === "delivered" && "✓"}
                      {order.status === "cancelled" && <AlertCircle className="h-3 w-3" />}
                      {order.status === "paid" ? "Pago e Aprovado" : order.status}
                    </span>
                  </div>

                  {/* Order Items list */}
                  <div className="flex flex-col gap-2 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-350">{item.product_name} <span className="font-bold text-slate-400">(x{item.quantity})</span></span>
                        <span className="font-bold">R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: DONATIONS */}
        {activeTab === "donations" && (
          <div className="flex flex-col gap-4">
            {userDonations.length === 0 ? (
              <div className="glass p-12 text-center rounded-2xl border border-slate-100 dark:border-slate-900 flex flex-col items-center gap-3">
                <DollarSign className="h-10 w-10 text-slate-400" />
                <h3 className="font-bold text-base">Nenhuma doação registrada</h3>
                <p className="text-xs text-slate-500">
                  Você ainda não realizou doações para apoiar os animais.
                </p>
                <Link href="/doacoes" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/10">
                  Apoiar ONG
                </Link>
              </div>
            ) : (
              userDonations.map((donation) => (
                <div 
                  key={donation.id}
                  className="glass border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-10 w-10 bg-primary-100 dark:bg-primary-950/60 rounded-xl flex items-center justify-center text-primary-600">
                      <DollarSign className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">
                        Doação {donation.type === "one_time" ? "Única" : "Recorrente"}
                        {donation.frequency && ` (${donation.frequency === "monthly" ? "Mensal" : donation.frequency})`}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Realizada em: {new Date(donation.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-base font-extrabold text-primary-600 dark:text-primary-400">
                      R$ {donation.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[9px] font-extrabold rounded-md uppercase tracking-wider">
                      Sucesso ✓
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: ADOPTIONS */}
        {activeTab === "adoptions" && (
          <div className="flex flex-col gap-4">
            {userAdoptions.length === 0 ? (
              <div className="glass p-12 text-center rounded-2xl border border-slate-100 dark:border-slate-900 flex flex-col items-center gap-3">
                <Heart className="h-10 w-10 text-slate-400" />
                <h3 className="font-bold text-base">Nenhuma solicitação enviada</h3>
                <p className="text-xs text-slate-500">
                  Você ainda não preencheu o questionário de adoção para nenhum pet.
                </p>
                <Link href="/adocao" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/10">
                  Conhecer Animais
                </Link>
              </div>
            ) : (
              userAdoptions.map((req) => (
                <div 
                  key={req.id}
                  className="glass border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm"
                >
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Solicitação de Adoção</span>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-0.5">Pet: {req.animal_name}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(req.created_at).toLocaleDateString("pt-BR")}
                      </span>
                      <span>ID: {req.id}</span>
                    </div>
                  </div>

                  {/* Status column */}
                  <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:border-0 justify-between">
                    <span className={`px-3 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-wider flex items-center gap-1.5 ${
                      req.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : req.status === "rejected"
                        ? "bg-rose-500/10 text-rose-600"
                        : req.status === "interview"
                        ? "bg-indigo-500/10 text-indigo-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {req.status === "pending" && (
                        <>
                          <Clock className="h-3.5 w-3.5 animate-spin" />
                          Pendente Análise
                        </>
                      )}
                      {req.status === "interview" && (
                        <>
                          <Calendar className="h-3.5 w-3.5" />
                          Entrevista Agendada
                        </>
                      )}
                      {req.status === "approved" && (
                        <>
                          <CheckCircle className="h-3.5 w-3.5" />
                          Aprovada! 🎉
                        </>
                      )}
                      {req.status === "rejected" && (
                        <>
                          <AlertCircle className="h-3.5 w-3.5" />
                          Recusada
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <div className="glass border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 text-left">
              <h3 className="font-bold text-base flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <User className="h-5 w-5 text-primary-500" />
                Dados Pessoais
              </h3>
              <div className="flex flex-col gap-3 text-sm font-medium">
                <div>
                  <span className="text-slate-400 block text-xs uppercase font-bold">Nome completo</span>
                  <span className="text-slate-800 dark:text-slate-200">{currentUser.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs uppercase font-bold">E-mail</span>
                  <span className="text-slate-800 dark:text-slate-200">{currentUser.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs uppercase font-bold">Telefone / WhatsApp</span>
                  <span className="text-slate-800 dark:text-slate-200">{currentUser.phone || "Não informado"}</span>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="glass border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 text-left">
              <h3 className="font-bold text-base flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <MapPin className="h-5 w-5 text-primary-500" />
                Endereço Padrão
              </h3>
              {currentUser.address ? (
                <div className="flex flex-col gap-3 text-sm font-medium">
                  <div>
                    <span className="text-slate-400 block text-xs uppercase font-bold">Logradouro</span>
                    <span className="text-slate-800 dark:text-slate-200">{currentUser.address.street}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block text-xs uppercase font-bold">Cidade - UF</span>
                      <span className="text-slate-800 dark:text-slate-200">{currentUser.address.city} - {currentUser.address.state}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs uppercase font-bold">CEP</span>
                      <span className="text-slate-800 dark:text-slate-200">{currentUser.address.zip}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Nenhum endereço cadastrado.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
