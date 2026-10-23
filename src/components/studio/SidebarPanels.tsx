import React, { useState } from 'react';
import {
  Layers,
  Palette,
  Target,
  Users,
  ChevronUp,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  ShieldAlert,
  Plus,
  Trash2,
  Copy,
  Download,
  Code,
  CheckCircle2,
  Radio,
  Calendar,
  MessageSquare,
  AlertCircle,
  KeyRound,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  BusinessProfile,
  MarketingConfig,
  ThemeConfig,
  SectionToggle,
} from '../../types';
import { generateSchemaJsonLd } from '../../utils/exportHtml';

interface Props {
  business: BusinessProfile;
  onChangeBusiness: (updated: BusinessProfile) => void;
  marketing: MarketingConfig;
  onChangeMarketing: (updated: MarketingConfig) => void;
  theme: ThemeConfig;
  onChangeTheme: (updated: ThemeConfig) => void;
  sections: SectionToggle[];
  onToggleSection: (id: string) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  savedClients: BusinessProfile[];
  onSelectClient: (client: BusinessProfile) => void;
  onDuplicateClient: (client: BusinessProfile) => void;
  onDeleteClient: (id: string) => void;
  onDownloadClientHtml: (client: BusinessProfile) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  activeTab?: 'secoes' | 'design' | 'marketing' | 'clientes';
  onChangeActiveTab?: (tab: 'secoes' | 'design' | 'marketing' | 'clientes') => void;
}

