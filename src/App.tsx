import React, { useState, useEffect } from 'react';
import {
  BusinessProfile,
  ViewportMode,
  MarketingConfig,
  ThemeConfig,
  SectionToggle,
  SelectedElementInspect,
  AppScreen,
  ThemeMode,
  SaaSUser,
} from './types';
import { mockBusinesses } from './data/mockBusinesses';
import { initialSaaSUsers } from './data/mockUsers';
import { AuthScreen } from './components/auth/AuthScreen';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { StudioHeader } from './components/studio/StudioHeader';
import { SidebarPanels } from './components/studio/SidebarPanels';
import { CanvasContainer } from './components/canvas/CanvasContainer';
import { RenderedLandingPage } from './components/canvas/RenderedLandingPage';
import { SuspendedPageNotice } from './components/canvas/SuspendedPageNotice';
import { GoogleVerificationModal } from './components/studio/GoogleVerificationModal';
import { GoogleSearchAutocomplete } from './components/studio/GoogleSearchAutocomplete';
import { ManualBusinessModal } from './components/studio/ManualBusinessModal';
import { LogoStudioModal } from './components/studio/LogoStudioModal';
import { InlineElementInspector } from './components/studio/InlineElementInspector';
import { ClientPortalModal } from './components/client/ClientPortalModal';
import { downloadStandaloneHtml, downloadSiteZip } from './utils/exportHtml';
import { Search, X, ArrowLeft, Info } from 'lucide-react';

