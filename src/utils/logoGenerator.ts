/**
 * SVG Logo Generator for Local Businesses
 * Generates 3 distinctive, modern logo variations when a business does not have a logo in Google Places.
 */

export type LogoPresetType = 'geometric' | 'emblem' | 'minimalist';

export function generateSvgLogo(
  name: string,
  type: LogoPresetType,
  primaryColor = '#0F172A',
  accentColor = '#3B82F6'
): string {
  const words = name.trim().split(/\s+/).filter((w) => w.length > 2);
  const initials =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase() || 'SE';

  const shortName = name.length > 18 ? name.slice(0, 16) + '...' : name;

  if (type === 'geometric') {
    // Versão 1: Monograma Geométrico & Moderno
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="52" viewBox="0 0 220 52">
      <defs>
        <linearGradient id="geomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}"/>
          <stop offset="100%" stop-color="${accentColor}"/>
        </linearGradient>
      </defs>
      <rect x="4" y="6" width="40" height="40" rx="12" fill="url(#geomGrad)"/>
      <text x="24" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">${initials}</text>
      <text x="54" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="14" fill="${primaryColor}">${shortName}</text>
      <text x="54" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="9" fill="#64748B" letter-spacing="1.5">ATENDIMENTO OFICIAL</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } else if (type === 'emblem') {
    // Versão 2: Emblema Editorial com Selo de Excelência Dourado
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="52" viewBox="0 0 220 52">
      <circle cx="24" cy="26" r="20" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
      <circle cx="24" cy="26" r="16" fill="none" stroke="#F59E0B" stroke-width="1" stroke-dasharray="2,2"/>
      <polygon points="24,15 26.5,22 34,22 28,26.5 30.5,34 24,29.5 17.5,34 20,26.5 14,22 21.5,22" fill="#D97706"/>
      <text x="54" y="25" font-family="Georgia, serif" font-weight="900" font-size="14" fill="${primaryColor}">${shortName}</text>
      <text x="54" y="39" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="8.5" fill="#D97706" letter-spacing="1">QUALIDADE COMPROVADA</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } else {
    // Versão 3: Badge Minimalista Arredondado
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="52" viewBox="0 0 220 52">
      <rect x="4" y="6" width="40" height="40" rx="20" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
      <text x="24" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="${primaryColor}" text-anchor="middle">${initials}</text>
      <text x="54" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13.5" fill="${primaryColor}">${shortName}</text>
      <text x="54" y="39" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="8.5" fill="#94A3B8" letter-spacing="1">PADRÃO PREMIUM</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}
