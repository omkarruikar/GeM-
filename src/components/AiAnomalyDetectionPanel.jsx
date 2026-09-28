import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function AiAnomalyDetectionPanel({ bid, onOpenCitation }) {
  const [filterSeverity, setFilterSeverity] = useState("ALL");

  if (!bid) return null;

  const anomalies = bid.ai_anomalies || [];
  const criticalCount = anomalies.filter(a => a.severity === "CRITICAL").length;
  const warningCount = anomalies.filter(a => a.severity === "WARNING").length;
  const advisoryCount = anomalies.filter(a => a.severity === "ADVISORY").length;

  const filtered = anomalies.filter(a => {
    if (filterSeverity === "CRITICAL") return a.severity === "CRITICAL";
    if (filterSeverity === "WARNING") return a.severity === "WARNING";
    if (filterSeverity === "ADVISORY") return a.severity === "ADVISORY";
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-stone-300 shadow-sm overflow-hidden font-sans space-y-0">
      
      {/* Header */}
      <div className="p-6 bg-[#FAF9F6] border-b border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider bg-stone-200 text-stone-800 px-2.5 py-0.5 rounded border border-stone-300">
                Feature 11
              </span>
              <span className="text-xs font-serif font-bold text-stone-600">
                AI Cross-Document Discrepancy & Inconsistency Engine
              </span>
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              AI Identified Inconsistencies, Gaps & Non-Compliances
            </h3>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              Multi-document semantic reasoning scans all uploaded PDFs, statutory certificates, and registry feeds to identify name mismatches, missing annexures, expired accreditations, and hidden prompt attacks.
            </p>
          </div>

          {/* Quick Counter Chips */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-lg text-center">
              <span className="text-[10px] font-mono uppercase text-rose-800 font-bold block">Critical</span>
              <span className="font-serif font-bold text-rose-900 text-lg">{criticalCount}</span>
            </div>
            <div className="bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg text-center">
              <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block">Warnings</span>
              <span className="font-serif font-bold text-amber-900 text-lg">{warningCount}</span>
            </div>
            <div className="bg-stone-100 border border-stone-300 px-3 py-1.5 rounded-lg text-center">
              <span className="text-[10px] font-mono uppercase text-stone-600 font-bold block">Advisories</span>
              <span className="font-serif font-bold text-stone-800 text-lg">{advisoryCount}</span>
            </div>
          </div>

        </div>

        {/* Severity Filter Bar */}
        <div className="flex items-center space-x-1.5 pt-4 mt-4 border-t border-stone-200 text-xs">
          <span className="text-stone-400 font-mono text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Severity:
          </span>
          {["ALL", "CRITICAL", "WARNING", "ADVISORY"].map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-3 py-1 rounded font-serif font-bold transition text-xs ${
                filterSeverity === s
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-300"
              }`}
            >
              {s} {s === "ALL" ? `(${anomalies.length})` : s === "CRITICAL" ? `(${criticalCount})` : s === "WARNING" ? `(${warningCount})` : `(${advisoryCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Anomalies List */}
      <div className="divide-y divide-stone-200 p-0">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-stone-500 font-serif">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
            <div className="font-bold text-stone-800">No Inconsistencies Detected in this Filter</div>
            <p className="text-xs font-sans text-stone-500 mt-1">
              Documents and statutory registrations pass cross-referencing checks.
            </p>
          </div>
        ) : (
          filtered.map((anomaly) => {
            const isCrit = anomaly.severity === "CRITICAL";
            const isWarn = anomaly.severity === "WARNING";

            return (
              <div 
                key={anomaly.id}
                className={`p-6 transition ${
                  isCrit ? "bg-rose-50/40" : isWarn ? "bg-amber-50/30" : "hover:bg-[#FBFBFA]"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  <div className="space-y-2 flex-1">
                    
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className={`px-2.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider text-[10px] border flex items-center gap-1 ${
                        isCrit 
                          ? "bg-rose-100 text-rose-950 border-rose-300" 
                          : isWarn 
                          ? "bg-amber-100 text-amber-950 border-amber-300" 
                          : "bg-stone-100 text-stone-800 border-stone-300"
                      }`}>
                        {isCrit && <ShieldAlert className="w-3 h-3 text-rose-700" />}
                        {isWarn && <AlertTriangle className="w-3 h-3 text-amber-700" />}
                        {!isCrit && !isWarn && <Info className="w-3 h-3 text-stone-500" />}
                        {anomaly.severity}
                      </span>

                      <span className="font-mono text-stone-400 text-[11px]">•</span>

                      <span className="font-mono text-stone-500 text-[11px] bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {anomaly.category}
                      </span>

                      <span className="font-mono text-stone-400 text-[11px]">•</span>

                      <span className="text-stone-600 font-sans text-[11px] flex items-center gap-1">
                        <FileText className="w-3 h-3 text-stone-400" />
                        Source: <strong>{anomaly.affected_document}</strong>
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-stone-900">
                      {anomaly.title}
                    </h4>

                    {/* Detailed AI Diagnostic */}
                    <div className="text-xs text-stone-800 leading-relaxed font-sans bg-white p-3.5 rounded-lg border border-stone-200">
                      {anomaly.description}
                    </div>

                    {/* Recommended Officer Remediation */}
                    <div className="flex items-start gap-2 text-xs font-sans text-stone-700 pt-1">
                      <span className="font-serif font-bold text-stone-900 shrink-0 flex items-center gap-1">
                        <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
                        AI Recommended Action:
                      </span>
                      <span className="text-stone-800 font-medium">
                        {anomaly.recommendation}
                      </span>
                    </div>

                  </div>

                  {/* Status Stamp */}
                  <div className="shrink-0 text-right">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">Diagnostic Status</span>
                    <span className="font-mono text-xs font-bold text-stone-800 px-2.5 py-1 rounded bg-stone-100 border border-stone-300 inline-block mt-1">
                      {anomaly.status}
                    </span>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
