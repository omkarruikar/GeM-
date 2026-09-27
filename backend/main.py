from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List, Optional
from datetime import datetime

from .models import (
    Tender, BidSubmission, OverrideRequest, FinalizeRequest,
    VerdictStatus, ClauseEvaluationResult
)
from .seed_data import initialize_database, DEMO_TENDER
from .audit_ledger import audit_ledger
from .rule_engine import DeterministicRuleEngine
from .registry_mock import RegistryMockService
from .guardrail import PromptInjectionGuardrail

app = FastAPI(
    title="GeM Bid Compliance Verification Platform API",
    description="Backend API for AI-Powered Integrated Bid Compliance Verification (MoPNG / CPCL)",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory State
CURRENT_TENDER, BIDS_DB = initialize_database()

@app.get("/")
def read_root():
    return {
        "status": "ONLINE",
        "service": "GeM Bid Compliance Verification Engine",
        "organization": "Ministry of Petroleum & Natural Gas / CPCL",
        "ps_id": "SIH26100",
        "docs_url": "/docs"
    }

@app.get("/api/tender")
def get_tender():
    return CURRENT_TENDER

@app.put("/api/tender/clauses")
def update_clauses(payload: Dict[str, Any]):
    """FR10: Configurable rule sets per tender category"""
    global CURRENT_TENDER, BIDS_DB
    new_clauses = payload.get("clauses", [])
    CURRENT_TENDER["clauses"] = new_clauses

    # Log in audit trail
    audit_ledger.append_event(
        event_type="RULE_SET_UPDATED",
        actor=payload.get("officer_or_admin", "Admin / Procurement Desk"),
        role="ADMIN",
        tender_id=CURRENT_TENDER["id"],
        details={
            "updated_clauses_count": len(new_clauses),
            "reason": payload.get("reason", "Tender eligibility rule set updated")
        }
    )

    # Re-evaluate all bids against updated rule set
    for bid in BIDS_DB:
        evals = DeterministicRuleEngine.evaluate_bid(CURRENT_TENDER, bid)
        bid["evaluations"] = [e.dict() for e in evals]
        has_fail = any(e.final_verdict == VerdictStatus.FAIL for e in evals)
        has_review = any(e.final_verdict == VerdictStatus.REVIEW for e in evals)
        bid["overall_verdict"] = VerdictStatus.FAIL if has_fail else (VerdictStatus.REVIEW if has_review else VerdictStatus.PASS)

    return {"message": "Tender clause rule set successfully updated and all bids re-evaluated.", "tender": CURRENT_TENDER}

@app.get("/api/bids")
def get_bids():
    return BIDS_DB

@app.get("/api/bids/{bid_id}")
def get_bid_by_id(bid_id: str):
    bid = next((b for b in BIDS_DB if b["id"] == bid_id), None)
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    return bid

@app.post("/api/bids/override")
def override_verdict(req: OverrideRequest):
    """FR6: Officer override workflow with mandatory reason capture"""
    bid = next((b for b in BIDS_DB if b["id"] == req.bid_id), None)
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")

    if not req.justification or len(req.justification.strip()) < 10:
        raise HTTPException(status_code=400, detail="Mandatory justification must be at least 10 characters.")

    timestamp = datetime.utcnow().isoformat() + "Z"

    if req.clause_id:
        # Override specific clause
        target_eval = next((e for e in bid["evaluations"] if e["clause_id"] == req.clause_id), None)
        if not target_eval:
            raise HTTPException(status_code=404, detail="Clause not found in bid evaluations")

        old_verdict = target_eval["final_verdict"]
        target_eval["final_verdict"] = req.new_verdict
        target_eval["is_overridden"] = True
        target_eval["override_reason"] = f"[{req.reason_category}] {req.justification}"
        target_eval["override_officer"] = f"{req.officer_name} ({req.officer_id})"
        target_eval["override_timestamp"] = timestamp

        # Recalculate overall verdict
        evals = bid["evaluations"]
        has_fail = any(e["final_verdict"] == "FAIL" for e in evals)
        has_review = any(e["final_verdict"] == "REVIEW" for e in evals)
        bid["overall_verdict"] = "FAIL" if has_fail else ("REVIEW" if has_review else "PASS")

        # Append to immutable audit trail
        audit_event = audit_ledger.append_event(
            event_type="OFFICER_OVERRIDE_CLAUSE",
            actor=req.officer_name,
            role="OFFICER",
            bid_id=req.bid_id,
            tender_id=bid["tender_id"],
            details={
                "clause_id": req.clause_id,
                "clause_code": target_eval["clause_code"],
                "previous_verdict": str(old_verdict),
                "new_verdict": req.new_verdict,
                "reason_category": req.reason_category,
                "justification": req.justification,
                "officer_id": req.officer_id,
                "rule_recalculation": f"Overall status now: {bid['overall_verdict']}"
            }
        )
    else:
        # Override overall verdict
        old_verdict = bid["overall_verdict"]
        bid["overall_verdict"] = req.new_verdict

        audit_event = audit_ledger.append_event(
            event_type="OFFICER_OVERRIDE_OVERALL",
            actor=req.officer_name,
            role="OFFICER",
            bid_id=req.bid_id,
            tender_id=bid["tender_id"],
            details={
                "previous_verdict": str(old_verdict),
                "new_verdict": req.new_verdict,
                "reason_category": req.reason_category,
                "justification": req.justification,
                "officer_id": req.officer_id
            }
        )

    return {
        "message": "Officer override recorded successfully in immutable audit ledger.",
        "bid": bid,
        "audit_event": audit_event
    }

@app.post("/api/bids/finalize")
def finalize_decision(req: FinalizeRequest):
    """FR6 / Non-Functional: Officer digital sign-off and lock"""
    bid = next((b for b in BIDS_DB if b["id"] == req.bid_id), None)
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")

    timestamp = datetime.utcnow().isoformat() + "Z"
    bid["officer_sign_off"] = True
    bid["officer_name"] = req.officer_name
    bid["officer_sign_timestamp"] = timestamp

    audit_event = audit_ledger.append_event(
        event_type="BID_DECISION_FINALIZED",
        actor=req.officer_name,
        role="OFFICER",
        bid_id=req.bid_id,
        tender_id=bid["tender_id"],
        details={
            "final_verdict": bid["overall_verdict"],
            "decision_summary": req.decision_summary,
            "officer_id": req.officer_id,
            "timestamp": timestamp,
            "legal_note": "Final officer compliance determination executed pursuant to GeM Procurement Guidelines."
        }
    )

    return {
        "message": "Bid compliance verdict officially signed off and locked.",
        "bid": bid,
        "audit_event": audit_event
    }

@app.get("/api/audit-trail")
def get_audit_trail(bid_id: Optional[str] = None):
    """FR7: Immutable timestamped audit trail"""
    return audit_ledger.get_events(bid_id)

@app.get("/api/audit-trail/verify")
def verify_audit_trail():
    """Verify cryptographic chain integrity"""
    return audit_ledger.verify_chain_integrity()

@app.get("/api/registry/gstin/{gstin}")
def lookup_gstin(gstin: str):
    """FR11: Simulated GSTN Portal API"""
    return RegistryMockService.verify_gstin(gstin)

@app.get("/api/registry/udyam/{udyam_no}")
def lookup_udyam(udyam_no: str):
    """FR11: Simulated Udyam MSME Registry"""
    return RegistryMockService.verify_udyam(udyam_no)

@app.post("/api/guardrail/scan")
def scan_adversarial_text(payload: Dict[str, Any]):
    """FR12: Guardrails against prompt-injection"""
    text = payload.get("text", "")
    doc_name = payload.get("document_name", "Test_Input_File.pdf")
    page = payload.get("page_number", 1)
    return PromptInjectionGuardrail.scan_text(text, doc_name, page)

@app.get("/api/report/{bid_id}")
def generate_report(bid_id: str):
    """FR8: Compliance report export data"""
    bid = next((b for b in BIDS_DB if b["id"] == bid_id), None)
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")

    return {
        "tender": CURRENT_TENDER,
        "bid": bid,
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "audit_chain_head": audit_ledger.chain[-1]["hash"],
        "export_reference": f"GEM-COMP-REP-{bid_id}-{int(datetime.utcnow().timestamp())}"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
