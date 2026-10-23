import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Building2,
  Users,
  ShieldCheck,
  Power,
  Edit3,
  ExternalLink,
  MessageSquare,
  Sun,
  Moon,
  LogOut,
  Calendar,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  KeyRound,
  Trash2,
  Copy,
  Check,
  Download,
  FileText,
} from 'lucide-react';
import { BusinessProfile, SaaSUser, ThemeMode } from '../../types';
import { SiteExpressLogo } from '../brand/SiteExpressLogo';
import { GoogleSearchAutocomplete } from '../studio/GoogleSearchAutocomplete';
import { GoogleApiKeyModal } from '../studio/GoogleApiKeyModal';
import { downloadPrdMarkdown, downloadPrdHtml } from '../../utils/prdContent';
import {
  MEGA_PROMPT_TEXT,
  downloadMegaPromptMarkdown,
  downloadMegaPromptHtml,
} from '../../utils/megaPromptContent';

interface Props {
  currentUser: SaaSUser;
  savedClients: BusinessProfile[];
  onSelectAndEditSite: (biz: BusinessProfile) => void;
  onOpenGoogleSearch: () => void;
  onOpenManualCreate: () => void;
  onToggleSiteStatus: (id: string) => void;
  onDeleteSite: (id: string) => void;
  onLogout: () => void;
  themeMode: ThemeMode;
  onToggleThemeMode: () => void;
  saasUsers: SaaSUser[];
  onAddSaaSUser: (newUser: SaaSUser) => void;
  onToggleUserStatus: (id: string) => void;
  onSelectBusinessFromSearch: (biz: BusinessProfile) => void;
  onNavigateToScreen?: (screen: 'login' | 'dashboard' | 'studio') => void;
}

