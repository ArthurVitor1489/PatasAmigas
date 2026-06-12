"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp, Animal } from "@/context/AppContext";
import { ArrowLeft, Heart, CheckCircle2, ShieldAlert, Check, User, Home, Users, BookOpen } from "lucide-react";

export default function SolicitarAdocao() {
  const params = useParams();
  const router = useRouter();
  const { animals, submitAdoptionRequest, currentUser } = useApp();
  const [animal, setAnimal] = useState<Animal | null>(null);
  
  // Step state: 'personal' -> 'residence' -> 'routine' -> 'responsibility' -> 'success'
  const [step, setStep] = useState<"personal" | "residence" | "routine" | "responsibility" | "success">("personal");

  // Form inputs
  const [formData, setFormData] = useState({
    // Personal details
    fullName: currentUser?.name || "",
    cpf: "",
    birthDate: "",
    occupation: "",
    phone: currentUser?.phone || "",
    whatsapp: currentUser?.phone || "",
    address: currentUser?.address ? `${currentUser.address.street}, ${currentUser.address.city}` : "",
    
    // Residence
    residenceType: "casa",
    ownership: "propria",
    landlordAuth: "nao_se_aplica",
    hasYard: "sim",
    isFenced: "sim",
    hasScreens: "sim", // For cats
    
    // Routine & Family
    familyMembers: "1",
    allAgree: "sim",
    hasKids: "nao",
    kidsAge: "",
    hasAllergies: "nao",
    hoursAlone: "0-4h",
    aloneLocation: "quintal",
    travelPlans: "hotel_ou_hospedagem",
    
    // History & Commitment
    hadPetBefore: "sim",
    pastPetFate: "",
    hasCurrentPets: "nao",
    currentPetsDetails: "",
    budgetAware: "sim",
    vetEmergencyAware: "sim",
    relocationPlan: "levara_junto",
    badBehaviorReaction: "educar_com_paciencia",
    reason: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const animalId = params.id as string;
    const found = animals.find(a => a.id === animalId);
    if (found) {
      setAnimal(found);
    }
  }, [params.id, animals]);

  if (!animal) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <span className="text-3xl">⚠️</span>
        <h2 className="text-xl font-bold">Animal não encontrado</h2>
        <Link href="/adocao" className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold">
          Voltar para adoções
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePersonal = () => {
    if (!formData.fullName || !formData.cpf || !formData.phone || !formData.address || !formData.occupation || !formData.birthDate) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios deste passo.");
      return false;
    }
    if (formData.cpf.replace(/\D/g, "").length < 11) {
      setErrorMsg("Por favor, digite um CPF válido.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const validateResidence = () => {
    setErrorMsg("");
    return true;
  };

  const validateRoutine = () => {
    setErrorMsg("");
    return true;
  };

  const validateResponsibility = () => {
    if (!formData.reason.trim()) {
      setErrorMsg("Por favor, nos conte um pouco sobre o motivo da adoção.");
      return false;
    }
    setErrorMsg("");
    return true;
  };

  const handleNextStep = (current: string) => {
    if (current === "personal" && validatePersonal()) setStep("residence");
    if (current === "residence" && validateResidence()) setStep("routine");
    if (current === "routine" && validateRoutine()) setStep("responsibility");
  };

  const handlePrevStep = (current: string) => {
    if (current === "residence") setStep("personal");
    if (current === "routine") setStep("residence");
    if (current === "responsibility") setStep("routine");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateResponsibility()) {
      // Submit adoption request in AppContext
      submitAdoptionRequest(animal.id, formData);
      setStep("success");
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-xl mx-auto py-12 text-center flex flex-col items-center gap-6">
        <div className="h-16 w-16 bg-rose-100 dark:bg-rose-950 rounded-full flex items-center justify-center text-rose-500 animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black">Questionário Recebido!</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Sua solicitação para adotar o(a) <span className="font-extrabold text-slate-800 dark:text-slate-200">{animal.name}</span> foi enviada para nossos analistas.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mt-2">
            Entraremos em contato via WhatsApp/Telefone para agendar a sua entrevista online em até 72 horas úteis. Fique atento às notificações!
          </p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/cliente" 
            className="px-6 py-3 border border-slate-250 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Acompanhar no Painel
          </Link>
          <Link 
            href="/adocao" 
            className="px-6 py-3 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-colors"
          >
            Voltar para Adoções
          </Link>
        </div>
      </div>
    );
  }

  // Steps breadcrumbs
  const stepsList = [
    { id: "personal", label: "Identificação", icon: User },
    { id: "residence", label: "Residência", icon: Home },
    { id: "routine", label: "Rotina", icon: Users },
    { id: "responsibility", label: "Compromisso", icon: BookOpen },
  ];

  return (
    <div className="flex flex-col gap-8 py-4 text-left max-w-3xl mx-auto">
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-semibold transition-colors w-fit"
      >
        <ArrowLeft className="h-5 w-5" />
        Voltar para detalhes do Pet
      </button>

      {/* Steps indicators */}
      <div className="hidden sm:flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {stepsList.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = 
            (s.id === "personal" && step !== "personal") ||
            (s.id === "residence" && step !== "personal" && step !== "residence") ||
            (s.id === "routine" && step === "responsibility");

          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border font-bold text-xs transition-colors ${
                  isActive 
                    ? "bg-rose-500 text-white border-rose-500" 
                    : isDone
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-850"
                }`}>
                  {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`text-xs font-bold ${isActive ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
              {idx < stepsList.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-slate-200 dark:bg-slate-800"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/85 shadow-sm flex flex-col gap-6">
        
        {/* Banner with Pet details */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <img 
            src={animal.images[0]} 
            alt={animal.name} 
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Solicitação de Adoção responsável para</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{animal.name}</h2>
            <p className="text-xs text-slate-500">{animal.breed} • {animal.age}</p>
          </div>
        </div>

        <h3 className="font-extrabold text-lg flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Heart className="h-5 w-5 text-rose-500 fill-rose-500 animate-pulse" />
          Adoção Responsável: Passo {step === "personal" ? "1 de 4" : step === "residence" ? "2 de 4" : step === "routine" ? "3 de 4" : "4 de 4"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* STEP 1: PERSONAL DETAILS */}
          {step === "personal" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo *</label>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">CPF *</label>
                  <input 
                    type="text" 
                    name="cpf"
                    required
                    placeholder="Apenas números"
                    value={formData.cpf}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "");
                      setFormData(prev => ({ ...prev, cpf: cleaned }));
                    }}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Data de Nascimento *</label>
                  <input 
                    type="date" 
                    name="birthDate"
                    required
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Profissão *</label>
                  <input 
                    type="text" 
                    name="occupation"
                    required
                    placeholder="Ex: Engenheiro, Estudante..."
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Telefone / Fixo *</label>
                  <input 
                    type="text" 
                    name="phone"
                    required
                    placeholder="(11) 99999-8888"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp para contato *</label>
                  <input 
                    type="text" 
                    name="whatsapp"
                    required
                    placeholder="(11) 99999-8888"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Endereço Residencial Completo *</label>
                  <input 
                    type="text" 
                    name="address"
                    required
                    placeholder="Rua, Número, Bairro, CEP, Cidade - UF"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              {errorMsg && <p className="text-[11px] font-bold text-brand-rose">{errorMsg}</p>}

              <button
                type="button"
                onClick={() => handleNextStep("personal")}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
              >
                Avançar Passo
              </button>
            </div>
          )}

          {/* STEP 2: RESIDENCE CONFIG */}
          {step === "residence" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Residência</label>
                  <select
                    name="residenceType"
                    value={formData.residenceType}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="sitio">Sítio / Chácara</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">A residência é:</label>
                  <select
                    name="ownership"
                    value={formData.ownership}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="propria">Própria</option>
                    <option value="alugada">Alugada</option>
                  </select>
                </div>

                {formData.ownership === "alugada" && (
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">O proprietário ou imobiliária autoriza pets por escrito? *</label>
                    <select
                      name="landlordAuth"
                      value={formData.landlordAuth}
                      onChange={handleInputChange}
                      className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="sim">Sim, autoriza e tenho o contrato/permissão</option>
                      <option value="nao">Não, ou ainda não consultei</option>
                    </select>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Possui quintal com terra/grama?</label>
                  <select
                    name="hasYard"
                    value={formData.hasYard}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="sim">Sim</option>
                    <option value="nao">Não, sem quintal</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">O local possui muros ou portões seguros para evitar fugas?</label>
                  <select
                    name="isFenced"
                    value={formData.isFenced}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="sim">Sim, totalmente fechado</option>
                    <option value="nao">Não, tem portão baixo ou frestas</option>
                  </select>
                </div>

                {animal.species === "cat" && (
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Possui telas de proteção em todas as janelas/sacadas? (Obrigatório para gatos) *</label>
                    <select
                      name="hasScreens"
                      value={formData.hasScreens}
                      onChange={handleInputChange}
                      className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="sim">Sim, todas as janelas são teladas</option>
                      <option value="parcial">Apenas algumas janelas</option>
                      <option value="nao">Não possuo telas</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => handlePrevStep("residence")}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep("residence")}
                  className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold text-center"
                >
                  Avançar Passo
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ROUTINE & FAMILY */}
          {step === "routine" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Quantas pessoas moram na residência?</label>
                  <input 
                    type="number" 
                    name="familyMembers"
                    min="1"
                    value={formData.familyMembers}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none w-32"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Todos estão cientes e concordam com a adoção?</label>
                  <select
                    name="allAgree"
                    value={formData.allAgree}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="sim">Sim, todos estão felizes e de acordo</option>
                    <option value="nao">Não, há restrições por parte de alguém</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Possui crianças na casa?</label>
                  <select
                    name="hasKids"
                    value={formData.hasKids}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="nao">Não possui crianças</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>

                {formData.hasKids === "sim" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Qual a idade das crianças?</label>
                    <input 
                      type="text" 
                      name="kidsAge"
                      placeholder="Ex: 5 anos, 12 anos..."
                      value={formData.kidsAge}
                      onChange={handleInputChange}
                      className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Por quanto tempo o animal ficará sozinho por dia?</label>
                  <select
                    name="hoursAlone"
                    value={formData.hoursAlone}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="0-4h">Menos de 4 horas</option>
                    <option value="4-8h">De 4 a 8 horas</option>
                    <option value="8h+">Mais de 8 horas</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Onde o animal ficará quando estiver sozinho?</label>
                  <select
                    name="aloneLocation"
                    value={formData.aloneLocation}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="interno">Dentro de casa (livre)</option>
                    <option value="quintal">No quintal seguro</option>
                    <option value="area_servico">Lavanderia / Área de Serviço</option>
                    <option value="preso">Amarrado / Em canil fechado</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Em caso de viagens curtas ou férias, o que fará com o pet?</label>
                  <select
                    name="travelPlans"
                    value={formData.travelPlans}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="levara_junto">Levo comigo na viagem</option>
                    <option value="parente_cuida">Deixo com parente / amigo de confiança em casa</option>
                    <option value="hotel_ou_hospedagem">Pago hotelzinho pet / hospedagem</option>
                    <option value="sozinho_com_visita">Fica sozinho e alguém passa para alimentar</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => handlePrevStep("routine")}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep("routine")}
                  className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold text-center"
                >
                  Avançar Passo
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: COMPROMISSO & RESPONSABILIDADE */}
          {step === "responsibility" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Você já teve animais no passado?</label>
                  <select
                    name="hadPetBefore"
                    value={formData.hadPetBefore}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="sim">Sim</option>
                    <option value="nao">Não, é meu primeiro animal</option>
                  </select>
                </div>

                {formData.hadPetBefore === "sim" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Qual foi o destino deles? *</label>
                    <input 
                      type="text" 
                      name="pastPetFate"
                      placeholder="Ex: Faleceu de velhice, vive com meus pais..."
                      value={formData.pastPetFate}
                      onChange={handleInputChange}
                      className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Possui animais atualmente?</label>
                  <select
                    name="hasCurrentPets"
                    value={formData.hasCurrentPets}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="nao">Não possui animais no momento</option>
                    <option value="sim">Sim, possui</option>
                  </select>
                </div>

                {formData.hasCurrentPets === "sim" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Quais animais? (Espécie, idade, castrados)</label>
                    <input 
                      type="text" 
                      name="currentPetsDetails"
                      placeholder="Ex: 1 cão SRD de 3 anos, castrado e vacinado"
                      value={formData.currentPetsDetails}
                      onChange={handleInputChange}
                      className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Em caso de mudança de cidade/casa, o que fará?</label>
                  <select
                    name="relocationPlan"
                    value={formData.relocationPlan}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="levara_junto">Levo o pet junto comigo, sem dúvidas</option>
                    <option value="doara">Buscarei outro lar para ele</option>
                    <option value="deixara_com_alguem">Deixarei com parentes</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Ciente dos custos (ração, vacinas)?</label>
                  <select
                    name="budgetAware"
                    value={formData.budgetAware}
                    onChange={handleInputChange}
                    className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="sim">Sim, estou de acordo e posso arcar com os custos</option>
                    <option value="nao">Tenho receio sobre os custos</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Por que você quer adotar este animal? *</label>
                <textarea
                  name="reason"
                  required
                  rows={3}
                  placeholder="Conte-nos o motivo e por que escolheu este pet..."
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              {/* Legal warning */}
              <div className="p-4 bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs leading-relaxed">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Declaração de Responsabilidade Vitalícia: </span>
                  Adotar é assumir a guarda de um ser vivo por toda a sua existência (de 12 a 18 anos). Declaro que as respostas acima são verdadeiras e estou ciente de que maus-tratos ou abandono animal constituem crime ambiental sob pena de detenção e multa.
                </div>
              </div>

              {errorMsg && <p className="text-[11px] font-bold text-brand-rose">{errorMsg}</p>}

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => handlePrevStep("responsibility")}
                  className="px-5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold text-center shadow-lg shadow-rose-500/10"
                >
                  Enviar Formulário de Adoção
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
