import React from 'react';
import {
  X,
  Sparkles,
  Image,
  MousePointerClick,
  MessageSquare,
  Check,
  Layout,
  Sliders,
  Maximize2,
  Minimize2,
  Wand2,
} from 'lucide-react';
import { SelectedElementInspect, BusinessProfile } from '../../types';

interface Props {
  inspectData: SelectedElementInspect | null;
  onClose: () => void;
  business: BusinessProfile;
  onUpdateBusiness: (updated: BusinessProfile) => void;
}

export const InlineElementInspector: React.FC<Props> = ({
  inspectData,
  onClose,
  business,
  onUpdateBusiness,
}) => {
  if (!inspectData) return null;

  const isButton = inspectData.type === 'button';
  const isImage = inspectData.type === 'image';
  const isHero = inspectData.type === 'text' && inspectData.fieldPath === 'hero';

  const currentHeroLayout = business.heroLayout || 'boxed';
  const currentEffects = business.imageEffects || {
    brightness: 100,
    contrast: 100,
    filter: 'none',
    objectFit: 'cover',
  };

  const photoFilterPresets = [
    { id: 'none', name: 'Original Fiel', desc: 'Sem alterações, 100% autêntico' },
    { id: 'vibrant', name: 'Vibrante Comercial', desc: 'Realce de cores naturais' },
    { id: 'warm', name: 'Acolhedor / Quente', desc: 'Ideal para gastronomia e acolhimento' },
    { id: 'cool', name: 'Clínico & Nítido', desc: 'Cores sóbrias e alta definição' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-5 w-88 sm:w-96 animate-fade-in text-xs text-slate-800 max-h-[85vh] overflow-y-auto">
      {/* Popover Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            {isButton ? (
              <MousePointerClick className="w-4 h-4 text-emerald-400" />
            ) : isImage ? (
              <Image className="w-4 h-4 text-blue-400" />
            ) : (
              <Layout className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-950 text-sm leading-tight">
              {isButton
                ? 'Editar Botão & Ação'
                : isImage
                ? 'Tratar Foto Real da Empresa'
                : 'Configurações de Layout'}
            </h4>
            <span className="text-[10px] text-slate-400">Inspetor Contextual Studio Pro</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Button Controls */}
      {isButton && (
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Texto Principal do Botão
            </label>
            <input
              type="text"
              value={business.ctaText}
              onChange={(e) => onUpdateBusiness({ ...business, ctaText: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mensagem Automática do WhatsApp</span>
            </label>
            <textarea
              rows={2}
              value={business.ctaWhatsappMessage}
              onChange={(e) =>
                onUpdateBusiness({ ...business, ctaWhatsappMessage: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              placeholder="Olá! Vim pelo site e gostaria de..."
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Esta mensagem já abre pronta no celular do cliente ao clicar no botão.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Texto do Botão Secundário
            </label>
            <input
              type="text"
              value={business.secondaryCtaText}
              onChange={(e) =>
                onUpdateBusiness({ ...business, secondaryCtaText: e.target.value })
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      )}

      {/* Image & Real Photo Treatment Controls */}
      {isImage && (
        <div className="space-y-4">
          {/* Real Photo Philosophy Warning & Guarantee */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
              <Wand2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Otimizador de Fotos Reais da Empresa</span>
            </div>
            <p className="text-[10px] text-blue-700 leading-tight">
              Ajuste iluminação, enquadramento e nitidez mantendo 100% a autenticidade e a confiança da empresa local (sem distorções irreais de IA).
            </p>
          </div>

          {/* Photo Presets */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Tratamento de Cores & Nitidez</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {photoFilterPresets.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() =>
                    onUpdateBusiness({
                      ...business,
                      imageEffects: { ...currentEffects, filter: f.id as any },
                    })
                  }
                  className={`p-2 rounded-xl border text-left transition-all ${
                    currentEffects.filter === f.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{f.name}</span>
                  <span className={`text-[9px] block leading-tight ${currentEffects.filter === f.id ? 'text-slate-300' : 'text-slate-400'}`}>
                    {f.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Framing / Object Fit */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
              Enquadramento na Caixa
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateBusiness({
                    ...business,
                    imageEffects: { ...currentEffects, objectFit: 'cover' },
                  })
                }
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  currentEffects.objectFit === 'cover'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Preencher (Cover)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateBusiness({
                    ...business,
                    imageEffects: { ...currentEffects, objectFit: 'contain' },
                  })
                }
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  currentEffects.objectFit === 'contain'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Minimize2 className="w-3 h-3" />
                <span>Conter Inteira</span>
              </button>
            </div>
          </div>

          {/* URL Input */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              URL da Imagem Atual
            </label>
            <input
              type="text"
              value={business.coverImage}
              onChange={(e) => onUpdateBusiness({ ...business, coverImage: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Quick Real Photos from the Business */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Fotos Reais Importadas da Empresa:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[business.coverImage, business.secondaryImage, ...business.galleryImages].slice(0, 4).map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onUpdateBusiness({ ...business, coverImage: url })}
                  className="h-14 rounded-xl overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-500 transition-all relative group"
                >
                  <img src={url} alt="Foto da empresa" className="w-full h-full object-cover" />
                  <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold">
                    Usar
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Layout Variations Selector */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
        <label className="text-[11px] font-bold text-slate-700 block flex items-center justify-between">
          <span>Estilo de Layout do Hero</span>
          <span className="text-[10px] text-blue-600 font-semibold">1 Clique</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'boxed', label: '📦 Caixa Dividida (7/5)' },
            { id: 'fullscreen', label: '🖼️ Plano de Fundo Total' },
            { id: 'centered', label: '🎯 Centralizado Editorial' },
            { id: 'split-reversed', label: '🔄 Foto à Esquerda' },
          ].map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() =>
                onUpdateBusiness({ ...business, heroLayout: l.id as any })
              }
              className={`p-2 rounded-xl border text-left font-bold text-[11px] transition-all ${
                currentHeroLayout === l.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-950 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Salvar e Fechar</span>
        </button>
      </div>
    </div>
  );
};
