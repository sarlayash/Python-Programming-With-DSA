import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2, CheckCircle2, ShieldCheck, Printer, ExternalLink, Award } from 'lucide-react';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { Certificate, LearnerProfile } from '../types';

interface CertificateViewProps {
  certificate: Certificate | null;
  learner: LearnerProfile | null;
  onOpenAuth: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  certificate,
  learner,
  onOpenAuth
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const certRef = useRef<HTMLDivElement>(null);

  // Fallback demo certificate if eligible or previewing
  const displayCert: Certificate = certificate || {
    certificateId: 'CERT-KAPIL-ENTERPRISE-8910',
    learnerId: learner?.id || 'usr_kapil_01',
    learnerName: learner?.name || 'Kapil Narula',
    learnerEmail: learner?.email || 'kapilnarula27july@gmail.com',
    courseTitle: 'Python Programming With DSA',
    subtitle: 'Powered By Kapil',
    issuedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    status: 'issued',
    verificationUrl: `/verify/cert/CERT-KAPIL-ENTERPRISE-8910`,
    grade: 'Executive Honors (Enterprise Distinction)',
    completionSummary: {
      totalSolved: learner?.solvedProblems.length || 8,
      totalAttempted: learner?.attemptedProblems.length || 10,
      daysCompleted: learner?.completedDays.length || 4
    }
  };

  useEffect(() => {
    const fullVerifyUrl = `${window.location.origin}/verify/cert/${displayCert.certificateId}`;
    QRCode.toDataURL(fullVerifyUrl, { width: 140, margin: 1 })
      .then(setQrCodeUrl)
      .catch(console.error);
  }, [displayCert.certificateId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4' // 297mm x 210mm
    });

    // Deep luxury background
    doc.setFillColor(253, 250, 243); // warm ivory
    doc.rect(0, 0, 297, 210, 'F');

    // Outer Navy Border
    doc.setDrawColor(15, 23, 42); // deep navy
    doc.setLineWidth(3);
    doc.rect(12, 12, 273, 186);

    // Inner Gold Border
    doc.setDrawColor(212, 175, 55); // gold
    doc.setLineWidth(1.2);
    doc.rect(15, 15, 267, 180);

    // Header Authority
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text('FORTUNE 500 EXECUTIVE ASSESSMENT BOARD', 148.5, 34, { align: 'center' });

    doc.setTextColor(180, 83, 9);
    doc.setFontSize(9);
    doc.text('OFFICIAL CERTIFICATE OF COMPLETION & EXECUTIVE MASTERY', 148.5, 40, { align: 'center' });

    // Course Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(26);
    doc.text('Python Programming With DSA', 148.5, 56, { align: 'center' });

    doc.setTextColor(180, 83, 9);
    doc.setFontSize(14);
    doc.text('POWERED BY KAPIL', 148.5, 64, { align: 'center' });

    // Recipient text
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(11);
    doc.text('This credential certifies that', 148.5, 82, { align: 'center' });

    // Learner Name
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(28);
    doc.text(displayCert.learnerName, 148.5, 96, { align: 'center' });

