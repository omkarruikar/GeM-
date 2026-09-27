import React, { useState } from 'react';
import { 
  Sliders, 
  Settings, 
  Save, 
  CheckCircle2, 
  Layers, 
  Sparkles
} from 'lucide-react';

export default function RuleConfigurator({ tender, onUpdateClauses }) {
  const [clauses, setClauses] = useState(tender?.clauses || []);
  const [category, setCategory] = useState("REFINERY_EQUIPMENT_CRITICAL");
  const [turnoverPercent, setTurnoverPercent] = useState(30);
  const [msmeExemptionEnabled, setMsmeExemptionEnabled] = useState(true);
  const [aiSemanticEnabled, setAiSemanticEnabled] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  const categories = [
    { id: "REFINERY_EQUIPMENT_CRITICAL", label: "Refinery Valves & Critical Equipment (CPCL)" },
    { id: "PETROCHEM_EPC", label: "Petrochemical Pipeline EPC & Commissioning" },
    { id: "IT_CYBERSECURITY", label: "IT Infrastructure & SCADA Cybersecurity" },
    { id: "CIVIL_WORKS", label: "Civil Infrastructure & Tank Farm Construction" }
  ];

  const handleToggleClauseMandatory = (clauseId) => {
    setClauses(prev => prev.map(c => 
      c.clause_id === clauseId ? { ...c, mandatory: !c.mandatory } : c
    ));
  };

  const handleToggleMsmeExempt = (clauseId) => {
    setClauses(prev => prev.map(c => 
      c.clause_id === clauseId ? { ...c, msme_exemptible: !c.msme_exemptible } : c
    ));
  };

  const handleSaveAndReevaluate = () => {
    const updatedClauses = clauses.map(c => {
      if (c.rule_type === "FINANCIAL_TURNOVER_MIN") {
        const minVal = (tender.estimated_value_inr * (turnoverPercent / 100));
        return {
          ...c,
          msme_exemptible: msmeExemptionEnabled,
          parameters: {
            ...c.parameters,
            min_turnover_inr: minVal
          }
        };
      }
      if (c.rule_type === "PAST_EXPERIENCE_ORDERS") {
        return {
          ...c,
          ai_semantic_check_enabled: aiSemanticEnabled
        };
      }
      return c;
    });

    onUpdateClauses(updatedClauses);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-stone-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-700">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="font-serif font-bold text-xl text-stone-900 tracking-tight">
              Configurable Rule Sets per Tender Category
            </h2>
            <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono font-semibold border border-stone-200">
              FR10 Admin Engine
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl font-sans">
            Configure deterministic clause evaluation parameters, threshold multipliers, and AI semantic tolerance per procurement category.
          </p>
        </div>

        <button
          onClick={handleSaveAndReevaluate}
          className="px-5 py-2.5 bg-[#0B192C] hover:bg-[#132A4A] text-white rounded text-xs font-serif font-bold transition flex items-center justify-center gap-2 shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save & Batch Re-Evaluate Bids</span>
        </button>
      </div>

      {savedNotification && (
        <div className="bg-[#FAF9F6] border border-emerald-300 text-emerald-950 rounded-lg px-4 py-3 text-xs flex items-center justify-between animate-in fade-in duration-150 font-sans">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold">
              Rule set updated! All 4 bidder submissions were automatically re-evaluated through the rule engine.
            </span>
          </div>
          <span className="text-[10px] font-mono text-stone-500">Audit event recorded</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        
        {/* Left Column: Category & Global Thresholds */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-stone-300 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-200">
              <Layers className="w-4 h-4 text-stone-700" />
              Tender Category Preset
            </h3>

            <div>
              <label className="block text-xs font-serif font-bold text-stone-800 mb-1">
                Select Active Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs rounded border border-stone-300 p-2.5 bg-white text-stone-900 focus:outline-none focus:border-stone-500"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Turnover Threshold Slider */}
            <div className="pt-2 border-t border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-serif font-bold text-stone-800">
                  Annual Turnover Threshold (% of Tender):
                </label>
                <span className="text-xs font-mono font-bold text-stone-900">
                  {turnoverPercent}% (₹ {((tender.estimated_value_inr * (turnoverPercent / 100)) / 10000000).toFixed(2)} Cr)
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                step="5"
                value={turnoverPercent}
                onChange={(e) => setTurnoverPercent(Number(e.target.value))}
                className="w-full accent-stone-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-0.5">
                <span>20% (₹2.90 Cr)</span>
                <span>30% Standard</span>
                <span>60% (₹8.70 Cr)</span>
              </div>
            </div>

            {/* Policy Toggles */}
            <div className="pt-2 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-serif font-bold text-stone-800 block">
                    MSME Policy Relaxation
                  </span>
                  <span className="text-[11px] text-stone-500 font-sans">
                    Waive turnover/prior exp as per DoE OM / GeM
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={msmeExemptionEnabled}
                  onChange={(e) => setMsmeExemptionEnabled(e.target.checked)}
                  className="rounded text-stone-900 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-serif font-bold text-stone-800 block">
                    AI Semantic Scope Matcher
                  </span>
                  <span className="text-[11px] text-stone-500 font-sans">
                    Evaluate technical equivalence for work orders
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={aiSemanticEnabled}
                  onChange={(e) => setAiSemanticEnabled(e.target.checked)}
                  className="rounded text-stone-900 w-4 h-4"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Per-Clause Deterministic Rule Matrix */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-xl p-5 border border-stone-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-stone-700" />
                Active Clause Trees & Rule Parameters ({clauses.length} Clauses)
              </h3>
              <span className="text-xs text-stone-500 font-mono">JSON Logic Tree</span>
            </div>

            <div className="divide-y divide-stone-200">
              {clauses.map((clause) => (
                <div key={clause.clause_id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {clause.clause_code}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-stone-900">{clause.title}</h4>
                      <span className="text-[10px] text-stone-500 font-sans">({clause.category})</span>
                    </div>
                    <p className="text-xs text-stone-600 max-w-xl font-sans">
                      {clause.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                      <span>Engine: {clause.rule_type}</span>
                      {clause.ai_semantic_check_enabled && (
                        <span className="text-stone-800 font-semibold">• AI Semantic Enabled</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleToggleClauseMandatory(clause.clause_id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-serif font-bold border transition ${
                        clause.mandatory 
                          ? "bg-rose-50 text-rose-900 border-rose-200" 
                          : "bg-stone-100 text-stone-600 border-stone-200"
                      }`}
                    >
                      {clause.mandatory ? "Mandatory" : "Optional"}
                    </button>
                    {clause.msme_exemptible !== undefined && (
                      <button
                        onClick={() => handleToggleMsmeExempt(clause.clause_id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-serif font-bold border transition ${
                          clause.msme_exemptible 
                            ? "bg-emerald-50 text-emerald-900 border-emerald-200" 
                            : "bg-stone-100 text-stone-500 border-stone-200"
                        }`}
                      >
                        {clause.msme_exemptible ? "MSME Exemptible" : "No Waiver"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
