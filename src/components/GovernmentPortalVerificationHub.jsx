import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  FileCheck2, 
  Lock, 
  ExternalLink, 
  Database,
  Code2,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Award,
  Users,
  FileSpreadsheet
} from 'lucide-react';

export default function GovernmentPortalVerificationHub({ 
  bid, 
  onRefreshRegistries 
}) {
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  if (!bid) return null;

  const verifications = bid.portal_verifications || [];

  const handleRunVerification = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onRefreshRegistries) {
        onRefreshRegistries(bid.id);
      }
    }, 750);
  };

  const toggleExpand = (portalId) => {
    setExpandedCards(prev => ({
      ...prev,
      [portalId]: !prev[portalId]
    }));
  };

  const filteredVerifications = verifications.filter(v => {
    if (filter === "VERIFIED") return v.status === "ACTIVE_VERIFIED";
    if (filter === "FLAGGED") return v.status === "FLAGGED" || v.status === "SUSPENDED";
    if (filter === "EXEMPTED") return v.status === "EXEMPTED";
    return true;
  });

  const verifiedCount = verifications.filter(v => v.status === "ACTIVE_VERIFIED").length;
  const flaggedCount = verifications.filter(v => v.status === "FLAGGED" || v.status === "SUSPENDED").length;
  const exemptedCount = verifications.filter(v => v.status === "EXEMPTED").length;

  return (
    <div className="bg-white rounded-xl border border-stone-300 shadow-sm overflow-hidden font-sans space-y-0">
      
      {/* Top Banner Header */}
      <div className="p-6 bg-[#FAF9F6] border-b border-stone-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider bg-stone-200 text-stone-800 px-2.5 py-0.5 rounded border border-stone-300">
                Features 1, 2, 3, 4, 6, 7, 8, 9
              </span>
              <span className="text-xs font-serif font-bold text-stone-600">
                Central Government Automated Verification Hub
              </span>
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900 tracking-tight">
              10 Integrated Central Portals & Regulatory Registries
            </h3>
            <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
              Automated multi-database cross-referencing: GSTN, Udyam MSME, Income Tax PAN/206AB, EPFO, ESIC, Startup India, NSIC, OEM Master, DigiLocker, and Central Debarment Watchlists.
            </p>
          </div>

          {/* Action Button & Live Latency Indicator */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">Gateway Status</span>
              <span className="text-xs font-mono font-bold text-emerald-800 flex items-center justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                REST Adapters 100% Online
              </span>
            </div>

            <button
              onClick={handleRunVerification}
              disabled={loading}
              className="px-4 py-2 rounded bg-[#0B192C] hover:bg-[#132A4A] text-white text-xs font-serif font-bold transition flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-300" : ""}`} />
              <span>{loading ? "Cross-Querying Portals..." : "Re-Query All 10 Registries"}</span>
            </button>
          </div>

        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-5 border-t border-stone-200 mt-5 text-xs">
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded font-serif text-xs font-bold transition ${
                filter === "ALL" 
                  ? "bg-stone-900 text-white" 
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-300"
              }`}
            >
              All Central Portals ({verifications.length})
            </button>
            <button
              onClick={() => setFilter("VERIFIED")}
              className={`px-3 py-1 rounded font-serif text-xs font-bold transition ${
                filter === "VERIFIED" 
                  ? "bg-emerald-800 text-white" 
                  : "bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-300"
              }`}
            >
              Verified / Compliant ({verifiedCount})
            </button>
            <button
              onClick={() => setFilter("FLAGGED")}
              className={`px-3 py-1 rounded font-serif text-xs font-bold transition ${
                filter === "FLAGGED" 
                  ? "bg-rose-900 text-white" 
                  : "bg-white text-rose-900 hover:bg-rose-50 border border-rose-300"
              }`}
            >
              Alerts / Defaulters ({flaggedCount})
            </button>
            <button
              onClick={() => setFilter("EXEMPTED")}
              className={`px-3 py-1 rounded font-serif text-xs font-bold transition ${
                filter === "EXEMPTED" 
                  ? "bg-stone-700 text-white" 
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-300"
              }`}
            >
              Exempted / Large Corp ({exemptedCount})
            </button>
          </div>

          <div className="text-[11px] font-mono text-stone-500">
            Target Bidder: <strong className="text-stone-900 font-serif">{bid.bidder_name}</strong>
          </div>
        </div>
      </div>

      {/* Grid of Central Portals Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
        {filteredVerifications.map((v) => {
          const isPass = v.status === "ACTIVE_VERIFIED";
          const isFail = v.status === "FLAGGED" || v.status === "SUSPENDED";
          const isExempt = v.status === "EXEMPTED";
          const isExpanded = expandedCards[v.portal_id];

          return (
            <div 
              key={v.portal_id}
              className={`rounded-xl border transition-all p-4 flex flex-col justify-between ${
                isFail 
                  ? "bg-rose-50/40 border-rose-300 ring-1 ring-rose-200" 
                  : isPass 
                  ? "bg-[#FAF9F6] border-stone-300 hover:border-stone-400" 
                  : "bg-stone-50/70 border-stone-200 text-stone-700"
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-200">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                      {v.ministry}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      {v.name}
                    </h4>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-serif font-bold uppercase tracking-wider flex items-center gap-1 border shrink-0 ${
                    isPass 
                      ? "bg-emerald-50 text-emerald-900 border-emerald-300" 
                      : isFail 
                      ? "bg-rose-100 text-rose-950 border-rose-300 font-mono" 
                      : "bg-stone-100 text-stone-700 border-stone-300"
                  }`}>
                    {isPass && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                    {isFail && <ShieldAlert className="w-3 h-3 text-rose-700" />}
                    {isExempt && <Layers className="w-3 h-3 text-stone-500" />}
                    {v.badge}
                  </span>
                </div>

                {/* Technical Gateway Metrics */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-stone-500 py-2 border-b border-stone-100">
                  <div>
                    <span className="text-stone-400 block uppercase">Query Latency:</span>
                    <span className="text-stone-800 font-semibold">{v.latency_ms} ms</span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-400 block uppercase">Gateway Tx ID:</span>
                    <span className="text-stone-800 font-semibold truncate block" title={v.tx_id}>{v.tx_id}</span>
                  </div>
                </div>

                {/* Key Extracted Details */}
                <div className="py-2.5 text-xs text-stone-800 space-y-1.5 font-sans">
                  {Object.entries(v.details || {}).map(([key, val]) => (
                    <div key={key} className="flex items-start justify-between gap-2">
                      <span className="text-stone-500 text-[11px] capitalize font-mono shrink-0">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className={`text-right font-semibold text-[11px] break-words ${
                        typeof val === 'boolean' 
                          ? (val ? 'text-emerald-800' : 'text-stone-600') 
                          : String(val).includes('SUSPENDED') || String(val).includes('NON-COMPLIANT') || String(val).includes('ALERT') || String(val).includes('BLACKLIST')
                          ? 'text-rose-900 font-bold font-mono'
                          : 'text-stone-900'
                      }`}>
                        {typeof val === 'boolean' ? (val ? 'Yes / Confirmed' : 'No') : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Signature & Payload Inspector */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] font-mono text-stone-500 mt-2">
                <span className="truncate max-w-[170px]" title={`SHA-256 Sign: ${v.signature_hash}`}>
                  Sig: {v.signature_hash?.slice(0, 16)}...
                </span>

                <button
                  onClick={() => setSelectedPayload({ name: v.name, endpoint: v.endpoint, ...v })}
                  className="px-2 py-0.5 rounded border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-serif font-bold flex items-center gap-1 transition shadow-2xs"
                >
                  <Code2 className="w-3 h-3 text-stone-600" />
                  <span>Inspect API Payload</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Raw Payload Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-2xl overflow-hidden animate-in fade-in duration-100 font-sans">
            
            <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center space-x-2.5">
                <Database className="w-4 h-4 text-amber-400" />
                <h4 className="font-serif font-bold text-sm">
                  Government Gateway Response: {selectedPayload.name}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedPayload(null)}
                className="text-stone-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-[#FAF9F6] rounded border border-stone-200 text-stone-700 font-mono text-[11px] space-y-1">
                <div>Endpoint: <strong className="text-stone-900">{selectedPayload.endpoint}</strong></div>
                <div>Status: <span className="font-bold text-emerald-800">{selectedPayload.status}</span> • Latency: {selectedPayload.latency_ms}ms</div>
                <div>Tx Reference: {selectedPayload.tx_id}</div>
                <div>Verified Timestamp: {selectedPayload.verified_at}</div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-500 font-bold mb-1">
                  Cryptographically Signed JSON Response Payload:
                </label>
                <pre className="p-4 bg-stone-900 text-emerald-400 rounded-lg text-[11px] font-mono overflow-x-auto max-h-72 border border-stone-800">
                  {JSON.stringify(selectedPayload, null, 2)}
                </pre>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedPayload(null)}
                  className="px-4 py-2 rounded bg-stone-900 text-white font-serif font-bold text-xs hover:bg-stone-800"
                >
                  Close Gateway Inspector
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