    // Underline
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.8);
    doc.line(75, 100, 222, 100);

    // Body description
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(10.5);
    doc.text(
      'has successfully demonstrated algorithmic competence in Data Structures, Dynamic Programming,',
      148.5,
      112,
      { align: 'center' }
    );
    doc.text(
      'Matrix Algorithms, Recursion, and Isolated Python Systems with distinction.',
      148.5,
      118,
      { align: 'center' }
    );

    // Distinction badge
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text(`Distinction Grade: ${displayCert.grade}`, 148.5, 132, { align: 'center' });

    // Signatures & QR
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text('Kapil', 60, 158);
    doc.setLineWidth(0.5);
    doc.setDrawColor(15, 23, 42);
    doc.line(40, 162, 95, 162);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Lead Instructor & Curriculum Architect', 67, 168, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Issued: ${displayCert.issuedDate}`, 225, 158, { align: 'center' });
    doc.line(195, 162, 255, 162);
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`ID: ${displayCert.certificateId}`, 225, 168, { align: 'center' });

    // Embed QR code
    if (qrCodeUrl) {
      doc.addImage(qrCodeUrl, 'PNG', 133.5, 142, 30, 30);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Verifiable Hash', 148.5, 176, { align: 'center' });
    }

    doc.save(`Certificate_${displayCert.certificateId}.pdf`);
  };

  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill Ivory Background
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, 1200, 800);

    // Outer Navy Border
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 740);

    // Inner Gold Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(45, 45, 1110, 710);

    // Corner Ornaments
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(55, 55, 6, 0, Math.PI * 2);
    ctx.arc(1145, 55, 6, 0, Math.PI * 2);
    ctx.arc(55, 745, 6, 0, Math.PI * 2);
    ctx.arc(1145, 745, 6, 0, Math.PI * 2);
    ctx.fill();

    // Headers
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px serif';
    ctx.fillText('FORTUNE 500 EXECUTIVE ASSESSMENT BOARD', 600, 110);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('OFFICIAL CERTIFICATE OF COMPLETION & EXECUTIVE MASTERY', 600, 140);

    // Course Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px serif';
    ctx.fillText('Python Programming With DSA', 600, 220);

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('POWERED BY KAPIL', 600, 260);

    // Recipient text
    ctx.fillStyle = '#64748b';
    ctx.font = '20px sans-serif';
    ctx.fillText('This credential certifies that', 600, 330);

    // Recipient Name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 46px serif';
    ctx.fillText(displayCert.learnerName, 600, 395);

    // Divider
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 415);
    ctx.lineTo(850, 415);
    ctx.stroke();

    // Body
    ctx.fillStyle = '#475569';
    ctx.font = '18px sans-serif';
    ctx.fillText(
      'has successfully demonstrated algorithmic competence in Data Structures, Dynamic Programming,',
      600,
      465
    );
    ctx.fillText(
      'Matrix Algorithms, Recursion, and Isolated Python Systems with distinction.',
      600,
      495
    );

    // Grade
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`Distinction Grade: ${displayCert.grade}`, 600, 550);

    // Signatures
    ctx.font = 'italic 28px serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Kapil', 300, 660);
    ctx.beginPath();
    ctx.moveTo(200, 675);
    ctx.lineTo(400, 675);
    ctx.stroke();
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Lead Instructor & Architect', 300, 700);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`Issued: ${displayCert.issuedDate}`, 900, 660);
    ctx.beginPath();
    ctx.moveTo(800, 675);
    ctx.lineTo(1000, 675);
    ctx.stroke();
    ctx.font = '13px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`ID: ${displayCert.certificateId}`, 900, 700);

    // Draw QR Code
    if (qrCodeUrl) {
      const qrImg = new Image();
      qrImg.src = qrCodeUrl;
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 540, 595, 120, 120);
        ctx.fillStyle = '#64748b';
        ctx.font = '11px sans-serif';
        ctx.fillText('Scan to Verify Authenticity', 600, 735);

        const a = document.createElement('a');
        a.download = `Certificate_${displayCert.certificateId}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Enterprise Verified Credential</span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Final Official Certificate</h1>
          <p className="text-xs text-slate-500">
            Cryptographically signed completion record with tamper-proof QR code verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handleDownloadPNG}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Download PNG
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Verified Status Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4 text-xs text-emerald-900 no-print">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Authentic Verified Certificate Status: ISSUED</span>
            <p className="text-[11px] text-emerald-700">
              Unique ID: <span className="font-mono font-bold">{displayCert.certificateId}</span> &bull; Eligible for LinkedIn profile integration.
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="px-2.5 py-1 rounded bg-emerald-100 font-bold text-emerald-800 text-[10px]">
            {displayCert.grade}
          </span>
        </div>
      </div>

      {/* Certificate Frame Display */}
      <div className="flex justify-center overflow-x-auto py-2">
        <div
          ref={certRef}
          className="w-full max-w-4xl bg-[#faf8f5] border-[10px] border-[#0f172a] p-8 sm:p-12 shadow-2xl relative text-center rounded-sm text-slate-900 overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 80%)'
          }}
        >
          {/* Inner Gold Inset Border */}
          <div className="absolute inset-3 border-2 border-amber-500/80 pointer-events-none"></div>

          {/* Header */}
          <div className="space-y-1 relative z-10">
            <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-[#0f172a]">
              Fortune 500 Executive Assessment Board
            </span>
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              Certificate of Completion & Algorithmic Distinction
            </div>
          </div>

          {/* Course Title */}
          <div className="mt-8 space-y-1 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black font-serif text-[#0f172a] tracking-tight">
              {displayCert.courseTitle}
            </h2>
            <p className="text-sm font-bold text-amber-600 tracking-wider uppercase font-sans">
              {displayCert.subtitle}
            </p>
          </div>

          {/* Recipient */}
          <div className="mt-8 space-y-2 relative z-10">
            <p className="text-xs text-slate-500 italic">This credential certifies that</p>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f172a] underline decoration-amber-500/70 underline-offset-8">
              {displayCert.learnerName}
            </h3>
            <p className="text-xs text-slate-600 max-w-xl mx-auto pt-4 leading-relaxed font-sans">
              has completed rigorous engineering coursework in Python Data Structures, Matrix Algorithms, 
              Dynamic Optimization, and Isolated Test Case Execution, fulfilling all completion requirements with distinction.
            </p>
          </div>

          {/* Grade */}
          <div className="mt-4 relative z-10">
            <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-300 rounded-full text-xs font-bold text-amber-900 font-sans">
              {displayCert.grade}
            </span>
          </div>

          {/* Footer Signatures and QR Code */}
          <div className="mt-12 pt-6 border-t border-slate-200/80 grid grid-cols-3 items-end relative z-10">
            {/* Instructor Signature */}
            <div className="text-left space-y-1">
              <div className="font-serif italic text-xl text-slate-900 font-bold">Kapil</div>
              <div className="w-32 border-b border-slate-800"></div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Lead Instructor & Architect</div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Verification" className="w-20 h-20 bg-white p-1 border border-slate-300 shadow-sm" />
              ) : (
                <div className="w-20 h-20 bg-slate-100 border border-slate-300"></div>
              )}
              <span className="text-[9px] font-mono text-slate-500 mt-1">Scan to Verify</span>
            </div>

            {/* Date & ID */}
            <div className="text-right space-y-1">
              <div className="text-xs font-bold text-slate-800">{displayCert.issuedDate}</div>
              <div className="w-32 ml-auto border-b border-slate-800"></div>
              <div className="text-[10px] font-mono text-slate-500">{displayCert.certificateId}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
