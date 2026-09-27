import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Sparkles, 
  UploadCloud, 
  Building
} from 'lucide-react';

export default function BidderPortal({ tender, bidders, onSelectBidder }) {
  const [selectedBidderId, setSelectedBidderId] = useState(bidders[0]?.id || "BID-001-LT");
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null);

  const activeBid = bidders.find(b => b.id === selectedBidderId) || bidders[0];

  const handleSimulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setUploadFeedback("Pre-submission verification report generated based on GeM tender requirements.");
    }, 500);
  };

  const passClauses = activeBid?.evaluations?.filter(e => e.final_verdict === "PASS") || [];
  const reviewClauses = activeBid?.evaluations?.filter(e => e.final_verdict === "REVIEW") || [];
  const failClauses = activeBid?.evaluations?.filter(e => e.final_verdict === "FAIL") || [];

  return (
    <div className="space-y-6">
      
      {/* Header Banner - Classical Dignified Style */}
      <div className="bg-[#0B192C] text-white rounded-xl p-6 sm:p-7 border border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#132A4A] border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h2 className="font-serif font-bold text-xl text-white tracking-tight">
              Bidder Self-Verification & Pre-Check Portal
            </h2>
            <span className="text-[10px] bg-stone-800 text-stone-300 px-2.5 py-0.5 rounded font-mono border border-stone-700">
              Transparency & Guidance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans leading-relaxed">
            Eliminating arbitrary disqualifications. Review tender eligibility readiness, identify deficient statutory certificates, and receive clear advice prior to final bid submission.
          </p>
        </div>

        {/* Bidder Switcher */}
        <div className="bg-[#132A4A]/80 p-2 rounded-lg border border-slate-700 flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Active Bidder:</span>
          <select
            value={selectedBidderId}
            onChange={(e) => {
              setSelectedBidderId(e.target.value);
              setUploadFeedback(null);
            }}
            className="bg-[#0B192C] text-white border border-slate-700 rounded px-2.5 py-1 text-xs font-serif font-bold focus:outline-none"
          >
            {bidders.map(b => (
              <option key={b.id} value={b.id}>
                {b.bidder_name} ({b.overall_verdict})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Upload Exhibits (Left) + Gap Advisory (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        
        {/* Left Side: Uploaded Documents Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-stone-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone-700" />
                Submitted Exhibit Package ({activeBid?.documents?.length || 0} Files)
              </h3>
              <span className="text-[11px] font-mono text-stone-500">
                GSTIN: {activeBid?.gstin}
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {activeBid?.documents?.map(doc => (
                <div key={doc.id} className="p-3 rounded bg-[#FAF9F6] border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <div className="w-7 h-7 rounded bg-stone-100 border border-stone-300 text-stone-700 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-serif font-bold text-stone-900 truncate" title={doc.name}>
                        {doc.name}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {doc.file_size_kb} KB • {doc.page_count} Pages • OCR: {(doc.ocr_confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white text-stone-700 px-2 py-0.5 rounded border border-stone-200 shrink-0">
                    {doc.doc_type?.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>

            {/* Re-Analyze Button */}
            <button
              onClick={handleSimulateAnalysis}
              disabled={analyzing}
              className="w-full py-2.5 rounded bg-[#0B192C] hover:bg-[#132A4A] text-white font-serif font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${analyzing ? "animate-spin" : ""}`} />
              <span>{analyzing ? "Evaluating Compliance..." : "Run AI Pre-Submission Verification"}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Readiness Score & Actionable Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Readiness Score Card */}
          <div className="bg-white rounded-xl p-6 border border-stone-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-stone-400 uppercase tracking-wider block">
                Preliminary Tender Eligibility Readiness
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
                {activeBid?.bidder_name}
              </h3>
              <p className="text-xs text-stone-600 mt-0.5 font-sans">
                Evaluation against tender: <strong className="font-mono text-stone-800">{tender?.tender_number}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-5 shrink-0">
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-stone-900">
                  {activeBid.compliance_score}%
                </div>
                <span className="text-[10px] font-mono font-semibold text-stone-500 uppercase">
                  Readiness
                </span>
              </div>
              <div className={`px-3 py-1 rounded text-xs font-serif font-bold uppercase tracking-wider border ${
                activeBid.overall_verdict === "PASS" ? "bg-emerald-50 text-emerald-900 border-emerald-300" :
                activeBid.overall_verdict === "REVIEW" ? "bg-amber-50 text-amber-900 border-amber-300" :
                "bg-rose-50 text-rose-900 border-rose-300"
              }`}>
                {activeBid.overall_verdict}
              </div>
            </div>
          </div>

          {/* Actionable Gap Analysis */}
          <div className="bg-white rounded-xl p-6 border border-stone-300 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-sm text-stone-900 pb-2 border-b border-stone-200 flex items-center justify-between">
              <span>Actionable Gap Advisory (Pre-Deadline Recommendations)</span>
              <span className="text-xs text-stone-500 font-mono font-normal">
                {failClauses.length} Deficiencies • {reviewClauses.length} Ambiguities
              </span>
            </h4>

            {failClauses.length === 0 && reviewClauses.length === 0 ? (
              <div className="p-4 rounded bg-[#FAF9F6] border border-emerald-300 text-stone-800 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-serif font-bold text-stone-900">All Eligibility Criteria Satisfied!</div>
                  <div className="text-stone-600 mt-0.5">
                    Your submission documents conform with high confidence to all financial, technical, statutory, and quality clauses.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Critical Failures */}
                {failClauses.map(clause => (
                  <div key={clause.clause_id} className="p-3.5 rounded bg-rose-50/50 border border-rose-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-serif font-bold text-rose-950">
                      <span className="flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-700" />
                        Deficiency in {clause.clause_code}: {clause.title}
                      </span>
                      <span className="text-[10px] bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-mono border border-rose-200">
                        ACTION REQUIRED
                      </span>
                    </div>
                    <p className="text-stone-700 text-[11px] font-sans">
                      {clause.reasoning}
                    </p>
                  </div>
                ))}

                {/* Ambiguous Review Items */}
                {reviewClauses.map(clause => (
                  <div key={clause.clause_id} className="p-3.5 rounded bg-amber-50/50 border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-serif font-bold text-amber-950">
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-700" />
                        Review Note for {clause.clause_code}: {clause.title}
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono border border-amber-200">
                        CLARIFICATION ELIGIBLE
                      </span>
                    </div>
                    <p className="text-stone-700 text-[11px] font-sans">
                      {clause.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
