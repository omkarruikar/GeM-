import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  FileCheck2, 
  ArrowRight, 
  CheckSquare, 
  Square,
  Send,
  Lock,
  Printer
} from 'lucide-react';

export default function OfficerAiRecommendationCard({ 
  bid, 
  onAcceptRecommendation, 
  onOpenOverride, 
  onOpenReport 
}) {
  if (!bid || !bid.officer_recommendation) return null;

  const rec = bid.officer_recommendation;
  const [checklist, setChecklist] = useState(rec.action_checklist || []);
  const [clarificationSent, setClarificationSent] = useState(false);
  const [noticeSent, setNoticeSent] = useState(false);

  const toggleTask = (index) => {
    setChecklist(prev => prev.map((item, idx) => 
      idx === index ? { ...item, completed: !item.completed } : item
    ));
  };

  const isAward = rec.verdict === "RECOMMENDED_FOR_AWARD";
  const isMsme = rec.verdict === "QUALIFIED_SUBJECT_TO_MSME_RATIFICATION";
  const isReject = rec.verdict === "REJECT_AND_DISQUALIFY";
  const isSecurity = rec.verdict === "SECURITY_QUARANTINE_VIGILANCE";

  return (
    <div className={`rounded-xl border shadow-sm p-6 font-sans space-y-4 ${
      isAward 
        ? "bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200" 
        : isMsme 
        ? "bg-amber-50/40 border-amber-300 ring-1 ring-amber-200" 
        : isReject 
        ? "bg-rose-50/40 border-rose-300 ring-1 ring-rose-200" 
        : "bg-purple-50/40 border-purple-300 ring-1 ring-purple-200"
    }`}>
      
      {/* Top Advisory Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${
            isAward ? "bg-emerald-700" : isMsme ? "bg-amber-700" : isReject ? "bg-rose-800" : "bg-purple-800"
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-white text-stone-800 px-2 py-0.5 rounded border border-stone-300">
                Feature 13
              </span>
              <span className="font-serif font-bold text-xs text-stone-700">
                AI Decision Advisory for Procurement Officer
              </span>
            </div>
            <h4 className="font-serif font-bold text-base text-stone-900 mt-0.5">
              {rec.title}
            </h4>
          </div>
        </div>

        <span className={`px-3 py-1 rounded text-xs font-serif font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border shrink-0 ${
          isAward 
            ? "bg-emerald-100 text-emerald-950 border-emerald-300" 
            : isMsme 
            ? "bg-amber-100 text-amber-950 border-amber-300" 
            : isReject 
            ? "bg-rose-100 text-rose-950 border-rose-300" 
            : "bg-purple-100 text-purple-950 border-purple-300"
        }`}>
          {isAward && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />}
          {isMsme && <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />}
          {isReject && <XCircle className="w-3.5 h-3.5 text-rose-800" />}
          {isSecurity && <ShieldAlert className="w-3.5 h-3.5 text-purple-800" />}
          {rec.verdict.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Executive Summary & Statutory Citations */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 space-y-2 text-xs text-stone-800 leading-relaxed font-sans">
        <div>
          <span className="font-serif font-bold text-stone-900 block mb-0.5">Executive Rationale:</span>
          {rec.summary}
        </div>
        <div className="pt-1.5 border-t border-stone-100 flex items-start gap-1.5 text-[11px] text-stone-600 font-mono">
          <strong className="text-stone-800 font-semibold shrink-0">Statutory Authority:</strong>
          <span>{rec.statutory_basis}</span>
        </div>
      </div>

      {/* Officer Action Checklist */}
      <div className="space-y-2">
        <span className="font-serif font-bold text-xs text-stone-800 block">
          Mandatory Officer Procedural Verification Checklist:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
          {checklist.map((item, idx) => (
            <button
              key={idx}
              onClick={() => toggleTask(idx)}
              className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-left transition"
            >
              {item.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-stone-400 shrink-0" />
              )}
              <span className={`text-[11px] ${item.completed ? 'text-stone-800 font-semibold' : 'text-stone-600'}`}>
                {item.task}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200">
        <div className="text-[11px] font-serif text-stone-600 italic">
          Actions take immediate effect and are permanently anchored into the SHA-256 cryptographic audit ledger.
        </div>

        <div className="flex items-center space-x-2">
          {isMsme && (
            <button
              onClick={() => onOpenOverride(bid, null)}
              className="px-3.5 py-1.5 rounded bg-amber-700 hover:bg-amber-600 text-white font-serif font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Ratify MSME Relaxation</span>
            </button>
          )}

          {isReject && (
            <button
              onClick={() => setNoticeSent(true)}
              disabled={noticeSent}
              className="px-3.5 py-1.5 rounded bg-rose-800 hover:bg-rose-700 text-white font-serif font-bold text-xs transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{noticeSent ? "Disqualification Notice Issued" : "Dispatch Formal Disqualification Notice"}</span>
            </button>
          )}

          {isAward && !bid.officer_sign_off && (
            <button
              onClick={onAcceptRecommendation}
              className="px-4 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-serif font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Ratify & Issue LOI</span>
            </button>
          )}

          <button
            onClick={() => onOpenReport(bid)}
            className="px-3 py-1.5 rounded border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-serif font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Generate Decision Pack</span>
          </button>
        </div>
      </div>

      {noticeSent && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs font-serif">
          Formal Disqualification Notice dispatched to {bid.bidder_name} citing GFR Rule 151 and Central Debarment Watchlist order. Block anchored to ledger.
        </div>
      )}

    </div>
  );
}
