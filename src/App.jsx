import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OfficerDashboard from './components/OfficerDashboard';
import BidEvaluationView from './components/BidEvaluationView';
import EvidenceInspectorModal from './components/EvidenceInspectorModal';
import OverrideModal from './components/OverrideModal';
import ComplianceReportModal from './components/ComplianceReportModal';
import AuditTrailExplorer from './components/AuditTrailExplorer';
import RuleConfigurator from './components/RuleConfigurator';
import BidderPortal from './components/BidderPortal';
import DualLoginModal from './components/DualLoginModal';
import CompanyPortalView from './components/CompanyPortalView';
import OfficerProjectManager from './components/OfficerProjectManager';

import { 
  INITIAL_TENDER, 
  INITIAL_BIDDERS, 
  INITIAL_AUDIT_LOG,
  ALL_PROJECTS,
  SAMPLE_COMPANIES,
  SAMPLE_OFFICERS
} from './data/mockData';

export default function App() {
  // Authentication State
  // Default to Console Officer Rajesh Sharma, or can switch to Company
  const [currentUser, setCurrentUser] = useState({
    type: "officer",
    name: "Rajesh Sharma",
    id: "CPCL-PO-8812",
    email: "officer.sharma@cpcl.gov.in",
    division: "Mechanical & Refining Procurement",
    role: "Senior Procurement Officer",
    clearance: "Level-3 Executive Authority"
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Active view: "officer_projects" | "officer_bids" | "company" | "admin" | "auditor"
  const [currentRole, setRole] = useState('officer_projects');
  
  // Projects & Bids State
  const [allProjects, setAllProjects] = useState(ALL_PROJECTS);
  const [tender, setTender] = useState(INITIAL_TENDER);
  const [bidders, setBidders] = useState(INITIAL_BIDDERS);
  const [auditLog, setAuditLog] = useState(INITIAL_AUDIT_LOG);
  const [selectedBidId, setSelectedBidId] = useState(null);

  // Modals state
  const [evidenceModalData, setEvidenceModalData] = useState({
    isOpen: false,
    citation: null,
    bid: null,
    clause: null
  });

  const [overrideModalData, setOverrideModalData] = useState({
    isOpen: false,
    bid: null,
    clause: null
  });

  const [reportModalData, setReportModalData] = useState({
    isOpen: false,
    bid: null
  });

  const [backendOnline, setBackendOnline] = useState(false);

  // Check backend connectivity on mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/bids")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setBidders(data);
          setBackendOnline(true);
        }
      })
      .catch(() => {
        setBackendOnline(false);
      });
  }, []);

  const activeBid = bidders.find(b => b.id === selectedBidId) || null;
  const hasSecurityAlert = bidders.some(b => b.security_alert);

  // Login Handlers
  const handleLoginCompany = (companyPayload) => {
    setCurrentUser(companyPayload);
    setRole("company");
  };

  const handleLoginOfficer = (officerPayload) => {
    setCurrentUser(officerPayload);
    setRole("officer_projects");
  };

  // Bid Selection Handlers
  const handleSelectBid = (bid) => {
    setSelectedBidId(bid.id);
  };

  const handleBackToDashboard = () => {
    setSelectedBidId(null);
  };

  const handleOpenCitation = (citation, bid, clause) => {
    setEvidenceModalData({
      isOpen: true,
      citation,
      bid,
      clause
    });
  };

  const handleCloseCitation = () => {
    setEvidenceModalData(prev => ({ ...prev, isOpen: false }));
  };

  const handleOpenOverride = (bid, clause) => {
    setOverrideModalData({
      isOpen: true,
      bid,
      clause
    });
  };

  const handleCloseOverride = () => {
    setOverrideModalData(prev => ({ ...prev, isOpen: false }));
  };

  const handleOpenReport = (bid) => {
    setReportModalData({
      isOpen: true,
      bid: bid || activeBid || bidders[0]
    });
  };

  const handleCloseReport = () => {
    setReportModalData({ isOpen: false, bid: null });
  };

  // Officer Override Execution (FR6)
  const handleConfirmOverride = ({ 
    bid_id, 
    clause_id, 
    new_verdict, 
    reason_category, 
    justification, 
    officer_name, 
    officer_id 
  }) => {
    const timestamp = new Date().toISOString();

    setBidders(prev => prev.map(b => {
      if (b.id !== bid_id) return b;

      let updatedEvals = b.evaluations;

      if (clause_id) {
        updatedEvals = b.evaluations.map(e => {
          if (e.clause_id !== clause_id) return e;
          return {
            ...e,
            final_verdict: new_verdict,
            is_overridden: true,
            override_reason: `[${reason_category}] ${justification}`,
            override_officer: `${officer_name} (${officer_id})`,
            override_timestamp: timestamp
          };
        });
      }

      const hasFail = updatedEvals.some(e => e.final_verdict === "FAIL");
      const hasReview = updatedEvals.some(e => e.final_verdict === "REVIEW");
      const calculatedOverall = hasFail ? "FAIL" : (hasReview ? "REVIEW" : "PASS");
      const finalOverall = clause_id ? calculatedOverall : new_verdict;

      return {
        ...b,
        evaluations: updatedEvals,
        overall_verdict: finalOverall
      };
    }));

    // Append to immutable audit trail (FR7)
    const newBlockIndex = auditLog.length;
    const previousHash = auditLog[auditLog.length - 1].hash;
    const newHash = "hash_" + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);

    const newAuditEvent = {
      block_index: newBlockIndex,
      timestamp,
      event_type: clause_id ? "OFFICER_OVERRIDE_CLAUSE" : "OFFICER_OVERRIDE_OVERALL",
      actor: `${officer_name} (${officer_id})`,
      role: "OFFICER",
      bid_id,
      tender_id: tender.id,
      details: {
        clause_id,
        new_verdict,
        reason_category,
        justification,
        officer_id
      },
      previous_hash: previousHash,
      hash: newHash
    };

    setAuditLog(prev => [...prev, newAuditEvent]);

    if (backendOnline) {
      fetch("http://127.0.0.1:8000/api/bids/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bid_id,
          clause_id,
          new_verdict,
          reason_category,
          justification,
          officer_id,
          officer_name
        })
      }).catch(() => {});
    }
  };

  // Finalize Decision
  const handleFinalizeBid = ({ bid_id, officer_name, officer_id, decision_summary }) => {
    const timestamp = new Date().toISOString();

    setBidders(prev => prev.map(b => {
      if (b.id !== bid_id) return b;
      return {
        ...b,
        officer_sign_off: true,
        officer_name: `${officer_name} (${officer_id})`,
        officer_sign_timestamp: timestamp
      };
    }));

    const newBlockIndex = auditLog.length;
    const previousHash = auditLog[auditLog.length - 1].hash;
    const newHash = "sign_" + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);

    const newAuditEvent = {
      block_index: newBlockIndex,
      timestamp,
      event_type: "BID_DECISION_FINALIZED",
      actor: `${officer_name} (${officer_id})`,
      role: "OFFICER",
      bid_id,
      tender_id: tender.id,
      details: {
        decision_summary,
        officer_id,
        timestamp
      },
      previous_hash: previousHash,
      hash: newHash
    };

    setAuditLog(prev => [...prev, newAuditEvent]);
  };

  // Authority to create/update required features or functions in a project
  const handleUpdateProjectClauses = (newClauses) => {
    setTender(prev => ({ ...prev, clauses: newClauses }));
    setAllProjects(prev => prev.map(p => 
      p.id === tender.id ? { ...p, clauses: newClauses } : p
    ));

    // Append rule update event to ledger
    setAuditLog(prev => [
      ...prev,
      {
        block_index: prev.length,
        timestamp: new Date().toISOString(),
        event_type: "PROJECT_CLAUSES_CONFIGURED",
        actor: `${currentUser.name} (${currentUser.id || 'OFFICER'})`,
        role: "OFFICER_CONSOLE",
        tender_id: tender.id,
        details: {
          updated_clauses_count: newClauses.length,
          message: "Officer configured required project features & clauses; bids evaluated."
        },
        previous_hash: prev[prev.length - 1].hash,
        hash: "officer_rule_" + Math.random().toString(16).slice(2)
      }
    ]);
  };

  const handleResetData = () => {
    setTender(INITIAL_TENDER);
    setAllProjects(ALL_PROJECTS);
    setBidders(INITIAL_BIDDERS);
    setAuditLog(INITIAL_AUDIT_LOG);
    setSelectedBidId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F9] text-stone-800 font-sans">
      
      {/* Navbar with Login Identity and Role Tabs */}
      <Navbar 
        currentRole={currentRole}
        setRole={setRole}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        tender={tender}
        hasSecurityAlert={hasSecurityAlert}
        onResetData={handleResetData}
        backendOnline={backendOnline}
      />

      {/* Main Body Canvas - Medium Text, Classy Institutional Theme */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: Company / Bidder Portal (All Bids & PDF Upload) */}
        {currentRole === 'company' && (
          <CompanyPortalView 
            companyUser={currentUser}
            allProjects={allProjects}
            onUploadSubmission={(payload) => {
              // Appends upload record
              setAuditLog(prev => [
                ...prev,
                {
                  block_index: prev.length,
                  timestamp: new Date().toISOString(),
                  event_type: "COMPANY_DOCUMENTS_UPLOADED",
                  actor: currentUser.name,
                  role: "BIDDER_COMPANY",
                  bid_id: "NEW-SUBMISSION",
                  tender_id: payload.projectId,
                  details: payload,
                  previous_hash: prev[prev.length - 1].hash,
                  hash: "upload_" + Math.random().toString(16).slice(2)
                }
              ]);
            }}
          />
        )}

        {/* VIEW 2: Console Officer - Projects & AI Contract Award Manager */}
        {currentRole === 'officer_projects' && (
          <OfficerProjectManager 
            officerUser={currentUser}
            allProjects={allProjects}
            bidders={bidders}
            onSelectBid={(bid) => {
              setSelectedBidId(bid.id);
              setRole("officer_bids");
            }}
            onOpenReport={handleOpenReport}
            onOpenOverride={handleOpenOverride}
            onUpdateProjectClauses={handleUpdateProjectClauses}
          />
        )}

        {/* VIEW 3: Console Officer - Detailed Bids Evaluation Matrix */}
        {currentRole === 'officer_bids' && (
          selectedBidId ? (
            <BidEvaluationView 
              bid={activeBid}
              tender={tender}
              onBack={handleBackToDashboard}
              onOpenCitation={handleOpenCitation}
              onOpenOverride={handleOpenOverride}
              onOpenReport={handleOpenReport}
              onFinalizeBid={handleFinalizeBid}
            />
          ) : (
            <OfficerDashboard 
              tender={tender}
              bidders={bidders}
              onSelectBid={handleSelectBid}
              onOpenReport={handleOpenReport}
              onOpenOverride={handleOpenOverride}
            />
          )
        )}

        {/* VIEW 4: Admin - Rule Sets Configurator */}
        {currentRole === 'admin' && (
          <RuleConfigurator 
            tender={tender}
            onUpdateClauses={handleUpdateProjectClauses}
          />
        )}

        {/* VIEW 5: Auditor - Cryptographic Ledger */}
        {currentRole === 'auditor' && (
          <AuditTrailExplorer 
            auditLog={auditLog}
            onExportAudit={handleOpenReport}
          />
        )}

      </main>

      {/* Institutional Gazette Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 px-4 text-center text-xs text-stone-500 font-serif">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Chennai Petroleum Corporation Limited • Ministry of Petroleum & Natural Gas</span>
          <span className="font-mono text-[11px] text-stone-400">SIH26100 Smart Automation • Explainable Verification & Contract Award Engine</span>
        </div>
      </footer>

      {/* Dual Login Modal (Company vs Console Officer) */}
      <DualLoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginCompany={handleLoginCompany}
        onLoginOfficer={handleLoginOfficer}
        currentUser={currentUser}
      />

      {/* Global Modals */}
      <EvidenceInspectorModal 
        isOpen={evidenceModalData.isOpen}
        onClose={handleCloseCitation}
        citation={evidenceModalData.citation}
        bid={evidenceModalData.bid}
        activeClause={evidenceModalData.clause}
      />

      <OverrideModal 
        isOpen={overrideModalData.isOpen}
        onClose={handleCloseOverride}
        bid={overrideModalData.bid}
        clause={overrideModalData.clause}
        onConfirmOverride={handleConfirmOverride}
      />

      <ComplianceReportModal 
        isOpen={reportModalData.isOpen}
        onClose={handleCloseReport}
        bid={reportModalData.bid}
        tender={tender}
        auditLog={auditLog}
      />

    </div>
  );
}
