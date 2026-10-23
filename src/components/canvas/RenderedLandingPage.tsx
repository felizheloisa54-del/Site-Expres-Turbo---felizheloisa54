import React, { useState, useEffect } from 'react';
import {
  Star,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  ShieldCheck,
  Award,
  Zap,
  Activity,
  HeartPulse,
  ShieldAlert,
  Sparkles,
  Flame,
  UtensilsCrossed,
  HeartHandshake,
  Cpu,
  Gauge,
  MessageCircle,
  Layout,
  Play,
  Video,
  ArrowRight,
} from 'lucide-react';
import { BusinessProfile, ThemeConfig, ViewportMode, SelectedElementInspect, SectionToggle } from '../../types';
import { buildWhatsAppLink } from '../../utils/phoneUtils';

interface Props {
  business: BusinessProfile;
  theme: ThemeConfig;
  viewport: ViewportMode;
  isPreviewMode: boolean;
  onUpdateBusiness: (updated: BusinessProfile) => void;
  onSelectElement?: (inspect: SelectedElementInspect) => void;
  sections?: SectionToggle[];
}

const iconMap: Record<string, React.ElementType> = {
  Activity,
  HeartPulse,
  ShieldAlert,
  Sparkles,
  Flame,
  UtensilsCrossed,
  HeartHandshake,
  Zap,
  Cpu,
  Gauge,
  Award,
};

