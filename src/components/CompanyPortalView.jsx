import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  Layers, 
  Sparkles, 
  Check, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  FileCheck2,
  FileUp,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CompanyPortalView({ 
  companyUser, 
  allProjects, 
  onUploadSubmission 
}) {
  const [selectedProjectId, setSelectedProjectId] = useState(allProjects[0]?.id || "TNDR-CPCL-2026-089");
  
  // Upload State for Selected Bid
  const [quotedPriceCr, setQuotedPriceCr] = useState("13.80");
  const [uploadedFiles, setUploadedFiles] = useState({
    gst_cert: "L&T_GSTIN_Registration_Certificate.pdf",
    ca_turnover: "L&T_CA_Audited_Turnover_Certificate.pdf",
    work_orders: "L&T_Past_Order_IOCL_Panipat.pdf",
    iso_cert: "L&T_ISO_9001_2015_Certificate.pdf",
    affidavit: "L&T_Notarized_Integrity_Affidavit.pdf",
    local_content: "L&T_Make_in_India_Local_Content.pdf",
    epfo_esic: "L&T_EPFO_ESIC_ECR_Challan_Aug2026.pdf",
    pan_206ab: "L&T_PAN_ITR_Section206AB_Certificate.pdf",
    oem_auth: "L&T_Direct_OEM_Manufacturing_License.pdf",
    land_border: "L&T_Rule_144xi_Land_Border_Declaration.pdf"
  });

  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  const activeProject = allProjects.find(p => p.id === selectedProjectId) || allProjects[0];

  const handleSimulateFileSelect = (fieldKey, defaultFileName) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldKey]: defaultFileName
    }));
  };

  const handleFinalSubmitBid = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {
      setSubmitting(false);
      const successPayload = {
        projectId: activeProject.id,
        projectTitle: activeProject.title,
        quotedPriceCr: parseFloat(quotedPriceCr),
        timestamp: new Date().toISOString(),
        documentsCount: Object.values(uploadedFiles).filter(Boolean).length
      };
      setSubmissionSuccess(successPayload);

      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 600);
  };

  return (
    <div className="space-y-6 text-stone-800">
      
      {/* Company Verification Banner - Medium Text, Classy Executive Look */}
      <div className="bg-white rounded-xl p-6 border border-stone-300 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#854D0E]"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded bg-[#0B192C] text-white flex items-center justify-center shrink-0 border border-stone-800">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-serif font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Verified Vendor
                </span>
                <span className="text-stone-400">•</span>
                <span className="font-mono text-stone-700 font-semibold">GSTIN: {companyUser?.gstin || "33AAACL1972K1Z9"}</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600 font-sans">{companyUser?.email || "procurement@lntvalves.com"}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
                {companyUser?.name || "Larsen & Toubro Limited - Valve Manufacturing Division"}
              </h2>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-stone-200 rounded p-3 text-right shrink-0">
            <span className="text-xs font-mono uppercase text-stone-500 block">Available Tenders</span>
            <span className="text-2xl font-serif font-bold text-stone-900">{allProjects.length} Projects Open</span>
          </div>
        </div>
      </div>

      {/* Available Tenders & Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Available Government e-Marketplace (GeM) Bids
            </h3>
            <p className="text-sm text-stone-500 font-sans">
              Select an active tender project below to review requirements and upload your bid response documents.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded border border-stone-300">
            Official CPCL / MoPNG Tenders
          </span>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allProjects.map((project) => {
            const isSelected = project.id === activeProject.id;
            return (
              <div
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setSubmissionSuccess(null);
                }}
                className={`p-5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#FAF9F6] border-stone-800 ring-1 ring-stone-800 shadow-sm"
                    : "bg-white border-stone-300 hover:border-stone-400 hover:shadow-xs"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {project.tender_number}
                    </span>
                    <span className={`text-[11px] font-serif font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      project.status.includes("ACTIVE") 
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-200" 
                        : "bg-stone-100 text-stone-700 border border-stone-300"
                    }`}>
                      {project.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-stone-900 leading-snug line-clamp-2">
                    {project.title}
                  </h4>

                  <div className="text-xs text-stone-600 space-y-1 pt-1 font-sans">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Tender Value:</span>
                      <strong className="text-stone-900 font-serif">₹ {(project.estimated_value_inr / 10000000).toFixed(2)} Cr</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Deadline:</span>
                      <span className="font-mono text-stone-700">{new Date(project.submission_deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Clauses to satisfy:</span>
                      <span className="font-semibold text-stone-800">{project.clauses?.length || 4} Mandatory Criteria</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className={`text-xs font-serif font-bold ${isSelected ? "text-stone-900" : "text-stone-500"}`}>
                    {isSelected ? "● Selected for Participation" : "Click to Select & Upload"}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? "text-stone-900" : "text-stone-400"}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Tender Participation & Document Upload Workstation */}
      <div className="bg-white rounded-xl border border-stone-300 shadow-sm p-6 sm:p-7 space-y-6">
        
        {/* Workstation Header */}
        <div className="pb-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-stone-500 uppercase tracking-wider font-semibold">
              Bid Participation Dossier
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mt-0.5">
              Submit Response Documents for: {activeProject.title}
            </h3>
            <p className="text-sm text-stone-600 font-sans mt-0.5">
              Bid ID: <strong className="font-mono text-stone-800">{activeProject.tender_number}</strong> • Estimated Budget: <strong className="font-serif text-stone-900">₹ {(activeProject.estimated_value_inr / 10000000).toFixed(2)} Cr</strong>
            </p>
          </div>

          <div className="bg-[#FAF9F6] border border-stone-200 p-3 rounded text-xs text-stone-700 font-serif">
            <div>EMD: <strong>₹ {(activeProject.emd_amount_inr / 100000).toFixed(2)} Lakhs</strong></div>
            <div className="text-stone-500 font-sans text-[11px]">(Exempt for Verified MSME / Startups)</div>
          </div>
        </div>

        {/* Commercial Bid Price (Budget) Input */}
        <div className="bg-[#FAF9F6] border border-stone-300 rounded-lg p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-serif font-bold text-base text-stone-900">
                1. Commercial Quoted Price / Bid Budget (INR Crores)
              </h4>
              <p className="text-xs text-stone-600 font-sans">
                Enter your total all-inclusive lump-sum price quotation for this tender scope.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-serif font-bold text-stone-600">INR</span>
              <input
                type="number"
                step="0.05"
                value={quotedPriceCr}
                onChange={(e) => setQuotedPriceCr(e.target.value)}
                className="w-32 text-lg font-serif font-bold bg-white text-stone-900 p-2 rounded border border-stone-300 text-right focus:outline-none focus:border-stone-600"
              />
              <span className="text-sm font-serif font-bold text-stone-800">Crores</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 font-mono pt-1 border-t border-stone-200">
            <span>Tender Estimated Budget: ₹ {(activeProject.estimated_value_inr / 10000000).toFixed(2)} Cr</span>
            <span className="text-emerald-800 font-bold font-serif">
              Savings vs Benchmark: ₹ {((activeProject.estimated_value_inr - parseFloat(quotedPriceCr || 0) * 10000000) / 100000).toFixed(2)} Lakhs
            </span>
          </div>
        </div>

        {/* Document Upload Grid */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-base text-stone-900">
            2. Upload Required Technical & Statutory Documents (PDF / Scanned Exhibits)
          </h4>
          <p className="text-xs text-stone-600 font-sans">
            Every file is ingested via layout-aware OCR and evaluated by the deterministic rule engine and AI semantic layer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            
            {/* Document 1: GST */}
            <div className="p-3.5 rounded border border-stone-300 bg-[#FAF9F6] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-stone-900">Statutory GSTIN Certificate</div>
                  <div className="text-[11px] text-stone-500 font-mono truncate">
                    {uploadedFiles.gst_cert || "No PDF selected"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateFileSelect("gst_cert", "GSTIN_Certificate_Verified.pdf")}
                className="px-2.5 py-1 rounded bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-serif font-bold text-xs"
              >
                Attach PDF
              </button>
            </div>

            {/* Document 2: CA Turnover */}
            <div className="p-3.5 rounded border border-stone-300 bg-[#FAF9F6] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-stone-900">Audited CA Turnover Certificate (with UDIN)</div>
                  <div className="text-[11px] text-stone-500 font-mono truncate">
                    {uploadedFiles.ca_turnover || "No PDF selected"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateFileSelect("ca_turnover", "CA_Audited_Turnover_UDIN.pdf")}
                className="px-2.5 py-1 rounded bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-serif font-bold text-xs"
              >
                Attach PDF
              </button>
            </div>

            {/* Document 3: Work Orders */}
            <div className="p-3.5 rounded border border-stone-300 bg-[#FAF9F6] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-stone-900">Past Work Orders / Completion Letters</div>
                  <div className="text-[11px] text-stone-500 font-mono truncate">
                    {uploadedFiles.work_orders || "No PDF selected"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateFileSelect("work_orders", "Refinery_Work_Order_Evidence.pdf")}
                className="px-2.5 py-1 rounded bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-serif font-bold text-xs"
              >
                Attach PDF
              </button>
            </div>

            {/* Document 4: ISO Certificate */}
            <div className="p-3.5 rounded border border-stone-300 bg-[#FAF9F6] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-stone-900">Mandatory ISO 9001:2015 Accreditation</div>
                  <div className="text-[11px] text-stone-500 font-mono truncate">
                    {uploadedFiles.iso_cert || "No PDF selected"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateFileSelect("iso_cert", "ISO_9001_NABCB_Certificate.pdf")}
                className="px-2.5 py-1 rounded bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-serif font-bold text-xs"
              >
                Attach PDF
              </button>
            </div>

            {/* Document 5: Affidavit */}
            <div className="p-3.5 rounded border border-stone-300 bg-[#FAF9F6] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-stone-900">Non-Blacklisting Affidavit (Stamp Paper)</div>
                  <div className="text-[11px] text-stone-500 font-mono truncate">
                    {uploadedFiles.affidavit || "No PDF selected"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateFileSelect("affidavit", "Notarized_Integrity_Affidavit.pdf")}
                className="px-2.5 py-1 rounded bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-serif font-bold text-xs"
              >
                Attach PDF
              </button>
            </div>

            {/* Document 6: Make in India */}
            <div className="p-3.5 rounded border border-stone-300 bg-[#FAF9F6] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-stone-900">Make in India Local Content Declaration</div>
                  <div className="text-[11px] text-stone-500 font-mono truncate">
                    {uploadedFiles.local_content || "No PDF selected"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateFileSelect("local_content", "Make_In_India_Class1_Cert.pdf")}
                className="px-2.5 py-1 rounded bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-serif font-bold text-xs"
              >
                Attach PDF
              </button>
            </div>

            {/* Document 7: EPFO & ESIC Labor Compliance */}
            <div className="p-3.5 rounded border border-stone-300 bg-[#FAF9F6] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-stone-900">EPFO & ESIC ECR Compliance Receipts</div>
                  <div className="text-[11px] text-stone-500 font-mono truncate">
                    {uploadedFiles.epfo_esic || "No PDF selected"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateFileSelect("epfo_esic", "EPFO_ECR_Receipts_Verified.pdf")}
                className="px-2.5 py-1 rounded bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-serif font-bold text-xs"
              >
                Attach PDF
              </button>
            </div>

            {/* Document 8: PAN & Section 206AB Tax Compliance */}
            <div className="p-3.5 rounded border border-stone-300 bg-[#FAF9F6] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-stone-900">PAN & Section 206AB ITR Returns</div>
                  <div className="text-[11px] text-stone-500 font-mono truncate">
                    {uploadedFiles.pan_206ab || "No PDF selected"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateFileSelect("pan_206ab", "PAN_ITR_Section_206AB.pdf")}
                className="px-2.5 py-1 rounded bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-serif font-bold text-xs"
              >
                Attach PDF
              </button>
            </div>

            {/* Document 9: OEM / MAF Authorization */}
            <div className="p-3.5 rounded border border-stone-300 bg-[#FAF9F6] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-stone-900">OEM Direct License or Manufacturer Authorization</div>
                  <div className="text-[11px] text-stone-500 font-mono truncate">
                    {uploadedFiles.oem_auth || "No PDF selected"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateFileSelect("oem_auth", "OEM_Direct_License_Valid.pdf")}
                className="px-2.5 py-1 rounded bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-serif font-bold text-xs"
              >
                Attach PDF
              </button>
            </div>

            {/* Document 10: Rule 144(xi) Land Border Sharing Declaration */}
            <div className="p-3.5 rounded border border-stone-300 bg-[#FAF9F6] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <FileText className="w-5 h-5 text-stone-600 shrink-0" />
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-stone-900">Rule 144(xi) Land Border Sharing Undertaking</div>
                  <div className="text-[11px] text-stone-500 font-mono truncate">
                    {uploadedFiles.land_border || "No PDF selected"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSimulateFileSelect("land_border", "Rule_144xi_Land_Border_Compliance.pdf")}
                className="px-2.5 py-1 rounded bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-serif font-bold text-xs"
              >
                Attach PDF
              </button>
            </div>

          </div>
        </div>

        {/* Submission Confirmation Notice */}
        {submissionSuccess && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs space-y-2 font-sans animate-in fade-in duration-150">
            <div className="flex items-center gap-2 font-serif font-bold text-sm text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              Bid Submission Successfully Ingested & Verified for Tender {submissionSuccess.projectId}!
            </div>
            <p className="leading-relaxed">
              Quoted Commercial Price: <strong className="font-serif">₹ {submissionSuccess.quotedPriceCr.toFixed(2)} Crores</strong> • Attached Documents: <strong>{submissionSuccess.documentsCount} PDF Exhibits</strong>. All files have been OCR-parsed and anchored into the electronic tender vault for Console Officer evaluation.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleFinalSubmitBid}
            disabled={submitting}
            className="px-6 py-3 rounded bg-[#0B192C] hover:bg-[#132A4A] text-white font-serif font-bold text-sm transition flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4 text-amber-400" />
            <span>{submitting ? "Uploading & Running Verification Engine..." : "Submit Tender Response Package"}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