export const DashboardScreen: React.FC<Props> = ({
  currentUser,
  savedClients,
  onSelectAndEditSite,
  onOpenGoogleSearch,
  onOpenManualCreate,
  onToggleSiteStatus,
  onDeleteSite,
  onLogout,
  themeMode,
  onToggleThemeMode,
  saasUsers,
  onAddSaaSUser,
  onToggleUserStatus,
  onSelectBusinessFromSearch,
  onNavigateToScreen,
}) => {
  const isDark = themeMode === 'dark';

  const [activeTab, setActiveTab] = useState<'novosite' | 'gestaosites' | 'paineldono'>('novosite');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isPrdMenuOpen, setIsPrdMenuOpen] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isGoogleApiKeyModalOpen, setIsGoogleApiKeyModalOpen] = useState(false);
  const [googlePlacesKey, setGooglePlacesKey] = useState<string | null>(() =>
    localStorage.getItem('SITE_EXPRESS_GOOGLE_PLACES_KEY')
  );

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(MEGA_PROMPT_TEXT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  // Super Admin subscriber creation modal state
  const [isNewSubscriberModalOpen, setIsNewSubscriberModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubPassword, setNewSubPassword] = useState('123456');
  const [newSubPlan, setNewSubPlan] = useState('Plano Agência Pro (50 Sites)');
  const [newSubMaxSites, setNewSubMaxSites] = useState(50);
  const [newSubPhone, setNewSubPhone] = useState('');

  const isAdmin = currentUser.role === 'admin';

  // Filtered sites for the Gestão de Sites tab
  const filteredSites = savedClients.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  });

  // Calculate days remaining helper for admin/creator insight
  const getDaysRemaining = (client: BusinessProfile): number => {
    if (!client.expirationDate) return 365;
    const now = new Date();
    const exp = new Date(client.expirationDate);
    const diffTime = exp.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}?site=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleCreateSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubEmail.trim()) return;

    const newUser: SaaSUser = {
      id: `user-${Date.now()}`,
      name: newSubName.trim(),
      email: newSubEmail.trim().toLowerCase(),
      password: newSubPassword.trim() || '123456',
      role: 'creator',
      status: 'active',
      createdAt: new Date().toISOString(),
      planName: newSubPlan,
      maxSites: newSubMaxSites,
      phone: newSubPhone.trim(),
    };

    onAddSaaSUser(newUser);
    setIsNewSubscriberModalOpen(false);
    setNewSubName('');
    setNewSubEmail('');
    setNewSubPhone('');
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 select-none ${
        isDark ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F8F9FA] text-slate-900'
      }`}
    >
      {/* 1. TOP HEADER WITH BRAND, USER BADGE, TABS, THEME TOGGLE & LOGOUT */}
      <header
        className={`h-16 px-4 sm:px-6 flex items-center justify-between border-b sticky top-0 z-30 transition-all ${
          isDark ? 'border-slate-800/80 bg-[#0E1322]/95 backdrop-blur-md' : 'border-slate-200 bg-white/95 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <SiteExpressLogo size="sm" isDark={isDark} />

          {/* iOS Native Segmented Control Tabs */}
          <nav
            className={`hidden md:flex items-center p-1 rounded-[12px] border transition-all ${
              isDark
                ? 'bg-[#1C1C1E] border-white/10'
                : 'bg-[#E5E5EA] border-black/5'
            }`}
          >
            <button
              onClick={() => setActiveTab('novosite')}
              className={`px-3.5 py-1.5 rounded-[9px] text-[13px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'novosite'
                  ? isDark
                    ? 'bg-[#2C2C2E] text-white shadow-xs font-bold'
                    : 'bg-white text-slate-900 shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#007AFF]" />
              <span>+ Novo Site</span>
            </button>

            <button
              onClick={() => setActiveTab('gestaosites')}
              className={`px-3.5 py-1.5 rounded-[9px] text-[13px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gestaosites'
                  ? isDark
                    ? 'bg-[#2C2C2E] text-white shadow-xs font-bold'
                    : 'bg-white text-slate-900 shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#34C759]" />
              <span>Meus Clientes ({savedClients.length})</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('paineldono')}
                className={`px-3.5 py-1.5 rounded-[9px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'paineldono'
                    ? isDark
                      ? 'bg-[#2C2C2E] text-purple-300 shadow-xs font-bold'
                      : 'bg-white text-purple-700 shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                <span>Painel do Dono</span>
              </button>
            )}
          </nav>
        </div>

        {/* Global 3-Screen Switcher */}
        {onNavigateToScreen && (
          <div className="hidden xl:flex items-center bg-black/5 dark:bg-black/40 p-1 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold">
            <button
              onClick={() => onNavigateToScreen('login')}
              className="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Ir para Tela 1: Página de Vendas & Login"
            >
              🌟 1. Vendas/Login
            </button>
            <button
              className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold shadow-xs cursor-default"
              title="Você está na Tela 2: + Novo Site & Buscador"
            >
              🏢 2. + Novo Site (Ativo)
            </button>
            <button
              onClick={() => onNavigateToScreen('studio')}
              className="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Ir para Tela 3: Studio Pro"
            >
              ⚡ 3. Studio Pro
            </button>
          </div>
        )}

        {/* Right Actions: User Badge, Theme Toggle & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Role Badge */}
          <div
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isAdmin ? 'bg-purple-500' : 'bg-emerald-500 animate-pulse'
              }`}
            />
            <span className="font-bold text-[11px] truncate max-w-[120px]">{currentUser.name}</span>
            <span
              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                isAdmin
                  ? 'bg-purple-500/10 text-purple-500'
                  : 'bg-blue-500/10 text-blue-500'
              }`}
            >
              {isAdmin ? 'Super Admin' : 'Criador'}
            </span>
          </div>

          {/* Google Places Key Button */}
          <button
            onClick={() => setIsGoogleApiKeyModalOpen(true)}
            className={`px-3 py-1.5 rounded-[12px] text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              googlePlacesKey
                ? isDark
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : isDark
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Configurar Chave Google Cloud Places API"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#007AFF]" />
            <span className="hidden sm:inline font-bold">
              {googlePlacesKey ? 'Google Places Ativo' : 'Chave Google'}
            </span>
          </button>

          {/* Download PRP & Mega-Prompt Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPrdMenuOpen(!isPrdMenuOpen)}
              className={`px-3 py-1.5 rounded-[12px] text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isDark
                  ? 'bg-[#007AFF]/15 text-[#0A84FF] border-[#0A84FF]/30 hover:bg-[#007AFF]/25'
                  : 'bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/20 hover:bg-[#007AFF]/20'
              }`}
              title="Baixar Documentação ou Mega-Prompt para outra IA"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-bold">Baixar PRP / Mega-Prompt</span>
              <Download className="w-3 h-3 opacity-70" />
            </button>

            {isPrdMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-72 rounded-[16px] shadow-2xl border p-2 z-50 backdrop-blur-xl ${
                  isDark ? 'bg-[#1C1C1E]/95 border-white/10 text-white' : 'bg-white/95 border-black/10 text-slate-900'
                }`}
              >
                <div className="px-3 py-2 border-b border-black/5 dark:border-white/10 mb-1">
                  <p className="text-xs font-bold">Documentos & Exportação IA</p>
                  <p className="text-[11px] opacity-60">Escolha o arquivo desejado</p>
                </div>

                {/* Section A: Mega-Prompt para Outra IA */}
                <div className="p-1 mb-1 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="px-2 py-1 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                    Prompt de Reprodução (Cursor / Claude / GPT)
                  </div>
                  <button
                    onClick={() => {
                      handleCopyPrompt();
                      setIsPrdMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-[8px] text-xs hover:bg-blue-500/15 flex items-center justify-between transition-colors font-semibold text-blue-600 dark:text-blue-400"
                  >
                    <span className="flex items-center gap-1.5">
                      {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPrompt ? 'Copiado!' : 'Copiar Mega-Prompt'}</span>
                    </span>
                    <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">1-Clique</span>
                  </button>

                  <button
                    onClick={() => {
                      downloadMegaPromptHtml();
                      setIsPrdMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-[8px] text-xs hover:bg-blue-500/15 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-[#007AFF]" />
                      <span>Baixar Prompt em HTML (.html)</span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      downloadMegaPromptMarkdown();
                      setIsPrdMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-[8px] text-xs hover:bg-blue-500/15 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-[#007AFF]" />
                      <span>Baixar Prompt em Markdown (.md)</span>
                    </span>
                  </button>
                </div>

                {/* Section B: PRP Documento Oficial */}
                <div className="px-2 py-1 text-[10px] font-bold opacity-60 uppercase tracking-wider mt-1">
                  Documento de Requisitos (PRP / PRD)
                </div>
                <button
                  onClick={() => {
                    downloadPrdMarkdown();
                    setIsPrdMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-[8px] text-xs hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#007AFF]" />
                    <span className="font-medium text-[11px]">Baixar PRP (.md)</span>
                  </div>
                  <Download className="w-3 h-3 opacity-60" />
                </button>

                <button
                  onClick={() => {
                    downloadPrdHtml();
                    setIsPrdMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-[8px] text-xs hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#34C759]" />
                    <span className="font-medium text-[11px]">Baixar PRP (.html)</span>
                  </div>
                  <Download className="w-3 h-3 opacity-60" />
                </button>
              </div>
            )}
          </div>

          {/* Day / Night Theme Toggle */}
          <button
            onClick={onToggleThemeMode}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all border ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title={isDark ? 'Mudar para Modo Claro (Diurno)' : 'Mudar para Modo Escuro (Noturno)'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isDark
                ? 'bg-slate-800/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border-slate-700'
                : 'bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200'
            }`}
            title="Sair da Ferramenta"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px] font-bold">Sair</span>
          </button>
        </div>
      </header>

      {/* Mobile iOS Segmented Control Bar */}
      <div
        className={`md:hidden px-3 py-2 border-b transition-colors ${
          isDark ? 'border-slate-800 bg-[#0E1322]' : 'border-slate-200 bg-white'
        }`}
      >
        <div
          className={`flex items-center p-1 rounded-[12px] border ${
            isDark ? 'bg-[#1C1C1E] border-white/10' : 'bg-[#E5E5EA] border-black/5'
          }`}
        >
          <button
            onClick={() => setActiveTab('novosite')}
            className={`flex-1 py-1.5 rounded-[9px] text-[12px] font-semibold transition-all text-center cursor-pointer ${
              activeTab === 'novosite'
                ? isDark
                  ? 'bg-[#2C2C2E] text-white shadow-xs font-bold'
                  : 'bg-white text-slate-900 shadow-xs font-bold'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            + Novo Site
          </button>
          <button
            onClick={() => setActiveTab('gestaosites')}
            className={`flex-1 py-1.5 rounded-[9px] text-[12px] font-semibold transition-all text-center cursor-pointer ${
              activeTab === 'gestaosites'
                ? isDark
                  ? 'bg-[#2C2C2E] text-white shadow-xs font-bold'
                  : 'bg-white text-slate-900 shadow-xs font-bold'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            Meus Clientes ({savedClients.length})
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('paineldono')}
              className={`flex-1 py-1.5 rounded-[9px] text-[12px] font-semibold transition-all text-center ${
                activeTab === 'paineldono'
                  ? isDark
                    ? 'bg-[#2C2C2E] text-purple-300 shadow-xs font-bold'
                    : 'bg-white text-purple-700 shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              Assinantes
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ========================================================== */}
        {/* TAB 1: NOVO SITE & INÍCIO (HERO + BUSCA GOOGLE OU MANUAL) */}
        {/* ========================================================== */}
        {activeTab === 'novosite' && (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Hero Lockup */}
            <div
              className={`rounded-3xl p-6 sm:p-10 border shadow-lg relative overflow-hidden transition-all ${
                isDark
                  ? 'bg-gradient-to-br from-[#111726] via-[#141d33] to-[#0d1424] border-slate-800'
                  : 'bg-gradient-to-br from-white via-blue-50/40 to-slate-50 border-slate-200/90'
              }`}
            >
              <div className="max-w-2xl relative z-10 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gerador Visual Instantâneo</span>
                </span>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Vamos começar seu site agora.
                </h1>

                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Crie landing pages de alta conversão para negócios locais brasileiros com o design
                  limpo estilo Apple + Google. Escolha entre puxar a ficha do Google Places ou cadastrar
                  manualmente.
                </p>

                {/* Direct Live Google Search Bar (Front and Center) */}
                <div className="pt-2 max-w-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-blue-500" />
                      <span>Digite o Nome da Empresa ou Clínica:</span>
                    </label>
                    <button
                      type="button"
                      onClick={onOpenManualCreate}
                      className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer text-[11px] flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Ou Cadastrar Manualmente</span>
                    </button>
                  </div>

                  <GoogleSearchAutocomplete
                    onSelectBusiness={onSelectBusinessFromSearch}
                    isDark={isDark}
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>💡 Sugestão: digite &quot;Dr. Samuel&quot;, &quot;Simprão&quot; ou qualquer comércio local</span>
                    <span className="text-emerald-600 font-semibold">● Busca em tempo real</span>
                  </div>
                </div>

                {/* 2 Big Action Doors (Google vs Manual - Apple iPhone Style) */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Option A: Search Google Meu Negócio */}
                  <div
                    className={`p-6 rounded-[24px] border transition-all duration-200 ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-700/80 hover:border-blue-500/80'
                        : 'bg-white/90 backdrop-blur-md border-slate-200/90 hover:border-blue-400 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mb-3.5 shadow-[0_4px_12px_rgba(59,130,246,0.35)] shrink-0">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base tracking-tight">Opção 1: Buscar no Google</h3>
                    <p className={`text-xs mt-1 mb-5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Importa automaticamente o nome, notas 4 e 5 estrelas, fotos reais e endereço direto do Google Places.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenGoogleSearch}
                      className="w-full py-3 rounded-full font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.97] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.3)] cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Buscar Empresa no Google</span>
                    </button>
                  </div>

                  {/* Option B: Register Manually */}
                  <div
                    className={`p-6 rounded-[24px] border transition-all duration-200 ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-700/80 hover:border-purple-500/80'
                        : 'bg-white/90 backdrop-blur-md border-slate-200/90 hover:border-purple-400 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center mb-3.5 shadow-[0_4px_12px_rgba(147,51,234,0.35)] shrink-0">
                      <PlusCircle className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-base tracking-tight">Opção 2: Cadastrar Manualmente</h3>
                    <p className={`text-xs mt-1 mb-5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Para empresas locais sem cadastro no Google Maps ou quando desejar criar uma ficha personalizada.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenManualCreate}
                      className={`w-full py-3 rounded-full font-bold text-xs border active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isDark
                          ? 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border-purple-500/40 shadow-[0_4px_14px_rgba(168,85,247,0.15)]'
                          : 'bg-purple-50 hover:bg-purple-100/80 text-purple-900 border-purple-200 shadow-[0_4px_14px_rgba(168,85,247,0.12)]'
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Preencher Dados Manualmente</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Apple iOS Mega-Prompt IA Quick Card */}
            <div
              className={`rounded-[20px] p-5 sm:p-6 border transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-blue-950/30 via-purple-950/20 to-slate-900/60 border-blue-500/20'
                  : 'bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border-blue-200/80 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500 text-white">
                      Prompt de Reprodução IA
                    </span>
                    <span className="text-xs opacity-60">Pronto para Cursor, Claude 3.7, ChatGPT e v0</span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    Replicar todo o Site Express em Outra IA
                  </h3>
                  <p className={`text-xs max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Criamos um mega-prompt completo com cada detalhe, tokens do Apple iOS, regras de negócio e arquitetura
                    para você colar em outra IA e ela reproduzir todo o sistema instantaneamente.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyPrompt}
                    className="px-4 py-2.5 rounded-[12px] bg-[#007AFF] hover:bg-[#0062cc] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    {copiedPrompt ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPrompt ? 'Prompt Copiado!' : 'Copiar Mega-Prompt'}</span>
                  </button>

                  <button
                    onClick={() => setIsPromptModalOpen(true)}
                    className={`px-3 py-2.5 rounded-[12px] border text-xs font-bold transition-all cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-2xs'
                    }`}
                  >
                    Visualizar Prompt
                  </button>

                  <button
                    onClick={downloadMegaPromptHtml}
                    className={`p-2.5 rounded-[12px] border transition-all cursor-pointer ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-blue-400' : 'bg-white hover:bg-slate-50 border-slate-300 text-blue-600'
                    }`}
                    title="Baixar Prompt em HTML formatado"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* In-page Google Search Autocomplete Direct Box */}
            <div
              className={`rounded-2xl p-6 border ${
                isDark ? 'bg-[#111726] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm">Buscador Rápido Google Places</h3>
              </div>
              <GoogleSearchAutocomplete onSelectBusiness={onSelectBusinessFromSearch} isDark={isDark} />
            </div>

            {/* Quick Access to Existing Sites */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base sm:text-lg">Sites Prontos para Editar</h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Selecione um dos seus projetos para abrir o estúdio de edição
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('gestaosites')}
                  className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                >
                  <span>Ver todos ({savedClients.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedClients.slice(0, 3).map((client) => (
                  <div
                    key={client.id}
                    className={`rounded-2xl border p-4 flex flex-col justify-between transition-all group ${
                      isDark
                        ? 'bg-[#111726] border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            client.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-rose-500/10 text-rose-500'
                          }`}
                        >
                          {client.status === 'active' ? '● No Ar' : '● Suspenso'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          {client.archetype}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm leading-snug line-clamp-1 group-hover:text-blue-500 transition-colors">
                        {client.name}
                      </h4>
                      <p className={`text-xs mt-0.5 line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {client.city} - {client.state} • {client.category}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t flex items-center gap-2 border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => onSelectAndEditSite(client)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar no Studio</span>
                      </button>

                      <a
                        href={`https://wa.me/${client.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                        title="Abrir WhatsApp do Cliente"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: GESTÃO DE SITES DOS CLIENTES (KILLSWITCH + WHATSAPP) */}
        {/* ========================================================== */}
        {activeTab === 'gestaosites' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Toolbar: Search + Stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">Gestão de Sites dos Clientes</h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Ative, desative, acesse ou edite os sites e fale no WhatsApp direto com o responsável
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar por nome, cidade..."
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-hidden ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                    }`}
                  />
                </div>

                <button
                  onClick={onOpenGoogleSearch}
                  className="px-3.5 py-2 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Novo Site</span>
                </button>
              </div>
            </div>

            {/* Sites Table / Card List */}
            <div className="space-y-3">
              {filteredSites.map((site) => {
                const daysRemaining = getDaysRemaining(site);

                return (
                  <div
                    key={site.id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                      site.status === 'suspended'
                        ? isDark
                          ? 'bg-rose-950/10 border-rose-900/40'
                          : 'bg-rose-50/50 border-rose-200'
                        : isDark
                        ? 'bg-[#111726] border-slate-800'
                        : 'bg-white border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      {/* Left: Client info and WhatsApp badge */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* Avatar / Photo thumbnail */}
                        <img
                          src={site.coverImage}
                          alt={site.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200/80 shrink-0"
                        />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-sm sm:text-base leading-tight truncate">
                              {site.name}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                site.status === 'active'
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                              }`}
                            >
                              {site.status === 'active' ? '● No Ar' : '● Suspenso'}
                            </span>
                          </div>

                          <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {site.category} • {site.city} - {site.state}
                          </p>

                          {/* Days remaining badge */}
                          <div className="flex items-center gap-2 mt-1 text-[11px]">
                            <span className="text-slate-400 flex items-center gap-1 font-medium">
                              <Calendar className="w-3 h-3" />
                              <span>Vencimento do plano:</span>
                            </span>
                            <span
                              className={`font-bold ${
                                daysRemaining <= 10
                                  ? 'text-rose-500'
                                  : daysRemaining <= 30
                                  ? 'text-amber-500'
                                  : 'text-emerald-500'
                              }`}
                            >
                              {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Expirado'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Direct Actions (Apple iPhone iOS Style) */}
                      <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                        {/* WhatsApp do Cliente (Apple Messages Style) */}
                        <a
                          href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                            `Olá! Sou o responsável pelo site da ${site.name} no Site Express Studio.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 font-bold text-xs flex items-center gap-2 transition-all active:scale-[0.96] shadow-2xs"
                        >
                          <div className="w-5 h-5 rounded-[6px] bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <MessageSquare className="w-3 h-3" />
                          </div>
                          <span>WhatsApp</span>
                        </a>

                        {/* Copy Public Link (iOS Share Style) */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(site.slug)}
                          className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.96] ${
                            isDark
                              ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs'
                          }`}
                          title="Copiar Link Público Oficial"
                        >
                          {copiedSlug === site.slug ? (
                            <>
                              <div className="w-5 h-5 rounded-[6px] bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                              <span className="text-emerald-600 font-bold">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <div className="w-5 h-5 rounded-[6px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                                <Copy className="w-3 h-3" />
                              </div>
                              <span>Link</span>
                            </>
                          )}
                        </button>

                        {/* 1-Click Killswitch (Apple iOS Settings Toggle) */}
                        <button
                          type="button"
                          onClick={() => onToggleSiteStatus(site.id)}
                          className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-[0.96] flex items-center gap-2 shadow-2xs ${
                            site.status === 'active'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_2px_8px_rgba(16,185,129,0.25)]'
                          }`}
                          title={
                            site.status === 'active'
                              ? 'Suspender e tirar site do ar imediatamente'
                              : 'Reativar site e colocar no ar'
                          }
                        >
                          <div
                            className={`w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 text-white ${
                              site.status === 'active' ? 'bg-rose-500' : 'bg-white/20'
                            }`}
                          >
                            <Power className="w-3 h-3" />
                          </div>
                          <span>{site.status === 'active' ? 'Desativar Site' : 'Ativar Site'}</span>
                        </button>

                        {/* Edit Site in Studio (Apple Accent Action) */}
                        <button
                          type="button"
                          onClick={() => onSelectAndEditSite(site)}
                          className="px-4 py-2 rounded-full font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.96] transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.25)]"
                        >
                          <div className="w-5 h-5 rounded-[6px] bg-white/20 text-white flex items-center justify-center shrink-0">
                            <Edit3 className="w-3 h-3" />
                          </div>
                          <span>Editar no Studio</span>
                        </button>

                        {/* Delete Site */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Deseja realmente excluir o site "${site.name}"?`)) {
                              onDeleteSite(site.id);
                            }
                          }}
                          className="p-2 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Excluir site"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredSites.length === 0 && (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Building2 className="w-8 h-8 mx-auto opacity-50" />
                  <p className="text-xs">Nenhum site localizado com esses critérios.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: PAINEL DO DONO (SUPER ADMIN - GESTÃO DE ASSINANTES) */}
        {/* ========================================================== */}
        {activeTab === 'paineldono' && isAdmin && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-black">Painel Exclusivo do Dono (Super Admin)</h2>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Controle e gere logins para os criadores de site que assinam a ferramenta Site Express Pro
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewSubscriberModalOpen(true)}
                className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Novo Assinante do SaaS</span>
              </button>
            </div>

            {/* Subscribers List */}
            <div className="space-y-3">
              {saasUsers.map((user) => (
                <div
                  key={user.id}
                  className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isDark ? 'bg-[#111726] border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {user.role === 'admin' ? 'AD' : 'CR'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm">{user.name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            user.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          }`}
                        >
                          {user.status === 'active' ? 'Assinatura Ativa' : 'Bloqueado'}
                        </span>
                      </div>
                      <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>{user.email}</span> •{' '}
                        <span className="font-semibold text-slate-400">{user.planName}</span>
                      </div>
                    </div>
                  </div>

                  {user.role !== 'admin' && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => onToggleUserStatus(user.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          user.status === 'active'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {user.status === 'active' ? 'Bloquear Assinatura' : 'Desbloquear'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: NOVO ASSINANTE (CRIADOR DE SITES) */}
      {isNewSubscriberModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
          <div
            className={`rounded-3xl max-w-md w-full border shadow-2xl overflow-hidden transition-all my-8 ${
              isDark ? 'bg-[#111726] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div
              className={`px-6 py-4 border-b flex items-center justify-between ${
                isDark ? 'border-slate-800 bg-[#0E1322]' : 'border-slate-100 bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-500" />
                <h3 className="font-black text-sm">Gerar Login para Novo Assinante</h3>
              </div>
              <button
                onClick={() => setIsNewSubscriberModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubscriber} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Nome do Criador / Agência</label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Ex: Pedro Henrique (Web Agency)"
                  className={`w-full p-2.5 rounded-xl border focus:outline-hidden ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">E-mail para Login</label>
                <input
                  type="email"
                  required
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  placeholder="pedro@webagency.com.br"
                  className={`w-full p-2.5 rounded-xl border focus:outline-hidden ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Senha Inicial</label>
                <input
                  type="text"
                  required
                  value={newSubPassword}
                  onChange={(e) => setNewSubPassword(e.target.value)}
                  placeholder="123456"
                  className={`w-full p-2.5 rounded-xl border focus:outline-hidden ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Plano Assinado</label>
                <select
                  value={newSubPlan}
                  onChange={(e) => setNewSubPlan(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-hidden ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="Plano Starter (10 Sites)">Plano Starter (10 Sites)</option>
                  <option value="Plano Agência Pro (50 Sites)">Plano Agência Pro (50 Sites)</option>
                  <option value="Plano Ilimitado Agency">Plano Ilimitado Agency</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">WhatsApp do Assinante (Opcional)</label>
                <input
                  type="text"
                  value={newSubPhone}
                  onChange={(e) => setNewSubPhone(e.target.value)}
                  placeholder="5511999998888"
                  className={`w-full p-2.5 rounded-xl border focus:outline-hidden ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSubscriberModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Criar Assinante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mega-Prompt Interactive Viewer & Copy Modal */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div
            className={`w-full max-w-4xl max-h-[88vh] rounded-[24px] shadow-2xl border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
              isDark ? 'bg-[#1C1C1E] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
            }`}
          >
            {/* Modal Header */}
            <div className="p-5 border-b flex items-center justify-between border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black">
                  IA
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Mega-Prompt de Reprodução Completa</h3>
                  <p className="text-xs opacity-60">Cole no Cursor, Claude 3.7, ChatGPT o3-mini/GPT-4o ou v0</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPrompt}
                  className="px-3.5 py-1.5 rounded-[10px] bg-[#007AFF] hover:bg-[#0062cc] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copiado!' : 'Copiar Tudo'}</span>
                </button>

                <button
                  onClick={downloadMegaPromptHtml}
                  className="px-3 py-1.5 rounded-[10px] border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1"
                  title="Baixar HTML do Prompt"
                >
                  <Download className="w-3 h-3 text-blue-500" />
                  <span>HTML</span>
                </button>

                <button
                  onClick={() => setIsPromptModalOpen(false)}
                  className="p-2 rounded-[10px] hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Prompt Preview Box */}
            <div className="flex-1 p-5 overflow-y-auto">
              <pre
                className={`p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed border select-all ${
                  isDark ? 'bg-black/50 border-white/5 text-emerald-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                {MEGA_PROMPT_TEXT}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
              <p className="text-[11px] opacity-60">
                Dica: O prompt instrui a IA a gerar código completo para React 19, Tailwind v4 e Tokens Apple iOS.
              </p>
              <button
                onClick={() => setIsPromptModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Cloud Places API Key Modal */}
      <GoogleApiKeyModal
        isOpen={isGoogleApiKeyModalOpen}
        onClose={() => setIsGoogleApiKeyModalOpen(false)}
        isDark={isDark}
        onKeyUpdated={(key) => setGooglePlacesKey(key)}
      />
    </div>
  );
};
