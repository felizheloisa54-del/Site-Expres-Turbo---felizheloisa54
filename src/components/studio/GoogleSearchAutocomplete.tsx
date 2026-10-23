import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  ArrowRight,
  Building2,
  KeyRound,
  Globe,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { BusinessProfile } from '../../types';
import { mockBusinesses } from '../../data/mockBusinesses';
import { GoogleApiKeyModal } from './GoogleApiKeyModal';

interface Props {
  onSelectBusiness: (business: BusinessProfile) => void;
  className?: string;
  isDark?: boolean;
}

interface GooglePlaceItem {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  types: string[];
  isOpenNow: boolean;
  photoRef?: string;
}

export const GoogleSearchAutocomplete: React.FC<Props> = ({
  onSelectBusiness,
  className = '',
  isDark = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [googlePlaces, setGooglePlaces] = useState<GooglePlaceItem[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [isImporting, setIsImporting] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('SITE_EXPRESS_GOOGLE_PLACES_KEY');
    setActiveKey(saved || null);
  }, []);

  // Filter mock businesses in real-time
  const filteredMocks = query.trim()
    ? mockBusinesses.filter(
        (b) =>
          b.name.toLowerCase().includes(query.toLowerCase()) ||
          b.city.toLowerCase().includes(query.toLowerCase()) ||
          b.category.toLowerCase().includes(query.toLowerCase()) ||
          b.address.toLowerCase().includes(query.toLowerCase())
      )
    : mockBusinesses;

  // Search real Google Places API when activeKey is present and query is typed
  useEffect(() => {
    if (!activeKey || !query.trim() || query.trim().length < 2) {
      setGooglePlaces([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      try {
        const res = await fetch('/api/places/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim(), apiKey: activeKey }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.places)) {
          setGooglePlaces(data.places);
        } else {
          setGooglePlaces([]);
        }
      } catch (err) {
        console.error('Error searching Google Places API:', err);
        setGooglePlaces([]);
      } finally {
        setIsSearchingApi(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, activeKey]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMock = (business: BusinessProfile) => {
    onSelectBusiness(business);
    setIsOpen(false);
    setQuery(business.name);
  };

  const handleSelectGooglePlace = async (place: GooglePlaceItem) => {
    if (!activeKey) return;
    setIsImporting(place.placeId);

    try {
      const res = await fetch('/api/places/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId: place.placeId, apiKey: activeKey }),
      });
      const data = await res.json();

      if (data.success && data.business) {
        // Enforce full business structure
        const baseMock = mockBusinesses[0];
        const fullBusiness: BusinessProfile = {
          ...baseMock,
          ...data.business,
          id: `biz-${Date.now()}`,
          isActive: true,
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          planType: 'Anual Pro',
          headline: `A melhor escolha em ${data.business.category} para você e sua família.`,
          subheadline: `Atendimento pontual, infraestrutura completa e facilidade de agendamento em ${data.business.city}.`,
          shortBio: `${data.business.name} oferece serviços de excelência em ${data.business.city}. Fale conosco pelo WhatsApp para orçamentos e agendamentos.`,
          ctaWhatsappMessage: `Olá! Vim através do site e gostaria de saber mais informações sobre a ${data.business.name}.`,
        };

        onSelectBusiness(fullBusiness);
        setIsOpen(false);
        setQuery(data.business.name);
      }
    } catch (err) {
      console.error('Error importing place from Google:', err);
    } finally {
      setIsImporting(null);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Top Bar Status & Config Key Button */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {activeKey ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Google Cloud Places Ativo (Busca Mundial)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Globe className="w-3.5 h-3.5" />
              <span>Catálogo Inteligente (Empresas Locais Prontas)</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsKeyModalOpen(true)}
          className={`px-2.5 py-1 rounded-[10px] text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
            activeKey
              ? 'bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/10'
              : 'bg-[#007AFF]/10 hover:bg-[#007AFF]/20 text-[#007AFF] border-[#007AFF]/30'
          }`}
          title="Configurar Chave Google Cloud Places API"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>{activeKey ? 'Gerenciar Chave' : 'Inserir Chave Google'}</span>
        </button>
      </div>

      {/* Search Input Container */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
          {isSearchingApi ? (
            <Loader2 className="w-4 h-4 text-[#007AFF] animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={
            activeKey
              ? 'Buscar qualquer empresa real do Google Maps (ex: Hospital Albert Einstein, Pizzaria Brás, etc.)...'
              : 'Digite nome da empresa ou cidade (ex: Clínica Dr. Samuel, Pamonharia Simprão, Impacto Baterias)...'
          }
          className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 rounded-[14px] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(true);
            }}
            className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1C1C1E] rounded-[18px] border border-slate-200 dark:border-white/10 shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-white/5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>
              {activeKey && googlePlaces.length > 0
                ? 'Resultados do Google Places (API Oficial)'
                : 'Empresas Locais Prontas para Importar'}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold lowercase">
              1-clique para gerar o site
            </span>
          </div>

          {/* 1. Real Google Places API Results (if key active) */}
          {activeKey && googlePlaces.length > 0 && (
            <div className="divide-y divide-slate-100 dark:divide-white/5 bg-blue-50/20 dark:bg-blue-950/10">
              {googlePlaces.map((place) => (
                <button
                  key={place.placeId}
                  onClick={() => handleSelectGooglePlace(place)}
                  disabled={isImporting === place.placeId}
                  className="w-full text-left px-4 py-3 hover:bg-[#007AFF]/10 transition-colors flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div className="w-10 h-10 rounded-[10px] bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20 font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#007AFF] transition-colors truncate">
                          {place.name}
                        </span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-blue-500 text-white">
                          Google Maps
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        <span className="flex items-center gap-0.5 font-bold text-amber-500 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {place.rating.toFixed(1)} ({place.reviewCount})
                        </span>
                        <span>·</span>
                        <span className="truncate flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {place.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#007AFF]">
                    {isImporting === place.placeId ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Importando...</span>
                      </>
                    ) : (
                      <>
                        <span>Criar Site</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 2. Enriched Local Brazilian Businesses (Always available as fallback or instant pick) */}
          {filteredMocks.length > 0 ? (
            filteredMocks.map((biz) => (
              <button
                key={biz.id}
                onClick={() => handleSelectMock(biz)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/80 dark:border-white/10">
                    <img src={biz.coverImage} alt={biz.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#007AFF] transition-colors truncate">
                        {biz.name}
                      </span>
                      <span title="Verificado">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#34C759] shrink-0" />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="truncate">{biz.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 font-bold text-slate-700 dark:text-slate-300 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {biz.rating.toFixed(1)} ({biz.reviewCount})
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 shrink-0 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {biz.city} - {biz.state}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#007AFF] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Usar Modelo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>Nenhuma empresa encontrada para &quot;{query}&quot;.</p>
              <p className="text-[11px] opacity-70">
                Você pode cadastrar manualmente ou configurar sua Chave do Google Cloud Places para pesquisar qualquer empresa no mundo.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Google API Key Modal */}
      <GoogleApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        isDark={isDark}
        onKeyUpdated={(key) => setActiveKey(key)}
      />
    </div>
  );
};
