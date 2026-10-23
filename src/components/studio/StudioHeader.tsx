import React, { useState, useRef, useEffect } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Search,
  Eye,
  FileCode,
  Archive,
  Share2,
  Users,
  Check,
  Layout,
  ChevronDown,
  ExternalLink,
  Globe,
  ArrowLeft,
  Palette,
  Sun,
  Moon,
  X,
  Plus,
  Sparkles,
  FileText,
  Copy,
} from 'lucide-react';
import { ViewportMode, BusinessProfile, ThemeMode, ThemeConfig, AppScreen } from '../../types';
import { SiteExpressLogo } from '../brand/SiteExpressLogo';
import {
  downloadMegaPromptMarkdown,
  downloadMegaPromptHtml,
} from '../../utils/megaPromptContent';

interface Props {
  business: BusinessProfile;
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  onOpenSearch: () => void;
  onOpenClients: () => void;
  onOpenPublicSite: () => void;
  onOpenLogoStudio: () => void;
  onBackToDashboard: () => void;
  onDownloadHtml: () => void;
  onDownloadZip: () => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onUpdateHeroLayout?: (layout: 'boxed' | 'fullscreen' | 'centered' | 'split-reversed') => void;
  themeMode?: ThemeMode;
  onToggleThemeMode?: () => void;
  theme?: ThemeConfig;
  onChangeTheme?: (updated: ThemeConfig) => void;
  onNavigateToScreen?: (screen: AppScreen) => void;
  clientCount?: number;
}

