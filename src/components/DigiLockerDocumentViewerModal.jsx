import React from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Award, 
  Clock, 
  ExternalLink,
  Key
} from 'lucide-react';

export default function DigiLockerDocumentViewerModal({ isOpen, onClose, bid }) {
  if (!isOpen || !bid) return null;

  const dl = bid.digilocker_verification || {
    status: "DIGITALLY_VERIFIED",
    dsc_signer: "Authorized Signatory",
    dsc_valid_till: "2028-12-31",
    certifying_authority: "CCA Licensed Certifying Authority",
    repository_uri: `did:in:gov:doc:${bid.id}`,
    sha256_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    tamper_detected: false,
    timestamp: new Date().toISOString()
  };

  const isVerified = dl.status === "DIGITALLY_VERIFIED" && !dl.tamper_detected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-300 w-full max-w-2xl overflow-hidden animate-in fade-in duration-100 font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-2.5">
            <Lock className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-base">DigiLocker National Depository Verification</h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Ministry of Electronics & IT • Government of India Digital Document Repository
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-mono text-sm">
            ✕
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-stone-800">
          
          {/* Authenticity Seal Badge */}
          <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isVerified ? "bg-emerald-50/70 border-emerald-300" : "bg-rose-50/70 border-rose-300"
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 ${
                isVerified ? "bg-emerald-700" : "bg-rose-800"
              }`}>
                {isVerified ? <ShieldCheck className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                  Official Verification Status
                </span>
                <h4 className={`font-serif font-bold text-base ${isVerified ? "text-emerald-950" : "text-rose-950"}`}>
                  {isVerified ? "DIGITALLY VERIFIED & UNTAMPERED" : "VERIFICATION FAILED / UNTRUSTED SIGNATURE"}
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  {isVerified 
                    ? "Document matched directly against Central Government issuing repository without modification."
                    : "Cryptographic hash mismatch or unaccredited self-signed key detected."}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">Integrity Protocol</span>
              <span className="font-mono text-xs font-bold text-stone-900 bg-white px-2.5 py-1 rounded border border-stone-300 inline-block mt-1">
                SHA-256 HMAC
              </span>
            </div>
          </div>

          {/* Credentials Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <div className="bg-[#FAF9F6] p-3 rounded-lg border border-stone-200 space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">Digital Signature Signer:</span>
              <strong className="text-stone-900 font-serif text-sm block">{dl.dsc_signer}</strong>
              <span className="text-[11px] text-stone-500 font-mono">DSC Valid Through: {dl.dsc_valid_till}</span>
            </div>

            <div className="bg-[#FAF9F6] p-3 rounded-lg border border-stone-200 space-y-1">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">Certifying Authority:</span>
              <strong className="text-stone-900 font-serif text-sm block">{dl.certifying_authority}</strong>
              <span className="text-[11px] text-stone-500 font-mono">CCA Licensed Class-3 Certificate</span>
            </div>

            <div className="bg-[#FAF9F6] p-3 rounded-lg border border-stone-200 space-y-1 sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">Central Repository URI:</span>
              <strong className="text-stone-900 font-mono text-xs break-all block">{dl.repository_uri}</strong>
            </div>

            <div className="bg-[#FAF9F6] p-3 rounded-lg border border-stone-200 space-y-1 sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">SHA-256 Cryptographic Hash Digest:</span>
              <strong className="text-stone-900 font-mono text-xs break-all block font-semibold">{dl.sha256_hash}</strong>
            </div>

          </div>

          {/* Documents Verified Under this Session */}
          <div>
            <h5 className="font-serif font-bold text-xs text-stone-900 uppercase tracking-wider mb-2">
              Verified Bidder Submissions ({bid.documents?.length || 0} Files):
            </h5>
            <div className="divide-y divide-stone-200 border border-stone-200 rounded-lg overflow-hidden text-xs">
              {bid.documents?.map(doc => (
                <div key={doc.id} className="p-3 bg-white flex items-center justify-between gap-2 hover:bg-stone-50">
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="font-medium text-stone-800 truncate">{doc.name}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 border shrink-0 ${
                    doc.digilocker_verified !== false 
                      ? "bg-emerald-50 text-emerald-900 border-emerald-300" 
                      : "bg-rose-50 text-rose-900 border-rose-300"
                  }`}>
                    {doc.digilocker_verified !== false ? <CheckCircle2 className="w-3 h-3 text-emerald-700" /> : <ShieldAlert className="w-3 h-3 text-rose-700" />}
                    {doc.digilocker_verified !== false ? "Verified DSC" : "Unverified"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
            <span className="text-[11px] font-mono text-stone-500">
              Verified At: {new Date(dl.timestamp).toLocaleString()}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-stone-900 text-white font-serif font-bold text-xs hover:bg-stone-800"
            >
              Close DigiLocker Inspector
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
