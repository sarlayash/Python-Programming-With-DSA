import React, { useState, useEffect, useRef } from 'react';
import { Award, CheckCircle, Download, ExternalLink, QrCode, Sparkles, Shield, Lock } from 'lucide-react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Badge, EarnedBadge, LearnerProfile } from '../types';

interface BadgesViewProps {
  badges: Badge[];
  earnedBadges: EarnedBadge[];
  learner: LearnerProfile | null;
  onOpenAuth: () => void;
  onSelectTopic?: (topicCode: string) => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  badges,
  earnedBadges,
  learner,
  onOpenAuth,
  onSelectTopic
}) => {
  const [selectedBadge, setSelectedBadge] = useState<EarnedBadge | null>(earnedBadges[0] || null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const badgeCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedBadge) {
      const verifyUrl = `${window.location.origin}/verify/badge/${selectedBadge.uniqueBadgeId}`;
      QRCode.toDataURL(verifyUrl, { width: 140, margin: 1 })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [selectedBadge]);

  const downloadBadgePNG = () => {
    if (!badgeCardRef.current || !selectedBadge) return;
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw luxury badge image
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 600, 600);

    // Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 560, 560);

    // Inner Border
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

    // Draw QR Code
    if (qrDataUrl) {
      const qrImg = new Image();
      qrImg.src = qrDataUrl;
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 240, 410, 120, 120);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.fillText('Scan to verify authenticity', 300, 550);

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
      doc.addImage(qrDataUrl, 'PNG', 57, 100, 36, 36);
    }

    doc.save(`${selectedBadge.badgeName.replace(/\s+/g, '_')}_Credential.pdf`);
  };

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

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            {earnedBadges.length} of {badges.length} Unlocked
          </span>
        </div>
      </div>

      {/* Main Grid: Left Badges Gallery, Right High-Resolution Inspection Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Badges Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge) => {
              const earned = earnedBadges.find(b => b.badgeId === badge.id || b.topicCode === badge.topicCode);
              const isSelected = selectedBadge?.uniqueBadgeId === earned?.uniqueBadgeId;

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    if (earned) setSelectedBadge(earned);
                  }}
                  className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    earned
                      ? isSelected
                        ? 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-500/20 cursor-pointer'
                        : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm cursor-pointer'
                      : 'border-slate-200 bg-slate-50/70 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        earned
                          ? 'bg-[#0f172a] text-amber-400 shadow-md'
                          : 'bg-slate-200 text-slate-400'
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
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> {badge.earningCriteria}
                        </span>
                        {onSelectTopic && (
                          <button
                            onClick={() => onSelectTopic(badge.topicCode)}
                            className="text-slate-700 hover:text-slate-900 font-semibold text-[11px]"
                          >
                            Solve Topic →
                          </button>
                        )}
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
              className="bg-[#0f172a] text-white rounded-2xl border-2 border-amber-500/80 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-6"
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
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed px-4">{selectedBadge.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-400">Awarded To:</span>
                  <div className="font-bold text-sm text-amber-300 mt-0.5">{selectedBadge.learnerName}</div>
                  <div className="font-mono text-[10px] text-slate-400 mt-1">ID: {selectedBadge.uniqueBadgeId}</div>
                  <div className="text-[10px] text-slate-500">Issued on {new Date(selectedBadge.issuedDate).toLocaleDateString()}</div>
                </div>
              </div>

              {/* QR Verification */}
              <div className="bg-white p-3 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-900">
                {qrDataUrl && (
                  <img src={qrDataUrl} alt="QR Verification" className="w-24 h-24 object-contain" />
                )}
                <span className="text-[10px] font-mono text-slate-500 font-semibold">
                  Scan to Verify Authentic Credential
                </span>
              </div>

              {/* Download buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={downloadBadgePNG}
                  className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  PNG
                </button>
                <button
                  onClick={downloadBadgePDF}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs space-y-2">
              <Award className="w-8 h-8 mx-auto text-slate-300" />
              <p>Select an earned badge to inspect cryptographic details and download verifiable credentials.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
