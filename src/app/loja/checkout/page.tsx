"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  CreditCard, 
  QrCode, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  MapPin, 
  ArrowRight,
  Info 
} from "lucide-react";

export default function Checkout() {
  const router = useRouter();
  const { cart, coupon, shippingCost, checkout, currentUser, login } = useApp();
  
  // Steps state: 'details' -> 'success'
  const [step, setStep] = useState<"details" | "success">("details");
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Address State
  const [address, setAddress] = useState({
    street: currentUser?.address?.street || "",
    number: "",
    complement: "",
    neighborhood: "",
    city: currentUser?.address?.city || "",
    state: currentUser?.address?.state || "",
    zip: currentUser?.address?.zip || "",
  });

  // Contact State
  const [contact, setContact] = useState({
    fullName: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "boleto">("pix");
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [formError, setFormError] = useState("");

  // Card details
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    installments: "1",
  });

  // Redirect if cart empty (and not in success screen)
  useEffect(() => {
    if (cart.length === 0 && step === "details") {
      router.push("/loja/carrinho");
    }
  }, [cart, step, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Simple validations
    if (!contact.fullName || !contact.email || !address.street || !address.city || !address.zip) {
      setFormError("Por favor, preencha todos os campos obrigatórios de endereço e contato.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        setFormError("Por favor, insira todos os dados do cartão de crédito.");
        return;
      }
    }

    if (!lgpdAccepted) {
      setFormError("Você precisa aceitar os termos de uso de dados (LGPD) para prosseguir.");
      return;
    }

    // Auto-login user if anonymous for order tracing
    if (!currentUser) {
      login(contact.email);
    }

    // Process order
    const order = checkout(paymentMethod, {
      ...address,
      fullName: contact.fullName,
      phone: contact.phone,
    });

    setCreatedOrder(order);
    setStep("success");
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = coupon ? subtotal * coupon.discount : 0;
  const shippingAmount = shippingCost || 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingAmount);

  // Success view
  if (step === "success" && createdOrder) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center flex flex-col items-center gap-8">
        <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Pedido Confirmado!</h1>
          <p className="text-sm text-slate-500">
            Muito obrigado! Seu pagamento foi aprovado e a ONG Patas Amigas agradece seu apoio.
          </p>
          <span className="text-xs font-bold text-slate-400 uppercase mt-2">Código do Pedido: {createdOrder.id}</span>
        </div>

        {/* PIX Payment Instructions */}
        {createdOrder.payment_method === "pix" && (
          <div className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800 w-full flex flex-col items-center gap-4">
            <h3 className="font-extrabold text-base flex items-center gap-1.5 text-primary-600">
              <QrCode className="h-5 w-5" />
              Pagamento via PIX Copia e Cola
            </h3>
            {/* Mock QR Code */}
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ongpatasamigas_mock_pix_payment" 
                alt="QR Code PIX" 
                className="h-36 w-36"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Chave PIX Copia e Cola</span>
              <input 
                type="text" 
                readOnly
                value="00020126580014br.gov.bcb.pix0136f001edc5-a75b-4559-96b0-124d8b30d2d4520400005303986540550.005802BR5916ONG_PATAS_AMIGAS6009SAO_PAULO62070503***6304E85B"
                className="w-full text-center px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-[10px] font-mono select-all focus:outline-none"
              />
              <button 
                onClick={(e) => {
                  navigator.clipboard.writeText(e.currentTarget.previousElementSibling?.getAttribute("value") || "");
                  const btn = e.currentTarget;
                  btn.innerHTML = "Copiado! ✓";
                  setTimeout(() => btn.innerHTML = "Copiar Código", 1500);
                }}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Copiar Código
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-sm">
              Escaneie o QR Code ou copie o código acima no aplicativo do seu banco. A aprovação é instantânea!
            </p>
          </div>
        )}

        {/* Boleto Payment Instructions */}
        {createdOrder.payment_method === "boleto" && (
          <div className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800 w-full flex flex-col items-center gap-4">
            <h3 className="font-extrabold text-base flex items-center gap-1.5 text-primary-600">
              <FileText className="h-5 w-5" />
              Boleto Bancário Gerado
            </h3>
            <p className="text-xs text-slate-500">
              O boleto foi enviado para o seu e-mail cadastrado e vencerá em 3 dias úteis.
            </p>
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Download do boleto simulado com sucesso!"); }}
              className="px-6 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Imprimir / Baixar Boleto PDF
            </a>
          </div>
        )}

        {/* Card Payment Instructions */}
        {createdOrder.payment_method === "card" && (
          <div className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800 w-full flex flex-col items-center gap-3">
            <h3 className="font-extrabold text-base flex items-center gap-1.5 text-primary-600">
              <CreditCard className="h-5 w-5" />
              Pagamento em Cartão de Crédito
            </h3>
            <p className="text-xs text-slate-500">
              O lançamento aparecerá na sua fatura como <span className="font-bold">ONG Patas Amigas</span>.
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Link 
            href="/cliente" 
            className="px-6 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-sm font-bold transition-all"
          >
            Ir para Minha Conta
          </Link>
          <Link 
            href="/loja" 
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-md"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4 text-left">
      <h1 className="text-3xl font-extrabold tracking-tight">Finalizar Compra</h1>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Information Forms */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Contact Details */}
          <div className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-base flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="h-5 w-5 text-primary-500" />
              1. Dados de Contato
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo *</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={contact.fullName}
                  onChange={handleContactChange}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">E-mail *</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={contact.email}
                  onChange={handleContactChange}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Telefone / WhatsApp *</label>
                <input 
                  type="text" 
                  name="phone"
                  required
                  value={contact.phone}
                  onChange={handleContactChange}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-base flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <MapPin className="h-5 w-5 text-primary-500" />
              2. Endereço de Entrega
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-4">
                <label className="text-xs font-bold text-slate-500 uppercase">Rua *</label>
                <input 
                  type="text" 
                  name="street"
                  required
                  value={address.street}
                  onChange={handleInputChange}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Número *</label>
                <input 
                  type="text" 
                  name="number"
                  required
                  value={address.number}
                  onChange={handleInputChange}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase">Complemento</label>
                <input 
                  type="text" 
                  name="complement"
                  value={address.complement}
                  onChange={handleInputChange}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase">Bairro *</label>
                <input 
                  type="text" 
                  name="neighborhood"
                  required
                  value={address.neighborhood}
                  onChange={handleInputChange}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-3">
                <label className="text-xs font-bold text-slate-500 uppercase">Cidade *</label>
                <input 
                  type="text" 
                  name="city"
                  required
                  value={address.city}
                  onChange={handleInputChange}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">UF *</label>
                <input 
                  type="text" 
                  name="state"
                  required
                  maxLength={2}
                  value={address.state}
                  onChange={handleInputChange}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none text-center"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">CEP *</label>
                <input 
                  type="text" 
                  name="zip"
                  required
                  value={address.zip}
                  onChange={handleInputChange}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-base flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <CreditCard className="h-5 w-5 text-primary-500" />
              3. Forma de Pagamento (Mercado Pago)
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: "pix", label: "PIX", icon: QrCode },
                { id: "card", label: "Cartão", icon: CreditCard },
                { id: "boleto", label: "Boleto", icon: FileText },
              ].map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => { setPaymentMethod(method.id as any); setFormError(""); }}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === method.id
                        ? "border-primary-500 bg-primary-50/20 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-bold scale-102"
                        : "border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-500"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs">{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Credit Card Inputs */}
            {paymentMethod === "card" && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Número do Cartão</label>
                  <input 
                    type="text" 
                    name="number"
                    maxLength={16}
                    placeholder="4532 ...."
                    value={cardDetails.number}
                    onChange={handleCardChange}
                    className="px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome do Titular</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="JOAO S SILVA"
                    value={cardDetails.name}
                    onChange={handleCardChange}
                    className="px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none uppercase"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Validade</label>
                  <input 
                    type="text" 
                    name="expiry"
                    maxLength={5}
                    placeholder="MM/AA"
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    className="px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none text-center"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">CVV</label>
                  <input 
                    type="text" 
                    name="cvv"
                    maxLength={4}
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    className="px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none text-center"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Parcelas</label>
                  <select 
                    name="installments"
                    value={cardDetails.installments}
                    onChange={handleCardChange}
                    className="px-3.5 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl text-sm focus:outline-none"
                  >
                    <option value="1">1x de R$ {finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} (Sem juros)</option>
                    <option value="2">2x de R$ {(finalTotal / 2).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</option>
                    <option value="3">3x de R$ {(finalTotal / 3).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Boleto Info */}
            {paymentMethod === "boleto" && (
              <div className="flex gap-2 items-start text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                <Info className="h-4.5 w-4.5 text-primary-500 shrink-0 mt-0.5" />
                <p>
                  O boleto tem prazo de vencimento de 3 dias úteis. A compensação pode levar até 24h a 48h úteis após o pagamento. Seu pedido começará a ser preparado somente após a compensação.
                </p>
              </div>
            )}

            {/* PIX Info */}
            {paymentMethod === "pix" && (
              <div className="flex gap-2 items-start text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                <Info className="h-4.5 w-4.5 text-primary-500 shrink-0 mt-0.5" />
                <p>
                  O pagamento via PIX é instantâneo e livre de taxas adicionais. Na próxima tela, você verá o QR Code e o código "Copia e Cola" para pagamento.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Checkout Summary & LGPD */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-6 sticky top-24">
            <h3 className="font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">Resumo da Compra</h3>

            {/* Item list mini */}
            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center gap-4 text-xs">
                  <div className="flex gap-2 items-center">
                    <img 
                      src={item.product.images[0]} 
                      alt="" 
                      className="h-8 w-8 rounded object-cover"
                    />
                    <span className="font-bold line-clamp-1">{item.product.name} (x{item.quantity})</span>
                  </div>
                  <span className="font-extrabold text-slate-950 dark:text-white shrink-0">
                    R$ {(item.product.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-slate-100 dark:border-slate-850" />

            {/* Totals */}
            <div className="flex flex-col gap-3 text-xs font-semibold">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-primary-600">
                  <span>Desconto ({coupon.code})</span>
                  <span>- R$ {discountAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Entrega</span>
                <span>{shippingAmount === 0 ? "Grátis" : `R$ ${shippingAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}</span>
              </div>
              <div className="flex justify-between items-end text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-150 dark:border-slate-800">
                <span>Valor Final</span>
                <span className="text-xl text-primary-600">R$ {finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* LGPD Consent Checkbox */}
            <div className="flex gap-2 items-start">
              <input 
                type="checkbox" 
                id="lgpd" 
                checked={lgpdAccepted}
                onChange={(e) => setLgpdAccepted(e.target.checked)}
                className="mt-1 accent-primary-600"
              />
              <label htmlFor="lgpd" className="text-[10px] text-slate-400 leading-relaxed cursor-pointer select-none">
                Estou ciente e aceito que meus dados cadastrais acima sejam utilizados para fins de faturamento e entrega deste pedido, em conformidade com a LGPD.
              </label>
            </div>

            {formError && (
              <p className="text-[11px] font-bold text-brand-rose leading-relaxed">{formError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20"
            >
              <ShieldCheck className="h-4.5 w-4.5" />
              Finalizar Pedido Solidário
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