export const SidebarPanels: React.FC<Props> = ({
  business,
  onChangeBusiness,
  marketing,
  onChangeMarketing,
  theme,
  onChangeTheme,
  sections,
  onToggleSection,
  onMoveSection,
  savedClients,
  onSelectClient,
  onDuplicateClient,
  onDeleteClient,
  onDownloadClientHtml,
  isOpen,
  onToggleOpen,
  activeTab: controlledActiveTab,
  onChangeActiveTab,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<'secoes' | 'design' | 'marketing' | 'clientes'>('secoes');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const setActiveTab = (tab: 'secoes' | 'design' | 'marketing' | 'clientes') => {
    if (onChangeActiveTab) {
      onChangeActiveTab(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };
  const [showSchemaPreview, setShowSchemaPreview] = useState(false);

  // Pre-set Palettes
  const palettes = [
    {
      id: 'clinico-azul',
      name: 'Azul Autoridade Clínico',
      primary: '#0F172A',
      accent: '#3B82F6',
      bg: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#0F172A',
      muted: '#64748B',
    },
    {
      id: 'gastronomico-verde',
      name: 'Verde Artesanal & Dourado (Simprão)',
      primary: '#153E23',
      accent: '#F3C94D',
      bg: '#F8F7F0',
      surface: '#FFFFFF',
      text: '#1B2516',
      muted: '#526649',
    },
    {
      id: 'comercio-grafite',
      name: 'Grafite Moderno & Vermelho Ação',
      primary: '#111827',
      accent: '#E11D48',
      bg: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#111827',
      muted: '#6B7280',
    },
    {
      id: 'esmeralda-sobrio',
      name: 'Esmeralda Sóbrio & Dourado',
      primary: '#064E3B',
      accent: '#D97706',
      bg: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#064E3B',
      muted: '#475569',
    },
    {
      id: 'minimalista-puro',
      name: 'Minimalista Preto & Branco',
      primary: '#09090B',
      accent: '#27272A',
      bg: '#FFFFFF',
      surface: '#F4F4F5',
      text: '#09090B',
      muted: '#71717A',
    },
  ];

  return (
    <aside
      className={`fixed lg:static top-16 bottom-0 left-0 z-20 bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 shadow-lg lg:shadow-none shrink-0 ${
        isOpen ? 'w-80 sm:w-88' : 'w-0 lg:w-14 overflow-hidden'
      }`}
    >
      {/* Tab Navigation Icons / Buttons */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1 shrink-0">
        <button
          onClick={() => {
            setActiveTab('secoes');
            if (!isOpen) onToggleOpen();
          }}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'secoes' && isOpen
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Seções e Ordem"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Seções</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('design');
            if (!isOpen) onToggleOpen();
          }}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'design' && isOpen
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Cores & Tipografia"
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Design</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('marketing');
            if (!isOpen) onToggleOpen();
          }}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'marketing' && isOpen
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Marketing, Pixels & SEO"
        >
          <Target className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pixels/SEO</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('clientes');
            if (!isOpen) onToggleOpen();
          }}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'clientes' && isOpen
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Clientes & Killswitch"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clientes</span>
        </button>
      </div>

      {/* Main Tab Panel Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs text-slate-700">
        {/* TAB 1: SEÇÕES DO SITE (MATCHES IMAGE 1) */}
        {activeTab === 'secoes' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Estrutura & Seções do Site</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Ative, desative e reordene as seções do site. O cabeçalho, rodapé e a barra de WhatsApp são permanentes.
              </p>
            </div>

            {/* Unified Sections List matching Reference Image 1 */}
            <div className="space-y-2">
              {sections.map((sec, index) => {
                const isPromo = sec.id === 'promocao';
                const isVideo = sec.id === 'video';

                return (
                  <div
                    key={sec.id}
                    className={`rounded-xl border transition-all ${
                      sec.enabled
                        ? 'bg-white border-slate-200/90 shadow-2xs'
                        : 'bg-slate-50/70 border-dashed border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="p-3 flex items-center justify-between gap-2">
                      {/* Left: Reorder Arrows (Up / Down) */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          disabled={index === 0}
                          onClick={() => onMoveSection(index, 'up')}
                          className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 cursor-pointer transition-colors"
                          title="Mover para Cima"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === sections.length - 1}
                          onClick={() => onMoveSection(index, 'down')}
                          className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 cursor-pointer transition-colors"
                          title="Mover para Baixo"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Center: Section Label */}
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-xs text-slate-900 block truncate">
                          {sec.label}
                        </span>
                        {isPromo && sec.enabled && (
                          <span className="text-[10px] text-amber-600 font-medium">
                            Oferta com cronômetro ativa
                          </span>
                        )}
                        {isVideo && sec.enabled && (
                          <span className="text-[10px] text-blue-600 font-medium">
                            Vídeo institucional ativo
                          </span>
                        )}
                      </div>

                      {/* Right: iOS Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => {
                          onToggleSection(sec.id);
                          if (isPromo) {
                            onChangeBusiness({
                              ...business,
                              promoBanner: {
                                ...business.promoBanner,
                                enabled: !sec.enabled,
                              },
                            });
                          }
                          if (isVideo) {
                            onChangeBusiness({
                              ...business,
                              videoSection: {
                                ...business.videoSection,
                                enabled: !sec.enabled,
                              },
                            });
                          }
                        }}
                        className="cursor-pointer shrink-0 transition-transform active:scale-95"
                        title={sec.enabled ? 'Desativar Seção' : 'Ativar Seção'}
                      >
                        {sec.enabled ? (
                          <ToggleRight className="w-6 h-6 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-300" />
                        )}
                      </button>
                    </div>

                    {/* Inline Sub-Editor for Promo Banner when Enabled */}
                    {isPromo && sec.enabled && (
                      <div className="px-3 pb-3 pt-1 border-t border-amber-100 bg-amber-50/50 rounded-b-xl space-y-2 text-xs">
                        <input
                          type="text"
                          value={business.promoBanner.title}
                          onChange={(e) =>
                            onChangeBusiness({
                              ...business,
                              promoBanner: { ...business.promoBanner, title: e.target.value },
                            })
                          }
                          placeholder="Título da oferta (ex: Primeira Consulta com 20% OFF)..."
                          className="w-full p-1.5 text-[11px] bg-white border border-amber-200 rounded-lg"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block">De (R$)</label>
                            <input
                              type="number"
                              value={business.promoBanner.oldPrice}
                              onChange={(e) =>
                                onChangeBusiness({
                                  ...business,
                                  promoBanner: {
                                    ...business.promoBanner,
                                    oldPrice: parseFloat(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-full p-1.5 text-[11px] bg-white border border-amber-200 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block">Por (R$)</label>
                            <input
                              type="number"
                              value={business.promoBanner.promoPrice}
                              onChange={(e) =>
                                onChangeBusiness({
                                  ...business,
                                  promoBanner: {
                                    ...business.promoBanner,
                                    promoPrice: parseFloat(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-full p-1.5 text-[11px] bg-white border border-amber-200 rounded-lg font-bold text-emerald-700"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Inline Sub-Editor for Video when Enabled */}
                    {isVideo && sec.enabled && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-200 bg-slate-50/70 rounded-b-xl space-y-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                            Título do Bloco de Vídeo
                          </label>
                          <input
                            type="text"
                            value={business.videoSection.title}
                            onChange={(e) =>
                              onChangeBusiness({
                                ...business,
                                videoSection: { ...business.videoSection, title: e.target.value },
                              })
                            }
                            placeholder="Conheça nossa estrutura..."
                            className="w-full p-1.5 text-[11px] bg-white border border-slate-200 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                            Link do Vídeo (MP4 direto ou YouTube)
                          </label>
                          <input
                            type="text"
                            value={business.videoSection.videoUrl}
                            onChange={(e) =>
                              onChangeBusiness({
                                ...business,
                                videoSection: { ...business.videoSection, videoUrl: e.target.value },
                              })
                            }
                            placeholder="https://...mp4 ou https://youtube.com/..."
                            className="w-full p-1.5 text-[11px] font-mono bg-white border border-slate-200 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                            Imagem de Capa (Poster antes do play)
                          </label>
                          <input
                            type="text"
                            value={business.videoSection.posterUrl}
                            onChange={(e) =>
                              onChangeBusiness({
                                ...business,
                                videoSection: { ...business.videoSection, posterUrl: e.target.value },
                              })
                            }
                            placeholder="https://... (URL da foto antes do play)"
                            className="w-full p-1.5 text-[11px] font-mono bg-white border border-slate-200 rounded-lg"
                          />
                        </div>

                        <div className="pt-1">
                          <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                            Carregar Exemplo Rápido:
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                onChangeBusiness({
                                  ...business,
                                  videoSection: {
                                    ...business.videoSection,
                                    videoUrl:
                                      'https://assets.mixkit.co/videos/preview/mixkit-doctor-checking-a-patient-with-a-stethoscope-41221-large.mp4',
                                    posterUrl:
                                      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
                                    title: 'Conheça o Instituto por dentro',
                                  },
                                })
                              }
                              className="p-1.5 bg-white hover:bg-blue-50 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700 text-left truncate cursor-pointer"
                            >
                              Clínica / Saúde
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onChangeBusiness({
                                  ...business,
                                  videoSection: {
                                    ...business.videoSection,
                                    videoUrl:
                                      'https://assets.mixkit.co/videos/preview/mixkit-chef-plating-a-dish-in-a-restaurant-kitchen-42777-large.mp4',
                                    posterUrl:
                                      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
                                    title: 'Cozinha Artesanal & Tradição',
                                  },
                                })
                              }
                              className="p-1.5 bg-white hover:bg-amber-50 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700 text-left truncate cursor-pointer"
                            >
                              Gastronomia
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DESIGN & CORES */}
        {activeTab === 'design' && (
          <div className="space-y-5">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Paletas & Identidade Visual</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Alterne paletas completas e fontes sem perder nenhum texto editado
              </p>
            </div>

            {/* Quick 1-Click Palettes */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Paletas Globais Selecionáveis
              </span>
              <div className="space-y-1.5">
                {palettes.map((p) => {
                  const isSelected = theme.primaryColor === p.primary;
                  return (
                    <button
                      key={p.id}
                      onClick={() =>
                        onChangeTheme({
                          ...theme,
                          id: p.id,
                          name: p.name,
                          primaryColor: p.primary,
                          accentColor: p.accent,
                          backgroundColor: p.bg,
                          surfaceColor: p.surface,
                          textColor: p.text,
                          mutedTextColor: p.muted,
                        })
                      }
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center -space-x-1">
                          <span
                            className="w-4 h-4 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: p.primary }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: p.accent }}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: p.bg }}
                          />
                        </div>
                        <span className="font-semibold text-slate-800 text-xs">{p.name}</span>
                      </div>
                      {isSelected && <span className="text-[10px] font-bold text-slate-900">Ativa</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Pairings */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Par Tipográfico Principal
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  {
                    id: 'Plus Jakarta Sans',
                    name: 'Plus Jakarta Sans',
                    desc: 'Moderna, geométrica e de altíssima legibilidade em telas.',
                  },
                  {
                    id: 'Playfair Display',
                    name: 'Playfair Display',
                    desc: 'Editorial clássica, sofisticada e ideal para clínicas e luxo.',
                  },
                  {
                    id: 'Inter',
                    name: 'Inter Pro',
                    desc: 'Neogrotesca limpa, funcional e padrão Canva / Apple.',
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() =>
                      onChangeTheme({ ...theme, fontFamily: f.id as any })
                    }
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      theme.fontFamily === f.id
                        ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-slate-900 block">{f.name}</span>
                    <span className="text-[11px] text-slate-500 leading-tight">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Layout Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Modelo de Layout do Topo (Hero)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'boxed', label: '📦 Caixa Dividida' },
                  { id: 'fullscreen', label: '🖼️ Plano de Fundo' },
                  { id: 'centered', label: '🎯 Centralizado' },
                  { id: 'split-reversed', label: '🔄 Foto Invertida' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onChangeBusiness({ ...business, heroLayout: item.id as any })
                    }
                    className={`p-2 rounded-lg border text-center font-semibold text-[11px] transition-all ${
                      (business.heroLayout || 'boxed') === item.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Button Style & Animation Effects */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Efeito dos Botões de WhatsApp
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'elevated', label: 'Elevação Suave' },
                  { id: 'shimmer', label: 'Brilho Shimmer' },
                  { id: 'pulse', label: 'Pulso Discreto' },
                  { id: 'outline', label: 'Contorno Nobre' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() =>
                      onChangeTheme({ ...theme, buttonStyle: b.id as any })
                    }
                    className={`p-2 rounded-lg border text-center font-semibold text-[11px] transition-all ${
                      theme.buttonStyle === b.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MARKETING, PIXELS & SEO */}
        {activeTab === 'marketing' && (
          <div className="space-y-5">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Marketing, Pixels & SEO Local</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Cole apenas os IDs. Os eventos de conversão no WhatsApp serão disparados
                automaticamente.
              </p>
            </div>

            {/* Meta Pixel Field */}
            <div className="space-y-1.5 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
              <label className="font-bold text-slate-900 block text-xs flex items-center justify-between">
                <span>Meta Pixel ID (Facebook & Instagram Ads)</span>
                <span className="text-[10px] text-blue-700 font-medium">Auto fbq(&apos;track&apos;, &apos;Contact&apos;)</span>
              </label>
              <input
                type="text"
                value={marketing.metaPixelId}
                onChange={(e) => onChangeMarketing({ ...marketing, metaPixelId: e.target.value })}
                placeholder="Ex: 123456789012345"
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
              />
              <p className="text-[10px] text-slate-500 leading-tight">
                Dispara evento oficial de contato a cada clique no WhatsApp ou ligação telefônica.
              </p>
            </div>

            {/* Google Ads Field */}
            <div className="space-y-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <label className="font-bold text-slate-900 block text-xs">Google Ads (ID + Rótulo)</label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  value={marketing.googleAdsId}
                  onChange={(e) => onChangeMarketing({ ...marketing, googleAdsId: e.target.value })}
                  placeholder="AW-XXXXXXXXX"
                  className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
                <input
                  type="text"
                  value={marketing.googleAdsLabel}
                  onChange={(e) => onChangeMarketing({ ...marketing, googleAdsLabel: e.target.value })}
                  placeholder="Rótulo (opcional)"
                  className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* GTM & GA4 */}
            <div className="space-y-2">
              <label className="font-bold text-slate-900 block text-xs">Google Tag Manager & GA4</label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  value={marketing.gtmId}
                  onChange={(e) => onChangeMarketing({ ...marketing, gtmId: e.target.value })}
                  placeholder="GTM-XXXXXX"
                  className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
                <input
                  type="text"
                  value={marketing.ga4Id}
                  onChange={(e) => onChangeMarketing({ ...marketing, ga4Id: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* Google Search Console */}
            <div className="space-y-1">
              <label className="font-bold text-slate-900 block text-xs">Google Search Console</label>
              <input
                type="text"
                value={marketing.searchConsoleCode}
                onChange={(e) => onChangeMarketing({ ...marketing, searchConsoleCode: e.target.value })}
                placeholder="Código de verificação HTML tag"
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            {/* SEO Semântico & Schema.org JSON-LD */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Schema.org JSON-LD Local</span>
                <button
                  onClick={() => setShowSchemaPreview(!showSchemaPreview)}
                  className="text-blue-600 hover:underline text-[11px] font-semibold flex items-center gap-1"
                >
                  <Code className="w-3 h-3" />
                  {showSchemaPreview ? 'Ocultar' : 'Ver Código'}
                </button>
              </div>

              {showSchemaPreview && (
                <pre className="p-2.5 bg-slate-950 text-emerald-400 rounded-lg text-[10px] overflow-x-auto max-h-48 font-mono">
                  {generateSchemaJsonLd(business)}
                </pre>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 block">Título SEO Personalizado</label>
                <input
                  type="text"
                  value={marketing.customMetaTitle}
                  onChange={(e) => onChangeMarketing({ ...marketing, customMetaTitle: e.target.value })}
                  placeholder={`${business.name} — ${business.city}/${business.state}`}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 block">Meta Description</label>
                <textarea
                  rows={2}
                  value={marketing.customMetaDescription}
                  onChange={(e) => onChangeMarketing({ ...marketing, customMetaDescription: e.target.value })}
                  placeholder={business.shortBio}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MEUS CLIENTES, ANUIDADES & KILLSWITCH */}
        {activeTab === 'clientes' && (
          <div className="space-y-5">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Gerenciador de Clientes & Assinaturas</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Controle de anuidades, alertas preventivos de vencimento, cobrança por WhatsApp e killswitch
              </p>
            </div>

            {/* Current Client Status Switch (Killswitch) */}
            <div
              className={`p-3.5 rounded-2xl border space-y-2.5 transition-colors ${
                business.status === 'active'
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-rose-50 border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Status do Site Ativo no Studio</span>
                  <span
                    className={`text-[11px] font-semibold ${
                      business.status === 'active' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {business.status === 'active' ? '🟢 Ativo no Ar (Público)' : '🔴 Suspenso (Tela de Bloqueio)'}
                  </span>
                </div>

                <button
                  onClick={() =>
                    onChangeBusiness({
                      ...business,
                      status: business.status === 'active' ? 'suspended' : 'active',
                    })
                  }
                  className="font-bold text-sm"
                  title="Alternar Status no Ar / Suspenso"
                >
                  {business.status === 'active' ? (
                    <ToggleRight className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-rose-600" />
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-600">Link Público:</span>
                <a
                  href={`/site/${business.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>/site/{business.slug}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* List of Saved Clients with Subscription Dashboard */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Base de Clientes ({savedClients.length})
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Controle de 365 Dias</span>
              </div>

              <div className="space-y-3">
                {savedClients.map((client) => {
                  const isCurrent = client.id === business.id;
                  
                  // Calculate days remaining
                  const expDate = client.expirationDate ? new Date(client.expirationDate) : new Date(Date.now() + 365 * 86400000);
                  const now = new Date();
                  const diffTime = expDate.getTime() - now.getTime();
                  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  // Warning state: <=10 critical (red), <=15 urgent (orange), <=30 warning (yellow), >30 normal (green)
                  const isCritical = daysRemaining <= 10;
                  const isUrgent = daysRemaining > 10 && daysRemaining <= 15;
                  const isWarning = daysRemaining > 15 && daysRemaining <= 30;

                  const renewalMessage = `Olá ${client.clientContactName || client.name}! Passando para lembrar que a anuidade da landing page oficial da sua empresa vence em ${daysRemaining} dias (${expDate.toLocaleDateString('pt-BR')}). Gostaria de garantir a renovação para manter seu site no ar e suas campanhas ativas?`;

                  const handleRenewOneYear = () => {
                    const newExp = new Date(Date.now() + 365 * 86400000).toISOString();
                    const updated = { ...client, expirationDate: newExp, status: 'active' as const };
                    onChangeBusiness(updated);
                  };

                  return (
                    <div
                      key={client.id}
                      className={`p-3.5 rounded-2xl border space-y-3 transition-all ${
                        isCurrent
                          ? 'bg-blue-50/40 border-blue-300 ring-1 ring-blue-300'
                          : isCritical
                          ? 'bg-rose-50/50 border-rose-300'
                          : isUrgent
                          ? 'bg-amber-50/50 border-amber-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Client Header Info */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 truncate">{client.name}</h5>
                          <p className="text-[10px] text-slate-400 truncate">
                            {client.slug}.siteexpress.com.br
                          </p>
                        </div>

                        {!isCurrent ? (
                          <button
                            onClick={() => onSelectClient(client)}
                            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
                          >
                            Abrir no Studio
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-full shrink-0">
                            Em Edição
                          </span>
                        )}
                      </div>

                      {/* Expiration & Alert Badge */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Anuidade</span>
                          <span className="font-semibold text-slate-800">
                            Vence em: {expDate.toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            isCritical
                              ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                              : isUrgent
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : isWarning
                              ? 'bg-yellow-100 text-yellow-900 border border-yellow-200'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>{daysRemaining > 0 ? `${daysRemaining}d restantes` : 'Vencido'}</span>
                        </span>
                      </div>

                      {/* Client Portal Credentials Info */}
                      <div className="p-2 bg-slate-50/80 rounded-xl border border-slate-100 text-[10px] space-y-1">
                        <div className="flex items-center justify-between text-slate-500 font-semibold">
                          <span className="flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-purple-600" />
                            <span>Acesso do Cliente:</span>
                          </span>
                          <span className="text-slate-400 font-mono">{client.clientPassword || '123456'}</span>
                        </div>
                        <p className="text-slate-600 truncate font-mono">
                          {client.clientEmail || 'cliente@siteexpress.com.br'}
                        </p>
                      </div>

                      {/* Action Buttons: WhatsApp Billing, Renewal, Killswitch */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {/* 1-Click WhatsApp Renewal Billing */}
                        <a
                          href={`https://wa.me/${client.whatsapp}?text=${encodeURIComponent(renewalMessage)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                          title="Enviar lembrete de renovação no WhatsApp do cliente"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Cobrar WhatsApp</span>
                        </a>

                        {/* Renew for +1 Year */}
                        <button
                          type="button"
                          onClick={handleRenewOneYear}
                          className="py-1.5 px-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                          title="Prorrogar anuidade por mais 365 dias"
                        >
                          <RefreshCw className="w-3 h-3 text-blue-600" />
                          <span>Renovar (+1 Ano)</span>
                        </button>
                      </div>

                      {/* Card Bottom: Killswitch & Utility Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        {/* Individual Killswitch */}
                        <button
                          onClick={() => {
                            const updated = {
                              ...client,
                              status: client.status === 'active' ? ('suspended' as const) : ('active' as const),
                            };
                            onChangeBusiness(updated);
                          }}
                          className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md ${
                            client.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                          title="Tirar ou colocar no ar este cliente com 1 clique"
                        >
                          <span>{client.status === 'active' ? '🟢 No Ar' : '🔴 Fora do Ar'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onDownloadClientHtml(client)}
                            className="text-slate-600 hover:text-slate-900 p-1"
                            title="Baixar HTML"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                          </button>
                          <button
                            onClick={() => onDuplicateClient(client)}
                            className="text-slate-500 hover:text-slate-800 p-1"
                            title="Duplicar Cliente"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {savedClients.length > 1 && (
                            <button
                              onClick={() => onDeleteClient(client.id)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
