import React from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Sliders, 
  History, 
  Building2, 
  RotateCcw,
  LogIn,
  Layers,
  Award
} from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  setRole, 
  currentUser, 
  onOpenLogin, 
  tender, 
  hasSecurityAlert, 
  onResetData 
}) {
  const isCompany = currentUser?.type === "company";

  return (
    <header className="bg-[#0B192C] text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-sm font-sans">
      {/* Top Institutional Gazette Ribbon */}
      <div className="border-b border-slate-800/80 bg-[#081220] px-4 sm:px-6 py-1.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400">
        <div className="flex items-center space-x-2 font-serif">
          <span className="font-bold text-amber-500/90 tracking-wider uppercase">
            Government of India
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Ministry of Petroleum & Natural Gas</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-semibold">Chennai Petroleum Corporation Limited (CPCL)</span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-slate-400">PS ID: <strong className="text-slate-200">SIH26100</strong></span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">GeM Procurement Portal</span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            System Verified
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Classical Emblem & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded bg-[#132A4A] border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif font-bold text-lg text-white tracking-normal">
                GeM Bid Compliance Verification Platform
              </h1>
              <span className="text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                CPCL Manali
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Smart Automation • Explainable Verification, Officer Overrides & Contract Awarding
            </p>
          </div>
        </div>

        {/* Center: Logged-in Identity Indicator */}
        <div className="flex items-center bg-[#132A4A]/60 border border-slate-700/60 rounded-lg px-3.5 py-1.5 text-xs text-slate-300 space-x-3">
          {isCompany ? (
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Logged In (Company)</span>
                <span className="font-serif font-bold text-slate-100 max-w-[220px] truncate block">
                  {currentUser?.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Logged In (Console Officer)</span>
                <span className="font-serif font-bold text-slate-100 max-w-[220px] truncate block">
                  {currentUser?.name} ({currentUser?.id})
                </span>
              </div>
            </div>
          )}

          <div className="h-6 w-px bg-slate-700"></div>

          <button
            onClick={onOpenLogin}
            className="text-xs font-serif font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Switch Login</span>
          </button>
        </div>

        {/* Right: Role Navigation Buttons */}
        <div className="flex items-center space-x-2">
          
          <nav className="bg-[#10243E] p-1 rounded-lg border border-slate-700/80 flex items-center space-x-1">
            {isCompany ? (
              <button
                onClick={() => setRole("company")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs transition font-serif font-bold ${
                  currentRole === "company"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Company Bids & Upload</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setRole("officer_projects")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs transition font-serif font-bold ${
                    currentRole === "officer_projects"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-blue-700" />
                  <span>Projects & Award</span>
                </button>

                <button
                  onClick={() => setRole("officer_bids")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs transition font-serif font-bold ${
                    currentRole === "officer_bids"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>Bids Matrix</span>
                </button>
              </>
            )}

            {/* Admin Rules Tab */}
            <button
              onClick={() => setRole("admin")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs transition font-serif font-bold ${
                currentRole === "admin"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Rule Config</span>
            </button>

            {/* Auditor Ledger Tab */}
            <button
              onClick={() => setRole("auditor")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs transition font-serif font-bold ${
                currentRole === "auditor"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Ledger</span>
            </button>
          </nav>

          {/* Reset Demo State Button */}
          <button
            onClick={onResetData}
            title="Reset to default CPCL demo state"
            className="p-2 rounded-lg bg-[#10243E] text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
}