export default function App() {
  // 1. PUBLIC SLUG ROUTING (?site=slug or /site/slug)
  const [publicSlug, setPublicSlug] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const querySite = params.get('site');
      if (querySite) return querySite;
      const match = window.location.pathname.match(/^\/site\/([a-zA-Z0-9_-]+)/);
      if (match) return match[1];
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const querySite = params.get('site');
      const match = window.location.pathname.match(/^\/site\/([a-zA-Z0-9_-]+)/);
      setPublicSlug(querySite || (match ? match[1] : null));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. DAY / NIGHT THEME MODE (GLOBAL)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('site_express_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  const toggleThemeMode = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    try {
      localStorage.setItem('site_express_theme_mode', next);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // 3. SAAS SUBSCRIBERS / USERS LIST
  const [saasUsers, setSaasUsers] = useState<SaaSUser[]>(() => {
    try {
      const stored = localStorage.getItem('site_express_saas_users');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Erro ao carregar usuários:', e);
    }
    return initialSaaSUsers;
  });

  useEffect(() => {
    try {
      localStorage.setItem('site_express_saas_users', JSON.stringify(saasUsers));
    } catch (e) {
      console.warn('Erro ao salvar usuários:', e);
    }
  }, [saasUsers]);

  // 4. AUTHENTICATED USER SESSION
  const [currentUser, setCurrentUser] = useState<SaaSUser | null>(() => {
    try {
      const stored = localStorage.getItem('site_express_active_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Erro ao carregar sessão:', e);
    }
    // Default to Lucas Mendes (Creator) for immediate access, with instant switch available
    return initialSaaSUsers[1];
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('site_express_active_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('site_express_active_user');
      }
    } catch (e) {
      console.warn('Erro ao salvar sessão:', e);
    }
  }, [currentUser]);

  // 5. CURRENT SCREEN NAVIGATION ('login' | 'dashboard' | 'studio')
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');

  // 6. SAVED CLIENT SITES
  const [savedClients, setSavedClients] = useState<BusinessProfile[]>(() => {
    try {
      const stored = localStorage.getItem('site_express_clients');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Erro ao carregar clientes:', e);
    }
    return mockBusinesses;
  });

  useEffect(() => {
    try {
      localStorage.setItem('site_express_clients', JSON.stringify(savedClients));
    } catch (e) {
      console.warn('Erro ao salvar clientes:', e);
    }
  }, [savedClients]);

  // Current active business inside the Studio
  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile>(savedClients[0] || mockBusinesses[0]);

  // Viewport mode inside the Studio
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [inspectData, setInspectData] = useState<SelectedElementInspect | null>(null);

  // Modals state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState<boolean>(false);
  const [verificationModalBiz, setVerificationModalBiz] = useState<BusinessProfile | null>(null);

  // Marketing configuration state
  const [marketing, setMarketing] = useState<MarketingConfig>({
    metaPixelId: '',
    googleAdsId: '',
    googleAdsLabel: '',
    gtmId: '',
    ga4Id: '',
    searchConsoleCode: '',
    customMetaTitle: '',
    customMetaDescription: '',
  });

  // Theme configuration state
  const [theme, setTheme] = useState<ThemeConfig>({
    id: 'clinico-azul',
    name: 'Azul Autoridade Clínico',
    primaryColor: '#0F172A',
    accentColor: '#3B82F6',
    backgroundColor: '#FAFAFA',
    surfaceColor: '#FFFFFF',
    textColor: '#0F172A',
    mutedTextColor: '#64748B',
    fontFamily: 'Plus Jakarta Sans',
    buttonStyle: 'elevated',
  });

  // Sections order and visibility (9 Modular Sections from Image 1)
  const [sections, setSections] = useState<SectionToggle[]>([
    { id: 'hero', label: 'Hero Editorial / Fotográfico', enabled: true },
    { id: 'bento', label: 'Bento de Especialidades', enabled: true },
    { id: 'como-funciona', label: 'Como Funciona (3 etapas)', enabled: true },
    { id: 'promocao', label: 'Promoção com Cronômetro', enabled: false },
    { id: 'credenciais', label: 'Autoridade & Números', enabled: true },
    { id: 'video', label: 'Vídeo Institucional', enabled: false },
    { id: 'avaliacoes', label: 'Avaliações do Google', enabled: true },
    { id: 'localizacao', label: 'Localização & Rotas', enabled: true },
    { id: 'faq', label: 'Dúvidas Frequentes', enabled: true },
  ]);

  const handleToggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
  };

  // Update current active business
  const updateBusinessProfile = (updated: BusinessProfile) => {
    setCurrentBusiness(updated);
    setSavedClients((prev) => {
      const idx = prev.findIndex((c) => c.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  };

  // Select business from Google Places search
  const handleSelectBusinessFromSearch = (biz: BusinessProfile) => {
    setIsSearchModalOpen(false);
    setVerificationModalBiz(biz);
  };

  // Confirm verification modal and open studio
  const handleConfirmVerification = (verifiedBiz: BusinessProfile) => {
    updateBusinessProfile(verifiedBiz);
    setVerificationModalBiz(null);

    // Adapt palette to match archetype
    if (verifiedBiz.archetype === 'gastronomia') {
      setTheme({
        id: 'gastronomico-verde',
        name: 'Verde Artesanal & Dourado (Simprão)',
        primaryColor: '#153E23',
        accentColor: '#F3C94D',
        backgroundColor: '#F8F7F0',
        surfaceColor: '#FFFFFF',
        textColor: '#1B2516',
        mutedTextColor: '#526649',
        fontFamily: 'Plus Jakarta Sans',
        buttonStyle: 'elevated',
      });
    } else if (verifiedBiz.archetype === 'produtos') {
      setTheme({
        id: 'comercio-grafite',
        name: 'Grafite Moderno & Vermelho Ação',
        primaryColor: '#111827',
        accentColor: '#E11D48',
        backgroundColor: '#F9FAFB',
        surfaceColor: '#FFFFFF',
        textColor: '#111827',
        mutedTextColor: '#6B7280',
        fontFamily: 'Plus Jakarta Sans',
        buttonStyle: 'shimmer',
      });
    } else {
      setTheme({
        id: 'clinico-azul',
        name: 'Azul Autoridade Clínico',
        primaryColor: '#0F172A',
        accentColor: '#3B82F6',
        backgroundColor: '#FAFAFA',
        surfaceColor: '#FFFFFF',
        textColor: '#0F172A',
        mutedTextColor: '#64748B',
        fontFamily: 'Plus Jakarta Sans',
        buttonStyle: 'elevated',
      });
    }

    setCurrentScreen('studio');
  };

  // Confirm manual business creation and open studio
  const handleConfirmManualCreation = (newBiz: BusinessProfile) => {
    updateBusinessProfile(newBiz);
    setCurrentScreen('studio');
  };

  // Toggle site active/suspended status (Killswitch)
  const handleToggleSiteStatus = (id: string) => {
    setSavedClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'active' ? 'suspended' : 'active';
          const updated = { ...c, status: nextStatus as 'active' | 'suspended' };
          if (currentBusiness.id === id) {
            setCurrentBusiness(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  // Delete site
  const handleDeleteSite = (id: string) => {
    setSavedClients((prev) => prev.filter((c) => c.id !== id));
    if (currentBusiness.id === id) {
      const remaining = savedClients.filter((c) => c.id !== id);
      if (remaining.length > 0) setCurrentBusiness(remaining[0]);
    }
  };

  // Select site and open studio
  const handleSelectAndEditSite = (site: BusinessProfile) => {
    setCurrentBusiness(site);
    setCurrentScreen('studio');
  };

  // Add new SaaS subscriber (Super Admin)
  const handleAddSaaSUser = (newUser: SaaSUser) => {
    setSaasUsers((prev) => [newUser, ...prev]);
  };

  // Toggle SaaS subscriber status (Super Admin)
  const handleToggleUserStatus = (id: string) => {
    setSaasUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            status: u.status === 'active' ? 'blocked' : 'active',
          };
        }
        return u;
      })
    );
  };

  // Sidebar active tab state
  const [sidebarTab, setSidebarTab] = useState<'secoes' | 'design' | 'marketing' | 'clientes'>('secoes');

  // =========================================================================
  // VIEW 1: PUBLIC VIEW VIA SLUG (?site=slug or /site/slug)
  // =========================================================================
  if (publicSlug) {
    const publicBusiness =
      savedClients.find((c) => c.slug === publicSlug) ||
      mockBusinesses.find((c) => c.slug === publicSlug);

    if (!publicBusiness) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
              404
            </div>
            <h1 className="text-xl font-bold">Site não encontrado</h1>
            <p className="text-xs text-slate-400">
              O endereço público <span className="font-mono text-white">"{publicSlug}"</span> não foi localizado ou ainda não foi publicado.
            </p>
            <button
              onClick={() => {
                window.history.pushState({}, '', window.location.pathname.split('?')[0]);
                setPublicSlug(null);
              }}
              className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Painel</span>
            </button>
          </div>
        </div>
      );
    }

    const publicTheme: ThemeConfig =
      publicBusiness.archetype === 'gastronomia'
        ? {
            id: 'gastronomico-verde',
            name: 'Verde Artesanal',
            primaryColor: '#153E23',
            accentColor: '#F3C94D',
            backgroundColor: '#F8F7F0',
            surfaceColor: '#FFFFFF',
            textColor: '#1B2516',
            mutedTextColor: '#526649',
            fontFamily: 'Plus Jakarta Sans',
            buttonStyle: 'elevated',
          }
        : publicBusiness.archetype === 'produtos'
        ? {
            id: 'comercio-grafite',
            name: 'Grafite Moderno',
            primaryColor: '#111827',
            accentColor: '#E11D48',
            backgroundColor: '#F9FAFB',
            surfaceColor: '#FFFFFF',
            textColor: '#111827',
            mutedTextColor: '#6B7280',
            fontFamily: 'Plus Jakarta Sans',
            buttonStyle: 'shimmer',
          }
        : {
            id: 'clinico-azul',
            name: 'Azul Clínico',
            primaryColor: '#0F172A',
            accentColor: '#3B82F6',
            backgroundColor: '#FAFAFA',
            surfaceColor: '#FFFFFF',
            textColor: '#0F172A',
            mutedTextColor: '#64748B',
            fontFamily: 'Plus Jakarta Sans',
            buttonStyle: 'elevated',
          };

    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col relative selection:bg-slate-200">
        {/* Floating Quick Bar for Administrator / Creator Testing */}
        <div className="fixed top-3 right-3 z-50 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs shadow-xl border border-white/10 select-none">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                publicBusiness.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>{publicBusiness.status === 'active' ? 'Site Oficial no Ar' : 'Site Suspenso'}</span>
            <span className="font-mono text-[10px] text-slate-400">/{publicBusiness.slug}</span>
          </span>
          <button
            onClick={() => {
              window.history.pushState({}, '', window.location.pathname.split('?')[0]);
              setPublicSlug(null);
            }}
            className="ml-2 pl-2 border-l border-white/20 text-blue-400 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Voltar ao Studio</span>
          </button>
        </div>

        {publicBusiness.status === 'suspended' ? (
          <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
            <div className="max-w-xl w-full">
              <SuspendedPageNotice
                business={publicBusiness}
                onReactivate={() => {
                  updateBusinessProfile({ ...publicBusiness, status: 'active' });
                }}
              />
            </div>
          </div>
        ) : (
          <RenderedLandingPage
            business={publicBusiness}
            theme={publicTheme}
            viewport={typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop'}
            isPreviewMode={true}
            onUpdateBusiness={updateBusinessProfile}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATION SCREEN (TELA 1)
  // =========================================================================
  if (currentScreen === 'login' || !currentUser) {
    return (
      <AuthScreen
        users={saasUsers}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentScreen('dashboard');
        }}
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
        onNavigateToScreen={(scr) => {
          if (!currentUser) setCurrentUser(saasUsers[1] || saasUsers[0]);
          setCurrentScreen(scr);
        }}
      />
    );
  }

  // =========================================================================
  // VIEW 3: DASHBOARD & GESTÃO (TELA 2)
  // =========================================================================
  if (currentScreen === 'dashboard') {
    return (
      <>
        <DashboardScreen
          currentUser={currentUser}
          savedClients={savedClients}
          onSelectAndEditSite={handleSelectAndEditSite}
          onOpenGoogleSearch={() => setIsSearchModalOpen(true)}
          onOpenManualCreate={() => setIsManualModalOpen(true)}
          onToggleSiteStatus={handleToggleSiteStatus}
          onDeleteSite={handleDeleteSite}
          onLogout={() => {
            setCurrentUser(null);
            setCurrentScreen('login');
          }}
          themeMode={themeMode}
          onToggleThemeMode={toggleThemeMode}
          saasUsers={saasUsers}
          onAddSaaSUser={handleAddSaaSUser}
          onToggleUserStatus={handleToggleUserStatus}
          onSelectBusinessFromSearch={handleSelectBusinessFromSearch}
          onNavigateToScreen={setCurrentScreen}
        />

        {/* GOOGLE SEARCH MODAL */}
        {isSearchModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-fade-in text-slate-900 dark:text-white">
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Buscador Google Meu Negócio</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Localize a ficha oficial de qualquer empresa e cidade brasileira
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <GoogleSearchAutocomplete onSelectBusiness={handleSelectBusinessFromSearch} />
              </div>
            </div>
          </div>
        )}

        {/* MANUAL CREATE BUSINESS MODAL */}
        <ManualBusinessModal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          onConfirm={handleConfirmManualCreation}
          themeMode={themeMode}
        />

        {/* GOOGLE VERIFICATION MODAL */}
        {verificationModalBiz && (
          <GoogleVerificationModal
            business={verificationModalBiz}
            isOpen={!!verificationModalBiz}
            onClose={() => setVerificationModalBiz(null)}
            onConfirm={handleConfirmVerification}
          />
        )}
      </>
    );
  }

  // =========================================================================
  // VIEW 4: ESTÚDIO DE CRIAÇÃO E EDIÇÃO DO SITE (TELA 3)
  // =========================================================================
  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased selection:bg-slate-200 transition-colors ${
        themeMode === 'dark' ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F8F9FA] text-slate-900'
      }`}
    >
      {/* 1. STUDIO HEADER (WITH "VOLTAR AO PAINEL" BUTTON & LOGO TOOL) */}
      <StudioHeader
        business={currentBusiness}
        viewport={viewport}
        onViewportChange={setViewport}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenClients={() => {
          setIsSidebarOpen(true);
          setSidebarTab('clientes');
        }}
        onOpenPublicSite={() => {
          const url = `${window.location.origin}?site=${currentBusiness.slug}`;
          window.open(url, '_blank');
        }}
        onOpenLogoStudio={() => setIsLogoModalOpen(true)}
        onBackToDashboard={() => setCurrentScreen('dashboard')}
        onDownloadHtml={() => downloadStandaloneHtml(currentBusiness, marketing, theme, sections)}
        onDownloadZip={() => downloadSiteZip(currentBusiness, marketing, theme, sections)}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onUpdateHeroLayout={(layout) =>
          updateBusinessProfile({ ...currentBusiness, heroLayout: layout })
        }
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
        theme={theme}
        onChangeTheme={setTheme}
        onNavigateToScreen={setCurrentScreen}
        clientCount={savedClients.length}
      />

      {/* 2. MAIN WORKSPACE: SIDEBAR + CANVAS */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Controls (Hidden when in full preview mode) */}
        {!isPreviewMode && (
          <SidebarPanels
            business={currentBusiness}
            onChangeBusiness={updateBusinessProfile}
            marketing={marketing}
            onChangeMarketing={setMarketing}
            theme={theme}
            onChangeTheme={setTheme}
            sections={sections}
            onToggleSection={handleToggleSection}
            onMoveSection={handleMoveSection}
            savedClients={savedClients}
            onSelectClient={(c) => updateBusinessProfile(c)}
            onDuplicateClient={(client) => {
              const duplicated: BusinessProfile = {
                ...client,
                id: `${client.id}-copia-${Date.now().toString().slice(-4)}`,
                name: `${client.name} (Cópia)`,
                slug: `${client.slug}-copia`,
                createdAt: new Date().toISOString(),
              };
              setSavedClients((prev) => [duplicated, ...prev]);
              setCurrentBusiness(duplicated);
            }}
            onDeleteClient={handleDeleteSite}
            onDownloadClientHtml={(c) => downloadStandaloneHtml(c, marketing, theme, sections)}
            isOpen={isSidebarOpen}
            onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
            activeTab={sidebarTab}
            onChangeActiveTab={setSidebarTab}
          />
        )}

        {/* Central Responsive Canvas Viewport */}
        <CanvasContainer
          business={currentBusiness}
          theme={theme}
          viewport={viewport}
          isPreviewMode={isPreviewMode}
          onUpdateBusiness={updateBusinessProfile}
          onSelectElement={(data) => setInspectData(data)}
          onReactivate={() => updateBusinessProfile({ ...currentBusiness, status: 'active' })}
          sections={sections}
        />
      </div>

      {/* 3. CONTEXTUAL ELEMENT INSPECTOR POPOVER */}
      {!isPreviewMode && (
        <InlineElementInspector
          inspectData={inspectData}
          onClose={() => setInspectData(null)}
          business={currentBusiness}
          onUpdateBusiness={updateBusinessProfile}
        />
      )}

      {/* 4. GOOGLE PLACES SEARCH MODAL */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-fade-in text-slate-900 dark:text-white">
            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base">Buscador Google Meu Negócio</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Localize a ficha oficial de qualquer empresa e cidade brasileira
                </p>
              </div>
            </div>

            <div className="mt-4">
              <GoogleSearchAutocomplete
                onSelectBusiness={handleSelectBusinessFromSearch}
                isDark={themeMode === 'dark'}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. MANUAL CREATE BUSINESS MODAL */}
      <ManualBusinessModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onConfirm={handleConfirmManualCreation}
        themeMode={themeMode}
      />

      {/* 6. LOGO & COLOR PALETTE STUDIO MODAL */}
      <LogoStudioModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        business={currentBusiness}
        theme={theme}
        onUpdateBusiness={updateBusinessProfile}
        onUpdateTheme={setTheme}
        themeMode={themeMode}
      />

      {/* 7. GOOGLE VERIFICATION MODAL */}
      {verificationModalBiz && (
        <GoogleVerificationModal
          business={verificationModalBiz}
          isOpen={!!verificationModalBiz}
          onClose={() => setVerificationModalBiz(null)}
          onConfirm={handleConfirmVerification}
        />
      )}

      {/* 8. CLIENT EXCLUSIVE ACCESS PORTAL MODAL */}
      <ClientPortalModal
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        clients={savedClients}
        initialClient={currentBusiness}
        onOpenPublicSite={(slug) => {
          const url = `${window.location.origin}?site=${slug}`;
          window.open(url, '_blank');
        }}
      />
    </div>
  );
}
