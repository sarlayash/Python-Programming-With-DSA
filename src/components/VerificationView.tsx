import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Download, 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  User, 
  Search, 
  Upload,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import jsQR from 'jsqr';
import { api } from '../lib/api';
import { Certificate, EarnedBadge } from '../types';
import { getVerificationUrl, generateHighContrastQR, parseVerificationTarget } from '../lib/verification';

interface VerificationViewProps {
  type: 'cert' | 'badge';
  id: string;
  onBackToPortal: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  type,
  id,
  onBackToPortal,
  onNavigateToTab
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certData, setCertData] = useState<Certificate | null>(null);
  const [badgeData, setBadgeData] = useState<EarnedBadge | null>(null);
  const [activeType, setActiveType] = useState<'cert' | 'badge'>(type);
  const [activeId, setActiveId] = useState<string>(id);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Manual lookup input
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadMessage, setUploadMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveType(type);
    setActiveId(id);
  }, [type, id]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadVerification = async () => {
      try {
        let loadedCert: Certificate | null = null;
        let loadedBadge: EarnedBadge | null = null;

        if (activeType === 'cert') {
          try {
            loadedCert = await api.verifyCertificate(activeId);
          } catch (certErr) {
            // Auto-heal: see if this ID was actually a badge
            try {
              loadedBadge = await api.verifyBadge(activeId);
              if (isMounted) setActiveType('badge');
            } catch {
              throw certErr;
            }
          }
        } else {
          try {
            loadedBadge = await api.verifyBadge(activeId);
          } catch (badgeErr) {
            // Auto-heal: see if this ID was actually a certificate
            try {
              loadedCert = await api.verifyCertificate(activeId);
              if (isMounted) setActiveType('cert');
            } catch {
              throw badgeErr;
            }
          }
        }

        if (isMounted) {
          if (loadedCert) {
            setCertData(loadedCert);
            setBadgeData(null);
          } else if (loadedBadge) {
            setBadgeData(loadedBadge);
            setCertData(null);
          }
        }

        // Generate high-contrast QR code for this verification URL
        const verifiedType = loadedCert ? 'cert' : 'badge';
        const verifiedId = loadedCert ? loadedCert.certificateId : (loadedBadge?.uniqueBadgeId || activeId);
        const directUrl = getVerificationUrl(verifiedType, verifiedId);
        const qr = await generateHighContrastQR(directUrl, 260);
        if (isMounted) {
          setQrUrl(qr);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Credential verification could not be validated.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVerification();

    return () => {
      isMounted = false;
    };
  }, [activeType, activeId]);

  const handleCopyLink = () => {
    const directUrl = getVerificationUrl(activeType, activeId);
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const parsed = parseVerificationTarget(searchQuery.trim());
    if (parsed) {
      window.location.hash = `/verify/${parsed.type}/${encodeURIComponent(parsed.id)}`;
      setActiveType(parsed.type);
      setActiveId(parsed.id);
    } else {
      // Default to certificate lookup
      window.location.hash = `/verify/cert/${encodeURIComponent(searchQuery.trim())}`;
      setActiveType('cert');
      setActiveId(searchQuery.trim());
    }
  };

  // Upload or scan QR code image file
  const handleQRImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          const parsed = parseVerificationTarget(code.data);
          if (parsed) {
            window.location.hash = `/verify/${parsed.type}/${encodeURIComponent(parsed.id)}`;
            setActiveType(parsed.type);
            setActiveId(parsed.id);
            setUploadMessage({ text: `Successfully scanned and loaded: ${parsed.id}`, isError: false });
          } else {
            setUploadMessage({ text: `Scanned code: ${code.data}`, isError: false });
          }
        } else {
          setUploadMessage({ text: 'No valid QR code detected in this image. Please ensure the QR code is clearly visible and high-contrast.', isError: true });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBackToPortal}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Python DSA Portal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">Verification Engine v2.4</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-700">Live Registry</span>
        </div>
      </div>

      {/* Verification Card */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Validating Cryptographic Credential...</h3>
            <p className="text-xs text-slate-500">Querying enterprise authority records for identifier: {activeId}</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl border border-rose-200 p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Credential Verification Failed</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                The requested identifier <span className="font-mono font-bold text-slate-900">{activeId}</span> could not be verified in the active registry.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <p className="text-xs font-semibold text-slate-700">Looking for a specific certificate or badge?</p>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Certificate or Badge ID (e.g. CERT-KAPIL-ENTERPRISE-8910)"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0f172a] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                Verify ID
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>OFFICIALLY VERIFIED & AUTHENTIC</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Python Programming With DSA
                </h1>
                <p className="text-xs sm:text-sm text-amber-300/90 font-medium">
                  Executive Credential &bull; Powered By Kapil
                </p>
              </div>

              {/* QR Badge Card */}
              <div className="bg-white p-2.5 rounded-2xl shadow-lg shrink-0 flex flex-col items-center justify-center gap-1.5 self-start sm:self-center">
                {qrUrl ? (
                  <img src={qrUrl} alt="Verified QR Code" className="w-28 h-28 object-contain rounded-lg" />
                ) : (
                  <div className="w-28 h-28 bg-slate-100 animate-pulse rounded-lg" />
                )}
                <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                  Verified Scan
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Core Credential Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Awarded Recipient</span>
                  <div className="text-xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-600" />
                    <span>{certData ? certData.learnerName : badgeData?.learnerName}</span>
                  </div>
                  {certData?.learnerEmail && (
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{certData.learnerEmail}</div>
                  )}
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Credential Classification</span>
                  <div className="text-base font-bold text-slate-800 mt-0.5 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>
                      {certData
                        ? 'Executive Certificate of Completion'
                        : `Topic Mastery Badge: ${badgeData?.badgeName} (${badgeData?.topicCode})`}
                    </span>
                  </div>
                  {certData?.grade && (
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-md text-xs font-semibold">
                      {certData.grade}
                    </span>
                  )}
                  {badgeData?.description && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{badgeData.description}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credential ID</span>
                    <div className="font-mono text-xs font-bold text-slate-900 mt-0.5 break-all">
                      {certData ? certData.certificateId : badgeData?.uniqueBadgeId}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issue Date</span>
                    <div className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{certData ? certData.issuedDate : new Date(badgeData?.issuedDate || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authorizing Authority</span>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    Kapil &bull; Lead Instructor & Super Administrator
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Curriculum Standards T1 - T10 &bull; Automated Python Sandbox Engine
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Status: Valid & In Good Standing
                  </span>
                  <span className="font-mono text-[10px] text-emerald-800">ISO-27001 SECURE</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Verification URL'}</span>
                </button>

                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab(certData ? 'certificate' : 'badges')}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{certData ? 'View Full Certificate' : 'View Badge Showcase'}</span>
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Digitally Sealed &bull; Python Programming With DSA
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Search and QR Upload Footer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 text-xs text-slate-600">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Need to scan or verify another credential?</p>
              <p className="text-[11px] text-slate-500">Scan via camera or upload a QR image from certificates and badges.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleQRImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload QR Image</span>
            </button>
          </div>
        </div>

        {uploadMessage && (
          <div className={`p-3 rounded-xl border text-xs font-semibold ${
            uploadMessage.isError
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {uploadMessage.text}
          </div>
        )}

        {/* Quick Test Credential Chips */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Test Credentials:</span>
          <button
            onClick={() => {
              window.location.hash = '/verify/cert/CERT-KAPIL-ENTERPRISE-8910';
              setActiveType('cert');
              setActiveId('CERT-KAPIL-ENTERPRISE-8910');
            }}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Kapil Narula (Certificate)
          </button>
          <button
            onClick={() => {
              window.location.hash = '/verify/badge/BDG-T1-8910-KAPIL';
              setActiveType('badge');
              setActiveId('BDG-T1-8910-KAPIL');
            }}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            T1 Badge
          </button>
          <button
            onClick={() => {
              window.location.hash = '/verify/badge/BDG-T2-8910-KAPIL';
              setActiveType('badge');
              setActiveId('BDG-T2-8910-KAPIL');
            }}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            T2 Badge
          </button>
          <button
            onClick={() => {
              window.location.hash = '/verify/badge/BDG-T3-8910-KAPIL';
              setActiveType('badge');
              setActiveId('BDG-T3-8910-KAPIL');
            }}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            T3 Badge
          </button>
          <button
            onClick={() => {
              window.location.hash = '/verify/badge/BDG-T4-8910-KAPIL';
              setActiveType('badge');
              setActiveId('BDG-T4-8910-KAPIL');
            }}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            T4 Badge
          </button>
        </div>
      </div>
    </div>
  );
};
