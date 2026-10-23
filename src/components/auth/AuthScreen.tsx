import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Search,
  FileText,
  Palette,
  Download,
  Zap,
  Sliders,
  Smartphone,
  Check,
  ArrowRight,
  Play,
  X,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { SaaSUser, ThemeMode, BusinessProfile } from '../../types';
import { SiteExpressLogo } from '../brand/SiteExpressLogo';
import { mockBusinesses } from '../../data/mockBusinesses';

interface Props {
  users: SaaSUser[];
  onLoginSuccess: (user: SaaSUser) => void;
  themeMode: ThemeMode;
  onToggleThemeMode: () => void;
  onNavigateToScreen?: (screen: 'login' | 'dashboard' | 'studio') => void;
}

export const AuthScreen: React.FC<Props> = ({
  users,
  onLoginSuccess,
  themeMode,
  onToggleThemeMode,
  onNavigateToScreen,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeRoleTab, setActiveRoleTab] = useState<'creator' | 'admin'>('creator');

  const isDark = themeMode === 'dark';

  const adminUser = users.find((u) => u.role === 'admin') || users[0];
  const creatorUsers = users.filter((u) => u.role === 'creator');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        (u.password === password.trim() ||
          password.trim() === 'admin' ||
          password.trim() === '123' ||
          password.trim() === '123456')
    );

    if (!user) {
      setErrorMsg('E-mail ou senha incorretos. Você pode clicar em um dos atalhos rápidos abaixo.');
      return;
    }

    if (user.status === 'blocked') {
      setErrorMsg('Sua conta está pausada. Entre em contato com a administração.');
      return;
    }

    onLoginSuccess(user);
  };

  const handleQuickLogin = (selectedUser: SaaSUser) => {
    onLoginSuccess(selectedUser);
  };

  const handleOpenCreator = () => {
    onLoginSuccess(creatorUsers[0] || adminUser);
    if (onNavigateToScreen) {
      onNavigateToScreen('dashboard');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-700 selection:bg-[#FFCC00] selection:text-[#171717] ${
        isDark ? 'bg-[#10243C] text-slate-100' : 'bg-[#F7F8FA] text-[#171717]'
      }`}
    >
      {/* =========================================================================
          1. HEADER OFICIAL (CONFORME HANDBOOK E CAPTURA DE TELA)
      ========================================================================= */}
      <header
        className={`h-20 px-4 sm:px-8 lg:px-12 flex items-center justify-between border-b sticky top-0 z-40 backdrop-blur-md transition-colors duration-500 ${
          isDark
            ? 'border-slate-800/80 bg-[#10243C]/90 text-white'
            : 'border-slate-200/80 bg-white/90 text-[#171717]'
        }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <SiteExpressLogo size="md" isDark={isDark} />
        </div>

        {/* Center Navigation Links (Conforme handbook: Início, Como funciona, Modelos, Preços, Ajuda) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
          <a
            href="#inicio"
            className={`transition-colors font-bold ${
              isDark ? 'text-white border-b-2 border-[#FFCC00] pb-0.5' : 'text-[#171717] border-b-2 border-[#FFCC00] pb-0.5'
            }`}
          >
            Início
          </a>
          <a
            href="#como-funciona"
            className={`transition-colors hover:text-[#FFCC00] ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Como funciona
          </a>
          <a
            href="#modelos"
            className={`transition-colors hover:text-[#FFCC00] ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Modelos
          </a>
          <a
            href="#precos"
            onClick={() => setIsLoginModalOpen(true)}
            className={`transition-colors hover:text-[#FFCC00] ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Preços
          </a>
          <a
            href="#ajuda"
            className={`transition-colors hover:text-[#FFCC00] ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Ajuda
          </a>
        </nav>

        {/* Global 3-Screen Switcher (Para navegação imediata de avaliação) */}
        {onNavigateToScreen && (
          <div className="hidden xl:flex items-center bg-black/5 dark:bg-black/30 p-1 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold">
            <button
              className="px-3 py-1 rounded-lg bg-[#FFCC00] text-[#171717] font-bold shadow-xs cursor-default"
              title="Tela 1: Apresentação & Início"
            >
              🌟 1. Apresentação
            </button>
            <button
              onClick={() => {
                onLoginSuccess(creatorUsers[0] || adminUser);
                onNavigateToScreen('dashboard');
              }}
              className="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Tela 2: + Novo Site & Buscador"
            >
              🏢 2. + Novo Site
            </button>
            <button
              onClick={() => {
                onLoginSuccess(creatorUsers[0] || adminUser);
                onNavigateToScreen('studio');
              }}
              className="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Tela 3: Studio Pro"
            >
              ⚡ 3. Studio Pro
            </button>
          </div>
        )}

        {/* Right Actions: Day/Night Toggle & Começar Agora */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Day / Night Theme Switcher (Cena do Quarto das Ideias) */}
          <button
            onClick={onToggleThemeMode}
            className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
              isDark
                ? 'bg-slate-800/80 text-[#FFD778] border-slate-700 hover:bg-slate-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-2xs'
            }`}
            title={isDark ? 'Mudar para Modo Dia (Luz Natural)' : 'Mudar para Modo Noite (Abajur Aceso)'}
          >
            {isDark ? <Moon className="w-4 h-4 fill-[#FFD778]" /> : <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />}
          </button>

          {/* Entrar Button */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className={`hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-[#171717]'
            }`}
          >
            Entrar
          </button>

          {/* Primary Button "Começar agora →" (Yellow #FFCC00) */}
          <button
            onClick={handleOpenCreator}
            className="px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#FFCC00] text-[#171717] hover:bg-[#F5C200] active:scale-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Começar agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. HERO: O QUARTO DAS IDEIAS (CONFORME CAPTURA LOVABLE - SEM BOTÕES DUPLICADOS)
      ========================================================================= */}
      <section id="inicio" className="relative w-full pt-8 sm:pt-12 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LADO ESQUERDO: TEXTOS, TÍTULOS E BOTÕES REAIS */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* Kicker: SUA IDEIA. SEU SITE. */}
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                SUA IDEIA. SEU SITE.
              </span>
              <div className={`h-[1px] w-12 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            </div>

            {/* Headline com Amarelo de Destaque */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-[-0.03em] leading-[1.08]">
              Sites profissionais{' '}
              <span className="text-[#FFCC00] block mt-1">do seu jeito.</span>
            </h1>

            {/* Subtítulo Aprovado */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Pesquise uma empresa, complete as informações e edite o site visualmente. Tudo em um só lugar.
            </p>

            {/* Botoes de Ação */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleOpenCreator}
                className="px-7 py-3.5 rounded-full font-extrabold text-sm bg-[#FFCC00] text-[#171717] hover:bg-[#F5C200] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Criar meu site agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#como-funciona"
                className={`px-5 py-3.5 rounded-full font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? 'border-white/20 text-white hover:bg-white/10'
                    : 'border-slate-300 text-slate-800 bg-white hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>Ver como funciona</span>
              </a>
            </div>

            {/* Kicker de 3 Benefícios Reais */}
            <div className={`pt-4 flex items-center gap-4 text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#FFCC00]" />
                <span>Rápido e fácil</span>
              </div>
              <span>|</span>
              <div className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-blue-500" />
                <span>Design profissional</span>
              </div>
              <span>|</span>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>100% responsivo</span>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: CENA 3D (COMPUTADOR, CELULAR, ABAJUR, LIVROS E CAFÉ — RECORTADO SEM TEXTO OU BOTÕES ARTIFICIAIS) */}
          <div className="lg:col-span-7 relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 bg-slate-100 dark:bg-slate-900">
              
              {/* Layer 1: Modo Dia (Luz Natural) recortado com precisão no lado direito da cena */}
              <img
                src="/assets/aistudio/Site_Express_em_Luz_Natural_74ffbece.png"
                alt="Site Express em Luz Natural"
                className={`absolute inset-0 w-full h-full object-cover object-[84%_38%] transition-opacity duration-700 ease-in-out ${
                  isDark ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              />

              {/* Layer 2: Modo Noite (Luz Noturna com Abajur) recortado no lado direito da cena */}
              <img
                src="/assets/aistudio/Imagem_ChatGPT_22_10_2026__20_28_55_c83acbad.png"
                alt="Site Express em Modo Noite"
                className={`absolute inset-0 w-full h-full object-cover object-[84%_38%] transition-opacity duration-700 ease-in-out ${
                  isDark ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />

              {/* Badge Flutuante Sutil na Cena */}
              <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-white/90 border border-white/10 flex items-center gap-2 shadow-md">
                <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#FFD778] animate-pulse' : 'bg-amber-400'}`} />
                <span>{isDark ? 'Modo Noite • Abajur Aceso' : 'Modo Dia • Luz Natural'}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          OS 4 PASSOS EM CARDS COLORIDOS (FLUTUANDO LOGO ABAIXO DA MESA DO HERO)
      ========================================================================= */}
      <div id="como-funciona" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-4 sm:mt-8 mb-16 sm:mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 01: Pesquise (Azul) */}
          <div
            onClick={handleOpenCreator}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group ${
              isDark
                ? 'bg-[#10243C] border-slate-700/80 shadow-xl hover:border-[#1675E8]'
                : 'bg-white border-slate-200 shadow-lg hover:shadow-xl hover:border-[#1675E8]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#1675E8] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block uppercase">01</span>
              <h4 className="font-extrabold text-sm sm:text-base leading-tight">Pesquise</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Encontre os dados da sua empresa.</p>
            </div>
          </div>

          {/* Card 02: Complete (Vermelho) */}
          <div
            onClick={handleOpenCreator}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group ${
              isDark
                ? 'bg-[#10243C] border-slate-700/80 shadow-xl hover:border-[#E11D48]'
                : 'bg-white border-slate-200 shadow-lg hover:shadow-xl hover:border-[#E11D48]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#E11D48] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block uppercase">02</span>
              <h4 className="font-extrabold text-sm sm:text-base leading-tight">Complete</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Adicione as informações que faltam.</p>
            </div>
          </div>

          {/* Card 03: Edite (Amarelo / Laranja) */}
          <div
            onClick={handleOpenCreator}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group ${
              isDark
                ? 'bg-[#10243C] border-slate-700/80 shadow-xl hover:border-[#F59E0B]'
                : 'bg-white border-slate-200 shadow-lg hover:shadow-xl hover:border-[#F59E0B]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block uppercase">03</span>
              <h4 className="font-extrabold text-sm sm:text-base leading-tight">Edite</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Personalize tudo do seu jeito.</p>
            </div>
          </div>

          {/* Card 04: Exporte (Verde) */}
          <div
            onClick={handleOpenCreator}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group ${
              isDark
                ? 'bg-[#10243C] border-slate-700/80 shadow-xl hover:border-[#10B981]'
                : 'bg-white border-slate-200 shadow-lg hover:shadow-xl hover:border-[#10B981]'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block uppercase">04</span>
              <h4 className="font-extrabold text-sm sm:text-base leading-tight">Exporte</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Baixe o site pronto para hospedar.</p>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          3. SEÇÃO: POR QUE SITE EXPRESS
      ========================================================================= */}
      <section className={`py-16 sm:py-20 border-t ${isDark ? 'border-slate-800 bg-[#0B1B30]' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-3">
              <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                POR QUE SITE EXPRESS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                O acabamento de um estúdio, a facilidade de um editor.
              </h2>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Coluna 1: Rapidez */}
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base">Rapidez</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Comece a partir dos dados da empresa, sem tela em branco.
                </p>
              </div>

              {/* Coluna 2: Personalização */}
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base">Personalização</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Cores, logo, fotos e textos com a identidade de cada cliente.
                </p>
              </div>

              {/* Coluna 3: Responsivo */}
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base">Responsivo</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ajustes próprios para celular, tablet e computador.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SEÇÃO: MODELOS POR SEGMENTO ("Um ponto de partida para cada negócio.")
      ========================================================================= */}
      <section id="modelos" className={`py-16 sm:py-20 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                MODELOS POR SEGMENTO
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                Um ponto de partida para cada negócio.
              </h2>
            </div>

            <button
              onClick={handleOpenCreator}
              className="text-xs font-bold text-[#1675E8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos os modelos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Modelos Principais com Miniaturas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Modelo 1: Gastronomia */}
            <div
              onClick={handleOpenCreator}
              className={`rounded-2xl overflow-hidden border transition-all cursor-pointer group flex flex-col justify-between ${
                isDark
                  ? 'bg-[#14283E] border-slate-700 hover:border-[#FFCC00]'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-lg hover:border-[#FFCC00]'
              }`}
            >
              <div className="h-48 overflow-hidden bg-slate-900 relative">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Gastronomia"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded">
                    Churrasco & Gastronomia
                  </span>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base">Gastronomia</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Restaurantes, bares, cafés e delivery</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-500 group-hover:text-black group-hover:bg-[#FFCC00] group-hover:border-[#FFCC00] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Modelo 2: Serviços (Clínicas e Saúde) */}
            <div
              onClick={handleOpenCreator}
              className={`rounded-2xl overflow-hidden border transition-all cursor-pointer group flex flex-col justify-between ${
                isDark
                  ? 'bg-[#14283E] border-slate-700 hover:border-[#FFCC00]'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-lg hover:border-[#FFCC00]'
              }`}
            >
              <div className="h-48 overflow-hidden bg-slate-900 relative">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                  alt="Serviços Médicos"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white bg-blue-900/80 px-2 py-0.5 rounded">
                    Clínica Viva • 4.9★
                  </span>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base">Serviços</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Clínicas, escritórios, estética e profissionais</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-500 group-hover:text-black group-hover:bg-[#FFCC00] group-hover:border-[#FFCC00] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Modelo 3: Produtos e Varejo */}
            <div
              onClick={handleOpenCreator}
              className={`rounded-2xl overflow-hidden border transition-all cursor-pointer group flex flex-col justify-between ${
                isDark
                  ? 'bg-[#14283E] border-slate-700 hover:border-[#FFCC00]'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-lg hover:border-[#FFCC00]'
              }`}
            >
              <div className="h-48 overflow-hidden bg-slate-900 relative">
                <img
                  src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"
                  alt="Varejo e Moda"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded">
                    Nexo Moda Urbana
                  </span>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base">Produtos e varejo</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Lojas, marcas e catálogos comerciais</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-500 group-hover:text-black group-hover:bg-[#FFCC00] group-hover:border-[#FFCC00] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>

          <p className="text-[11px] text-slate-400 mt-4 text-center">
            Imagens demonstrativas. Empresas e conteúdos fictícios.
          </p>
        </div>
      </section>

      {/* =========================================================================
          5. SEÇÃO: DIFERENCIAIS ("Feito para quem entrega sites a clientes reais.")
      ========================================================================= */}
      <section id="diferenciais" className={`py-16 sm:py-20 border-t ${isDark ? 'border-slate-800 bg-[#0B1B30]' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="space-y-3 mb-10">
            <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              DIFERENCIAIS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Feito para quem entrega sites a clientes reais.
            </h2>
          </div>

          {/* 3 Cards de Diferenciais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Controle Visual */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${isDark ? 'bg-[#14283E] border-slate-700' : 'bg-slate-50/70 border-slate-200/90'}`}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base sm:text-lg">Controle visual</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Clique no texto ou na imagem do próprio site para editar. Desfazer e refazer de verdade.
              </p>
            </div>

            {/* Card 2: Dados Comerciais */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${isDark ? 'bg-[#14283E] border-slate-700' : 'bg-slate-50/70 border-slate-200/90'}`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base sm:text-lg">Dados comerciais</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Importação autorizada de dados públicos, sempre mostrando o que foi importado e o que falta confirmar.
              </p>
            </div>

            {/* Card 3: Exportação Independente */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${isDark ? 'bg-[#14283E] border-slate-700' : 'bg-slate-50/70 border-slate-200/90'}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold mb-4">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base sm:text-lg">Exportação independente</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Pacote com HTML, CSS e imagens que funciona em qualquer hospedagem, sem depender da plataforma.
              </p>
            </div>

          </div>

          {/* Checklist de Confiança */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="w-4 h-4 shrink-0" />
              <span>Sem depoimentos inventados</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="w-4 h-4 shrink-0" />
              <span>Sem dados fabricados</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="w-4 h-4 shrink-0" />
              <span>SEO em cada página</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Check className="w-4 h-4 shrink-0" />
              <span>Você é dono do seu site</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. BANNER DE CONVERSÃO FINAL (SEU SITE COMEÇA AQUI — CONFORME REFERÊNCIA)
      ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#0A1628] text-white p-8 sm:p-12 lg:p-16 relative border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* Lado Esquerdo: Textos e Botão de Ação */}
          <div className="relative z-10 space-y-6 text-left max-w-lg">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block">
              SEU SITE COMEÇA AQUI
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.08]">
              Escolha um modelo e comece agora.
            </h3>
            <div className="pt-2">
              <button
                onClick={handleOpenCreator}
                className="px-8 py-4 rounded-full font-extrabold text-sm sm:text-base bg-[#FFCC00] text-[#171717] hover:bg-[#F5C200] active:scale-95 transition-all shadow-xl flex items-center gap-2.5 cursor-pointer group"
              >
                <span>Ver modelos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Lado Direito: Moldura de Tela Premium com o Quarto das Ideias / Modo Noite */}
          <div className="w-full lg:w-1/2 relative z-10 flex justify-center lg:justify-end">
            <div className="relative rounded-2xl sm:rounded-3xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] bg-[#070e1c] overflow-hidden max-w-lg w-full ring-1 ring-white/10 group">
              {/* Barra superior de dispositivo elegante */}
              <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 px-3 py-0.5 rounded-md bg-white/5 border border-white/5">
                  siteexpress.pro
                </div>
                <div className="w-8" />
              </div>

              {/* Imagem em alta definição da cena noturna com overlay de reflexo */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="/assets/aistudio/Imagem_ChatGPT_22_10_2026__20_28_55_c83acbad.png"
                  alt="Site Express em Modo Noite"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Sutil background ambient glow */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#FFCC00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* =========================================================================
          7. RODAPÉ OFICIAL DO SITE EXPRESS
      ========================================================================= */}
      <footer id="ajuda" className={`py-12 border-t text-xs ${isDark ? 'border-slate-800 bg-[#0B1B30] text-slate-400' : 'border-slate-200 bg-white text-slate-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <SiteExpressLogo size="sm" isDark={isDark} />
            <p className="text-xs leading-relaxed max-w-sm">
              Sua ideia. Seu site. Sites profissionais, editáveis e responsivos para empresas brasileiras.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              PRODUTO
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#como-funciona" className="hover:underline">Como funciona</a></li>
              <li><a href="#modelos" className="hover:underline">Modelos</a></li>
              <li><a href="#precos" onClick={() => setIsLoginModalOpen(true)} className="hover:underline">Preços & Planos</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              SUPORTE
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => setIsLoginModalOpen(true)} className="hover:underline">Central de ajuda</button></li>
              <li><button onClick={() => setIsLoginModalOpen(true)} className="hover:underline">Painel de Acesso</button></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© 2026 Site Express. Imagens de modelos são demonstrativas.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Privacidade & Termos</span>
            <span>Feito para Agências & Criadores</span>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          8. MODAL DE ACESSO & LOGIN (CONEXÃO COM PAINEL E STUDIO)
      ========================================================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14283E] rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-8 relative text-slate-900 dark:text-white animate-fade-in">
            
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <SiteExpressLogo size="sm" isDark={isDark} />
              <h3 className="font-black text-xl mt-3">Acessar o Site Express</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Entre para gerenciar seus clientes ou criar novos sites
              </p>
            </div>

            {/* Selector Criador vs Super Admin */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveRoleTab('creator')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  activeRoleTab === 'creator'
                    ? 'bg-white dark:bg-[#10243C] text-slate-900 dark:text-white shadow-xs font-black'
                    : 'text-slate-500'
                }`}
              >
                Criador de Sites
              </button>
              <button
                type="button"
                onClick={() => setActiveRoleTab('admin')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  activeRoleTab === 'admin'
                    ? 'bg-white dark:bg-[#10243C] text-purple-600 dark:text-purple-400 shadow-xs font-black'
                    : 'text-slate-500'
                }`}
              >
                Super Admin (Dono)
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activeRoleTab === 'admin' ? 'admin@siteexpress.com' : 'lucas@agenciapro.com'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-[#FFCC00] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-[#FFCC00] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-extrabold text-xs bg-[#FFCC00] text-[#171717] hover:bg-[#F5C200] active:scale-95 transition-all shadow-md cursor-pointer mt-2"
              >
                Entrar no Sistema
              </button>
            </form>

            {/* Atalhos Rápidos com 1-Clique */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5 text-center">
                Atalhos de Demonstração (1-Clique)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin(adminUser)}
                  className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-500/20 transition-colors text-left flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="block text-[11px]">Super Admin</span>
                    <span className="text-[9px] opacity-70">Painel do Dono</span>
                  </div>
                  <UserCheck className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin(creatorUsers[0] || adminUser)}
                  className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-500/20 transition-colors text-left flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="block text-[11px]">Lucas Mendes</span>
                    <span className="text-[9px] opacity-70">Agência Pro</span>
                  </div>
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
