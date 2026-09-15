import QRCode from 'qrcode';

export interface ParsedVerificationTarget {
  type: 'cert' | 'badge';
  id: string;
}

/**
 * Computes an absolute verification URL that is 100% resilient across:
 * - GitHub Pages (preserving repository base path like /Python-Programming-With-DSA/)
 * - Cloud Run / Custom Domain deployments
 * - Local development (defaults to live verification target so mobile camera scans work)
 */
export function getVerificationUrl(type: 'cert' | 'badge', id: string): string {
  const cleanId = encodeURIComponent(id.trim());

  if (typeof window === 'undefined') {
    return `https://sarlayash.github.io/Python-Programming-With-DSA/#/verify/${type}/${cleanId}`;
  }

  const hostname = window.location.hostname;
  // If running on localhost/127.0.0.1, phone camera scans cannot reach local computer loopback,
  // so route to live public repository domain where phone can open and verify instantly
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `https://sarlayash.github.io/Python-Programming-With-DSA/#/verify/${type}/${cleanId}`;
  }

  // Preserve the exact path before hash or query string, stripping trailing index.html
  const href = window.location.href;
  const baseWithoutHashOrQuery = href.split('?')[0].split('#')[0].replace(/\/index\.html$/, '');
  const cleanBase = baseWithoutHashOrQuery.endsWith('/')
    ? baseWithoutHashOrQuery.slice(0, -1)
    : baseWithoutHashOrQuery;

  // Use hash-based routing: universally supported without server rewrites on static hosting
  return `${cleanBase}/#/verify/${type}/${cleanId}`;
}

/**
 * Parses any URL, hash, query string, or raw ID to determine verification target
 */
export function parseVerificationTarget(inputString: string): ParsedVerificationTarget | null {
  if (!inputString) return null;
  const str = inputString.trim();

  // 1. Hash route pattern: #/verify/cert/XYZ or #/verify/badge/XYZ or /verify/...
  if (str.includes('/verify/')) {
    const afterVerify = str.split('/verify/')[1] || '';
    const cleanSegment = afterVerify.split('?')[0].split('#')[0];
    const parts = cleanSegment.split('/').filter(Boolean);

    if (parts.length >= 2) {
      const type = parts[0].toLowerCase().includes('cert') ? 'cert' : 'badge';
      const id = decodeURIComponent(parts[1]).trim();
      if (id) return { type, id };
    } else if (parts.length === 1 && parts[0]) {
      const raw = decodeURIComponent(parts[0]).trim();
      const upper = raw.toUpperCase();
      if (upper.startsWith('CERT') || upper.includes('ENTERPRISE') || upper === 'COMPLETE') {
        return { type: 'cert', id: raw };
      } else {
        return { type: 'badge', id: raw };
      }
    }
  }

  // 2. Query param pattern: ?verify=cert&id=XYZ or ?cert=XYZ or ?badge=XYZ
  if (str.includes('?') || str.includes('&') || str.includes('=')) {
    try {
      const queryPart = str.includes('?') ? str.split('?')[1] : str;
      const params = new URLSearchParams(queryPart);
      const verifyType = params.get('verify');
      const id = params.get('id');
      if (id) {
        const type = verifyType === 'badge' ? 'badge' : 'cert';
        return { type, id: decodeURIComponent(id).trim() };
      }
      const certParam = params.get('cert');
      if (certParam) return { type: 'cert', id: decodeURIComponent(certParam).trim() };
      const badgeParam = params.get('badge');
      if (badgeParam) return { type: 'badge', id: decodeURIComponent(badgeParam).trim() };
    } catch {}
  }

  // 3. Raw Credential ID heuristics
  const upper = str.toUpperCase();
  if (upper.startsWith('CERT-') || upper.includes('ENTERPRISE') || upper.startsWith('C-') || upper === 'COMPLETE') {
    return { type: 'cert', id: str };
  }
  if (upper.startsWith('UB-') || upper.startsWith('BDG-') || upper.startsWith('BADGE-') || upper.match(/^T(10|[1-9])/)) {
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
