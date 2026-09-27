import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Mail, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { SAMPLE_COMPANIES, SAMPLE_OFFICERS } from '../data/mockData';

export default function DualLoginModal({ 
  isOpen, 
  onClose, 
  onLoginCompany, 
  onLoginOfficer, 
  currentUser 
}) {
  const [activeTab, setActiveTab] = useState("company"); // "company" | "officer"

  // Company Form State
  const [companyName, setCompanyName] = useState("Larsen & Toubro Limited - Valve Division");
  const [companyGstin, setCompanyGstin] = useState("33AAACL1972K1Z9");
  const [companyEmail, setCompanyEmail] = useState("procurement@lntvalves.com");
  const [companyError, setCompanyError] = useState("");
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);

  // Officer Form State
  const [officerEmail, setOfficerEmail] = useState("officer.sharma@cpcl.gov.in");
  const [officerPassword, setOfficerPassword] = useState("admin@cpcl2026");
  const [showPassword, setShowPassword] = useState(false);
  const [officerError, setOfficerError] = useState("");
  const [isAuthenticatingOfficer, setIsAuthenticatingOfficer] = useState(false);

  if (!isOpen) return null;

  // Handle Company Submission
  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setCompanyError("Please provide the legal name of the company.");
      return;
    }
    if (!companyGstin.trim() || companyGstin.trim().length < 10) {
      setCompanyError("Please provide a valid 15-character GSTIN number.");
      return;
    }
    if (!companyEmail.trim() || !companyEmail.includes("@")) {
      setCompanyError("Please provide a valid official business email address.");
      return;
    }

    setCompanyError("");
    setIsVerifyingGst(true);

    // Simulate GSTN Central Portal Verification check
    setTimeout(() => {
      setIsVerifyingGst(false);
      onLoginCompany({
        type: "company",
        name: companyName.trim(),
        gstin: companyGstin.trim().toUpperCase(),
        email: companyEmail.trim()
      });
      onClose();
    }, 450);
  };

  // Handle Officer Submission
  const handleOfficerSubmit = (e) => {
    e.preventDefault();
    if (!officerEmail.trim() || !officerEmail.includes("@")) {
      setOfficerError("Please enter a valid government email ID.");
      return;
    }
    if (!officerPassword.trim() || officerPassword.length < 4) {
      setOfficerError("Please enter your console authorization password.");
      return;
    }

    setOfficerError("");
    setIsAuthenticatingOfficer(true);

    setTimeout(() => {
      setIsAuthenticatingOfficer(false);
      const matched = SAMPLE_OFFICERS.find(o => o.email.toLowerCase() === officerEmail.toLowerCase()) || SAMPLE_OFFICERS[0];
      onLoginOfficer({
        type: "officer",
        name: matched.name,
        id: matched.id,
        email: matched.email,
        division: matched.division,
        role: matched.role,
        clearance: matched.clearance
      });
      onClose();
    }, 450);
  };

  const handleQuickFillCompany = (sample) => {
    setCompanyName(sample.name);
    setCompanyGstin(sample.gstin);
    setCompanyEmail(sample.email);
    setCompanyError("");
  };

  const handleQuickFillOfficer = (officer) => {
    setOfficerEmail(officer.email);
    setOfficerPassword("admin@cpcl2026");
    setOfficerError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        
        {/* Top Header - Classical Institutional Style */}
        <div className="bg-[#0B192C] text-white p-6 border-b border-stone-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded bg-[#132A4A] border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  GeM Electronic Procurement Portal Access
                </h3>
                <p className="text-xs text-slate-300 font-sans">
                  Ministry of Petroleum & Natural Gas • Central Tender Gateway
                </p>
              </div>
            </div>

            {currentUser && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white text-xs font-serif font-bold px-2.5 py-1 rounded border border-slate-700 bg-slate-800"
              >
                Close
              </button>
            )}
          </div>

          {/* Dual Login Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-5 bg-[#081220] p-1.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab("company")}
              className={`py-2 px-3 rounded text-sm font-serif font-bold transition flex items-center justify-center gap-2 ${
                activeTab === "company"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>1. Company / Bidder Login</span>
            </button>

            <button
              onClick={() => setActiveTab("officer")}
              className={`py-2 px-3 rounded text-sm font-serif font-bold transition flex items-center justify-center gap-2 ${
                activeTab === "officer"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCheck className="w-4 h-4 text-blue-700" />
              <span>2. Console Officer Login</span>
            </button>
          </div>
        </div>

        {/* Tab Content 1: Company Login */}
        {activeTab === "company" && (
          <form onSubmit={handleCompanySubmit} className="p-6 sm:p-7 space-y-4 font-sans text-stone-800">
            
            <div className="bg-[#FAF9F6] border border-stone-200 p-3 rounded text-xs text-stone-600 leading-relaxed font-sans">
              <strong className="text-stone-900 font-serif">Enterprise Access Notice:</strong> After validating your GSTIN and business credentials, you can inspect all open tenders, download tender specifications, and upload submission PDFs for evaluation.
            </div>

            {/* Box 1: Company Legal Name */}
            <div>
              <label className="block text-sm font-serif font-bold text-stone-900 mb-1">
                Name of the Company:
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Larsen & Toubro Limited - Valve Division"
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded border border-stone-300 focus:outline-none focus:border-stone-600 font-sans"
                />
              </div>
            </div>

            {/* Box 2: GSTIN Number */}
            <div>
              <label className="block text-sm font-serif font-bold text-stone-900 mb-1">
                GSTIN Number (15-digit Tax Identification):
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={companyGstin}
                  onChange={(e) => setCompanyGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 33AAACL1972K1Z9"
                  maxLength={15}
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded border border-stone-300 font-mono uppercase focus:outline-none focus:border-stone-600 tracking-wider"
                />
              </div>
            </div>

            {/* Box 3: Email Address */}
            <div>
              <label className="block text-sm font-serif font-bold text-stone-900 mb-1">
                Official Business Email Address:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="e.g. procurement@lntvalves.com"
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded border border-stone-300 focus:outline-none focus:border-stone-600 font-sans"
                />
              </div>
            </div>

            {/* Quick Demo Pre-fill Chips */}
            <div className="pt-1">
              <span className="text-xs font-serif font-bold text-stone-500 uppercase block mb-1.5">
                Quick Sample Bidders:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_COMPANIES.map((sample) => (
                  <button
                    type="button"
                    key={sample.gstin}
                    onClick={() => handleQuickFillCompany(sample)}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1 rounded border border-stone-300 font-sans transition"
                  >
                    {sample.name.split(' - ')[0]} ({sample.category})
                  </button>
                ))}
              </div>
            </div>

            {companyError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{companyError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifyingGst}
              className="w-full py-3 bg-[#0B192C] hover:bg-[#132A4A] text-white rounded text-sm font-serif font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isVerifyingGst ? (
                <span>Validating with GSTN Registry...</span>
              ) : (
                <>
                  <span>Verify Credentials & Enter Company Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab Content 2: Console Officer Login */}
        {activeTab === "officer" && (
          <form onSubmit={handleOfficerSubmit} className="p-6 sm:p-7 space-y-4 font-sans text-stone-800">
            
            <div className="bg-[#FAF9F6] border border-stone-200 p-3 rounded text-xs text-stone-600 leading-relaxed font-sans">
              <strong className="text-stone-900 font-serif">Procurement Console Authority:</strong> Certified officers can inspect bids across all refinery projects, create/configure required clause functions, run AI multi-pdf analysis, and award contracts based on budget and technical evaluation.
            </div>

            {/* Box 1: Email Address */}
            <div>
              <label className="block text-sm font-serif font-bold text-stone-900 mb-1">
                Official Government Email Address:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={officerEmail}
                  onChange={(e) => setOfficerEmail(e.target.value)}
                  placeholder="e.g. officer.sharma@cpcl.gov.in"
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded border border-stone-300 focus:outline-none focus:border-stone-600 font-sans"
                />
              </div>
            </div>

            {/* Box 2: Password */}
            <div>
              <label className="block text-sm font-serif font-bold text-stone-900 mb-1">
                Secure Console Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={officerPassword}
                  onChange={(e) => setOfficerPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-sm pl-9 pr-10 py-2.5 rounded border border-stone-300 focus:outline-none focus:border-stone-600 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Pre-fill Chips for Officers */}
            <div className="pt-1">
              <span className="text-xs font-serif font-bold text-stone-500 uppercase block mb-1.5">
                Authorized Officer Profiles:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_OFFICERS.map((officer) => (
                  <button
                    type="button"
                    key={officer.id}
                    onClick={() => handleQuickFillOfficer(officer)}
                    className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1 rounded border border-stone-300 font-sans transition"
                  >
                    {officer.name} ({officer.id})
                  </button>
                ))}
              </div>
            </div>

            {officerError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{officerError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticatingOfficer}
              className="w-full py-3 bg-[#0B192C] hover:bg-[#132A4A] text-white rounded text-sm font-serif font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isAuthenticatingOfficer ? (
                <span>Authenticating Security Credentials...</span>
              ) : (
                <>
                  <span>Authenticate & Launch Officer Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
