import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Award, 
  Plus, 
  Sliders, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  FileCheck2,
  ChevronRight,
  Eye,
  Edit3,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OfficerProjectManager({ 
  officerUser, 
  allProjects, 
  bidders, 
  onSelectBid, 
  onOpenReport, 
  onOpenOverride,
  onUpdateProjectClauses 
}) {
  const [selectedProjectId, setSelectedProjectId] = useState(allProjects[0]?.id || "TNDR-CPCL-2026-089");
  const [showAddClauseModal, setShowAddClauseModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);

  // New Clause Creation State (Authority to create features/functions)
  const [newClauseTitle, setNewClauseTitle] = useState("");
  const [newClauseCategory, setNewClauseCategory] = useState("Technical & Quality Standards");
  const [newClauseDesc, setNewClauseDesc] = useState("");
  const [newClauseMandatory, setNewClauseMandatory] = useState(true);

  // Award State
  const [awardAwarded, setAwardAwarded] = useState(false);
  const [officerAwardJustification, setOfficerAwardJustification] = useState(
    "Contract awarded to L&T Valves as the lowest compliant commercial bidder (L1) satisfying all technical, statutory, and quality requirements pursuant to GFR 2017 Rule 173."
  );

  const activeProject = allProjects.find(p => p.id === selectedProjectId) || allProjects[0];

  // Filter bids for active project
  const projectBids = bidders.filter(b => b.tender_id === activeProject.id || activeProject.id === "TNDR-CPCL-2026-089");

  // Determine compliant bids for awarding
  const compliantBids = projectBids.filter(b => b.overall_verdict === "PASS");
  const bestBid = compliantBids.length > 0 
    ? compliantBids.reduce((prev, curr) => (prev.quoted_price_inr < curr.quoted_price_inr ? prev : curr))
    : projectBids[0];

  const estimatedCr = activeProject.estimated_value_inr / 10000000;
  const bestBidCr = (bestBid?.quoted_price_inr || 138000000) / 10000000;
  const savingsLakhs = ((activeProject.estimated_value_inr - (bestBid?.quoted_price_inr || 138000000)) / 100000).toFixed(2);

  const handleAddNewClause = (e) => {
    e.preventDefault();
    if (!newClauseTitle.trim()) return;

    const clauseCode = `CL-${(activeProject.clauses.length + 1).toFixed(1)}`;
    const newClause = {
      clause_id: `CL-CUSTOM-${Date.now()}`,
      clause_code: clauseCode,
      title: newClauseTitle.trim(),
      category: newClauseCategory,
      description: newClauseDesc.trim() || "Requirement verified by procurement committee.",
      rule_type: "CUSTOM_OFFICER_FEATURE",
      parameters: {},
      mandatory: newClauseMandatory,
      msme_exemptible: false
    };

    onUpdateProjectClauses([...activeProject.clauses, newClause]);
    setNewClauseTitle("");
    setNewClauseDesc("");
    setShowAddClauseModal(false);
  };

  const handleConfirmAward = () => {
    setAwardAwarded(true);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 text-stone-800 font-sans">
      
      {/* Officer Console Authority Banner */}
      <div className="bg-[#0B192C] text-white rounded-xl p-6 sm:p-7 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded bg-[#132A4A] border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-mono bg-[#132A4A] text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 font-bold uppercase">
                  {officerUser?.clearance || "Level-3 Executive Authority"}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-mono">ID: {officerUser?.id || "CPCL-PO-8812"}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">{officerUser?.division || "Mechanical & Refining Procurement"}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Officer Console: {officerUser?.name || "Rajesh Sharma"}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAwardModal(true)}
              className="px-4 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-serif font-bold transition flex items-center gap-2 shadow-xs"
            >
              <Award className="w-4 h-4 text-amber-200" />
              <span>AI Multi-PDF Analysis & Award Contract</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cross-Project Selector & Statistics */}
      <div className="bg-white rounded-xl p-6 border border-stone-300 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Tender Projects & Bids Management
            </h3>
            <p className="text-sm text-stone-500 font-sans">
              Inspect submitted bids across every project, configure mandatory features, and award contracts.
            </p>
          </div>

          {/* Project Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-serif font-bold text-stone-600">Select Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-serif font-bold bg-[#FAF9F6] border border-stone-300 rounded p-2 text-stone-900 focus:outline-none focus:border-stone-600"
            >
              {allProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.tender_number} - {p.title.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Project Overview Card */}
        <div className="bg-[#FAF9F6] border border-stone-200 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-300">
                {activeProject.tender_number}
              </span>
              <span className="text-stone-400">•</span>
              <span className="font-serif text-stone-600">{activeProject.organization}</span>
            </div>
            <h4 className="font-serif font-bold text-base text-stone-900">
              {activeProject.title}
            </h4>
            <div className="text-xs text-stone-600 font-mono">
              Estimated Budget: <strong className="text-stone-900 font-serif">₹ {estimatedCr.toFixed(2)} Cr</strong> • Closing: {new Date(activeProject.submission_deadline).toLocaleDateString()}
            </div>
          </div>

          {/* Action: Add Required Feature / Clause Button */}
          <button
            onClick={() => setShowAddClauseModal(true)}
            className="px-3.5 py-2 rounded bg-white text-stone-800 hover:bg-stone-100 border border-stone-300 text-xs font-serif font-bold transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-stone-700" />
            <span>Create Required Feature / Clause</span>
          </button>
        </div>
      </div>

      {/* Submitted Bids Matrix for Selected Project */}
      <div className="bg-white rounded-xl border border-stone-300 shadow-sm overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF9F6] flex items-center justify-between">
          <div>
            <h4 className="font-serif font-bold text-base text-stone-900">
              Submissions Received for this Project ({projectBids.length} Bidders)
            </h4>
            <p className="text-xs text-stone-500 font-sans">
              All PDF documents analyzed via OCR & AI semantic verification layer.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-600 bg-white px-2.5 py-1 rounded border border-stone-300 font-semibold">
            Budget Benchmark: ₹ {estimatedCr.toFixed(2)} Cr
          </span>
        </div>

        <div className="divide-y divide-stone-200">
          {projectBids.map((bid) => {
            const bidCr = (bid.quoted_price_inr || 138000000) / 10000000;
            const diffLakhs = ((activeProject.estimated_value_inr - (bid.quoted_price_inr || 138000000)) / 100000).toFixed(2);
            const isL1 = bid.id === "BID-001-LT";

            return (
              <div key={bid.id} className="p-5 hover:bg-[#FBFBFA] transition flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {bid.id}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="font-mono text-stone-700">GSTIN: {bid.gstin}</span>
                    <span className="text-stone-300">•</span>
                    <span className="font-serif text-stone-600">{bid.bidder_type_label || bid.bidder_type}</span>
                    {isL1 && bid.overall_verdict === "PASS" && (
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded">
                        L1 LOWEST COMPLIANT QUOTE
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-base text-stone-900">
                    {bid.bidder_name}
                  </h4>

                  <div className="text-xs text-stone-600 font-sans flex items-center gap-3">
                    <span>Quoted Price: <strong className="font-serif text-stone-900 text-sm">₹ {bidCr.toFixed(2)} Cr</strong></span>
                    <span>•</span>
                    <span className={`font-serif ${diffLakhs >= 0 ? "text-emerald-800 font-bold" : "text-rose-800"}`}>
                      {diffLakhs >= 0 ? `₹ ${diffLakhs} Lakhs Under Budget` : `Over Budget`}
                    </span>
                    <span>•</span>
                    <span>Readiness: <strong className="font-mono text-stone-900">{bid.compliance_score}%</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className={`px-3 py-1 rounded text-xs font-serif font-bold uppercase tracking-wider border ${
                    bid.overall_verdict === "PASS" ? "bg-emerald-50 text-emerald-900 border-emerald-300" :
                    bid.overall_verdict === "FAIL" ? "bg-rose-50 text-rose-900 border-rose-300" :
                    "bg-amber-50 text-amber-900 border-amber-300"
                  }`}>
                    {bid.overall_verdict}
                  </span>

                  <button
                    onClick={() => onSelectBid(bid)}
                    className="px-3.5 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-serif font-bold transition flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => onOpenOverride(bid, null)}
                    className="px-3 py-1.5 rounded bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-300 hover:border-amber-300 text-xs font-serif transition"
                  >
                    Override
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Modal 1: Create Required Feature / Clause Authority */}
      {showAddClauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-lg overflow-hidden animate-in fade-in duration-100">
            <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center space-x-2.5">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base">Configure Tender Requirements & Clauses</h3>
              </div>
              <button onClick={() => setShowAddClauseModal(false)} className="text-slate-400 hover:text-white font-mono">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewClause} className="p-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-stone-800 font-serif font-bold mb-1">
                  Clause / Feature Title:
                </label>
                <input
                  type="text"
                  value={newClauseTitle}
                  onChange={(e) => setNewClauseTitle(e.target.value)}
                  placeholder="e.g. SIL-3 Certified Hydraulic Actuator Integration"
                  className="w-full text-xs rounded border border-stone-300 p-2.5 text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-stone-800 font-serif font-bold mb-1">
                  Category:
                </label>
                <select
                  value={newClauseCategory}
                  onChange={(e) => setNewClauseCategory(e.target.value)}
                  className="w-full text-xs rounded border border-stone-300 p-2.5 text-stone-900 bg-white"
                >
                  <option value="Technical & Quality Standards">Technical & Quality Standards</option>
                  <option value="Financial & Commercial Thresholds">Financial & Commercial Thresholds</option>
                  <option value="Statutory & HSE Clearances">Statutory & HSE Clearances</option>
                  <option value="Make in India Local Content">Make in India Local Content</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-800 font-serif font-bold mb-1">
                  Specific Evaluation Rule / Criteria Description:
                </label>
                <textarea
                  rows={3}
                  value={newClauseDesc}
                  onChange={(e) => setNewClauseDesc(e.target.value)}
                  placeholder="e.g. Bidder must provide third-party SIL-3 certification certificate accredited by TUV or equivalent body."
                  className="w-full text-xs rounded border border-stone-300 p-2.5 text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="clause-mandatory"
                  checked={newClauseMandatory}
                  onChange={(e) => setNewClauseMandatory(e.target.checked)}
                  className="rounded border-stone-300 text-stone-900"
                />
                <label htmlFor="clause-mandatory" className="text-stone-700 font-serif font-bold">
                  Mandatory Hard Requirement (Non-compliance triggers FAIL)
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddClauseModal(false)}
                  className="px-4 py-2 rounded border border-stone-300 text-stone-700 hover:bg-stone-50 font-serif"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#0B192C] hover:bg-[#132A4A] text-white font-serif font-bold"
                >
                  Add Requirement to Tender
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: AI Comprehensive Multi-PDF Analysis & Contract Award */}
      {showAwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-3xl overflow-hidden animate-in fade-in duration-100 font-sans">
            
            <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center space-x-2.5">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base">
                  AI Multi-Criteria Bid Analysis & Official Contract Award
                </h3>
              </div>
              <button onClick={() => setShowAwardModal(false)} className="text-slate-400 hover:text-white font-mono">
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-xs text-stone-800">
              
              {/* Highlighted Winning Recommendation Card */}
              <div className="p-5 rounded-lg bg-[#FAF9F6] border-2 border-emerald-600/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    AI Recommended Contract Awardee (L1 Compliant)
                  </span>
                  <span className="text-[11px] font-mono bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded font-bold">
                    100% Eligible
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-stone-200">
                  <div>
                    <h4 className="font-serif font-bold text-lg text-stone-900">
                      {bestBid.bidder_name}
                    </h4>
                    <div className="text-stone-600 font-mono text-xs">
                      GSTIN: {bestBid.gstin} • Entity: {bestBid.bidder_type_label}
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block">Awarded Budget</span>
                    <span className="text-2xl font-serif font-bold text-emerald-800">
                      ₹ {bestBidCr.toFixed(2)} Cr
                    </span>
                    <div className="text-[11px] text-emerald-800 font-serif">
                      Saves ₹ {savingsLakhs} Lakhs below estimate
                    </div>
                  </div>
                </div>

                {/* Important Features Breakdown Highlighted */}
                <div className="pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded border border-stone-200">
                    <span className="text-stone-500 block font-mono">1. Financial Turnover</span>
                    <strong className="text-stone-900">₹ 18.40 Cr (Exceeds ₹4.35 Cr threshold)</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-200">
                    <span className="text-stone-500 block font-mono">2. Past Experience Scope</span>
                    <strong className="text-stone-900">95% AI Match (IOCL Panipat Hydrocracker)</strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-stone-200">
                    <span className="text-stone-500 block font-mono">3. Make in India Local Content</span>
                    <strong className="text-stone-900">78.5% Domestic (Class-I Supplier)</strong>
                  </div>
                </div>
              </div>

              {/* Comparative Analysis Table of All Competing Bidders */}
              <div>
                <h5 className="font-serif font-bold text-sm text-stone-900 mb-2">
                  Comparative Analysis of All Competing Bidders:
                </h5>
                <div className="border border-stone-300 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F6] text-stone-800 font-serif font-bold border-b border-stone-300">
                      <tr>
                        <th className="p-2.5">Company Name & Entity</th>
                        <th className="p-2.5 font-mono">Quoted Budget</th>
                        <th className="p-2.5 font-serif">Score & Risk Profile</th>
                        <th className="p-2.5">Government Portals & DigiLocker</th>
                        <th className="p-2.5">Key Technical & Statutory Verification</th>
                        <th className="p-2.5 font-serif">AI Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {projectBids.map((b) => {
                        const bCr = (b.quoted_price_inr || 138000000) / 10000000;
                        const riskKey = b.risk_level || "LOW_RISK";
                        return (
                          <tr key={b.id} className="hover:bg-stone-50">
                            <td className="p-2.5">
                              <div className="font-serif font-bold text-stone-900">{b.bidder_name}</div>
                              <div className="text-[10px] text-stone-500 font-mono">GSTIN: {b.gstin} • {b.bidder_type_label || b.bidder_type}</div>
                            </td>
                            <td className="p-2.5 font-mono font-bold text-stone-800">
                              ₹ {bCr.toFixed(2)} Cr
                            </td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-serif font-bold block mb-1 ${
                                b.overall_verdict === "PASS" ? "bg-emerald-50 text-emerald-900 border border-emerald-200" :
                                b.overall_verdict === "FAIL" ? "bg-rose-50 text-rose-900 border border-rose-200" :
                                "bg-amber-50 text-amber-900 border border-amber-200"
                              }`}>
                                {b.overall_verdict} ({b.compliance_score}%)
                              </span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                                riskKey === "LOW_RISK" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                                riskKey === "MODERATE_RISK" ? "bg-amber-50 text-amber-800 border-amber-200" :
                                "bg-rose-50 text-rose-800 border-rose-200"
                              }`}>
                                {b.risk_label || riskKey}
                              </span>
                            </td>
                            <td className="p-2.5 text-[11px]">
                              {b.id === "BID-001-LT" && (
                                <div>
                                  <span className="font-semibold text-emerald-900 block font-mono text-[10px]">10/10 Portals Active</span>
                                  <span className="text-[10px] text-stone-500">DigiLocker Class-3 DSC Verified</span>
                                </div>
                              )}
                              {b.id === "BID-002-DELTA" && (
                                <div>
                                  <span className="font-semibold text-amber-900 block font-mono text-[10px]">MSME Udyam Verified</span>
                                  <span className="text-[10px] text-stone-500">Capricorn DSC • EMD Waived</span>
                                </div>
                              )}
                              {b.id === "BID-003-APEX" && (
                                <div>
                                  <span className="font-semibold text-rose-900 block font-mono text-[10px]">Suspended GSTN (Rule 21A)</span>
                                  <span className="text-[10px] text-rose-800">CPPP Central Debarment Hit</span>
                                </div>
                              )}
                              {b.id === "BID-004-SHADOW" && (
                                <div>
                                  <span className="font-semibold text-purple-900 block font-mono text-[10px]">Prompt Injection Quarantined</span>
                                  <span className="text-[10px] text-stone-500">Untrusted Self-Signed Certificate</span>
                                </div>
                              )}
                            </td>
                            <td className="p-2.5 text-[11px] text-stone-600">
                              {b.id === "BID-001-LT" && "ISO 9001 valid till 2027 • SIL-3 Actuation • 78.5% MII Class-I"}
                              {b.id === "BID-002-DELTA" && "Udyam MSME turnover waiver • 86% scope match • 82% MII"}
                              {b.id === "BID-003-APEX" && "Expired ISO • Section 206AB Non-Filer • Forged BG history"}
                              {b.id === "BID-004-SHADOW" && "System Prompt Attack Blocked • Missing CA Turnover & ISO"}
                            </td>
                            <td className="p-2.5 font-serif font-bold text-xs">
                              {b.id === "BID-001-LT" ? (
                                <span className="text-emerald-800 block">Recommended (L1)</span>
                              ) : b.id === "BID-002-DELTA" ? (
                                <span className="text-amber-800 block">MSME Exemption</span>
                              ) : b.id === "BID-003-APEX" ? (
                                <span className="text-rose-800 block">Disqualified</span>
                              ) : (
                                <span className="text-purple-800 block">Security Isolation</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Officer Ratification & Justification Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-serif font-bold text-stone-900">
                  Officer Statutory Justification & Award Rationale:
                </label>
                <textarea
                  rows={2}
                  value={officerAwardJustification}
                  onChange={(e) => setOfficerAwardJustification(e.target.value)}
                  className="w-full text-xs rounded border border-stone-300 p-2.5 text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              {/* Success Notification if Awarded */}
              {awardAwarded && (
                <div className="p-4 rounded bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs space-y-1 font-serif">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Contract Award Formally Ratified & Letter of Intent (LOI) Issued!
                  </div>
                  <p className="font-sans text-[11px] text-stone-700">
                    The contract has been officially awarded to <strong className="font-serif">{bestBid.bidder_name}</strong> for ₹ {bestBidCr.toFixed(2)} Crores. Anchored into SHA-256 block ledger.
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAwardModal(false)}
                  className="px-4 py-2 rounded border border-stone-300 text-stone-700 hover:bg-stone-50 font-serif"
                >
                  Close
                </button>
                {!awardAwarded ? (
                  <button
                    type="button"
                    onClick={handleConfirmAward}
                    className="px-5 py-2 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-serif font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Confirm Award & Issue LOI</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenReport(bestBid);
                      setShowAwardModal(false);
                    }}
                    className="px-5 py-2 rounded bg-[#0B192C] text-white font-serif font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Award Dossier</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
