import React, { useState, useEffect, useRef } from 'react';
import { Award, CheckCircle, Download, ExternalLink, QrCode, Sparkles, Shield, Lock, Share2, Copy, Play } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Badge, EarnedBadge, LearnerProfile } from '../types';
import { getVerificationUrl, generateHighContrastQR } from '../lib/verification';
import { api } from '../lib/api';

interface BadgesViewProps {
  badges: Badge[];
  earnedBadges: EarnedBadge[];
  learner: LearnerProfile | null;
  onOpenAuth: () => void;
  onSelectTopic?: (topicCode: string) => void;
  onBadgesUpdated?: (earned: EarnedBadge[]) => void;
  onNavigateToVerify?: (badgeId: string) => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  badges,
  earnedBadges,
  learner,
  onOpenAuth,
  onSelectTopic,
  onBadgesUpdated,
  onNavigateToVerify
}) => {
  const [selectedBadge, setSelectedBadge] = useState<EarnedBadge | null>(earnedBadges[0] || null);
  const [selectedTemplate, setSelectedTemplate] = useState<Badge | null>(badges[0] || null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimingAll, setIsClaimingAll] = useState(false);
  const badgeCardRef = useRef<HTMLDivElement>(null);

  // Sync selectedBadge when earnedBadges change
  useEffect(() => {
    if (!selectedBadge && earnedBadges.length > 0) {
      setSelectedBadge(earnedBadges[0]);
    } else if (selectedBadge) {
      const updated = earnedBadges.find(b => b.topicCode === selectedBadge.topicCode || b.badgeId === selectedBadge.badgeId);
      if (updated) setSelectedBadge(updated);
    }
  }, [earnedBadges]);

  useEffect(() => {
    if (selectedBadge) {
      const verifyUrl = getVerificationUrl('badge', selectedBadge.uniqueBadgeId || selectedBadge.badgeId);
      generateHighContrastQR(verifyUrl, 260)
        .then(setQrDataUrl)
        .catch(console.error);
    } else {
      setQrDataUrl('');
    }
  }, [selectedBadge]);

  const activeVerifyUrl = selectedBadge
    ? getVerificationUrl('badge', selectedBadge.uniqueBadgeId || selectedBadge.badgeId)
    : '';

  const handleCopyLink = () => {
    if (!activeVerifyUrl) return;
    navigator.clipboard.writeText(activeVerifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleClaimSingle = async (topicCode: string) => {
    setIsClaiming(true);
    try {
      const claimed = await api.claimBadge(topicCode);
      const updated = [...earnedBadges.filter(b => b.topicCode !== claimed.topicCode && b.badgeId !== claimed.badgeId), claimed];
      if (onBadgesUpdated) {
        onBadgesUpdated(updated);
      }
      setSelectedBadge(claimed);
    } catch (e) {
      console.error('Failed to claim badge:', e);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClaimAll = async () => {
    setIsClaimingAll(true);
    try {
      const all = await api.claimAllBadges();
      if (onBadgesUpdated) {
        onBadgesUpdated(all);
      }
      if (all.length > 0) {
        setSelectedBadge(all[0]);
      }
    } catch (e) {
      console.error('Failed to claim all badges:', e);
    } finally {
      setIsClaimingAll(false);
    }
  };

  const downloadBadgePNG = () => {
    if (!badgeCardRef.current || !selectedBadge) return;
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark luxury badge background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 600, 600);

    // Gold Outer Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 560, 560);

    // Inner Slate Border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 540, 540);

    // Title
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PYTHON PROGRAMMING WITH DSA', 300, 80);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('POWERED BY KAPIL • OFFICIAL CREDENTIAL', 300, 105);

    // Badge Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(selectedBadge.badgeName, 300, 200);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`TOPIC: ${selectedBadge.topicCode}`, 300, 235);

    // Recipient
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Awarded To:', 300, 280);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(selectedBadge.learnerName, 300, 315);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.fillText(`ID: ${selectedBadge.uniqueBadgeId}`, 300, 350);
    ctx.fillText(`Issued: ${new Date(selectedBadge.issuedDate).toLocaleDateString()}`, 300, 375);

    // Draw QR Code with high-contrast quiet zone
    if (qrDataUrl) {
      const qrImg = new Image();
      qrImg.src = qrDataUrl;
      qrImg.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(230, 400, 140, 140);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(230, 400, 140, 140);
        ctx.drawImage(qrImg, 240, 410, 120, 120);
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Scan to verify authenticity', 300, 560);

        const link = document.createElement('a');
        link.download = `${selectedBadge.badgeName.replace(/\s+/g, '_')}_Badge.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
    }
  };

  const downloadBadgePDF = () => {
    if (!selectedBadge) return;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [150, 150]
    });

    // Dark background
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 150, 150, 'F');

    // Gold border
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.5);
    doc.rect(8, 8, 134, 134);

    doc.setTextColor(212, 175, 55);
    doc.setFontSize(11);
    doc.text('PYTHON PROGRAMMING WITH DSA', 75, 22, { align: 'center' });

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text('POWERED BY KAPIL • OFFICIAL EXECUTIVE BADGE', 75, 28, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(selectedBadge.badgeName, 75, 48, { align: 'center' });

    doc.setTextColor(251, 191, 36);
    doc.setFontSize(10);
    doc.text(`Topic: ${selectedBadge.topicCode}`, 75, 56, { align: 'center' });

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text('Presented To:', 75, 68, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(selectedBadge.learnerName, 75, 76, { align: 'center' });

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(`Unique ID: ${selectedBadge.uniqueBadgeId}`, 75, 86, { align: 'center' });
    doc.text(`Issued: ${new Date(selectedBadge.issuedDate).toLocaleDateString()}`, 75, 92, { align: 'center' });

    if (qrDataUrl) {
      doc.setFillColor(255, 255, 255);
      doc.rect(55, 98, 40, 40, 'F');
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.5);
      doc.rect(55, 98, 40, 40);
      doc.addImage(qrDataUrl, 'PNG', 57, 100, 36, 36);
    }

    doc.save(`${selectedBadge.badgeName.replace(/\s+/g, '_')}_Credential.pdf`);
  };

  const linkedInBadgeUrl = selectedBadge
    ? `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(selectedBadge.badgeName + ' - Python Programming With DSA')}&organizationName=Fortune%20500%20Executive%20Assessment%20Board&issueYear=2026&issueMonth=9&certUrl=${encodeURIComponent(activeVerifyUrl)}&certId=${encodeURIComponent(selectedBadge.uniqueBadgeId)}`
    : '';
  const linkedInShareUrl = selectedBadge
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(activeVerifyUrl)}`
    : '';
  const twitterShareUrl = selectedBadge
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent('I just earned the verified ' + selectedBadge.badgeName + ' credential in Python Programming With DSA, powered by Kapil!')}&url=${encodeURIComponent(activeVerifyUrl)}`
    : '';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Verifiable Daily Badges</span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Credential Showcase</h1>
          <p className="text-xs text-slate-500">
            Earn cryptographic credentials by solving day-wise algorithm challenges. Includes QR verification and exportable PDF/PNG formats.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            {earnedBadges.length} of {badges.length} Unlocked
          </span>

          {earnedBadges.length < badges.length && (
            <button
              onClick={handleClaimAll}
              disabled={isClaimingAll}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isClaimingAll ? 'Unlocking All...' : 'Unlock All 10 Badges'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Badges Gallery, Right High-Resolution Inspection Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Badges Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => {
              const earned = earnedBadges.find(b => b.badgeId === badge.id || b.topicCode === badge.topicCode);
              const isSelected = earned
                ? selectedBadge?.uniqueBadgeId === earned?.uniqueBadgeId
                : selectedTemplate?.id === badge.id && !selectedBadge;

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    setSelectedTemplate(badge);
                    if (earned) {
                      setSelectedBadge(earned);
                    } else {
                      setSelectedBadge(null);
                    }
                  }}
                  className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                    earned
                      ? isSelected
                        ? 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm'
                      : isSelected
                      ? 'border-slate-400 bg-slate-100 shadow-xs ring-2 ring-slate-400/20'
                      : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-100/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        earned
                          ? 'bg-[#0f172a] text-amber-400 shadow-md'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        <Award className="w-5 h-5" />
                      </div>

                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {badge.topicCode}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">{badge.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {earned ? (
                      <>
                        <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Earned & Verified
                        </span>
                        <span className="text-amber-600 font-bold text-[11px]">Inspect →</span>
                      </>
                    ) : (
                      <>
                        <span className="text-slate-500 text-[11px] flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-slate-400" /> {badge.earningCriteria || 'Solve topic problems'}
                        </span>
                        <span className="text-slate-600 hover:text-slate-900 font-semibold text-[11px]">
                          Unlock →
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: High Resolution Inspector Card with QR Verification & Downloads */}
        <div className="space-y-4">
          {selectedBadge ? (
            <div
              ref={badgeCardRef}
              className="bg-[#0f172a] text-white rounded-2xl border-2 border-amber-500/80 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3 text-center">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                  OFFICIAL ENTERPRISE BADGE &bull; {selectedBadge.topicCode}
                </div>

                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-950/40">
                  <Award className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{selectedBadge.badgeName}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed px-2">{selectedBadge.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400">Awarded To:</span>
                  <div className="font-bold text-sm text-amber-300 mt-0.5">{selectedBadge.learnerName}</div>
                  <div className="font-mono text-[10px] text-slate-400 mt-1">ID: {selectedBadge.uniqueBadgeId}</div>
                  <div className="text-[10px] text-slate-500">Issued on {new Date(selectedBadge.issuedDate).toLocaleDateString()}</div>
                </div>
              </div>

              {/* QR Verification */}
              <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-900 shadow-inner">
                {qrDataUrl && (
                  <a
                    href={activeVerifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-1 hover:ring-2 hover:ring-amber-500 rounded-lg transition-all"
                    title="Scan with phone or click to verify"
                  >
                    <img src={qrDataUrl} alt="QR Verification" className="w-24 h-24 object-contain" />
                  </a>
                )}
                <a
                  href={activeVerifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-amber-700 hover:text-amber-900 font-bold underline flex items-center gap-1"
                >
                  <span>Scan or Click to Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Social and Professional Integration */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                <a
                  href={linkedInBadgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 px-3 bg-[#0077b5] hover:bg-[#006097] text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Add to LinkedIn Profile</span>
                </a>

                <div className="grid grid-cols-2 gap-1.5">
                  <a
                    href={linkedInShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-medium rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={twitterShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-medium rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share on X</span>
                  </a>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-medium rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Verification Link Copied!' : 'Copy Verification Link'}</span>
                </button>
              </div>

              {/* Download buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={downloadBadgePNG}
                  className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  PNG
                </button>
                <button
                  onClick={downloadBadgePDF}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
              </div>
            </div>
          ) : selectedTemplate ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3 text-center">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-bold">
                  BADGE CRITERIA &bull; {selectedTemplate.topicCode}
                </div>

                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <Award className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedTemplate.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedTemplate.description}</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Earning Criteria</span>
                  <p className="text-xs text-amber-900 mt-0.5 font-medium">{selectedTemplate.earningCriteria}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleClaimSingle(selectedTemplate.topicCode)}
                  disabled={isClaiming}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isClaiming ? 'Claiming Credential...' : 'Claim & Unlock Verified Badge'}</span>
                </button>

                {onSelectTopic && (
                  <button
                    onClick={() => onSelectTopic(selectedTemplate.topicCode)}
                    className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Solve in Coding Lab</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs space-y-2">
              <Award className="w-8 h-8 mx-auto text-slate-300" />
              <p>Select any badge to inspect cryptographic details, claim verifiable credentials, or solve challenges.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
