import JSZip from 'jszip';
import { BusinessProfile, MarketingConfig, ThemeConfig, SectionToggle } from '../types';
import { cleanWhatsAppNumber } from './phoneUtils';

export function generateSchemaJsonLd(business: BusinessProfile): string {
  const schemaType =
    business.archetype === 'gastronomia'
      ? 'Restaurant'
      : business.archetype === 'servicos'
      ? 'MedicalBusiness'
      : 'LocalBusiness';

  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: business.name,
    image: [business.coverImage, business.secondaryImage],
    telephone: business.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.zipCode,
      addressCountry: 'BR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.rating.toString(),
      reviewCount: business.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    priceRange: business.archetype === 'gastronomia' ? '$$' : '$$$',
    openingHours: business.openingHours,
    url: window.location.origin,
  };

  return JSON.stringify(schema, null, 2);
}

export function buildStandaloneHtml(
  business: BusinessProfile,
  marketing: MarketingConfig,
  theme: ThemeConfig,
  sections: SectionToggle[]
): string {
  const schemaJsonLd = generateSchemaJsonLd(business);
  const cleanPhone = cleanWhatsAppNumber(business.whatsapp || business.phone);
  const buildWaHref = (customText?: string) => {
    const text = customText || business.ctaWhatsappMessage || 'Olá! Gostaria de mais informações.';
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };
  const waUrl = buildWaHref();

  // Tracking scripts
  const metaPixelScript = marketing.metaPixelId
    ? `
  <!-- Meta Pixel Code -->
  <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${marketing.metaPixelId}');
    fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${marketing.metaPixelId}&ev=PageView&noscript=1"
  /></noscript>
  <!-- End Meta Pixel Code -->
  `
    : '';

  const googleAdsScript = marketing.googleAdsId
    ? `
  <!-- Global site tag (gtag.js) - Google Ads: ${marketing.googleAdsId} -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${marketing.googleAdsId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${marketing.googleAdsId}');
  </script>
  `
    : '';

  const gtmHeadScript = marketing.gtmId
    ? `
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${marketing.gtmId}');</script>
  <!-- End Google Tag Manager -->
  `
    : '';

  const isGastronomia = business.archetype === 'gastronomia';
  const isServicos = business.archetype === 'servicos';
  const isProdutos = business.archetype === 'produtos';

  const primaryBg = isGastronomia ? '#153E23' : isServicos ? '#0F172A' : '#111827';
  const accentColor = isGastronomia ? '#F3C94D' : isServicos ? '#3B82F6' : '#E11D48';
  const pageBg = isGastronomia ? '#F8F7F0' : isServicos ? '#FAFAFA' : '#F9FAFB';

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${marketing.customMetaTitle || `${business.name} — ${business.city}/${business.state}`}</title>
  <meta name="description" content="${marketing.customMetaDescription || business.shortBio}" />
  ${marketing.searchConsoleCode ? `<meta name="google-site-verification" content="${marketing.searchConsoleCode}" />` : ''}
  
  <!-- Open Graph / Social -->
  <meta property="og:title" content="${business.name}" />
  <meta property="og:description" content="${business.shortBio}" />
  <meta property="og:image" content="${business.coverImage}" />
  <meta property="og:type" content="website" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='${encodeURIComponent(accentColor)}'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='50' font-weight='bold' fill='white'>${business.name.slice(0, 1).toUpperCase()}</text></svg>">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS Runtime -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  
  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  ${schemaJsonLd}
  </script>

  ${gtmHeadScript}
  ${googleAdsScript}
  ${metaPixelScript}

  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: ${pageBg};
    }
    .editorial-serif {
      font-family: 'Playfair Display', Georgia, serif;
    }
    /* Mobile compact card styling */
    @media (max-width: 640px) {
      .catalog-card-mobile {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
      }
      .catalog-img-mobile {
        width: 38% !important;
        height: 100% !important;
        min-height: 120px !important;
      }
      .catalog-content-mobile {
        width: 62% !important;
        padding: 0.75rem !important;
      }
    }
  </style>
