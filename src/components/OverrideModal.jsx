import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Lock, 
  FileCheck,
  ShieldCheck,
  Building
} from 'lucide-react';
import { OVERRIDE_REASON_CATEGORIES } from '../data/mockData';

export default function OverrideModal({ 
  isOpen, 
  onClose, 
  bid, 
  clause, 
  onConfirmOverride 
}) {
  if (!isOpen || !bid) return null;

  const isClauseOverride = Boolean(clause);
  const currentVerdict = isClauseOverride 
    ? (bid.evaluations?.find(e => e.clause_id === clause.clause_id)?.final_verdict || "REVIEW")
    : bid.overall_verdict;

  const [selectedVerdict, setSelectedVerdict] = useState(
    currentVerdict === "PASS" ? "REVIEW" : "PASS"
  );
  const [reasonCategory, setReasonCategory] = useState(OVERRIDE_REASON_CATEGORIES[0].id);
  const [justification, setJustification] = useState("");
  const [officerName, setOfficerName] = useState("Rajesh Sharma");
  const [officerId, setOfficerId] = useState("CPCL-PO-8812");
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!justification.trim() || justification.trim().length < 15) {
      setErrorMsg("Mandatory statutory justification must contain at least 15 characters.");
      return;
    }
    if (!confirmed) {
      setErrorMsg("You must confirm that this override is entered into the permanent audit ledger.");
      return;
    }

    onConfirmOverride({
      bid_id: bid.id,
      clause_id: isClauseOverride ? clause.clause_id : null,
      new_verdict: selectedVerdict,
      reason_category: reasonCategory,
      justification: justification.trim(),
      officer_name: officerName,
      officer_id: officerId
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        
        {/* Classical Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#132A4A] border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                {isClauseOverride ? `Statutory Override: ${clause.clause_code}` : "Overall Bid Determination Override"}
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                FR6 Protocol • Mandatory Justification & Immutable Ledger Signature
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          
          {/* Target Context Box */}
          <div className="bg-[#FAF9F6] border border-stone-200 rounded p-3.5 space-y-1.5 font-sans">
            <div className="flex justify-between">
              <span className="text-stone-500 font-mono uppercase text-[10px]">Bidder Entity:</span>
              <span className="font-serif font-bold text-stone-900">{bid.bidder_name}</span>
            </div>
            {isClauseOverride && (
              <div className="flex justify-between">
                <span className="text-stone-500 font-mono uppercase text-[10px]">Target Clause:</span>
                <span className="font-semibold text-stone-800">{clause.title}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-stone-200">
              <span className="text-stone-500 font-mono uppercase text-[10px]">Current Evaluation:</span>
              <span className="font-serif font-bold text-stone-800 uppercase tracking-wide">
                {currentVerdict}
              </span>
            </div>
          </div>

          {/* Overridden Verdict Selection */}
          <div>
            <label className="block text-xs font-serif font-bold text-stone-800 uppercase tracking-wide mb-1.5">
              Select Overridden Verdict:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["PASS", "REVIEW", "FAIL"].map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setSelectedVerdict(v)}
                  className={`py-2 text-xs font-serif font-bold rounded border transition uppercase tracking-wider ${
                    selectedVerdict === v
                      ? v === "PASS" ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
                        : v === "FAIL" ? "bg-rose-900 text-white border-rose-900 shadow-xs"
                        : "bg-amber-800 text-white border-amber-800 shadow-xs"
                      : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Statutory Category Dropdown */}
          <div>
            <label className="block text-xs font-serif font-bold text-stone-800 uppercase tracking-wide mb-1.5">
              Statutory Basis (GFR 2017 / Ministry Policy):
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full text-xs rounded border border-stone-300 p-2.5 bg-white text-stone-900 focus:outline-none focus:border-stone-500"
            >
              {OVERRIDE_REASON_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Justification Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-serif font-bold text-stone-800 uppercase tracking-wide">
                Officer Justification Rationale (Mandatory):
              </label>
              <span className={`text-[10px] font-mono ${
                justification.length < 15 ? "text-rose-700" : "text-emerald-800"
              }`}>
                {justification.length} / min 15 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
                setErrorMsg("");
              }}
              placeholder="e.g., MSME Certificate verified via Udyam portal; turnover relaxation granted under DPIIT Order F.No. 1(2)(1)/2016-MA. Engineering desk confirms technical capability."
              className="w-full text-xs rounded border border-stone-300 p-2.5 text-stone-900 focus:outline-none focus:border-stone-500"
            />
          </div>

          {/* Officer Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-serif font-bold text-stone-700 mb-1">
                Authorized Officer:
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full text-xs rounded border border-stone-300 p-2 bg-[#FAF9F6] text-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-serif font-bold text-stone-700 mb-1">
                Designation / ID:
              </label>
              <input
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                className="w-full text-xs rounded border border-stone-300 p-2 bg-[#FAF9F6] text-stone-900"
              />
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              id="confirm-override"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-stone-300 text-stone-900 focus:ring-0"
            />
            <label htmlFor="confirm-override" className="text-xs text-stone-600 leading-snug">
              I certify under official authority that this override is executed pursuant to Government procurement regulations and will be permanently anchored to the SHA-256 audit ledger.
            </label>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-xs text-rose-800 bg-rose-50 border border-rose-200 p-2 rounded flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-700" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-stone-300 text-xs font-serif font-bold text-stone-700 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-[#0B192C] hover:bg-[#132A4A] text-white text-xs font-serif font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              Confirm & Sign Override
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
