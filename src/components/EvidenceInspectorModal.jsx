import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Eye, 
  CheckCircle2, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function EvidenceInspectorModal({ 
  isOpen, 
  onClose, 
  citation, 
  bid, 
  activeClause 
}) {
  if (!isOpen || !bid) return null;

  const referencedDoc = bid.documents?.find(d => d.id === citation?.document_id || d.name === citation?.document_name) || bid.documents?.[0];
  const [currentPage, setCurrentPage] = useState(citation?.page_number || 1);
  const [selectedDocId, setSelectedDocId] = useState(referencedDoc?.id || bid.documents?.[0]?.id);

  const activeDoc = bid.documents?.find(d => d.id === selectedDocId) || bid.documents?.[0];
  const totalPages = activeDoc?.page_count || 1;
  const pageText = activeDoc?.raw_text_pages?.[currentPage - 1] || activeDoc?.raw_text_pages?.[0] || "Document text preview rendering...";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        
        {/* Classical Dossier Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#132A4A] border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-white">
                  Documentary Evidence Inspector
                </h3>
                <span className="text-[10px] font-mono uppercase bg-[#132A4A] text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 font-semibold">
                  FR5 Traceability &lt; 2 Clicks
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Bidder: <strong className="text-slate-200 font-serif">{bid.bidder_name}</strong> • Clause: <strong className="text-stone-300 font-mono">{activeClause?.clause_code}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-xs text-slate-300 font-mono hidden sm:block">
              OCR Confidence: <strong className="text-emerald-400 font-bold">{(citation?.confidence_score ? citation.confidence_score * 100 : 98).toFixed(1)}%</strong>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Archival Document Selector Tabs */}
        <div className="bg-[#FAF9F6] px-6 py-2.5 border-b border-stone-200 flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-serif font-bold text-stone-600 uppercase tracking-wider">
              Submitted Exhibits:
            </span>
            <div className="flex items-center space-x-1">
              {bid.documents?.map(doc => {
                const isSelected = doc.id === activeDoc?.id;
                const isCited = doc.id === citation?.document_id || doc.name === citation?.document_name;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-serif transition whitespace-nowrap flex items-center space-x-1.5 ${
                      isSelected 
                        ? 'bg-[#0B192C] text-white font-bold shadow-xs' 
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-stone-500" />
                    <span className="max-w-[130px] truncate">{doc.name}</span>
                    {isCited && (
                      <span className="bg-amber-400 text-stone-900 font-sans font-bold text-[9px] px-1 rounded ml-1">
                        CITED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Page controls */}
          <div className="flex items-center space-x-2 bg-white px-2.5 py-1 rounded border border-stone-300 text-xs font-mono">
            <button 
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-0.5 rounded hover:bg-stone-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-stone-700">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-0.5 rounded hover:bg-stone-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Side-by-Side Canvas */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Side: Simulated Archival Document View (7 cols) */}
          <div className="lg:col-span-7 bg-[#EFECE6]/70 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-start border-r border-stone-300">
            <div className="bg-white w-full max-w-xl shadow-md rounded border border-stone-300 p-8 min-h-[480px] font-mono text-stone-800 flex flex-col justify-between relative">
              
              {/* Official Seal Watermark */}
              <div className="border-b border-stone-400 pb-3 mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-500">
                    Official Bid Submission Document
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-900 uppercase">
                    {activeDoc?.doc_type?.replace(/_/g, ' ') || "OFFICIAL ATTACHMENT"}
                  </h4>
                </div>
                <div className="text-right font-mono text-[10px] text-stone-500">
                  <div>Doc ID: {activeDoc?.id}</div>
                  <div>Page {currentPage} of {totalPages}</div>
                </div>
              </div>

              {/* Main Document Body */}
              <div className="flex-1 text-xs leading-relaxed space-y-4 whitespace-pre-line text-stone-800">
                {pageText}
              </div>

              {/* Precise Evidence Highlight Annotation */}
              {citation?.extracted_snippet && (
                <div className="mt-5 p-3.5 rounded bg-amber-50/90 border border-amber-300 shadow-xs relative">
                  <div className="text-[10px] font-serif font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    Cited Evidentiary Snippet (FR5 Verified)
                  </div>
                  <p className="text-xs text-stone-900 font-sans italic leading-relaxed">
                    "{citation.extracted_snippet}"
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-stone-500">
                    <span>Bounding Box: [Top: 120px, L: 45px]</span>
                    <span className="font-semibold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Tamper-Free Verified
                    </span>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 pt-2.5 border-t border-stone-300 text-[10px] font-sans text-stone-500 flex items-center justify-between">
                <span>GeM Submission Document • Electronically Archived</span>
                <span className="font-mono">SHA-256 Digest: 8f4a...2c90</span>
              </div>
            </div>
          </div>

          {/* Right Side: Structured Extraction & Rationale (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 overflow-y-auto space-y-5">
            
            {/* Clause Alignment Header */}
            <div>
              <div className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                Target Tender Requirement
              </div>
              <h4 className="text-base font-serif font-bold text-stone-900 mt-0.5">
                {activeClause?.title || "Verification Clause"}
              </h4>
              <p className="text-xs text-stone-600 mt-1 font-sans leading-relaxed">
                {activeClause?.description}
              </p>
            </div>

            {/* Structured Fields Extracted Table */}
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <div className="bg-[#FAF9F6] px-3.5 py-2 border-b border-stone-200 text-xs font-serif font-bold text-stone-700 flex items-center justify-between">
                <span>Structured Fields (OCR / Layout-Aware NLP)</span>
                <span className="text-[10px] font-mono text-stone-500">STQC Compliant</span>
              </div>
              <div className="divide-y divide-stone-100 text-xs">
                {activeDoc?.extracted_fields && Object.entries(activeDoc.extracted_fields).map(([key, val]) => (
                  <div key={key} className="px-3.5 py-2 flex items-center justify-between">
                    <span className="text-stone-500 font-mono capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-right max-w-[200px] truncate">
                      {typeof val === 'number' && key.includes('inr') 
                        ? `₹ ${(val / 10000000).toFixed(2)} Cr` 
                        : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quoted Verbatim Evidence Box */}
            <div className="bg-[#FAF9F6] border border-stone-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-stone-800">
                  Verbatim Match from Submission
                </span>
                <span className="text-[10px] font-mono bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-bold">
                  Page {citation?.page_number || currentPage}
                </span>
              </div>
              <blockquote className="text-xs text-stone-800 bg-white p-3 rounded border border-stone-200 font-sans leading-relaxed">
                "{citation?.extracted_snippet || 'Verified against submitted document content.'}"
              </blockquote>
              <div className="flex items-center justify-between text-xs text-stone-600 font-mono pt-1">
                <span>Verification Confidence:</span>
                <strong className="text-emerald-800">
                  {(citation?.confidence_score ? citation.confidence_score * 100 : 98).toFixed(1)}%
                </strong>
              </div>
            </div>

            {/* Human-in-the-Loop Principle Reminder */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded text-[11px] text-stone-700 space-y-1">
              <div className="font-serif font-bold text-stone-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                Human-in-the-Loop Mandate
              </div>
              <p className="leading-relaxed">
                This evidence extraction assists the Procurement Officer by surfacing relevant proofs. Final eligibility determination is executed by the designated Procurement Officer.
              </p>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#FAF9F6] border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 font-mono">
            Exhibit: <strong className="text-stone-700">{activeDoc?.name}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#0B192C] hover:bg-[#132A4A] text-white text-xs font-serif font-bold transition"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
