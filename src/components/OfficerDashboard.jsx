import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  ShieldAlert, 
  Search, 
  Building2, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  Sparkles,
  FileCheck2,
  Lock,
  Layers,
  Database
} from 'lucide-react';
import { RISK_LEVEL_CONFIG } from '../data/mockData';

export default function OfficerDashboard({ 
  tender, 
  bidders, 
  onSelectBid, 
  onOpenReport, 
  onOpenOverride 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const passCount = bidders.filter(b => b.overall_verdict === "PASS").length;
  const reviewCount = bidders.filter(b => b.overall_verdict === "REVIEW").length;
  const failCount = bidders.filter(b => b.overall_verdict === "FAIL").length;
  const securityThreatCount = bidders.filter(b => b.security_alert).length;

  const filteredBidders = bidders.filter(b => {
    const matchesSearch = b.bidder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.pan && b.pan.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (filterTab === "PASS" && b.overall_verdict !== "PASS") return false;
    if (filterTab === "REVIEW" && b.overall_verdict !== "REVIEW") return false;
    if (filterTab === "FAIL" && b.overall_verdict !== "FAIL") return false;

    if (riskFilter !== "ALL" && b.risk_level !== riskFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Executive Tender Overview Card - Classical Institutional Styling */}
      <div className="bg-white rounded-xl border border-stone-300 shadow-sm p-6 sm:p-7 relative overflow-hidden">
        
        {/* Subtle decorative gold top-accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#854D0E]/80"></div>

        <div className="space-y-5">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-stone-200">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-300">
                  {tender.tender_number}
                </span>
                <span className="text-stone-400">•</span>
                <span className="font-serif font-bold text-stone-700">
                  {tender.organization}
                </span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500 font-sans">{tender.division}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight leading-snug">
                {tender.title}
              </h2>
            </div>

            {/* Tender Value Box */}
            <div className="bg-[#FAF9F6] border border-stone-200 rounded-lg p-3 sm:text-right shrink-0 min-w-[200px]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
                Estimated Tender Value
              </span>
              <span className="text-2xl font-serif font-bold text-stone-900">
                ₹ {(tender.estimated_value_inr / 10000000).toFixed(2)} Crores
              </span>
              <span className="text-[11px] text-stone-600 block mt-0.5">
                EMD: ₹ {(tender.emd_amount_inr / 100000).toFixed(2)} L (Exempt for MSME)
              </span>
            </div>
          </div>

          {/* Key Platform Capability Highlights - Classical Banner with 14 Points */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-semibold mb-2">
              Automated 14-Point Bid Verification & Regulatory Gateway:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="bg-[#FBFBFA] border border-stone-200 rounded-lg p-2.5 flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-300">
                  <Database className="w-3.5 h-3.5 text-[#854D0E]" />
                </div>
                <div className="overflow-hidden">
                  <span className="font-semibold text-xs text-stone-900 block truncate">10 Government Portals</span>
                  <span className="text-[10px] text-stone-500 block truncate">GSTN, Udyam, PAN 206AB, EPFO, ESIC</span>
                </div>
              </div>

              <div className="bg-[#FBFBFA] border border-stone-200 rounded-lg p-2.5 flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-300">
                  <Sparkles className="w-3.5 h-3.5 text-stone-700" />
                </div>
                <div className="overflow-hidden">
                  <span className="font-semibold text-xs text-stone-900 block truncate">AI Inconsistency Detector</span>
                  <span className="text-[10px] text-stone-500 block truncate">Missing Docs, Aliases, UDIN Gaps</span>
                </div>
              </div>

              <div className="bg-[#FBFBFA] border border-stone-200 rounded-lg p-2.5 flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                </div>
                <div className="overflow-hidden">
                  <span className="font-semibold text-xs text-stone-900 block truncate">Compliance Score & Risk</span>
                  <span className="text-[10px] text-stone-500 block truncate">Weighted 4-Quadrant Scoring</span>
                </div>
              </div>

              <div className="bg-[#FBFBFA] border border-stone-200 rounded-lg p-2.5 flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-300">
                  <Lock className="w-3.5 h-3.5 text-stone-700" />
                </div>
                <div className="overflow-hidden">
                  <span className="font-semibold text-xs text-stone-900 block truncate">SHA-256 Chained Ledger</span>
                  <span className="text-[10px] text-stone-500 block truncate">Immutable Auditable Dossier</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Summary KPI Cards Grid - Restrained Classical Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Total Ingested Bids */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-serif font-bold text-stone-500 uppercase tracking-wider block">
              Total Ingested Bids
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              {bidders.length}
            </div>
            <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
              100% Document Extracted
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
            <Layers className="w-5 h-5 text-stone-600" />
          </div>
        </div>

        {/* Compliant Bids */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-serif font-bold text-stone-500 uppercase tracking-wider block">
              Compliant (PASS)
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 mt-1">
              {passCount}
            </div>
            <span className="text-[10px] text-emerald-800 font-mono mt-0.5 block">
              L&T Petrochem Systems (L1)
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        {/* Officer Review Required */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-serif font-bold text-stone-500 uppercase tracking-wider block">
              Officer Review (REVIEW)
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 mt-1">
              {reviewCount}
            </div>
            <span className="text-[10px] text-amber-800 font-mono mt-0.5 block">
              Delta Flowtech (MSME waiver)
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        {/* Non-Compliant / Adversarial */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-serif font-bold text-stone-500 uppercase tracking-wider block">
              Disqualified / Threat
            </span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-rose-900 mt-1">
              {failCount}
            </div>
            <span className="text-[10px] text-rose-800 font-mono mt-0.5 block">
              {securityThreatCount} Prompt Injection Blocked
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center border border-rose-200">
            <ShieldAlert className="w-5 h-5 text-rose-700" />
          </div>
        </div>

      </div>

      {/* Bid Evaluation Matrix Listing - Clean Dossier Design */}
      <div className="bg-white rounded-xl border border-stone-300 shadow-sm overflow-hidden">
        
        {/* Table Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {[
              { id: "ALL", label: `All Submissions (${bidders.length})` },
              { id: "PASS", label: `Compliant (${passCount})` },
              { id: "REVIEW", label: `Pending Review (${reviewCount})` },
              { id: "FAIL", label: `Disqualified (${failCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-serif transition ${
                  filterTab === tab.id
                    ? "bg-[#0B192C] text-white font-bold shadow-xs"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search bidder, GSTIN, PAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded border border-stone-300 bg-white focus:outline-none focus:border-stone-500 font-sans"
            />
          </div>

        </div>

        {/* Bidders Dossier Rows */}
        <div className="divide-y divide-stone-200">
          {filteredBidders.map((b) => {
            const isThreat = Boolean(b.security_alert);
            const isSigned = b.officer_sign_off;
            const riskKey = b.risk_level || "LOW_RISK";
            const riskInfo = RISK_LEVEL_CONFIG[riskKey] || RISK_LEVEL_CONFIG.LOW_RISK;

            return (
              <div 
                key={b.id}
                className="p-5 hover:bg-[#FBFBFA] transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                
                {/* Left: Bidder Information & Risk Badge */}
                <div className="space-y-2 flex-1">
                  
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {b.id}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="font-mono text-stone-700">GSTIN: {b.gstin}</span>
                    <span className="text-stone-300">•</span>
                    <span className="font-serif text-stone-600 text-[11px]">
                      {b.bidder_type_label || b.bidder_type}
                    </span>

                    {/* Risk Level Badge */}
                    <span className={`text-[10px] font-serif font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${riskInfo.bg} ${riskInfo.text} ${riskInfo.border}`}>
                      {riskKey === "LOW_RISK" && <ShieldCheck className="w-3 h-3 text-emerald-700" />}
                      {riskKey === "MODERATE_RISK" && <AlertTriangle className="w-3 h-3 text-amber-700" />}
                      {riskKey === "HIGH_RISK" && <ShieldAlert className="w-3 h-3 text-rose-700" />}
                      {riskKey === "CRITICAL_RISK" && <Lock className="w-3 h-3 text-purple-700" />}
                      {riskInfo.label}
                    </span>

                    {/* Government Portals Status */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1">
                      <Database className="w-3 h-3 text-stone-500" />
                      {b.id === "BID-001-LT" ? "10/10 Registries Verified" :
                       b.id === "BID-002-DELTA" ? "MSME Udyam Validated" :
                       b.id === "BID-003-APEX" ? "Suspended GST / Debarred" : "Prompt Injection Quarantined"}
                    </span>

                    {isThreat && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-rose-700" />
                        ADVERSARIAL INJECTION INTERCEPTED
                      </span>
                    )}

                    {isSigned && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        OFFICER RATIFIED
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {b.bidder_name}
                  </h3>

                  {/* Per-Clause Breakdown Badges (Traceability Preview) */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold mr-1">
                      Evaluated Clauses:
                    </span>
                    {b.evaluations?.map(ev => (
                      <span
                        key={ev.clause_id}
                        title={`${ev.clause_code}: ${ev.title} - ${ev.final_verdict}`}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border flex items-center gap-1 ${
                          ev.final_verdict === "PASS" ? "bg-emerald-50/70 text-emerald-900 border-emerald-200" :
                          ev.final_verdict === "FAIL" ? "bg-rose-50/70 text-rose-900 border-rose-200" :
                          "bg-amber-50/70 text-amber-900 border-amber-200"
                        }`}
                      >
                        {ev.clause_code}
                        <span className="font-bold">
                          {ev.final_verdict === "PASS" && "✓"}
                          {ev.final_verdict === "FAIL" && "✗"}
                          {ev.final_verdict === "REVIEW" && "!"}
                        </span>
                      </span>
                    ))}
                  </div>

                </div>

                {/* Right: Readiness Score & Action Button */}
                <div className="flex items-center space-x-4 shrink-0 justify-between lg:justify-end">
                  
                  {/* Readiness Score */}
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">Compliance</span>
                    <span className="text-xl font-serif font-bold text-stone-900">
                      {b.compliance_score}%
                    </span>
                  </div>

                  {/* Verdict Stamp */}
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded text-xs font-serif font-bold uppercase tracking-wider inline-flex items-center gap-1.5 border ${
                      b.overall_verdict === "PASS" ? "bg-emerald-50 text-emerald-900 border-emerald-300" :
                      b.overall_verdict === "FAIL" ? "bg-rose-50 text-rose-900 border-rose-300" :
                      "bg-amber-50 text-amber-900 border-amber-300"
                    }`}>
                      {b.overall_verdict === "PASS" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                      {b.overall_verdict === "FAIL" && <XCircle className="w-3.5 h-3.5 text-rose-700" />}
                      {b.overall_verdict === "REVIEW" && <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />}
                      {b.overall_verdict}
                    </span>
                  </div>

                  {/* Primary Call to Action Button */}
                  <button
                    onClick={() => onSelectBid(b)}
                    className="px-4 py-2 rounded bg-[#0B192C] hover:bg-[#132A4A] text-white text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Inspect & Verify</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
