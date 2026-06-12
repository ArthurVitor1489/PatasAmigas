"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Heart, QrCode, CreditCard, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

export default function Doacoes() {
  const { animals, makeDonation, currentUser } = useApp();

  // Tabs: 'one_time' | 'recurring' | 'sponsor'
  const [donationType, setDonationType] = useState<"one_time" | "recurring" | "sponsor">("one_time");
  
  // Frequency: 'monthly' | 'quarterly' | 'yearly'
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  
  // Selected Animal for Apadrinhamento
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  
  // Values
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState("");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");

  // Success view state
  const [step, setStep] = useState<"donate" | "success">("donate");

  const quickValues = [10, 20, 50, 100];

  const handleAmountSelect = (val: number) => {
    setSelectedAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const finalAmount = selectedAmount > 0 ? selectedAmount : parseFloat(customAmount) || 0;

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) {
      alert("Por favor, selecione ou digite um valor maior que zero.");
      return;
    }

    if (donationType === "sponsor" && !selectedAnimalId) {
      alert("Por favor, selecione o animal que deseja apadrinhar.");
      return;
    }

    makeDonation(
      finalAmount,
      donationType === "one_time" ? "one_time" : "recurring",
      donationType !== "one_time" ? frequency : undefined,
      donationType === "sponsor" ? selectedAnimalId : undefined
    );

    setStep("success");
  };

  // Success view
  if (step === "success") {
    const chosenAnimal = animals.find(a => a.id === selectedAnimalId);
    return (
      <div className="max-w-xl mx-auto py-12 text-center flex flex-col items-center gap-6">
        <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black">Muito Obrigado!</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Sua doação solidária de <span className="font-extrabold text-slate-800 dark:text-white">R$ {finalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span> foi processada com sucesso.
          </p>
          {donationType === "sponsor" && chosenAnimal && (
            <p className="text-xs text-primary-600 font-bold bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-850 px-4 py-2.5 rounded-xl mt-2">
              Você agora é padrinho do pet {chosenAnimal.name}! Acompanhe atualizações sobre ele na Área do Cliente.
            </p>
          )}
        </div>

        {paymentMethod === "pix" && (
          <div className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800 w-full flex flex-col items-center gap-4">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-primary-600">
              <QrCode className="h-4.5 w-4.5" />
              Concluir Pagamento do PIX
            </h3>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ongpatasamigas_donation_payment" 
                alt="QR Code PIX Doacao" 
                className="h-32 w-32"
              />
            </div>
            <input 
              type="text" 
              readOnly
              value="00020126580014br.gov.bcb.pix0136f001edc5-a75b-4559-96b0-124d8b30d2d4520400005303986540550.005802BR5916ONG_PATAS_AMIGAS6009SAO_PAULO62070503***6304E85B"
              className="w-full text-center px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-[9px] font-mono select-all focus:outline-none"
            />
          </div>
        )}

        <div className="flex gap-4">
          <Link 
            href="/cliente" 
            className="px-6 py-3 border border-slate-250 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Ver Minhas Doações
          </Link>
          <button 
            onClick={() => { setStep("donate"); setCustomAmount(""); setSelectedAmount(50); }}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all shadow-md"
          >
            Fazer outra Doação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4 text-left max-w-4xl mx-auto">
      
      {/* Introduction */}
      <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
        <span className="text-3xl">💝</span>
        <h1 className="text-3xl font-black">Como você deseja ajudar?</h1>
        <p className="text-slate-500 text-sm">
          Cada doação contribui para o resgate de animais, vacinas, cirurgias e manutenção do abrigo. Escolha a melhor modalidade para você.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Donation Types Buttons */}
        {[
          { id: "one_time", title: "Doação Única", desc: "Ajude de imediato com qualquer valor." },
          { id: "recurring", title: "Mensal / Anual", desc: "Apoio recorrente para manutenção contínua." },
          { id: "sponsor", title: "Apadrinhamento", desc: "Patrocine a alimentação e remédios de um pet." },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => { setDonationType(type.id as any); setStep("donate"); }}
            className={`p-6 rounded-2xl border-2 flex flex-col text-left gap-2 transition-all ${
              donationType === type.id
                ? "border-primary-500 bg-primary-50/20 dark:bg-primary-950/20 shadow-md scale-102"
                : "border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/30"
            }`}
          >
            <Heart className={`h-6 w-6 ${donationType === type.id ? "text-primary-500 fill-primary-500" : "text-slate-400"}`} />
            <h3 className="font-extrabold text-base">{type.title}</h3>
            <p className="text-xs text-slate-500">{type.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4">
        {/* Form Config */}
        <form onSubmit={handleDonateSubmit} className="lg:col-span-2 glass p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col gap-6">
          
          {/* Apadrinhar Pet list */}
          {donationType === "sponsor" && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Escolha o pet para apadrinhar *</label>
              <select
                required
                value={selectedAnimalId}
                onChange={(e) => setSelectedAnimalId(e.target.value)}
                className="w-full px-3.5 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
              >
                <option value="">Selecione um animal...</option>
                {animals.filter(a => a.status === "available").map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.breed} - {a.age})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Recurrence Frequency */}
          {donationType === "recurring" && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Frequência da contribuição</label>
              <div className="flex gap-2">
                {[
                  { id: "monthly", label: "Mensal" },
                  { id: "quarterly", label: "Trimestral" },
                  { id: "yearly", label: "Anual" },
                ].map((freq) => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setFrequency(freq.id as any)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      frequency === freq.id
                        ? "border-primary-500 bg-primary-50/20 text-primary-600 dark:text-primary-400 font-bold"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/20 text-slate-500"
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amount select */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-500 uppercase">Valor da Doação</label>
            <div className="grid grid-cols-4 gap-3">
              {quickValues.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAmountSelect(val)}
                  className={`py-3 rounded-xl text-sm font-extrabold border transition-all ${
                    selectedAmount === val
                      ? "border-primary-500 bg-primary-500 text-white font-bold"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/30"
                  }`}
                >
                  R$ {val}
                </button>
              ))}
            </div>
            
            {/* Custom value input */}
            <div className="relative mt-2">
              <input
                type="number"
                min="5"
                placeholder="Ou digite outro valor livre (Mínimo R$ 5)"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
              />
              <span className="absolute left-4 top-3.5 text-slate-400 text-sm font-bold">R$</span>
            </div>
          </div>

          {/* Payment method selection */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-500 uppercase">Método de pagamento</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "pix"
                    ? "border-primary-500 bg-primary-50/20 text-primary-600 dark:text-primary-400 font-bold"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/20 text-slate-500"
                }`}
              >
                <QrCode className="h-5 w-5" />
                PIX
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "card"
                    ? "border-primary-500 bg-primary-50/20 text-primary-600 dark:text-primary-400 font-bold"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/20 text-slate-500"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                Cartão de Crédito
              </button>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="submit"
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/10 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="h-4.5 w-4.5" />
            Confirmar Doação de R$ {finalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </button>
        </form>

        {/* Sidebar Info/Impact */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          {/* Social Impact Card */}
          <div className="glass border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 text-left">
            <h3 className="font-extrabold text-base text-primary-600 flex items-center gap-1">
              🐾
              Impacto de sua Doação
            </h3>
            <ul className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <p>
                  <span className="font-bold text-slate-800 dark:text-white">R$ 20</span> compra ração de boa qualidade para um cão filhote por uma semana.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <p>
                  <span className="font-bold text-slate-800 dark:text-white">R$ 50</span> paga uma dose completa de vacina importada (V10 / Quádrupla Felina).
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <p>
                  <span className="font-bold text-slate-800 dark:text-white">R$ 100</span> cobre a castração e exames básicos de um animal resgatado.
                </p>
              </li>
            </ul>
          </div>

          {/* Transparency pledge */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-3 text-left">
            <h4 className="font-bold text-xs uppercase text-slate-400 flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              Segurança
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Todos os pagamentos recorrentes e únicos utilizam criptografia SSL. Os dados do seu cartão são processados diretamente no checkout do Mercado Pago, de forma 100% segura e confidencial.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
