import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  CheckCircle2,
  Utensils,
  Stethoscope,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { BusinessProfile, ArchetypeId } from '../../types';
import { generateSvgLogo, LogoPresetType } from '../../utils/logoGenerator';

interface Props {
  business: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updatedBusiness: BusinessProfile) => void;
}

export const GoogleVerificationModal: React.FC<Props> = ({
  business,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [formData, setFormData] = useState<BusinessProfile>(() => {
    // If business has no logo, generate option 1 by default
    if (!business.logoUrl) {
      return {
        ...business,
        logoUrl: generateSvgLogo(business.name, 'geometric'),
        logoHeight: 44,
      };
    }
    return business;
  });
  const [selectedLogoPreset, setSelectedLogoPreset] = useState<LogoPresetType>('geometric');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'persuasivo' | 'acolhedor' | 'premium' | 'urgencia'>('persuasivo');
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Sync state when business prop changes
  React.useEffect(() => {
    if (!business.logoUrl) {
      setFormData({
        ...business,
        logoUrl: generateSvgLogo(business.name, 'geometric'),
        logoHeight: 44,
      });
    } else {
      setFormData(business);
    }
  }, [business]);

  const handleSelectLogoPreset = (type: LogoPresetType) => {
    setSelectedLogoPreset(type);
    const newLogoSvg = generateSvgLogo(formData.name, type);
    setFormData((prev) => ({
      ...prev,
      logoUrl: newLogoSvg,
      logoHeight: 44,
    }));
  };

  if (!isOpen) return null;

  // Filter ONLY 4 and 5-star reviews, sorted 5 then 4
  const filteredReviews = formData.reviews
    .filter((r) => r.rating >= 4)
    .sort((a, b) => b.rating - a.rating);

  const handleEnhanceWithAi = async () => {
    setIsEnhancing(true);
    setAiSuccessMessage(null);
    try {
      const res = await fetch('/api/enhance-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.name,
          category: formData.category,
          city: formData.city,
          originalBio: formData.shortBio,
          tone: selectedTone,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setFormData((prev) => ({
          ...prev,
          shortBio: data.text,
          subheadline: data.text,
        }));
        setAiSuccessMessage('Texto otimizado com sucesso pela IA!');
        setTimeout(() => setAiSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error('Falha ao aprimorar com IA:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleArchetypeChange = (arch: ArchetypeId) => {
    setFormData((prev) => ({
      ...prev,
      archetype: arch,
      ctaText:
        arch === 'gastronomia'
          ? 'Fazer Pedido no WhatsApp'
          : arch === 'servicos'
          ? 'Agendar Consulta no WhatsApp'
          : 'Pedir Orçamento no WhatsApp',
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Ficha de Verificação do Google Meu Negócio
              </h3>
              <p className="text-[11px] text-slate-500">
                Revise os dados importados antes de gerar a landing page oficial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-7 max-h-[78vh] overflow-y-auto space-y-6">
          {/* Photos and Identity Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            <div className="md:col-span-5 space-y-2">
              <div className="relative rounded-xl overflow-hidden h-44 sm:h-48 border border-slate-200 bg-slate-100 shadow-xs">
                <img
                  src={formData.coverImage}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
                  Foto de Capa Oficial
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {formData.galleryImages.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="h-12 rounded-lg overflow-hidden border border-slate-200">
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-md px-2 py-0.5 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Perfil Verificado no Google
                </span>
                <span className="text-xs text-slate-400">ID: {formData.id}</span>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-lg sm:text-xl font-extrabold text-slate-900 w-full border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-hidden py-0.5 transition-colors"
                />
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="text-xs sm:text-sm font-medium text-slate-500 w-full border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-hidden py-0.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border border-slate-200 rounded px-2 py-1 w-full text-xs font-medium"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="WhatsApp (ex: 5543999489000)"
                    className="border border-slate-200 rounded px-2 py-1 w-full text-xs font-medium text-emerald-700"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  {formData.address}, {formData.neighborhood} — {formData.city}/{formData.state}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs pt-1">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {formData.rating.toFixed(1)}
                  <span className="font-normal text-slate-500">({formData.reviewCount} avaliações)</span>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  🟢 Aberto agora
                </span>
              </div>

              {/* 3 Opções de Logo Geradas Automaticamente */}
              <div className="pt-2 border-t border-slate-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>Logomarca do Site (3 Opções Criadas Automaticamente):</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Clique para selecionar</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectLogoPreset('geometric')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedLogoPreset === 'geometric'
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="h-9 flex items-center justify-center bg-slate-50 rounded-lg p-1 overflow-hidden">
                      <img
                        src={generateSvgLogo(formData.name, 'geometric')}
                        alt="Opção 1"
                        className="max-h-7 max-w-full object-contain"
                      />
                    </div>
                    <span className="block text-[10px] font-bold text-slate-800 mt-1 text-center truncate">
                      Opção 1: Monograma
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectLogoPreset('emblem')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedLogoPreset === 'emblem'
                        ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="h-9 flex items-center justify-center bg-amber-50/40 rounded-lg p-1 overflow-hidden">
                      <img
                        src={generateSvgLogo(formData.name, 'emblem')}
                        alt="Opção 2"
                        className="max-h-7 max-w-full object-contain"
                      />
                    </div>
                    <span className="block text-[10px] font-bold text-slate-800 mt-1 text-center truncate">
                      Opção 2: Emblema Ouro
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectLogoPreset('minimalist')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedLogoPreset === 'minimalist'
                        ? 'bg-slate-100 border-slate-700 ring-2 ring-slate-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="h-9 flex items-center justify-center bg-slate-50 rounded-lg p-1 overflow-hidden">
                      <img
                        src={generateSvgLogo(formData.name, 'minimalist')}
                        alt="Opção 3"
                        className="max-h-7 max-w-full object-contain"
                      />
                    </div>
                    <span className="block text-[10px] font-bold text-slate-800 mt-1 text-center truncate">
                      Opção 3: Minimalista
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Presentation / Mini-Bio with AI Enhancement */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Apresentação Comercial / Mini-Bio
                </label>
                <p className="text-[11px] text-slate-500">
                  Texto magnético que aparece no topo da landing page para reter a atenção do cliente
                </p>
              </div>

              {/* AI Button and Tone Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value as any)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden"
                >
                  <option value="persuasivo">Tom Persuasivo (Conversão)</option>
                  <option value="acolhedor">Tom Acolhedor (Familiar)</option>
                  <option value="premium">Tom Premium (Alto Padrão)</option>
                  <option value="urgencia">Tom Agilidade (Pronta-Entrega)</option>
                </select>
                <button
                  type="button"
                  onClick={handleEnhanceWithAi}
                  disabled={isEnhancing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xs disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                  {isEnhancing ? 'Otimizando com IA...' : 'Melhorar com IA'}
                </button>
              </div>
            </div>

            {aiSuccessMessage && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {aiSuccessMessage}
              </div>
            )}

            <textarea
              rows={3}
              value={formData.shortBio}
              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 leading-relaxed"
              placeholder="Descreva a empresa em poucas linhas com foco em benefícios para o cliente..."
            />
          </div>

          {/* Archetype Recommendation & Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Arquétipo Visual Recomendado para este Segmento
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option A: Gastronomia */}
              <button
                type="button"
                onClick={() => handleArchetypeChange('gastronomia')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  formData.archetype === 'gastronomia'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                    <Utensils className="w-4 h-4" />
                  </div>
                  {formData.archetype === 'gastronomia' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Gastronomia & Restaurantes</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                  Paleta terrosa acolhedora, cardápio por abas e botão de pedido item a item no WhatsApp.
                </p>
              </button>

              {/* Option B: Serviços & Autoridade */}
              <button
                type="button"
                onClick={() => handleArchetypeChange('servicos')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  formData.archetype === 'servicos'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  {formData.archetype === 'servicos' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-700" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Serviços, Clínicas & Autoridade</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                  Azul profundo sofisticado, bento grid de especialidades, credenciais (CRM/OAB) e agendamento.
                </p>
              </button>

              {/* Option C: Produtos & Vitrine */}
              <button
                type="button"
                onClick={() => handleArchetypeChange('produtos')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  formData.archetype === 'produtos'
                    ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  {formData.archetype === 'produtos' && (
                    <CheckCircle2 className="w-4 h-4 text-rose-700" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">Produtos & Comércio Local</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                  Faixa de garantias (Pix com desconto, pronta-entrega) e catálogo com botão de cotação direta.
                </p>
              </button>
            </div>
          </div>

          {/* Filtered Google Reviews Preview (STRICT RULE: 4 & 5 stars only) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Avaliações Selecionadas para o Site (Filtro 4 e 5 Estrelas)
                </label>
                <p className="text-[11px] text-slate-500">
                  Apenas depoimentos nota máxima e excelente serão exibidos aos clientes
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {filteredReviews.length} avaliações qualificadas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: rev.avatarColor }}
                      >
                        {rev.initials}
                      </div>
                      <span className="font-bold text-slate-900 truncate max-w-[140px]">{rev.author}</span>
                    </div>
                    <div className="text-amber-400 font-semibold tracking-tighter">
                      {'★'.repeat(rev.rating)}
                    </div>
                  </div>
                  <p className="text-slate-600 line-clamp-2 italic text-[11px] leading-relaxed">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => onConfirm(formData)}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-950 hover:bg-slate-800 shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Confirmar e Gerar Site Oficial</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
