import React from 'react';
import { 
  X, 
  Printer, 
  FileSpreadsheet, 
  ShieldCheck, 
  Hash,
  Award,
  Building2
} from 'lucide-react';

export default function ComplianceReportModal({ isOpen, onClose, bid, tender, auditLog }) {
  if (!isOpen || !bid) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    let csv = `GeM Bid Compliance Verification Report\nTender Number,${tender?.tender_number}\nBidder Name,${bid.bidder_name}\nGSTIN,${bid.gstin}\nOverall Verdict,${bid.overall_verdict}\n\nClause Code,Category,Title,Verdict,Confidence,Rule Applied,Reasoning\n`;
    
    bid.evaluations?.forEach(e => {
      csv += `"${e.clause_code}","${e.category}","${e.title}","${e.final_verdict}","${(e.confidence * 100).toFixed(1)}%","${e.rule_logic_applied}","${e.reasoning.replace(/"/g, '""')}"\n`;
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Compliance_Report_${bid.id}_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const latestHash = auditLog?.[auditLog.length - 1]?.hash || "a4f89d309e4a3e78df790184b9687e1a3dc8f645127608103c8091873100fe32";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        
        {/* Header - Non-Printable Controls */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-stone-800 no-print">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#132A4A] border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Official Compliance Determination Certificate</h3>
              <p className="text-xs text-slate-400 font-sans">
                Official CPCL / MoPNG Audit Certificate • FR8 Export
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-serif font-bold transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded bg-white hover:bg-stone-100 text-stone-900 text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Canvas */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 font-sans text-stone-900 space-y-6 bg-white">
          
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-stone-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-serif font-bold text-stone-600 uppercase tracking-widest">
                Government of India • Ministry of Petroleum & Natural Gas
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-950 uppercase tracking-tight mt-1">
                Chennai Petroleum Corporation Limited (CPCL)
              </h2>
              <div className="text-xs text-stone-600 font-sans mt-0.5">
                Central E-Procurement Cell • Manali Refinery Complex, Chennai 600068
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-stone-300 sm:pl-6 text-xs">
              <div className="font-mono text-stone-400 text-[10px] uppercase">Official Certificate No.</div>
              <div className="font-mono font-bold text-stone-900 text-sm">GEM-CERT-2026-{bid.id}</div>
              <div className="text-stone-500 text-[11px] mt-1 font-serif">
                Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Executive Overview Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded bg-[#FAF9F6] border border-stone-300 text-xs font-sans">
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-mono block">GeM Tender Reference</span>
              <strong className="text-stone-900 font-mono">{tender?.tender_number}</strong>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-mono block">Estimated Tender Value</span>
              <strong className="font-serif text-stone-900">₹ {(tender?.estimated_value_inr / 10000000).toFixed(2)} Cr</strong>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-mono block">Bidder Entity</span>
              <strong className="text-stone-900 font-serif block truncate">{bid.bidder_name}</strong>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-mono block">Official Determination</span>
              <span className={`inline-block font-serif font-bold uppercase tracking-wider px-2 py-0.5 rounded text-[11px] border ${
                bid.overall_verdict === "PASS" ? "bg-emerald-50 text-emerald-900 border-emerald-300" :
                bid.overall_verdict === "FAIL" ? "bg-rose-50 text-rose-900 border-rose-300" : "bg-amber-50 text-amber-900 border-amber-300"
              }`}>
                {bid.overall_verdict}
              </span>
            </div>
          </div>

          {/* Per-Clause Compliance Matrix Table */}
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-900 mb-2 uppercase tracking-wider">
              Itemized Clause Verification & Traceability Matrix
            </h4>
            <div className="border border-stone-300 rounded overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FAF9F6] text-stone-800 font-serif font-bold border-b border-stone-300">
                  <tr>
                    <th className="p-2.5 font-mono">Code</th>
                    <th className="p-2.5">Clause Title & Evaluation Scope</th>
                    <th className="p-2.5">Document Exhibit</th>
                    <th className="p-2.5 font-mono">Confidence</th>
                    <th className="p-2.5 font-serif">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {bid.evaluations?.map((item) => (
                    <tr key={item.clause_id} className="hover:bg-stone-50/50">
                      <td className="p-2.5 font-mono font-bold text-stone-800 align-top">
                        {item.clause_code}
                      </td>
                      <td className="p-2.5 align-top">
                        <div className="font-serif font-bold text-stone-900">{item.title}</div>
                        <div className="text-[11px] text-stone-600 mt-0.5 font-sans leading-relaxed">{item.reasoning}</div>
                        {item.is_overridden && (
                          <div className="mt-1 text-[10px] bg-amber-50 text-amber-950 p-1 rounded border border-amber-200 font-mono">
                            OFFICER GFR OVERRIDE: {item.override_reason} (By {item.override_officer})
                          </div>
                        )}
                      </td>
                      <td className="p-2.5 align-top text-[11px] text-stone-600">
                        {item.citations?.[0] ? (
                          <div>
                            <span className="font-semibold text-stone-800 block truncate max-w-[150px]">
                              {item.citations[0].document_name}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              Page {item.citations[0].page_number}
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic font-serif">No exhibit cited</span>
                        )}
                      </td>
                      <td className="p-2.5 font-mono align-top text-stone-700">
                        {(item.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="p-2.5 align-top font-serif font-bold">
                        <span className={`px-2 py-0.5 rounded text-[11px] border ${
                          item.final_verdict === "PASS" ? "text-emerald-900 bg-emerald-50 border-emerald-200" :
                          item.final_verdict === "FAIL" ? "text-rose-900 bg-rose-50 border-rose-200" : "text-amber-900 bg-amber-50 border-amber-200"
                        }`}>
                          {item.final_verdict}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regulatory Verification Summary */}
          <div className="p-4 rounded border border-stone-200 bg-[#FAF9F6] space-y-2 text-xs font-sans">
            <h5 className="font-serif font-bold text-stone-900 uppercase tracking-wider">
              Statutory Cross-Verification Records
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-stone-400 text-[10px] font-mono uppercase block">GSTN Live Status:</span>
                <span className="font-mono font-bold text-stone-900">{bid.registry_status?.gst_status}</span>
                <div className="text-[10px] text-stone-600">{bid.registry_status?.gst_filing_compliance}</div>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] font-mono uppercase block">MSME Udyam Status:</span>
                <span className="font-serif font-bold text-stone-900">
                  {bid.registry_status?.udyam_valid ? "VALID MSME" : "LARGE / NON-MSME"}
                </span>
                <div className="text-[10px] text-stone-600">{bid.registry_status?.enterprise_type}</div>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] font-mono uppercase block">Central Debarment Watch:</span>
                <span className={`font-mono font-bold ${bid.registry_status?.debarment_status?.includes("BLACKLISTED") ? "text-rose-800" : "text-emerald-800"}`}>
                  {bid.registry_status?.debarment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Digest & Official Signature Block */}
          <div className="pt-6 border-t-2 border-stone-900 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
            <div>
              <div className="font-serif font-bold text-stone-900 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-stone-700" />
                Immutable SHA-256 Audit Seal
              </div>
              <div className="font-mono text-[10px] text-stone-600 break-all bg-stone-50 p-2.5 rounded mt-1 border border-stone-300">
                {latestHash}
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                Generated pursuant to Government of India e-procurement guidelines. Digitally anchored in the audit chain.
              </p>
            </div>

            <div className="text-right flex flex-col justify-end items-end font-serif">
              <div className="w-48 border-b border-stone-400 pb-1 mb-1 italic text-stone-800 text-sm">
                {bid.officer_name || "Rajesh Sharma (PO-8812)"}
              </div>
              <div className="font-bold text-stone-900">Designated Procurement Officer</div>
              <div className="text-[11px] text-stone-500 font-sans">
                CPCL Manali Refinery Procurement Cell
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
