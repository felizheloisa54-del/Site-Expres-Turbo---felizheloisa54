import React, { useState } from 'react';
import {
  X,
  Image,
  Sparkles,
  Palette,
  Check,
  Eye,
  Sliders,
  Shield,
  Layers,
  Globe,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { BusinessProfile, ThemeConfig, ThemeMode } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  theme: ThemeConfig;
  onUpdateBusiness: (updated: BusinessProfile) => void;
  onUpdateTheme: (updatedTheme: ThemeConfig) => void;
  themeMode: ThemeMode;
}

export const LogoStudioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  business,
  theme,
  onUpdateBusiness,
  onUpdateTheme,
  themeMode,
}) => {
  const isDark = themeMode === 'dark';

  const [inputUrl, setInputUrl] = useState(business.logoUrl || '');
  const [logoHeight, setLogoHeight] = useState(business.logoHeight || 44);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [selectedGeneratedLogo, setSelectedGeneratedLogo] = useState<number | null>(null);

  if (!isOpen) return null;

  // Extract initial letters for monogram
  const initials = business.name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'SE';

  // 3 Generated Logo Presets for businesses without a logo
  const logoPresets = [
    {
      id: 1,
      title: 'Versão 1: Monograma Geométrico & Moderno',
      type: 'geometric',
      primaryColor: theme.primaryColor || '#0F172A',
      accentColor: theme.accentColor || '#3B82F6',
      render: () => (
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm shrink-0"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
            }}
          >
            {initials}
          </div>
          <div className="leading-tight">
            <span className="font-extrabold text-sm block tracking-tight text-slate-900">
              {business.name}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {business.category.split('&')[0]} • {business.city}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Versão 2: Emblema Editorial com Selo de Excelência',
      type: 'emblem',
      primaryColor: '#1E293B',
      accentColor: '#EAB308',
      render: () => (
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500/80 bg-amber-50 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div className="leading-tight">
            <span className="font-black text-xs sm:text-sm block tracking-tight text-slate-900 font-serif">
              {business.name}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1">
              ★ QUALIDADE COMPROVADA ★
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Versão 3: Minimalista com Ícone de Nicho',
      type: 'niche',
      primaryColor: business.archetype === 'gastronomia' ? '#153E23' : '#111827',
      accentColor: business.archetype === 'gastronomia' ? '#F3C94D' : '#E11D48',
      render: () => (
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0"
            style={{ backgroundColor: theme.accentColor }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <span className="font-black text-sm block tracking-tight text-slate-900">
              {business.name}
            </span>
            <span className="text-[10px] font-semibold text-slate-500">
              Excelência em {business.city}
            </span>
          </div>
        </div>
      ),
    },
  ];

  // Sync palette with logo colors
  const handleSyncPalette = (primary: string, accent: string) => {
    onUpdateTheme({
      ...theme,
      primaryColor: primary,
      accentColor: accent,
    });
  };

  const handleApplyUrl = () => {
    onUpdateBusiness({
      ...business,
      logoUrl: inputUrl.trim() || undefined,
      logoHeight,
    });
  };

  const handleSelectPreset = (presetIndex: number) => {
    setSelectedGeneratedLogo(presetIndex);
    const preset = logoPresets[presetIndex];
    handleSyncPalette(preset.primaryColor, preset.accentColor);
    // Set a specialized SVG data uri or monogram flag
    onUpdateBusiness({
      ...business,
      logoUrl: undefined, // uses generative template
      logoHeight: 44,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
      <div
        className={`rounded-3xl max-w-2xl w-full border shadow-2xl overflow-hidden transition-all my-8 ${
          isDark ? 'bg-[#111726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Top Bar */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-[#0E1322]' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                Estúdio de Logomarca, Cores & Favicon
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Adequação profissional de imagem, remoção de fundo e sincronização com a paleta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* SECTION 1: CUSTOM LOGO INPUT & BACKGROUND REMOVER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold flex items-center gap-1.5 text-xs">
                <Image className="w-4 h-4 text-blue-500" />
                <span>Logomarca da Empresa (Imagem / Link Oficial)</span>
              </label>
              {business.logoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setInputUrl('');
                    onUpdateBusiness({ ...business, logoUrl: undefined });
                  }}
                  className="text-[11px] font-bold text-rose-500 hover:underline"
                >
                  Remover Logo
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://exemplo.com/logo-da-empresa.png"
                className={`w-full p-2.5 rounded-xl border text-xs font-mono focus:outline-hidden ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                }`}
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-colors shrink-0 shadow-xs"
              >
                Aplicar
              </button>
            </div>

            {/* Live Logo Preview Box with Transparency Checkerboard */}
            {business.logoUrl && (
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-center transition-all bg-white ${
                      removeBackground ? 'mix-blend-multiply' : ''
                    }`}
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                      backgroundSize: '12px 12px',
                      backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
                    }}
                  >
                    <img
                      src={business.logoUrl}
                      alt="Logo do cliente"
                      style={{ height: `${logoHeight}px` }}
                      className={`max-w-[200px] object-contain ${
                        removeBackground ? 'mix-blend-multiply' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <span className="font-bold text-xs block">Prévia da Logo no Site</span>
                    <span className="text-[10px] text-slate-400">
                      Altura atual: {logoHeight}px
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Remove Background Toggle */}
                  <button
                    type="button"
                    onClick={() => setRemoveBackground(!removeBackground)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      removeBackground
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-bold'
                        : isDark
                        ? 'border-slate-700 text-slate-400 hover:text-white'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{removeBackground ? 'Fundo Removido (Transparente)' : 'Tirar Fundo Branco'}</span>
                  </button>

                  {/* Size slider */}
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="range"
                      min={28}
                      max={64}
                      value={logoHeight}
                      onChange={(e) => {
                        const h = parseInt(e.target.value);
                        setLogoHeight(h);
                        onUpdateBusiness({ ...business, logoHeight: h });
                      }}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: GERADOR DE 3 LOGOS SE A EMPRESA NÃO TIVER */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <div>
              <h4 className="font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>A empresa não tem logo? Escolha uma das 3 versões geradas:</span>
              </h4>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Criadas automaticamente com base no nome ({business.name}), nicho e cidade da empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {logoPresets.map((preset, idx) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(idx)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedGeneratedLogo === idx
                      ? isDark
                        ? 'bg-blue-600/10 border-blue-500 shadow-xs'
                        : 'bg-blue-50/80 border-blue-400 shadow-xs'
                      : isDark
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-50 hover:bg-white border-slate-200'
                  }`}
                >
                  <div className="flex-1 mr-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {preset.title}
                    </span>
                    {preset.render()}
                  </div>

                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      selectedGeneratedLogo === idx
                        ? 'bg-blue-600 text-white'
                        : isDark
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedGeneratedLogo === idx ? 'Selecionada' : 'Usar Esta Logo'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: PALETA DE CORES SINCRONIZADA */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <h4 className="font-bold text-xs flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Sincronizar Paleta de Cores do Site com a Logo</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: 'Azul Google & Safira', primary: '#0F172A', accent: '#1A73E8' },
                { name: 'Verde Simprão Artesanal', primary: '#153E23', accent: '#F3C94D' },
                { name: 'Grafite & Carmim Ação', primary: '#111827', accent: '#E11D48' },
                { name: 'Índigo Executivo & Cyan', primary: '#0A0E1A', accent: '#06B6D4' },
              ].map((pal, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSyncPalette(pal.primary, pal.accent)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    theme.primaryColor === pal.primary && theme.accentColor === pal.accent
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : isDark
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: pal.primary }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pal.accent }} />
                  </div>
                  <span className="text-[10px] font-bold block truncate">{pal.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 4: FAVICON OFFICIAL PREVIEW */}
          <div className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <h4 className="font-bold text-xs flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Favicon do Navegador (Ícone da Aba)</span>
            </h4>
            <div
              className={`p-3 rounded-xl border flex items-center gap-3 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* Simulated browser tab */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center font-bold text-[9px] text-white shrink-0"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  {initials[0]}
                </div>
                <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[140px]">
                  {business.name}
                </span>
                <X className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                O favicon é incorporado automaticamente na exportação do site com as cores da marca.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-end ${
            isDark ? 'border-slate-800 bg-[#0E1322]' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
          >
            Concluir e Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
