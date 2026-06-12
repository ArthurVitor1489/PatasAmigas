"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { 
  ShoppingBag, 
  Trash2, 
  Tag, 
  Truck, 
  ArrowRight, 
  Percent, 
  X 
} from "lucide-react";

export default function Carrinho() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    coupon, 
    applyCoupon, 
    removeCoupon, 
    shippingCost, 
    calculateShipping 
  } = useApp();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [zipResult, setZipResult] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = coupon ? subtotal * coupon.discount : 0;
  const shippingAmount = shippingCost || 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput("");
    } else {
      setCouponError("Cupom inválido ou expirado.");
    }
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setZipResult("");
    if (!zipInput.trim() || zipInput.length < 8) {
      setZipResult("Insira um CEP válido.");
      return;
    }

    const cost = calculateShipping(zipInput);
    setZipResult(`Frete calculado com sucesso! Entrega estimada em até 5 dias úteis.`);
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-6 max-w-md mx-auto">
        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Seu carrinho está vazio</h2>
          <p className="text-sm text-slate-500">
            Você ainda não adicionou nenhum produto. Visite nossa loja virtual e faça uma compra solidária!
          </p>
        </div>
        <Link 
          href="/loja" 
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-500/10"
        >
          Ir para a Loja
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4 text-left">
      <h1 className="text-3xl font-extrabold tracking-tight">Seu Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => (
            <div 
              key={item.product.id} 
              className="glass p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
            >
              {/* Product Info */}
              <div className="flex gap-4 items-center">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name} 
                  className="h-20 w-20 rounded-xl object-cover bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
                <div className="flex flex-col">
                  <h3 className="font-bold text-sm sm:text-base line-clamp-1">{item.product.name}</h3>
                  <span className="text-xs text-slate-400 mt-0.5">Preço Unitário: R$ {item.product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                    R$ {(item.product.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-slate-100 dark:border-slate-800/50 pt-3 sm:pt-0 sm:border-0">
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 p-1">
                  <button 
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="h-8 w-8 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="h-8 w-8 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-slate-400 hover:text-brand-rose hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
                  title="Remover produto"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Shipping and Coupons container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {/* Shipping Simulator */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <Truck className="h-4.5 w-4.5 text-primary-500" />
                Simulação de Frete
              </h4>
              <form onSubmit={handleCalculateShipping} className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={8}
                  placeholder="Digite seu CEP (8 dígitos)"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Calcular
                </button>
              </form>
              {zipResult && (
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed mt-1">
                  {zipResult}
                </p>
              )}
            </div>

            {/* Coupon Application */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-3">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <Tag className="h-4.5 w-4.5 text-primary-500" />
                Cupom de Desconto
              </h4>
              {coupon ? (
                <div className="flex items-center justify-between px-3 py-2 bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 rounded-xl">
                  <span className="text-xs font-bold text-primary-700 dark:text-primary-400 flex items-center gap-1">
                    <Percent className="h-3.5 w-3.5" />
                    {coupon.code} ({coupon.discount * 100}% OFF)
                  </span>
                  <button 
                    onClick={removeCoupon}
                    className="p-1 text-primary-700 hover:text-brand-rose hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                    title="Remover cupom"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Código do cupom (Ex: PATAS10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Aplicar
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] font-bold text-brand-rose mt-1">{couponError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Side Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-6 sticky top-24">
            <h3 className="font-extrabold text-lg border-b border-slate-100 dark:border-slate-800 pb-3">Resumo do Pedido</h3>

            <div className="flex flex-col gap-4 text-sm font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal dos itens</span>
                <span className="text-slate-800 dark:text-slate-200">R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>

              {coupon && (
                <div className="flex justify-between text-primary-600">
                  <span>Desconto ({coupon.code})</span>
                  <span>- R$ {discountAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Custo de Entrega</span>
                {shippingCost !== null ? (
                  <span className="text-slate-800 dark:text-slate-200">
                    {shippingAmount === 0 ? "Grátis" : `R$ ${shippingAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Calcular no painel ao lado</span>
                )}
              </div>

              <hr className="border-slate-200 dark:border-slate-800 my-1" />

              <div className="flex justify-between items-end text-base font-extrabold text-slate-900 dark:text-white">
                <span>Valor Total</span>
                <span className="text-2xl text-primary-600 dark:text-primary-500">
                  R$ {finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <Link 
              href="/loja/checkout" 
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 hover:-translate-y-0.5"
            >
              Ir para o Pagamento
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Ao comprar na nossa loja virtual, você aceita nossa política de privacidade em conformidade com a LGPD. Todo o lucro das vendas é direcionado para a manutenção das atividades da ONG.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
