import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Clock, 
  Layers,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export default function RegistryLookupDrawer({ registryStatus, bidderName, gstin, udyamNumber }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(registryStatus);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus(prev => ({
        ...prev,
        verified_at: new Date().toISOString()
      }));
    }, 500);
  };

  const isGstActive = status?.gst_status === "ACTIVE";
  const isUdyamValid = status?.udyam_valid;
  const isDebarred = status?.debarment_status?.includes("BLACKLISTED");

  return (
    <div className="bg-white rounded-xl border border-stone-300 shadow-sm p-5 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
              Central Regulatory Cross-Referencing
              <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono font-semibold border border-stone-200">
                FR11 Live API Mock
              </span>
            </h4>
            <p className="text-xs text-stone-500 font-sans">
              Live checks against GSTN, Ministry of MSME Udyam, and Central Debarment Watchlists
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-stone-300 text-xs font-serif font-bold text-stone-700 hover:bg-stone-50 transition disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-stone-900" : ""}`} />
          <span>{loading ? "Re-querying..." : "Re-query Registries"}</span>
        </button>
      </div>

      {/* 3 Classical Registry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-sans">
        
        {/* GSTN Registry */}
        <div className={`rounded-lg p-3.5 border transition ${
          isGstActive 
            ? "bg-[#FAF9F6] border-stone-200" 
            : "bg-rose-50/60 border-rose-200"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
              GSTN Portal API
            </span>
            <span className={`text-[10px] font-serif font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider border ${
              isGstActive ? "bg-emerald-50 text-emerald-900 border-emerald-200" : "bg-rose-50 text-rose-900 border-rose-200"
            }`}>
              {isGstActive ? <CheckCircle2 className="w-3 h-3 text-emerald-700" /> : <XCircle className="w-3 h-3 text-rose-700" />}
              {status?.gst_status || "UNKNOWN"}
            </span>
          </div>

          <div className="text-xs space-y-1 text-stone-700">
            <div>
              <span className="text-stone-400 block text-[10px] font-mono uppercase">Verified GSTIN:</span>
              <strong className="font-mono text-stone-900">{gstin || "N/A"}</strong>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] font-mono uppercase">Filing Compliance:</span>
              <span className={`font-semibold ${isGstActive ? "text-emerald-900" : "text-rose-900"}`}>
                {status?.gst_filing_compliance || "Regular"}
              </span>
            </div>
          </div>
        </div>

        {/* Udyam MSME Registry */}
        <div className="rounded-lg p-3.5 border bg-[#FAF9F6] border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
              Ministry of MSME Udyam
            </span>
            <span className={`text-[10px] font-serif font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider border ${
              isUdyamValid ? "bg-stone-100 text-stone-800 border-stone-300" : "bg-stone-100 text-stone-600 border-stone-200"
            }`}>
              {isUdyamValid ? <CheckCircle2 className="w-3 h-3 text-stone-700" /> : <Layers className="w-3 h-3 text-stone-400" />}
              {isUdyamValid ? "VERIFIED MSME" : "LARGE ENTERPRISE"}
            </span>
          </div>

          <div className="text-xs space-y-1 text-stone-700">
            <div>
              <span className="text-stone-400 block text-[10px] font-mono uppercase">Udyam Registration:</span>
              <strong className="font-mono text-stone-900">{udyamNumber || "Not Applicable"}</strong>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] font-mono uppercase">Classification:</span>
              <span className="font-semibold text-stone-900">
                {status?.enterprise_type || "Large Corporation"}
              </span>
            </div>
          </div>
        </div>

        {/* Central CPPP / GeM Debarment Watchlist */}
        <div className={`rounded-lg p-3.5 border transition ${
          !isDebarred 
            ? "bg-[#FAF9F6] border-stone-200" 
            : "bg-rose-50 border-rose-300"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
              Central Debarment Watch
            </span>
            <span className={`text-[10px] font-serif font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider border ${
              !isDebarred ? "bg-emerald-50 text-emerald-900 border-emerald-200" : "bg-rose-900 text-white border-rose-900"
            }`}>
              {!isDebarred ? <ShieldCheck className="w-3 h-3 text-emerald-700" /> : <ShieldAlert className="w-3 h-3 text-white" />}
              {!isDebarred ? "CLEAN RECORD" : "BLACKLISTED"}
            </span>
          </div>

          <div className="text-xs space-y-1 text-stone-700">
            <div>
              <span className="text-stone-400 block text-[10px] font-mono uppercase">Watchlist Status:</span>
              <span className={`font-semibold ${!isDebarred ? "text-emerald-900" : "text-rose-900"}`}>
                {status?.debarment_status || "Clean"}
              </span>
            </div>
            <div className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> Verified: {new Date(status?.verified_at || Date.now()).toLocaleTimeString()}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
