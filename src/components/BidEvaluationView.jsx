import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  FileText, 
  Sparkles, 
  Lock, 
  Edit3, 
  FileCheck2, 
  Building2,
  ShieldCheck,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import AdversarialAlertBanner from './AdversarialAlertBanner';
import RegistryLookupDrawer from './RegistryLookupDrawer';
import confetti from 'canvas-confetti';

export default function BidEvaluationView({ 
  bid, 
  tender, 
  onBack, 
  onOpenCitation, 
  onOpenOverride, 
  onOpenReport, 
  onFinalizeBid 
}) {
  const [officerNote, setOfficerNote] = useState("Technical and statutory verification reviewed and ratified pursuant to GeM GTC.");
  const [showSignModal, setShowSignModal] = useState(false);

  if (!bid) return null;

  const handleFinalSign = () => {
    onFinalizeBid({
      bid_id: bid.id,
      officer_name: "Rajesh Sharma",
      officer_id: "CPCL-PO-8812",
      decision_summary: officerNote
    });
    setShowSignModal(false);
    
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case "PASS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-serif font-bold uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            PASS
          </span>
        );
      case "FAIL":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-serif font-bold uppercase tracking-wider bg-rose-50 text-rose-900 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            FAIL
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-serif font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            REVIEW
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card - Classical Dossier Style */}
      <div className="bg-white rounded-xl p-6 border border-stone-300 shadow-sm space-y-4">
        
        {/* Navigation & Action Buttons Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-stone-200">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-serif font-bold text-stone-700 hover:text-stone-950 transition bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded border border-stone-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bids Matrix</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenOverride(bid, null)}
              className="px-3.5 py-1.5 rounded border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-serif font-bold transition flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-800" />
              <span>Override Overall Verdict</span>
            </button>
            <button
              onClick={() => onOpenReport(bid)}
              className="px-3.5 py-1.5 rounded border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 text-xs font-serif font-bold transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-stone-700" />
              <span>Compliance Certificate</span>
            </button>
            {!bid.officer_sign_off ? (
              <button
                onClick={() => setShowSignModal(true)}
                className="px-4 py-1.5 rounded bg-[#0B192C] hover:bg-[#132A4A] text-white text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Finalize & Sign Off</span>
              </button>
            ) : (
              <div className="px-3 py-1 rounded bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-serif font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>RATIFIED BY {bid.officer_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bidder Profile Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-mono font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-300">
                {bid.id}
              </span>
              <span className="text-stone-300">•</span>
              <span className="font-serif text-stone-600">
                {bid.bidder_type_label || bid.bidder_type}
              </span>
              <span className="text-stone-300">•</span>
              <span className="font-mono text-stone-700 font-semibold">GSTIN: {bid.gstin}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">
              {bid.bidder_name}
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-stone-400 block font-semibold">
                Overall AI & Rule Verdict
              </span>
              <div className="mt-1">{getVerdictBadge(bid.overall_verdict)}</div>
            </div>
            <div className="h-10 w-px bg-stone-200"></div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-stone-400 block font-semibold">
                Readiness Score
              </span>
              <span className="text-2xl font-serif font-bold text-stone-900">
                {bid.compliance_score}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Adversarial Alert Notice (FR12 Guardrail Intercept) */}
      {bid.security_alert && (
        <AdversarialAlertBanner securityAlert={bid.security_alert} />
      )}

      {/* Government Registry Cross-Referencing Drawer (FR11) */}
      <RegistryLookupDrawer 
        registryStatus={bid.registry_status}
        bidderName={bid.bidder_name}
        gstin={bid.gstin}
        udyamNumber={bid.udyam_number}
      />

      {/* Per-Clause Verification Intelligence Matrix (FR3, FR4, FR5, FR6) */}
      <div className="bg-white rounded-xl border border-stone-300 shadow-sm overflow-hidden space-y-0">
        
        {/* Section Header with Feature Highlight */}
        <div className="p-5 border-b border-stone-200 bg-[#FAF9F6] flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Clause Eligibility & Compliance Determination Matrix
              </h3>
              <span className="text-[10px] font-mono uppercase bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-bold">
                FR3 + FR4 + FR5
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5 font-sans">
              Deterministic rule logic evaluated first; AI semantic layer resolves ambiguous technical scope and claims.
            </p>
          </div>
          <div className="text-xs font-mono text-stone-500">
            {bid.evaluations?.length || 0} Clauses Evaluated
          </div>
        </div>

        {/* Per Clause Evaluation Rows */}
        <div className="divide-y divide-stone-200">
          {bid.evaluations?.map((evaluation) => {
            const hasCitations = evaluation.citations && evaluation.citations.length > 0;
            const isOverridden = evaluation.is_overridden;
            const isThreatFlagged = evaluation.prompt_injection_flagged;

            return (
              <div 
                key={evaluation.clause_id}
                className={`p-5 sm:p-6 transition ${
                  isThreatFlagged ? "bg-rose-50/40" : 
                  isOverridden ? "bg-amber-50/30" : "hover:bg-[#FBFBFA]"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  {/* Left: Clause Details & Reasoning */}
                  <div className="space-y-2 flex-1">
                    
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-mono font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-300">
                        {evaluation.clause_code}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-stone-900">
                        {evaluation.title}
                      </h4>
                      <span className="text-stone-400">•</span>
                      <span className="text-[11px] text-stone-500 font-sans">
                        {evaluation.category}
                      </span>

                      {isOverridden && (
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                          <Edit3 className="w-3 h-3 text-amber-800" />
                          OFFICER GFR 173 OVERRIDE RECORDED
                        </span>
                      )}

                      {isThreatFlagged && (
                        <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded border border-rose-300 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-700" />
                          GUARDRAIL SECURITY ALERT
                        </span>
                      )}
                    </div>

                    {/* Explanatory Reasoning Dossier Box */}
                    <div className="text-xs text-stone-800 leading-relaxed font-sans bg-[#FBFBFA] p-3 rounded-lg border border-stone-200">
                      {evaluation.reasoning}
                    </div>

                    {/* Officer Override Justification Badge */}
                    {isOverridden && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs font-mono space-y-1">
                        <div className="font-bold flex items-center gap-1 text-amber-900">
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          Statutory Justification on Record:
                        </div>
                        <div className="text-amber-900">{evaluation.override_reason}</div>
                        <div className="text-[10px] text-amber-800 pt-0.5">
                          Officer: {evaluation.override_officer} • Timestamp: {new Date(evaluation.override_timestamp || Date.now()).toLocaleTimeString()}
                        </div>
                      </div>
                    )}

                    {/* Engine Metadata tags */}
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono pt-0.5">
                      <span>Engine Rule: <strong className="text-stone-700">{evaluation.rule_logic_applied}</strong></span>
                      <span>•</span>
                      <span>Verification Confidence: <strong className="text-stone-800">{(evaluation.confidence * 100).toFixed(0)}%</strong></span>
                    </div>

                  </div>

                  {/* Right: Verdict Badge & Important Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-end sm:items-center lg:items-end justify-between sm:justify-end gap-3 shrink-0">
                    
                    <div>
                      {getVerdictBadge(evaluation.final_verdict)}
                    </div>

                    {/* Core Actions: Evidence Citation (< 2 Clicks) and Override */}
                    <div className="flex items-center space-x-2">
                      {hasCitations && (
                        <button
                          onClick={() => onOpenCitation(evaluation.citations[0], bid, evaluation)}
                          title="Inspect verbatim document snippet (FR5 Traceability < 2 Clicks)"
                          className="px-3 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-700" />
                          <span>Inspect Evidence</span>
                          <span className="text-[10px] bg-white text-stone-700 px-1.5 py-0.2 rounded font-mono border border-stone-200">
                            p.{evaluation.citations[0].page_number}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => onOpenOverride(bid, evaluation)}
                        title="Override verdict with mandatory GFR justification (FR6)"
                        className="px-2.5 py-1.5 rounded text-stone-600 hover:text-amber-900 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-xs font-serif transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Override</span>
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Officer Final Sign-Off Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center space-x-2.5">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base">Final Procurement Determination</h3>
              </div>
              <button onClick={() => setShowSignModal(false)} className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-[#FAF9F6] rounded border border-stone-200 space-y-1">
                <div>Bidder: <strong className="text-stone-900">{bid.bidder_name}</strong></div>
                <div>Overall Determination: <strong className="font-serif text-stone-900">{bid.overall_verdict}</strong></div>
                <div>Designated Officer: <strong>Rajesh Sharma (CPCL-PO-8812)</strong></div>
              </div>

              <div>
                <label className="block text-stone-800 font-serif font-bold mb-1">
                  Procurement Officer Ratification Rationale:
                </label>
                <textarea
                  rows={3}
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  className="w-full text-xs rounded border border-stone-300 p-2.5 text-stone-900 focus:outline-none focus:border-stone-500 font-sans"
                />
              </div>

              <div className="p-3 rounded bg-stone-50 border border-stone-200 text-stone-700 text-[11px] leading-relaxed">
                By ratifying this determination, the verdict will be signed under your official credentials and permanently recorded in the SHA-256 tamper-evident audit ledger.
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  onClick={() => setShowSignModal(false)}
                  className="px-4 py-2 rounded border border-stone-300 text-stone-700 hover:bg-stone-100 font-serif"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSign}
                  className="px-5 py-2 rounded bg-[#0B192C] hover:bg-[#132A4A] text-white font-serif font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Sign & Anchor to Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