export const StudioHeader: React.FC<Props> = ({
  business,
  viewport,
  onViewportChange,
  onOpenSearch,
  onOpenClients,
  onOpenPublicSite,
  onOpenLogoStudio,
  onBackToDashboard,
  onDownloadHtml,
  onDownloadZip,
  isPreviewMode,
  onTogglePreview,
  onUpdateHeroLayout,
  themeMode = 'light',
  onToggleThemeMode,
  theme,
  onChangeTheme,
  onNavigateToScreen,
  clientCount,
}) => {
  const isDark = themeMode === 'dark';

  const [downloadDropdown, setDownloadDropdown] = useState(false);
  const [heroDropdown, setHeroDropdown] = useState(false);
  const [paletteDropdown, setPaletteDropdown] = useState(false);
  const [fontDropdown, setFontDropdown] = useState(false);
  const [promptDropdown, setPromptDropdown] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const downloadRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  // Palettes list for header dropdown (from Image 1)
  const headerPalettes = [
    {
      id: 'clinico-azul',
      name: 'Autoridade Marinho',
      primary: '#0F172A',
      accent: '#3B82F6',
      bg: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#0F172A',
      muted: '#64748B',
    },
    {
      id: 'gastronomico-verde',
      name: 'Verde Simprão Artesanal',
      primary: '#153E23',
      accent: '#F3C94D',
      bg: '#F8F7F0',
      surface: '#FFFFFF',
      text: '#1B2516',
      muted: '#526649',
    },
    {
      id: 'comercio-grafite',
      name: 'Grafite Moderno & Ação',
      primary: '#111827',
      accent: '#E11D48',
      bg: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#111827',
      muted: '#6B7280',
    },
    {
      id: 'esmeralda-sobrio',
      name: 'Esmeralda & Dourado',
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

  // Fonts list for header dropdown (from Image 1)
  const headerFonts: { id: ThemeConfig['fontFamily']; label: string }[] = [
    { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Moderno)' },
    { id: 'Cormorant Garamond', label: 'Cormorant Clássico (Elegante)' },
    { id: 'Inter', label: 'Inter (Alta Legibilidade)' },
    { id: 'Outfit', label: 'Outfit (Geométrico Limpo)' },
    { id: 'Playfair Display', label: 'Playfair (Editorial Premium)' },
    { id: 'Montserrat', label: 'Montserrat (Comercial Impacto)' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setDownloadDropdown(false);
      }
      if (heroRef.current && !heroRef.current.contains(event.target as Node)) {
        setHeroDropdown(false);
      }
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        setPaletteDropdown(false);
      }
      if (fontRef.current && !fontRef.current.contains(event.target as Node)) {
        setFontDropdown(false);
      }
      if (promptRef.current && !promptRef.current.contains(event.target as Node)) {
        setPromptDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}?site=${business.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyPrompt = async () => {
    try {
      const res = await fetch('/public/PROMPT-MESTRE-SITE-EXPRESS-STUDIO-PRO.md');
      const text = await res.text();
      navigator.clipboard.writeText(text);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    } catch {
      // fallback
    }
  };

  const heroLayoutLabels: Record<string, string> = {
    boxed: 'Caixa (7/5)',
    fullscreen: 'Plano Fundo Total',
    centered: 'Central Editorial',
    'split-reversed': 'Foto Esquerda',
  };

  const currentHeroLayout = business.heroLayout || 'boxed';

  return (
    <div className="flex flex-col z-30 sticky top-0 shadow-2xs select-none">
      {/* 1. TOP GLOBAL BAR (TIER 1 - FROM IMAGE 1) */}
      <div
        className={`h-11 px-3 sm:px-6 flex items-center justify-between gap-3 border-b text-xs transition-colors ${
          isDark ? 'bg-[#0B0F19] border-slate-800 text-white' : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <SiteExpressLogo size="sm" isDark={true} />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Base demo ativa</span>
          </span>
        </div>

        {/* Global 3-Screen Switcher */}
        {onNavigateToScreen && (
          <div className="flex items-center bg-black/40 p-0.5 rounded-xl border border-white/10 text-[11px] font-semibold">
            <button
              onClick={() => onNavigateToScreen('login')}
              className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Ir para Tela 1: Página de Vendas & Login"
            >
              1. Vendas/Login
            </button>
            <button
              onClick={() => onNavigateToScreen('dashboard')}
              className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Ir para Tela 2: + Novo Site & Buscador"
            >
              2. + Novo Site
            </button>
            <button
              onClick={() => onNavigateToScreen('studio')}
              className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold shadow-xs cursor-default"
              title="Você está na Tela 3: Studio Pro"
            >
              3. Studio Pro
            </button>
          </div>
        )}

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Novo Site</span>
          </button>

          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <span>Meus Clientes ({clientCount || 3})</span>
          </button>

          {/* Prompt Mestre Dropdown Button */}
          <div className="relative" ref={promptRef}>
            <button
              onClick={() => setPromptDropdown(!promptDropdown)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 font-bold text-xs transition-colors cursor-pointer"
              title="Baixar Prompt Mestre para outra IA"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Prompt Mestre</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {promptDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-white text-xs">
                <div className="px-2.5 py-1.5 border-b border-slate-800 mb-1">
                  <p className="font-bold text-xs">Prompt Mestre para Outra IA</p>
                  <p className="text-[10px] text-slate-400">Reproduza 100% no ChatGPT, Claude ou Cursor</p>
                </div>
                <button
                  onClick={() => {
                    handleCopyPrompt();
                    setPromptDropdown(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between font-semibold transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copiado!' : 'Copiar Texto do Prompt'}</span>
                  </span>
                  <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">1-Clique</span>
                </button>
                <a
                  href="/public/PROMPT-MESTRE-SITE-EXPRESS-STUDIO-PRO.md"
                  download="PROMPT-MESTRE-SITE-EXPRESS-STUDIO-PRO.md"
                  onClick={() => setPromptDropdown(false)}
                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2 font-semibold transition-colors cursor-pointer block"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Baixar Prompt (.md)</span>
                </a>
                <a
                  href="/public/PROMPT-MESTRE-SITE-EXPRESS-STUDIO-PRO.html"
                  target="_blank"
                  onClick={() => setPromptDropdown(false)}
                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-white/10 flex items-center gap-2 font-semibold transition-colors cursor-pointer block text-slate-300"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                  <span>Visualizar Página Web (.html)</span>
                </a>
              </div>
            )}
          </div>

          {onToggleThemeMode && (
            <button
              onClick={onToggleThemeMode}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isDark ? 'Modo Claro' : 'Modo Escuro'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* 2. SUB-HEADER TOOLBAR (TIER 2 - FROM IMAGE 1) */}
      <header
        className={`h-14 px-3 sm:px-6 flex items-center justify-between gap-3 border-b transition-colors ${
          isDark ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200/90 text-slate-900'
        }`}
      >
      {/* Zone 1: Return to Dashboard + Brand + Active Business Lockup */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        {/* Back to Clients Button */}
        <button
          type="button"
          onClick={onBackToDashboard}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
            isDark
              ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
          title="Voltar para Meus Clientes"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Meus Clientes</span>
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

        {/* Current Active Client & Live Status Badge */}
        <div className="flex items-center gap-2 text-xs truncate max-w-[200px] sm:max-w-xs">
          <span className="font-extrabold truncate text-sm">{business.name}</span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
              business.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                business.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            {business.status === 'active' ? 'Ativo no ar' : 'Suspenso'}
          </span>
        </div>
      </div>

      {/* Zone 2: Viewport Switcher Controls (Computador / Tablet / Celular) */}
      <div
        className={`flex items-center p-1 rounded-xl border ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/90 border-slate-200/80'
        }`}
      >
        <button
          onClick={() => onViewportChange('desktop')}
          title="Computador (100% Tela Cheia)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewport === 'desktop'
              ? isDark
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-950 shadow-xs font-bold'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Computador</span>
        </button>

        <button
          onClick={() => onViewportChange('tablet')}
          title="Tablet (768px)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewport === 'tablet'
              ? isDark
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-950 shadow-xs font-bold'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>

        <button
          onClick={() => onViewportChange('mobile')}
          title="Celular (390px fiel ao iPhone)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewport === 'mobile'
              ? isDark
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-950 shadow-xs font-bold'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Celular</span>
        </button>
      </div>

      {/* Zone 3: Actions, Tools, Theme & Export Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Palette Selector Dropdown (from Image 1: Autoridade Marinho ⌵) */}
        {theme && onChangeTheme && (
          <div ref={paletteRef} className="relative hidden md:block">
            <button
              onClick={() => setPaletteDropdown(!paletteDropdown)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
              title="Paleta de Cores"
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: theme.accentColor }}
              />
              <span className="font-bold truncate max-w-[110px]">
                {theme.name.split(' ')[0]} {theme.name.split(' ')[1] || ''}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {paletteDropdown && (
              <div
                className={`absolute left-0 mt-2 w-60 rounded-2xl border shadow-xl py-1.5 z-50 text-xs animate-fade-in ${
                  isDark ? 'bg-[#111726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Paletas Globais
                </div>
                {headerPalettes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
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
                      });
                      setPaletteDropdown(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors ${
                      theme.primaryColor === p.primary ? 'font-bold bg-blue-50/50 dark:bg-blue-950/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-1">
                        <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: p.primary }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ backgroundColor: p.accent }} />
                      </div>
                      <span>{p.name}</span>
                    </div>
                    {theme.primaryColor === p.primary && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Font Selector Dropdown (from Image 1: Cormorant Clássico ⌵) */}
        {theme && onChangeTheme && (
          <div ref={fontRef} className="relative hidden lg:block">
            <button
              onClick={() => setFontDropdown(!fontDropdown)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
              title="Tipografia Global"
            >
              <span className="font-bold truncate max-w-[120px]">
                {theme.fontFamily.split(' ')[0]} ⌵
              </span>
            </button>

            {fontDropdown && (
              <div
                className={`absolute left-0 mt-2 w-56 rounded-2xl border shadow-xl py-1.5 z-50 text-xs animate-fade-in ${
                  isDark ? 'bg-[#111726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Tipografia do Site
                </div>
                {headerFonts.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onChangeTheme({
                        ...theme,
                        fontFamily: f.id,
                      });
                      setFontDropdown(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors ${
                      theme.fontFamily === f.id ? 'font-bold bg-blue-50/50 dark:bg-blue-950/30' : ''
                    }`}
                  >
                    <span>{f.label}</span>
                    {theme.fontFamily === f.id && <Check className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Salvo Status Badge (from Image 1) */}
        <div
          className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
          title="Todas as alterações são salvas automaticamente"
        >
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>Salvo</span>
        </div>

        {/* Abrir Site Público (from Image 1) */}
        <button
          onClick={onOpenPublicSite}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
            isDark
              ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          title="Abrir site no ar em tela cheia com link oficial"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
          <span>Abrir</span>
        </button>

        {/* Baixar Site Pronto Button (Black pill from Image 1) & Export Dropdown */}
        <div ref={downloadRef} className="relative">
          <button
            onClick={() => setDownloadDropdown(!downloadDropdown)}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Site Pronto</span>
          </button>

          {downloadDropdown && (
            <div
              className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-xl py-2 z-50 text-xs animate-fade-in ${
                isDark ? 'bg-[#111726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                Opções de Exportação Oficial
              </div>

              <button
                onClick={() => {
                  onDownloadHtml();
                  setDownloadDropdown(false);
                }}
                className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold">Arquivo HTML Único (.html)</div>
                  <div className="text-[11px] text-slate-400">
                    Autossuficiente, pronto para Vercel, HostGator ou cPanel.
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onDownloadZip();
                  setDownloadDropdown(false);
                }}
                className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors cursor-pointer"
              >
                <Archive className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold">Pacote ZIP Completo (.zip)</div>
                  <div className="text-[11px] text-slate-400">
                    Contém index.html e guia de publicação passo a passo.
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsVercelModalOpen(true);
                  setDownloadDropdown(false);
                }}
                className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors border-t border-slate-100 dark:border-slate-800 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>Publicar na Vercel (Grátis)</span>
                    <span className="text-[9px] bg-purple-500/10 text-purple-600 px-1.5 py-0.2 rounded font-extrabold">1 MIN</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Passo a passo visual para colocar no ar mundialmente.
                  </div>
                </div>
              </button>

              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

              <button
                onClick={handleCopyShareLink}
                className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-bold text-emerald-500">Link Copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar Link de Compartilhamento</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VERCEL PUBLISH GUIDE MODAL */}
      {isVercelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-fade-in text-slate-900 dark:text-white">
            <button
              onClick={() => setIsVercelModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black text-sm">
                ▲
              </div>
              <div>
                <h3 className="font-extrabold text-base">Como Publicar seu Site na Vercel</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hospedagem profissional gratuita, rápida e com HTTPS vitalício
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Baixe o Arquivo HTML</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Clique em <strong>Baixar Site Pronto</strong> &gt; <strong>Arquivo HTML Único</strong>. O arquivo já vem 100% autossuficiente com todas as fontes, fotos e scripts de WhatsApp embutidos.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Acesse o Painel da Vercel</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Abra <strong>vercel.com</strong>, faça login e clique no botão <strong>Add New &gt; Project</strong> ou simplesmente arraste a pasta ou arquivo index.html na área de Deploy.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Seu Site está no Ar!</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    A Vercel gera um link <code>.vercel.app</code> instantâneo e permite conectar o domínio próprio do seu cliente (ex: <code>clinicasamuel.com.br</code>) sem custo extra.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300">
                <p className="font-bold text-[11px]">💡 Dica Pro — Publicação Instantânea no Site Express:</p>
                <p className="text-[10px] mt-0.5 leading-relaxed">
                  Você não precisa publicar na Vercel para apresentar ao cliente! O Site Express já mantém o site no ar pelo link oficial com Killswitch anti-inadimplência. Basta copiar o link no botão Compartilhar.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onDownloadHtml();
                  setIsVercelModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar HTML Agora</span>
              </button>
              <button
                onClick={() => setIsVercelModalOpen(false)}
                className="py-2.5 px-4 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
    </div>
  );
};