</head>
<body class="text-slate-900 antialiased selection:bg-slate-200">
  ${marketing.gtmId ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${marketing.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''}

  <!-- HEADER -->
  <header class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 border-b border-slate-200/80 transition-all">
    <div class="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        ${
          business.logoUrl
            ? `<img src="${business.logoUrl}" alt="${business.name}" style="height: ${business.logoHeight || 40}px;" class="max-w-[200px] object-contain shrink-0" />`
            : `<div class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-xs shrink-0" style="background: linear-gradient(135deg, ${primaryBg}, ${accentColor});">${business.name.slice(0, 2).toUpperCase()}</div>`
        }
        <a href="#" class="text-base sm:text-xl font-bold tracking-tight text-slate-950 truncate">
          ${business.name}
        </a>
      </div>
      <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <a href="#sobre" class="hover:text-slate-950 transition-colors">Sobre Nós</a>
        <a href="#destaques" class="hover:text-slate-950 transition-colors">${isGastronomia ? 'Cardápio' : isServicos ? 'Especialidades' : 'Produtos'}</a>
        <a href="#avaliacoes" class="hover:text-slate-950 transition-colors">Avaliações Google</a>
        <a href="#localizacao" class="hover:text-slate-950 transition-colors">Localização</a>
      </div>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="contact-cta inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-sm transition-transform active:scale-95" style="background-color: ${primaryBg};">
        ${business.ctaText}
      </a>
    </div>
  </header>

  <!-- HERO SECTION (${business.heroLayout || 'boxed'}) -->
  ${
    business.heroLayout === 'fullscreen'
      ? `
  <section class="relative min-h-[520px] sm:min-h-[620px] flex items-center justify-center overflow-hidden border-b border-slate-200">
    <img src="${business.coverImage}" alt="${business.name}" class="absolute inset-0 w-full h-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40"></div>
    <div class="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center text-white space-y-6">
      <div class="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-amber-400 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        <span>${business.eyebrowText}</span>
      </div>
      <h1 class="text-3xl sm:text-6xl font-black tracking-tight leading-[1.05] text-white">
        ${business.headline} <em class="not-italic text-amber-400">${business.highlightWord}</em>
      </h1>
      <p class="text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
        ${business.subheadline}
      </p>
      <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="contact-cta px-7 py-4 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all text-sm shadow-xl flex items-center gap-2">
          ${business.ctaText}
        </a>
        <a href="#destaques" class="px-6 py-4 rounded-xl font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all text-sm">
          ${business.secondaryCtaText}
        </a>
      </div>
      <div class="pt-4 flex items-center justify-center gap-4 text-xs text-slate-300">
        <span class="flex items-center gap-1 font-bold text-white">★ ${business.rating.toFixed(1)} no Google (${business.reviewCount} avaliações)</span>
        <span>•</span>
        <span class="text-emerald-400 font-semibold">🟢 Aberto agora em ${business.city}</span>
      </div>
    </div>
  </section>
  `
      : business.heroLayout === 'centered'
      ? `
  <section class="py-12 sm:py-20 border-b border-slate-200 text-center">
    <div class="max-w-4xl mx-auto px-4 space-y-6">
      <div class="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-500">
        <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${accentColor};"></span>
        <span>${business.eyebrowText}</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.05]">
        ${business.headline} <em class="not-italic" style="color: ${accentColor};">${business.highlightWord}</em>
      </h1>
      <p class="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
        ${business.subheadline}
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="contact-cta px-7 py-3.5 rounded-xl font-bold text-white shadow-md active:scale-95 transition-all text-xs sm:text-sm" style="background-color: ${primaryBg};">
          ${business.ctaText}
        </a>
        <a href="#destaques" class="px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-xs sm:text-sm shadow-2xs">
          ${business.secondaryCtaText}
        </a>
      </div>
      <div class="mt-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative max-w-4xl mx-auto">
        <img src="${business.coverImage}" alt="${business.name}" class="w-full h-72 sm:h-[420px] object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div class="absolute bottom-4 left-4 right-4 text-left text-white flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold opacity-90">${business.category}</p>
            <p class="text-sm sm:text-base font-bold">${business.address} — ${business.city}/${business.state}</p>
          </div>
          <div class="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-slate-900 font-bold text-xs flex items-center gap-1 shadow">
            ★ ${business.rating.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  </section>
  `
      : `
  <section class="relative overflow-hidden pt-8 pb-14 sm:pt-16 sm:pb-24 border-b border-slate-200/60">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
        <div class="${business.heroLayout === 'split-reversed' ? 'lg:col-span-7 lg:order-2' : 'lg:col-span-7'} space-y-5">
          <div class="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-500">
            <span class="w-2 h-2 rounded-full" style="background-color: ${accentColor};"></span>
            ${business.eyebrowText}
          </div>
          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.1]">
            ${business.headline} <em class="not-italic" style="color: ${accentColor};">${business.highlightWord}</em>
          </h1>
          <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
            ${business.subheadline}
          </p>
          <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="contact-cta inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-95" style="background-color: ${primaryBg};">
              ${business.ctaText}
            </a>
            <a href="#destaques" class="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
              ${business.secondaryCtaText}
            </a>
          </div>
          <div class="pt-2 flex items-center gap-4 text-xs sm:text-sm text-slate-500">
            <span class="inline-flex items-center gap-1 font-semibold text-slate-800">
              <span class="text-amber-500">★</span> ${business.rating.toFixed(1)} no Google
            </span>
            <span>·</span>
            <span>${business.reviewCount} avaliações</span>
            <span>·</span>
            <span class="text-emerald-600 font-medium">${business.isOpenNow ? '🟢 Aberto agora' : 'Horário comercial'}</span>
          </div>
        </div>

        <div class="${business.heroLayout === 'split-reversed' ? 'lg:col-span-5 lg:order-1' : 'lg:col-span-5'} relative">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <img src="${business.coverImage}" alt="${business.name}" class="w-full h-80 sm:h-96 object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <p class="text-xs uppercase tracking-wider font-semibold opacity-90">${business.category}</p>
              <p class="text-sm sm:text-base font-bold">${business.address} — ${business.city}/${business.state}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `
  }

  <!-- CREDENTIALS STRIP -->
  <section class="py-6 bg-white border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        ${business.credentials
          .map(
            (c) => `
          <div class="p-3">
            <p class="text-xs uppercase tracking-wider text-slate-500 font-medium">${c.label}</p>
            <p class="text-base sm:text-lg font-bold text-slate-900 mt-0.5">${c.value}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </section>

  ${
    business.promoBanner.enabled
      ? `
  <!-- PROMO BOX WITH COUNTDOWN TIMER -->
  <section class="py-8 bg-amber-50/70 border-b border-amber-200/80">
    <div class="max-w-5xl mx-auto px-4">
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-left">
          <span class="inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
            ${business.promoBanner.badge}
          </span>
          <h3 class="text-xl sm:text-2xl font-bold text-slate-900">${business.promoBanner.title}</h3>
          <p class="text-sm text-slate-600">${business.promoBanner.subtitle}</p>
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="text-center">
            <span class="text-xs text-slate-400 line-through">De R$ ${business.promoBanner.oldPrice.toFixed(2)}</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-emerald-700">Por R$ ${business.promoBanner.promoPrice.toFixed(2)}</div>
            <div id="countdown-timer" class="text-xs font-mono font-bold text-rose-600 mt-1">Oferta expira em 07:45:22</div>
          </div>
          <a href="${buildWaHref(`Olá! Quero garantir a oferta: ${business.promoBanner.title}`)}" target="_blank" rel="noopener noreferrer" class="contact-cta px-6 py-3 rounded-xl font-bold text-white shadow bg-emerald-600 hover:bg-emerald-700 transition-colors">
            Garantir no WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
  `
      : ''
  }

  <!-- VÍDEO INSTITUCIONAL (OPCIONAL) -->
  ${
    business.videoSection?.enabled
      ? `
  <section id="video" class="py-12 sm:py-16 max-w-5xl mx-auto px-4">
    <div class="text-center max-w-2xl mx-auto mb-8 space-y-2">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
        ▶ ${business.videoSection.badge || 'Vídeo Institucional'}
      </span>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-950">${business.videoSection.title}</h2>
      <p class="text-xs sm:text-sm text-slate-600">${business.videoSection.subtitle}</p>
    </div>
    <div class="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-black aspect-video max-w-4xl mx-auto">
      ${(() => {
        const u = (business.videoSection.videoUrl || '').trim();
        if (u.includes('youtube.com') || u.includes('youtu.be')) {
          let vId = '';
          if (u.includes('watch?v=')) vId = u.split('watch?v=')[1]?.split('&')[0] || '';
          else if (u.includes('youtu.be/')) vId = u.split('youtu.be/')[1]?.split('?')[0] || '';
          else if (u.includes('embed/')) vId = u.split('embed/')[1]?.split('?')[0] || '';
          return `<iframe src="https://www.youtube.com/embed/${vId}?rel=0" title="${business.videoSection.title}" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
        if (u.includes('vimeo.com/')) {
          const vId = u.split('vimeo.com/')[1]?.split(/[?#/]/)[0] || '';
          return `<iframe src="https://player.vimeo.com/video/${vId}" title="${business.videoSection.title}" class="w-full h-full border-0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        }
        return `<video controls poster="${business.videoSection.posterUrl || business.coverImage}" class="w-full h-full object-cover" src="${u}"></video>`;
      })()}
    </div>
  </section>
  `
      : ''
  }

  <!-- DESTAQUES / ESPECIALIDADES / CARDÁPIO -->
  <section id="destaques" class="py-12 sm:py-20 max-w-6xl mx-auto px-4">
    <div class="text-center max-w-2xl mx-auto mb-10">
      <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-950">
        ${isGastronomia ? 'Nosso Cardápio Artesanal' : isServicos ? 'Especialidades & Cuidados' : 'Catálogo de Produtos'}
      </h2>
      <p class="text-slate-600 text-sm sm:text-base mt-2">
        ${business.shortBio}
      </p>
    </div>

    <!-- CATALOG GRID / CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${business.catalogItems
        .map(
          (item) => `
        <div class="catalog-card-mobile bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div class="catalog-img-mobile relative w-full h-48 bg-slate-100 overflow-hidden shrink-0">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
            ${item.badge ? `<span class="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold px-2 py-0.5 rounded shadow-xs">${item.badge}</span>` : ''}
          </div>
          <div class="catalog-content-mobile p-5 flex flex-col justify-between flex-1">
            <div>
              <p class="text-xs font-semibold uppercase text-slate-400 tracking-wider">${item.category}</p>
              <h3 class="text-base sm:text-lg font-bold text-slate-900 mt-1">${item.name}</h3>
              <p class="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">${item.description}</p>
            </div>
            <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5">
                ${(item as any).showPrice && item.price ? `
                  <div class="text-base font-extrabold text-slate-950">R$ ${item.price.toFixed(2)}</div>
                ` : `
                  <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Pronta-Entrega & Atendimento</span>
                  </span>
                `}
              </div>
              <a href="${buildWaHref(`Olá! Gostaria de pedir/consultar: ${item.name}`)}" target="_blank" rel="noopener noreferrer" class="contact-cta px-3.5 py-1.5 rounded-lg text-xs font-bold text-white transition-colors" style="background-color: ${primaryBg};">
                ${isGastronomia ? 'Pedir no WhatsApp' : isServicos ? 'Agendar' : 'Solicitar'}
              </a>
            </div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  </section>

  <!-- OFICIAL GOOGLE REVIEWS CAROUSEL -->
  <section id="avaliacoes" class="py-14 sm:py-20 bg-slate-50 border-y border-slate-200">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <div>
          <div class="flex items-center gap-2">
            <!-- Google G Logo SVG -->
            <svg class="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Avaliações Verificadas no Google</h2>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">Exibindo apenas relatos de 4 e 5 estrelas</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-right">
            <span class="text-2xl font-extrabold text-slate-900">${business.rating.toFixed(1)}</span>
            <div class="text-amber-500 text-sm">★★★★★</div>
          </div>
          <a href="${business.mapsUrl}" target="_blank" rel="noopener noreferrer" class="ml-4 text-xs font-semibold text-blue-600 hover:underline">
            Ver todas (${business.reviewCount})
          </a>
        </div>
      </div>

      <!-- REVIEWS CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        ${business.reviews
          .map(
            (rev) => `
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white" style="background-color: ${rev.avatarColor};">
                    ${rev.initials}
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-slate-900 leading-tight">${rev.author}</h4>
                    <span class="text-xs text-slate-400">${rev.date}</span>
                  </div>
                </div>
                <div class="text-amber-400 text-sm">★★★★★</div>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed italic">"${rev.comment}"</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Avaliação confirmada pelo Google
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- LOCALIZAÇÃO GOOGLE MAPS + WAZE -->
  <section id="localizacao" class="py-12 sm:py-16 max-w-6xl mx-auto px-4">
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
      <div class="lg:col-span-5 p-6 sm:p-10 space-y-4 flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Localização & Acesso Fácil</span>
          <h3 class="text-2xl font-bold text-slate-950 mt-1">Como Chegar até Nós</h3>
          <p class="text-sm text-slate-600 mt-2">${business.address}</p>
          <p class="text-sm text-slate-600 font-medium">${business.neighborhood} — ${business.city}/${business.state}</p>
          <p class="text-xs text-slate-400 mt-1">CEP: ${business.zipCode}</p>

          <div class="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p class="text-xs font-semibold text-slate-700">Horário de Funcionamento:</p>
            <p class="text-xs text-slate-600 mt-0.5">${business.openingHours}</p>
          </div>
        </div>

        <div class="pt-4 flex flex-col sm:flex-row gap-3">
          <a href="${business.mapsUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors">
            Abrir no Google Maps
          </a>
          <a href="${business.wazeUrl}" target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors">
            Traçar Rota no Waze
          </a>
        </div>
      </div>

      <div class="lg:col-span-7 bg-slate-100 min-h-[260px] relative">
        <iframe
          title="Mapa de Localização"
          src="https://maps.google.com/maps?q=${encodeURIComponent(`${business.address}, ${business.city} - ${business.state}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed"
          class="w-full h-full min-h-[300px] border-0"
          loading="lazy">
        </iframe>
      </div>
    </div>
  </section>

  <!-- FAQ SECTION -->
  <section class="py-12 max-w-4xl mx-auto px-4">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-slate-950">Dúvidas Frequentes</h2>
      <p class="text-xs sm:text-sm text-slate-500 mt-1">Tire suas dúvidas antes de chamar no WhatsApp</p>
    </div>
    <div class="space-y-3">
      ${business.faq
        .map(
          (f) => `
        <details class="group bg-white rounded-xl border border-slate-200 p-4 open:border-slate-400 transition-colors">
          <summary class="font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none flex items-center justify-between">
            ${f.question}
            <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">${f.answer}</p>
        </details>
      `
        )
        .join('')}
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="mt-12 bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
    <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
      <div>
        <h4 class="text-white font-bold text-sm mb-2">${business.name}</h4>
        <p class="leading-relaxed">${business.shortBio}</p>
        <p class="mt-3 text-slate-500">CNPJ & Direitos Reservados © ${new Date().getFullYear()}</p>
      </div>
      <div>
        <h4 class="text-white font-bold text-sm mb-2">Atendimento & Contato</h4>
        <p>Telefone: ${business.phone}</p>
        <p class="mt-1">WhatsApp Oficial: Atendimento Direto</p>
        <p class="mt-1 text-slate-500">${business.openingHours}</p>
      </div>
      <div>
        <h4 class="text-white font-bold text-sm mb-2">Endereço Oficial</h4>
        <p>${business.address}</p>
        <p>${business.neighborhood} — ${business.city}/${business.state}</p>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="contact-cta mt-4 inline-block font-bold text-white hover:underline" style="color: ${accentColor};">
          Falar com Atendente no WhatsApp →
        </a>
      </div>
    </div>
  </footer>

  <!-- MOBILE BOTTOM STICKY BAR -->
  <div class="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 shadow-lg flex items-center gap-3">
    <div class="flex-1 truncate">
      <p class="text-xs font-bold text-slate-900 truncate">${business.name}</p>
      <p class="text-[10px] text-emerald-600 font-medium">Atendimento Rápido</p>
    </div>
    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="contact-cta px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow active:scale-95" style="background-color: ${primaryBg};">
      ${business.ctaText}
    </a>
  </div>

  <!-- INTERACTIVE CLIENT-SIDE JAVASCRIPT -->
  <script>
    // Meta Pixel & Google Ads Event Tracking on WhatsApp / Phone Clicks
    document.addEventListener('DOMContentLoaded', function() {
      const contactLinks = document.querySelectorAll('.contact-cta, a[href*="wa.me"], a[href*="whatsapp"], a[href^="tel:"]');
      contactLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          if (typeof fbq === 'function') {
            fbq('track', 'Contact');
          }
          if (typeof gtag === 'function' && '${marketing.googleAdsId}') {
            gtag('event', 'conversion', {
              'send_to': '${marketing.googleAdsId}/${marketing.googleAdsLabel || 'default'}'
            });
          }
        });
      });

      // Countdown Timer Logic
      const timerEl = document.getElementById('countdown-timer');
      if (timerEl) {
        let totalSeconds = ${business.promoBanner.hoursRemaining * 3600};
        setInterval(function() {
          if (totalSeconds > 0) {
            totalSeconds--;
            const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const secs = String(totalSeconds % 60).padStart(2, '0');
            timerEl.innerText = 'Oferta expira em ' + hrs + ':' + mins + ':' + secs;
          }
        }, 1000);
      }
    });
  </script>
