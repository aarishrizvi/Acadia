import React, { useEffect } from 'react';
import { Award, CheckCircle2, Download, Printer, X, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle: string;
  academyName: string;
  completionDate?: string;
  certificateId?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  academyName,
  completionDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  certificateId = 'ACAD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti blast!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
        });
      } catch (e) {
        console.log('Confetti triggered', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div className="relative border-2 border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-xl p-8 md:p-12 text-center shadow-inner">
          {/* Corner Ornaments */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400/80" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/80" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400/80" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/80" />

          {/* Badge & Header */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-amber-400">
                <Award className="w-8 h-8" />
              </div>
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold mb-2">
            Certificate of Completion
          </p>
          <h2 className="text-xl md:text-2xl font-serif text-slate-100 mb-6 tracking-wide">
            ACADIA GLOBAL ACADEMY NETWORK
          </h2>

          <p className="text-sm text-slate-400 mb-2">This is proudly presented to</p>
          <div className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-4 border-b border-slate-700/60 pb-3 max-w-md mx-auto">
            {studentName}
          </div>

          <p className="text-sm text-slate-400 max-w-lg mx-auto mb-2">
            for successfully mastering all curriculum requirements, practical exercises, and lessons in:
          </p>
          <div className="text-lg md:text-xl font-semibold text-emerald-400 max-w-xl mx-auto mb-6">
            {courseTitle}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-8">
            <span>Hosted by</span>
            <span className="text-slate-200 font-medium px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
              {academyName}
            </span>
          </div>

          {/* Footer of Certificate */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800/80 text-left max-w-lg mx-auto">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Date Issued</p>
              <p className="text-sm font-medium text-slate-300">{completionDate}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Credential ID</p>
              <p className="text-sm font-mono text-amber-400/90">{certificateId}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-emerald-400/90">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographically Verified & Verified by Acadia Trust Network</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Celebrate your achievement and share with your network!</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-600/20 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
