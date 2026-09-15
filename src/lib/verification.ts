import QRCode from 'qrcode';

export interface ParsedVerificationTarget {
  type: 'cert' | 'badge';
  id: string;
}

/**
 * Computes an absolute verification URL that is 100% resilient across:
 * - GitHub Pages (preserving repository base path like /Python-Programming-With-DSA/)
 * - Cloud Run / Custom Domain deployments
 * - Local development
 */
export function getVerificationUrl(type: 'cert' | 'badge', id: string): string {
  if (typeof window === 'undefined') {
    return `/#/verify/${type}/${encodeURIComponent(id)}`;
  }

  // Preserve the exact path before hash or query string, stripping trailing index.html
  const href = window.location.href;
  const baseWithoutHashOrQuery = href.split('?')[0].split('#')[0].replace(/\/index\.html$/, '');
  const cleanBase = baseWithoutHashOrQuery.endsWith('/')
    ? baseWithoutHashOrQuery.slice(0, -1)
    : baseWithoutHashOrQuery;

  // Use hash-based routing: universally supported without server rewrites on static hosting
  return `${cleanBase}/#/verify/${type}/${encodeURIComponent(id)}`;
}

/**
 * Parses any URL, hash, query string, or raw ID to determine verification target
 */
export function parseVerificationTarget(inputString: string): ParsedVerificationTarget | null {
  if (!inputString) return null;
  const str = inputString.trim();

  // 1. Hash route pattern: #/verify/cert/XYZ or #/verify/badge/XYZ
  if (str.includes('/verify/')) {
    const parts = str.split('/verify/')[1]?.split('?')[0]?.split('#')[0]?.split('/') || [];
    if (parts.length >= 2) {
      const type = parts[0].toLowerCase().includes('cert') ? 'cert' : 'badge';
      const id = decodeURIComponent(parts[1]);
      if (id) return { type, id };
    }
  }

  // 2. Query param pattern: ?verify=cert&id=XYZ
  if (str.includes('verify=') || str.includes('id=')) {
    try {
      // Use URL or URLSearchParams
      const queryPart = str.includes('?') ? str.split('?')[1] : str;
      const params = new URLSearchParams(queryPart);
      const verifyType = params.get('verify');
      const id = params.get('id');
      if (id) {
        const type = verifyType === 'badge' ? 'badge' : 'cert';
        return { type, id: decodeURIComponent(id) };
      }
    } catch {}
  }

  // 3. Raw Credential ID heuristics
  const upper = str.toUpperCase();
  if (upper.startsWith('CERT-') || upper.includes('ENTERPRISE') || upper.startsWith('C-')) {
    return { type: 'cert', id: str };
  }
  if (upper.startsWith('UB-') || upper.startsWith('BDG-') || upper.startsWith('BADGE-') || upper.startsWith('T')) {
    return { type: 'badge', id: str };
  }

  return null;
}

/**
 * Generates an ultra-clear, high-contrast QR code optimized for smartphone camera scanners
 */
export async function generateHighContrastQR(text: string, size = 260): Promise<string> {
  return await QRCode.toDataURL(text, {
    width: size,
    margin: 2, // Standard quiet zone essential for phone lens recognition
    errorCorrectionLevel: 'M',
    color: {
      dark: '#0f172a', // Deep slate navy for maximum contrast
      light: '#ffffff' // Pure white background
    }
  });
}
