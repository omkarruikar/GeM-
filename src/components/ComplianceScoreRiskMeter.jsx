import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Award, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  Lock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { RISK_LEVEL_CONFIG } from '../data/mockData';

export default function ComplianceScoreRiskMeter({ bid }) {
  if (!bid) return null;

  const score = bid.compliance_score || 0;
  const riskKey = bid.risk_level || (score >= 85 ? "LOW_RISK" : score >= 60 ? "MODERATE_RISK" : "HIGH_RISK");
  const riskInfo = RISK_LEVEL_CONFIG[riskKey] || RISK_LEVEL_CONFIG.LOW_RISK;

  const breakdown = bid.score_breakdown || {
    statutory: score >= 85 ? 98 : score >= 60 ? 90 : 30,
    financial_tax: score >= 85 ? 95 : score >= 60 ? 80 : 35,
    technical_experience: score >= 85 ? 96 : score >= 60 ? 84 : 25,
    integrity_policy: score >= 85 ? 98 : score >= 60 ? 90 : 20
  };

  const getShieldIcon = () => {
    switch (riskKey) {
      case "LOW_RISK":
        return <ShieldCheck className="w-5 h-5 text-emerald-700" />;
      case "MODERATE_RISK":
        return <AlertTriangle className="w-5 h-5 text-amber-700" />;
      case "HIGH_RISK":
        return <ShieldAlert className="w-5 h-5 text-rose-700" />;
      default:
        return <Lock className="w-5 h-5 text-purple-700" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-300 shadow-sm p-6 font-sans space-y-5">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-800 px-2 py-0.5 rounded border border-stone-300">
              Feature 12
            </span>
            <span className="font-serif font-bold text-xs text-stone-600">
              Multi-Dimensional Risk Determination Engine
            </span>
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900 mt-0.5">
            Overall Compliance Score & Risk Profile
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-stone-500">Confidence Rating:</span>
          <span className="font-mono font-bold text-xs bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200">
            99.2% Deterministic + AI
          </span>
        </div>
      </div>

      {/* Main Meter Grid: Score on Left, 4-Quadrant Bars on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Score & Risk Badge (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-xl bg-[#FAF9F6] border border-stone-300 text-center space-y-3">
          
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">
            Composite Compliance Index
          </span>

          <div className="relative flex items-center justify-center">
            {/* Visual Ring Gauge */}
            <div className="w-28 h-28 rounded-full border-8 border-stone-200 flex items-center justify-center relative shadow-inner bg-white">
              <div 
                className="absolute inset-0 rounded-full border-8 border-transparent"
                style={{
                  borderTopColor: riskKey === "LOW_RISK" ? "#047857" : riskKey === "MODERATE_RISK" ? "#b45309" : "#be123c",
                  borderRightColor: score >= 50 ? (riskKey === "LOW_RISK" ? "#047857" : riskKey === "MODERATE_RISK" ? "#b45309" : "#be123c") : "transparent",
                  transform: `rotate(${Math.min(360, (score / 100) * 360)}deg)`,
                  transition: "transform 1s ease"
                }}
              />
              <div className="text-center z-10">
                <span className="text-3xl font-serif font-bold text-stone-900 block leading-none">
                  {score}%
                </span>
                <span className="text-[10px] font-mono text-stone-400 block mt-1 uppercase">Readiness</span>
              </div>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className={`w-full py-2 px-3 rounded-lg border flex items-center justify-center gap-2 font-serif font-bold text-xs tracking-wider uppercase ${riskInfo.bg} ${riskInfo.text} ${riskInfo.border}`}>
            {getShieldIcon()}
            <span>{riskInfo.label}</span>
          </div>

          <p className="text-[11px] text-stone-500 leading-snug font-sans max-w-xs">
            {riskInfo.description}
          </p>

        </div>

        {/* 4-Quadrant Dimension Breakdown (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="text-xs font-serif font-bold text-stone-800 flex items-center justify-between pb-1 border-b border-stone-100">
            <span>Core Evaluation Dimensions (25% Weight Each):</span>
            <span className="font-mono text-stone-500 text-[11px]">Weighted Cumulative Score</span>
          </div>

          {/* Dim 1: Statutory & Registrations */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-stone-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                1. Statutory Registrations & Portals (25%)
              </span>
              <span className="font-mono font-bold text-stone-900">{breakdown.statutory}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
              <div 
                className={`h-full transition-all duration-700 ${breakdown.statutory >= 85 ? 'bg-emerald-700' : breakdown.statutory >= 60 ? 'bg-amber-600' : 'bg-rose-600'}`} 
                style={{ width: `${breakdown.statutory}%` }} 
              />
            </div>
            <span className="text-[10px] text-stone-500 font-sans block">
              GSTN Active, Udyam MSME validity, EPFO, ESIC, and MCA incorporation checks.
            </span>
          </div>

          {/* Dim 2: Financial & Tax */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-stone-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                2. Financial Turnover & Tax Compliance (25%)
              </span>
              <span className="font-mono font-bold text-stone-900">{breakdown.financial_tax}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
              <div 
                className={`h-full transition-all duration-700 ${breakdown.financial_tax >= 85 ? 'bg-emerald-700' : breakdown.financial_tax >= 60 ? 'bg-amber-600' : 'bg-rose-600'}`} 
                style={{ width: `${breakdown.financial_tax}%` }} 
              />
            </div>
            <span className="text-[10px] text-stone-500 font-sans block">
              Audited 3-year turnover, ICAI UDIN verification, and Section 206AB tax return compliance.
            </span>
          </div>

          {/* Dim 3: Technical Experience */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-stone-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                3. Technical Capability & Past Experience (25%)
              </span>
              <span className="font-mono font-bold text-stone-900">{breakdown.technical_experience}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
              <div 
                className={`h-full transition-all duration-700 ${breakdown.technical_experience >= 85 ? 'bg-emerald-700' : breakdown.technical_experience >= 60 ? 'bg-amber-600' : 'bg-rose-600'}`} 
                style={{ width: `${breakdown.technical_experience}%` }} 
              />
            </div>
            <span className="text-[10px] text-stone-500 font-sans block">
              Work order values, SIL-3 actuator scope match, and ISO 9001:2015 quality standards.
            </span>
          </div>

          {/* Dim 4: Integrity & Make in India */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-stone-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                4. Integrity, Make in India & Policy Compliance (25%)
              </span>
              <span className="font-mono font-bold text-stone-900">{breakdown.integrity_policy}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
              <div 
                className={`h-full transition-all duration-700 ${breakdown.integrity_policy >= 85 ? 'bg-emerald-700' : breakdown.integrity_policy >= 60 ? 'bg-amber-600' : 'bg-rose-600'}`} 
                style={{ width: `${breakdown.integrity_policy}%` }} 
              />
            </div>
            <span className="text-[10px] text-stone-500 font-sans block">
              Central CPPP debarment clearance, Class-I MII % (min 50%), and GFR Rule 144(xi) land border declaration.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