</body>
</html>`;
}

export async function downloadSiteZip(
  business: BusinessProfile,
  marketing: MarketingConfig,
  theme: ThemeConfig,
  sections: SectionToggle[]
): Promise<void> {
  const zip = new JSZip();
  const htmlContent = buildStandaloneHtml(business, marketing, theme, sections);

  zip.file('index.html', htmlContent);

  const readmeContent = `# ${business.name} — Landing Page Oficial

Este pacote contém o código-fonte estático completo e autônomo da landing page gerada pelo **Site Express Studio Pro**.

## Como Hospedar em 1 Minuto:
1. **Vercel / Netlify**: Basta arrastar e soltar esta pasta ou fazer upload do arquivo \`index.html\`.
2. **Hospedagem Tradicional (cPanel / HostGator / Locaweb)**: Envie o arquivo \`index.html\` para dentro do diretório \`public_html\`.
3. **GitHub Pages**: Suba o repositório e ative o GitHub Pages na raiz.

## O que está incluso:
- Design responsivo para computadores, tablets e smartphones (com cartões compactos mobile).
- Schema.org JSON-LD para SEO no Google Meu Negócio.
- Tracking automático de contatos para Meta Pixel (Facebook Ads) e Google Ads.
- Carrossel de avaliações 4-5 estrelas do Google.
- Links rápidos para Google Maps e Waze.
`;

  zip.file('README.md', readmeContent);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${business.slug}-landing-page.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

export function downloadStandaloneHtml(
  business: BusinessProfile,
  marketing: MarketingConfig,
  theme: ThemeConfig,
  sections: SectionToggle[]
): void {
  const htmlContent = buildStandaloneHtml(business, marketing, theme, sections);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${business.slug}-site.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