export const RenderedLandingPage: React.FC<Props> = ({
  business,
  theme,
  viewport,
  isPreviewMode,
  onUpdateBusiness,
  onSelectElement,
  sections,
}) => {
  // Real countdown timer
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: business.promoBanner.hoursRemaining,
    minutes: 45,
    seconds: 22,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered Reviews: STRICT 4 and 5 stars only!
  const validReviews = business.reviews
    .filter((r) => r.rating >= 4)
    .sort((a, b) => b.rating - a.rating);

  const [reviewIndex, setReviewIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const isMobileView = viewport === 'mobile';
  const heroLayout = business.heroLayout || 'boxed';

  // Google Reviews Autoplay
  useEffect(() => {
    if (business.reviewsAutoplay === false || validReviews.length <= 1) return;
    const maxIndex = Math.max(0, validReviews.length - (isMobileView ? 1 : 3));
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [business.reviewsAutoplay, validReviews.length, isMobileView]);

  const getWhatsAppLink = (customItemName?: string) => {
    let msg = business.ctaWhatsappMessage;
    if (customItemName) {
      msg = `Olá! Vim pelo site da ${business.name} e gostaria de pedir/consultar: ${customItemName}`;
    }
    return buildWhatsAppLink(business.whatsapp || business.phone, msg);
  };

  const isSectionEnabled = (sectionId: string) => {
    if (!sections || sections.length === 0) return true;
    const sec = sections.find((s) => s.id === sectionId);
    return sec ? sec.enabled : true;
  };

  const getVideoEmbedInfo = (url?: string) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
      let videoId = '';
      if (trimmed.includes('watch?v=')) {
        videoId = trimmed.split('watch?v=')[1]?.split('&')[0] || '';
      } else if (trimmed.includes('youtu.be/')) {
        videoId = trimmed.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (trimmed.includes('embed/')) {
        videoId = trimmed.split('embed/')[1]?.split('?')[0] || '';
      }
      if (videoId) {
        return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0` };
      }
    }
    if (trimmed.includes('vimeo.com')) {
      const parts = trimmed.split('vimeo.com/');
      const videoId = parts[1]?.split(/[?#/]/)[0];
      if (videoId) {
        return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${videoId}` };
      }
    }
    return { type: 'direct', src: trimmed };
  };

  const isGastronomia = business.archetype === 'gastronomia';
  const isServicos = business.archetype === 'servicos';
  const isProdutos = business.archetype === 'produtos';

  // CSS Filter for Real Photos
  const getPhotoFilterStyle = () => {
    const filter = business.imageEffects?.filter || 'none';
    switch (filter) {
      case 'vibrant':
        return { filter: 'contrast(1.08) saturate(1.15)' };
      case 'warm':
        return { filter: 'sepia(0.08) contrast(1.05) saturate(1.1)' };
      case 'cool':
        return { filter: 'hue-rotate(5deg) contrast(1.06) saturate(1.02)' };
      case 'none':
      default:
        return {};
    }
  };

  const photoObjectFit = business.imageEffects?.objectFit || 'cover';

  // Button animation style classes
  const getButtonEffectClass = () => {
    switch (theme.buttonStyle) {
      case 'shimmer':
        return 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent';
      case 'pulse':
        return 'animate-pulse hover:animate-none';
      case 'outline':
        return 'border-2 border-current bg-transparent hover:bg-white/10';
      case 'elevated':
      default:
        return 'shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all';
    }
  };

  const filteredCatalog =
    selectedCategory === 'Todos'
      ? business.catalogItems
      : business.catalogItems.filter((i) => i.category === selectedCategory);

  return (
    <div
      className="w-full max-w-full overflow-x-hidden text-slate-900 transition-colors duration-200 select-text relative"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: `'${theme.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif`,
      }}
    >
      {/* 1. TOP NOTIFICATION / GUARANTEE STRIP (Archetype C: Produtos & Varejo) */}
      {isProdutos && (
        <div className="bg-slate-950 text-white text-[11px] py-2 px-4 text-center flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Socorro 24h & Entrega Expressa em 35min
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Garantia Nacional até 24 Meses
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:flex items-center gap-1.5 font-medium">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            Desconto Extra no Pix + Teste Grátis
          </span>
        </div>
      )}

      {/* 2. HEADER */}
      <header
        className={`sticky top-0 z-30 w-full backdrop-blur-md border-b transition-all ${
          isGastronomia
            ? 'bg-[#153E23]/95 border-[#2D7819]/40 text-white'
            : 'bg-white/95 border-slate-200/80 text-slate-900'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                style={{ height: `${business.logoHeight || 40}px` }}
                className="max-w-[200px] object-contain shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xs shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                }}
              >
                {business.name
                  .split(' ')
                  .filter((w) => w.length > 2)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase() || 'SE'}
              </div>
            )}
            <div className="min-w-0">
              <a href="#" className="font-extrabold text-sm sm:text-lg tracking-tight truncate block">
                {business.name}
              </a>
              {isServicos && (
                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  {business.city} - {business.state}
                </span>
              )}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium opacity-90">
            <a href="#destaques" className="hover:opacity-100 transition-opacity">
              {isGastronomia ? 'Cardápio' : isServicos ? 'Especialidades' : 'Catálogo'}
            </a>
            <a href="#sobre" className="hover:opacity-100 transition-opacity">
              Sobre Nós
            </a>
            <a href="#avaliacoes" className="hover:opacity-100 transition-opacity">
              Avaliações Google
            </a>
            <a href="#localizacao" className="hover:opacity-100 transition-opacity">
              Como Chegar
            </a>
          </nav>

          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!isPreviewMode && onSelectElement) {
                e.preventDefault();
                onSelectElement({ type: 'button', text: business.ctaText });
              }
            }}
            className={`contact-cta px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all active:scale-95 flex items-center gap-1.5 shrink-0 ${getButtonEffectClass()}`}
            style={{
              backgroundColor: isGastronomia ? '#F3C94D' : theme.primaryColor,
              color: isGastronomia ? '#153E23' : '#FFFFFF',
            }}
          >
            <MessageCircle className="w-3.5 h-3.5 sm:hidden fill-current" />
            <span className="hidden sm:inline">{business.ctaText}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* 3. HERO SECTION (WITH 4 CUSTOMIZABLE LAYOUTS: Boxed, Fullscreen, Centered, Split-Reversed) */}
      
      {/* 3A. LAYOUT: FULLSCREEN BACKGROUND */}
      {heroLayout === 'fullscreen' && (
        <section className="relative min-h-[520px] sm:min-h-[620px] flex items-center justify-center overflow-hidden border-b border-slate-200">
          <img
            src={business.coverImage}
            alt={business.name}
            style={{ ...getPhotoFilterStyle(), objectFit: photoObjectFit }}
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center text-white space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping-slow" />
              <span>{business.eyebrowText}</span>
            </div>

            <h1 className="text-3xl sm:text-6xl font-black tracking-[-0.045em] leading-[1.05] text-white">
              {business.headline}{' '}
              <em className="not-italic text-amber-400">{business.highlightWord}</em>
            </h1>

            <p className="text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
              {business.subheadline}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={`contact-cta px-7 py-4 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all text-sm shadow-xl flex items-center gap-2 ${getButtonEffectClass()}`}
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>{business.ctaText}</span>
              </a>

              <a
                href="#destaques"
                className="px-6 py-4 rounded-xl font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all text-sm"
              >
                {business.secondaryCtaText}
              </a>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-bold text-white">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {business.rating.toFixed(1)} no Google ({business.reviewCount} avaliações)
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">🟢 Aberto agora em {business.city}</span>
            </div>
          </div>
        </section>
      )}

      {/* 3B. LAYOUT: CENTERED EDITORIAL WITH PHOTO BELOW */}
      {heroLayout === 'centered' && (
        <section className="py-12 sm:py-20 border-b border-slate-200 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accentColor }} />
              <span>{business.eyebrowText}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-[-0.045em] leading-[1.05]">
              {business.headline}{' '}
              <em className="not-italic" style={{ color: theme.accentColor }}>
                {business.highlightWord}
              </em>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {business.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={`contact-cta px-7 py-3.5 rounded-xl font-bold text-white shadow-md active:scale-95 transition-all text-xs sm:text-sm flex items-center gap-2 ${getButtonEffectClass()}`}
                style={{ backgroundColor: theme.primaryColor }}
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{business.ctaText}</span>
              </a>

              <a
                href="#destaques"
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs sm:text-sm shadow-2xs"
              >
                {business.secondaryCtaText}
              </a>
            </div>

            {/* Large 16:9 Photo Frame Below Headline */}
            <div
              onClick={() => {
                if (!isPreviewMode && onSelectElement) {
                  onSelectElement({ type: 'image', url: business.coverImage });
                }
              }}
              className="mt-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative group cursor-pointer max-w-4xl mx-auto"
            >
              <img
                src={business.coverImage}
                alt={business.name}
                style={{ ...getPhotoFilterStyle(), objectFit: photoObjectFit }}
                className="w-full h-72 sm:h-[420px] group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-left text-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold opacity-90">{business.category}</p>
                  <p className="text-sm sm:text-base font-bold">{business.address} — {business.city}/{business.state}</p>
                </div>
                <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-slate-900 font-bold text-xs flex items-center gap-1 shadow">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{business.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3C & 3D. LAYOUTS: BOXED (7/5) OR SPLIT-REVERSED (5/7) */}
      {(heroLayout === 'boxed' || heroLayout === 'split-reversed') && (
        <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 border-b border-slate-200/60">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Text Column */}
              <div
                className={`space-y-5 text-left ${
                  heroLayout === 'split-reversed' ? 'lg:col-span-7 lg:order-2' : 'lg:col-span-7'
                }`}
              >
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-500">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-ping-slow"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span
                    contentEditable={!isPreviewMode}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateBusiness({ ...business, eyebrowText: e.currentTarget.innerText })
                    }
                    className={!isPreviewMode ? 'hover:bg-blue-50/70 p-0.5 rounded cursor-text' : ''}
                  >
                    {business.eyebrowText}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-[-0.045em] leading-[1.05]">
                  <span
                    contentEditable={!isPreviewMode}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateBusiness({ ...business, headline: e.currentTarget.innerText })
                    }
                    className={!isPreviewMode ? 'hover:bg-blue-50/70 p-0.5 rounded cursor-text' : ''}
                  >
                    {business.headline}
                  </span>{' '}
                  <em
                    className="not-italic"
                    style={{ color: isGastronomia ? '#2D7819' : theme.accentColor }}
                    contentEditable={!isPreviewMode}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdateBusiness({ ...business, highlightWord: e.currentTarget.innerText })
                    }
                  >
                    {business.highlightWord}
                  </em>
                </h1>

                <p
                  contentEditable={!isPreviewMode}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateBusiness({ ...business, subheadline: e.currentTarget.innerText })
                  }
                  className={`text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl ${
                    !isPreviewMode ? 'hover:bg-blue-50/70 p-1 rounded cursor-text' : ''
                  }`}
                >
                  {business.subheadline}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!isPreviewMode && onSelectElement) {
                        e.preventDefault();
                        onSelectElement({ type: 'button', text: business.ctaText });
                      }
                    }}
                    className={`contact-cta inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white shadow-md active:scale-95 transition-all text-xs sm:text-sm ${getButtonEffectClass()}`}
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{business.ctaText}</span>
                  </a>

                  <a
                    href="#destaques"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs sm:text-sm shadow-2xs"
                  >
                    <span>{business.secondaryCtaText}</span>
                  </a>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{business.rating.toFixed(1)} no Google</span>
                    <span className="font-normal text-slate-500">({business.reviewCount})</span>
                  </div>
                  <span>·</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {business.isOpenNow ? 'Aberto Agora' : 'Atendimento Hoje'}
                  </span>
                  <span>·</span>
                  <span>{business.city} - {business.state}</span>
                </div>
              </div>

              {/* Photo Column */}
              <div
                className={`relative ${
                  heroLayout === 'split-reversed' ? 'lg:col-span-5 lg:order-1' : 'lg:col-span-5'
                }`}
              >
                <div
                  onClick={() => {
                    if (!isPreviewMode && onSelectElement) {
                      onSelectElement({ type: 'image', url: business.coverImage });
                    }
                  }}
                  className={`relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 ${
                    !isPreviewMode ? 'cursor-pointer group' : ''
                  }`}
                >
                  <img
                    src={
                      isServicos && business.doctorOrFounderImage
                        ? business.doctorOrFounderImage
                        : business.coverImage
                    }
                    alt={business.name}
                    style={{ ...getPhotoFilterStyle(), objectFit: photoObjectFit }}
                    className="w-full h-80 sm:h-96 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {isServicos ? business.credentials[0]?.value : `${business.name}`}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {business.address} — {business.city}/{business.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. FAST SHORTCUT BAND (Archetype A: Gastronomia "O que você procura hoje?") */}
      {isGastronomia && (
        <section className="py-6 bg-amber-50/50 border-b border-amber-200/60">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-bold text-[#153E23]">
                O que você procura hoje no Simprão?
              </span>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                {['Pamonhas Quentes', 'Empadão Goiano', 'Almoço Típico', 'Doces da Roça'].map(
                  (item, i) => (
                    <a
                      key={i}
                      href="#destaques"
                      onClick={() => setSelectedCategory(i === 0 ? 'Pamonhas' : i === 1 ? 'Salgados' : 'Todos')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#153E23] bg-white border border-amber-200/80 hover:bg-amber-100/50 transition-colors text-center shadow-2xs"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. CREDENTIALS / KPI STRIP */}
      <section className="py-6 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-slate-100">
            {business.credentials.map((cred, idx) => (
              <div key={idx} className="p-2 sm:p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {cred.label}
                </p>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                  {cred.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROMO BOX WITH REAL COUNTDOWN TIMER (If Enabled) */}
      {business.promoBanner.enabled && (
        <section className="py-8 bg-amber-50/70 border-b border-amber-200/80">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900">
                  {business.promoBanner.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                  {business.promoBanner.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
                  {business.promoBanner.subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="text-center sm:text-right">
                  <span className="text-xs text-slate-400 line-through">
                    De R$ {business.promoBanner.oldPrice.toFixed(2)}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                    Por R$ {business.promoBanner.promoPrice.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-rose-600 mt-1 flex items-center justify-center sm:justify-end gap-1">
                    <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                    Expira em {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                </div>

                <a
                  href={getWhatsAppLink(`Oferta Especial: ${business.promoBanner.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-cta px-6 py-3.5 rounded-xl font-bold text-white shadow-md bg-emerald-600 hover:bg-emerald-700 transition-colors text-xs sm:text-sm"
                >
                  Garantir no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. ARCHETYPE B: BENTO GRID OF SPECIALTIES (For Serviços & Clínicas) */}
      {isServicos && (
        <section id="especialidades" className="py-14 sm:py-20 max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Especialidades & Cuidados Integrados
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
              Protocolos Médicos Personalizados
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Corpo clínico experiente e tecnologia diagnóstica completa no mesmo endereço em Londrina.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-lg">
              <div className="space-y-3 z-10">
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                  {business.features[0]?.badge || 'Destaque Principal'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {business.features[0]?.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                  {business.features[0]?.description}
                </p>
              </div>

              <div className="pt-6 z-10 flex items-center justify-between">
                <a
                  href={getWhatsAppLink(business.features[0]?.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-cta px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <span>{business.features[0]?.actionText || 'Agendar Avaliação'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {business.features.slice(1, 4).map((feat, idx) => {
              const IconComp = iconMap[feat.iconName] || Activity;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{feat.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100">
                    <a
                      href={getWhatsAppLink(feat.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>{feat.actionText || 'Saber mais'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 pt-10 border-t border-slate-200/80">
            <h3 className="text-center font-bold text-xs uppercase tracking-wider text-slate-400 mb-8">
              Como Funciona Seu Atendimento em 3 Etapas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Contato Ágil no WhatsApp',
                  desc: 'Você conversa diretamente com nossa concierge para triagem e escolha do melhor dia e horário.',
                },
                {
                  step: '02',
                  title: 'Consulta & Exames no Mesmo Local',
                  desc: 'Avaliação clínica minuciosa com eletrocardiograma e ecocardiograma sem precisar se deslocar pela cidade.',
                },
                {
                  step: '03',
                  title: 'Plano Terapêutico Claro',
                  desc: 'Saia com laudos em mãos, orientações detalhadas e acompanhamento preventivo contínuo.',
                },
              ].map((st, i) => (
                <div key={i} className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80">
                  <span className="font-mono font-black text-2xl text-blue-600/40">{st.step}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{st.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7.5. VIDEO INSTITUCIONAL SECTION (OPTIONAL) */}
      {business.videoSection?.enabled && (
        <section id="video" className="py-12 sm:py-16 max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200 shadow-2xs">
              <Play className="w-3.5 h-3.5 fill-red-600" />
              <span>{business.videoSection.badge || 'Vídeo Institucional'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              {business.videoSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {business.videoSection.subtitle}
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-950 aspect-video max-w-4xl mx-auto">
            {business.videoSection.videoUrl.includes('youtube.com') || business.videoSection.videoUrl.includes('youtu.be') ? (
              <iframe
                src={
                  business.videoSection.videoUrl.includes('watch?v=')
                    ? business.videoSection.videoUrl.replace('watch?v=', 'embed/')
                    : business.videoSection.videoUrl
                }
                title={business.videoSection.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                controls
                poster={business.videoSection.posterUrl || business.coverImage}
                className="w-full h-full object-cover"
                src={business.videoSection.videoUrl}
              >
                Seu navegador não suporta a reprodução de vídeo.
              </video>
            )}
          </div>
        </section>
      )}

      {/* 8. CATALOG / MENU / PRODUCTS (All Archetypes, with MOBILE-FIRST COMPACT ADAPTATION) */}
      <section id="destaques" className="py-14 sm:py-20 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isGastronomia ? 'Cardápio Típico' : isServicos ? 'Consultas & Pacotes' : 'Vitrine de Produtos'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mt-1">
              {isGastronomia
                ? 'Receitas Feitas com Milho Puro'
                : isServicos
                ? 'Consultas e Exames Diagnósticos'
                : 'Catálogo a Pronta-Entrega'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {business.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-950 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div
          className={`grid gap-4 sm:gap-6 ${
            isMobileView ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow overflow-hidden ${
                isMobileView
                  ? 'flex flex-row items-center h-32'
                  : 'flex flex-col'
              }`}
            >
              <div
                className={`relative bg-slate-100 overflow-hidden shrink-0 ${
                  isMobileView ? 'w-36 h-full' : 'w-full h-48'
                }`}
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {item.badge && (
                  <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <div
                className={`p-3.5 sm:p-5 flex flex-col justify-between flex-1 min-w-0 ${
                  isMobileView ? 'h-full py-2.5' : ''
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <h4 className="text-xs sm:text-base font-bold text-slate-900 leading-snug truncate sm:whitespace-normal">
                    {item.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 sm:pt-3 sm:mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {(item as any).showPrice && item.price ? (
                      <span className="text-xs sm:text-base font-black text-slate-950">
                        R$ {item.price.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Pronta-Entrega & Atendimento</span>
                      </span>
                    )}
                  </div>

                  <a
                    href={getWhatsAppLink(item.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-cta px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold text-white transition-transform active:scale-95 shadow-2xs shrink-0 flex items-center gap-1.5"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <span>{isGastronomia ? 'Pedir no WhatsApp' : isServicos ? 'Agendar' : 'Solicitar'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. ASYMMETRIC ABOUT / QUEM SOMOS */}
      <section id="sobre" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <img
                  src={business.secondaryImage}
                  alt="Nossa Estrutura"
                  style={{ ...getPhotoFilterStyle() }}
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-200 max-w-xs hidden sm:block">
                <p className="text-xs font-bold text-slate-900">Atendimento Humanizado</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mais de {business.reviewCount} clientes atendidos com nota 4.9+ comprovada no Google.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quem Somos & Nossa Trajetória
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Compromisso genuíno com a sua satisfação em {business.city}
              </h2>
              <p
                contentEditable={!isPreviewMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdateBusiness({ ...business, aboutStory: e.currentTarget.innerText })
                }
                className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${
                  !isPreviewMode ? 'hover:bg-blue-50/70 p-1 rounded cursor-text' : ''
                }`}
              >
                {business.aboutStory}
              </p>

              <div className="pt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">Localização Privilegiada</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{business.neighborhood}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="font-bold text-slate-900">Atendimento Direto</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Sem intermediários ou robôs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PHOTO GALLERY MOSAIC WITH LIGHTBOX */}
      <section className="py-14 sm:py-20 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Galeria de Fotos
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Conheça Nosso Espaço & Produtos
          </h2>
          <p className="text-xs text-slate-500 mt-1">Clique em qualquer imagem para ampliar</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {business.galleryImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setActiveLightboxImg(img)}
              className="h-44 sm:h-52 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group relative"
            >
              <img
                src={img}
                alt={`Galeria ${i + 1}`}
                style={{ ...getPhotoFilterStyle() }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                Ampliar Foto
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. OFFICIAL GOOGLE REVIEWS CAROUSEL (4 & 5 STARS ONLY) */}
      <section id="avaliacoes" className="py-14 sm:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Avaliações no Google Meu Negócio
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Filtro estrito: exibindo apenas relatos de 4 e 5 estrelas
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">
                  {business.rating.toFixed(1)}
                </span>
                <div className="text-amber-400 text-sm">★★★★★</div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateBusiness({
                      ...business,
                      reviewsAutoplay: business.reviewsAutoplay === false ? true : false,
                    })
                  }
                  title="Ativar/Desativar rolagem automática das avaliações"
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all ${
                    business.reviewsAutoplay !== false
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${business.reviewsAutoplay !== false ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'}`} />
                  <span>{business.reviewsAutoplay !== false ? 'Auto' : 'Pausa'}</span>
                </button>

                <button
                  disabled={reviewIndex === 0}
                  onClick={() => setReviewIndex((prev) => Math.max(0, prev - 1))}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={reviewIndex >= validReviews.length - (isMobileView ? 1 : 3)}
                  onClick={() => setReviewIndex((prev) => prev + 1)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {validReviews
              .slice(reviewIndex, reviewIndex + (isMobileView ? 1 : 3))
              .map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                          style={{ backgroundColor: rev.avatarColor }}
                        >
                          {rev.initials}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 leading-tight">
                            {rev.author}
                          </h5>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="text-amber-400 text-xs">
                        {'★'.repeat(rev.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Depoimento verificado no Google Maps
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 12. SMART LOCATION (GOOGLE MAPS + WAZE BUTTONS) */}
      <section id="localizacao" className="py-14 sm:py-20 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 p-6 sm:p-10 space-y-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Endereço & Acesso
              </span>
              <h3 className="text-2xl font-black text-slate-950 mt-1">Venha nos Visitar</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-3">
                {business.address}
              </p>
              <p className="text-xs text-slate-500">
                {business.neighborhood} — {business.city}/{business.state}
              </p>
              <p className="text-xs text-slate-400">CEP: {business.zipCode}</p>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">Horários:</span>
                <span className="text-[11px] text-slate-600">{business.openingHours}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors text-center flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Abrir Google Maps</span>
              </a>

              <a
                href={business.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors text-center flex items-center justify-center gap-2"
              >
                <span>Traçar Rota no Waze</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-100 min-h-[280px]">
            <iframe
              title="Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                `${business.address}, ${business.city} - ${business.state}`
              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full min-h-[300px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 13. FAQ ACCORDION */}
      <section className="py-12 max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Perguntas Frequentes
          </span>
          <h2 className="text-2xl font-bold text-slate-950 mt-1">Dúvidas Comuns</h2>
        </div>

        <div className="space-y-3">
          {business.faq.map((f, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span>{f.question}</span>
                  <span className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {f.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 14. UNIFIED BOTTOM SHELL FOOTER */}
      <footer className="mt-14 bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div>
            <h4 className="text-white font-bold text-sm mb-2">{business.name}</h4>
            <p className="leading-relaxed text-slate-400">{business.shortBio}</p>
            <p className="mt-3 text-slate-600">
              Perfil oficial verificado no Google • {new Date().getFullYear()}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-2">Contato & Atendimento</h4>
            <p>Telefone: {business.phone}</p>
            <p className="mt-1 text-emerald-400">WhatsApp: Atendimento Rápido</p>
            <p className="mt-1 text-slate-500">{business.openingHours}</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-2">Endereço Comercial</h4>
            <p>{business.address}</p>
            <p>{business.neighborhood} — {business.city}/{business.state}</p>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-cta mt-4 inline-block font-bold text-white hover:underline"
              style={{ color: theme.accentColor }}
            >
              Falar no WhatsApp Agora →
            </a>
          </div>
        </div>
      </footer>

      {/* 15. MOBILE STICKY BOTTOM BAR (IOS APPLE DESIGN) */}
      {isMobileView && (
        <div className="sticky bottom-0 z-40 w-full ios-liquid-glass p-3 border-t border-slate-200/80 shadow-lg flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">{business.name}</p>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Atendimento Online no WhatsApp
            </p>
          </div>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-cta px-4 py-2.5 rounded-full text-xs font-bold text-white shadow-md active:scale-95 transition-transform shrink-0 flex items-center gap-1.5"
            style={{ backgroundColor: '#25D366' }}
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      )}

      {/* 16. LIGHTBOX MODAL FOR GALLERY */}
      {activeLightboxImg && (
        <div
          onClick={() => setActiveLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden bg-black shadow-2xl"
          >
            <button
              onClick={() => setActiveLightboxImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeLightboxImg}
              alt="Ampliação"
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
