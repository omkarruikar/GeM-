from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum

class VerdictStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    REVIEW = "REVIEW"

class RoleEnum(str, Enum):
    OFFICER = "officer"
    BIDDER = "bidder"
    ADMIN = "admin"
    AUDITOR = "auditor"

class EvidenceCitation(BaseModel):
    document_id: str
    document_name: str
    page_number: int
    extracted_snippet: str
    confidence_score: float = Field(default=0.95, ge=0.0, le=1.0)
    bounding_box: Optional[Dict[str, float]] = None # {"top": 120, "left": 50, "width": 400, "height": 80}

class ClauseRequirement(BaseModel):
    clause_id: str
    clause_code: str # e.g. "CL-3.1"
    title: str
    category: str # "Financial", "Technical/Experience", "Statutory", "Quality/HSE", "Integrity", "MakeInIndia"
    description: str
    rule_type: str # "NUMERIC_MIN", "MATCH_ANY_WORK_ORDER", "REGISTRY_VERIFY", "CERTIFICATE_VALIDITY", "AFFIDAVIT_AGE"
    parameters: Dict[str, Any]
    mandatory: bool = True
    msme_exemptible: bool = False
    ai_semantic_check_enabled: bool = False

class ClauseEvaluationResult(BaseModel):
    clause_id: str
    clause_code: str
    title: str
    category: str
    rule_verdict: VerdictStatus
    semantic_verdict: Optional[VerdictStatus] = None
    final_verdict: VerdictStatus
    confidence: float
    reasoning: str
    citations: List[EvidenceCitation] = []
    rule_logic_applied: str
    is_overridden: bool = False
    override_reason: Optional[str] = None
    override_officer: Optional[str] = None
    override_timestamp: Optional[str] = None
    prompt_injection_flagged: bool = False

class BidderDocument(BaseModel):
    id: str
    name: str
    doc_type: str # "GST_CERT", "UDYAM_CERT", "TURNOVER_CA", "WORK_ORDER", "ISO_9001", "ISO_45001", "AFFIDAVIT", "LOCAL_CONTENT"
    file_size_kb: int
    upload_timestamp: str
    page_count: int
    extracted_fields: Dict[str, Any]
    raw_text_pages: List[str]
    ocr_confidence: float = 0.96

class RegistryStatus(BaseModel):
    entity_name: str
    gstin: Optional[str] = None
    gst_status: str # "ACTIVE", "SUSPENDED", "CANCELLED"
    gst_filing_compliance: str # "GSTR-1 & 3B Compliant", "Non-compliant (4 defaults)"
    udyam_registration: Optional[str] = None
    udyam_valid: bool = False
    enterprise_type: Optional[str] = None # "Micro", "Small", "Medium"
    debarment_status: str # "CLEAN - No active debarment", "BLACKLISTED"
    verified_at: str

class BidSubmission(BaseModel):
    id: str
    tender_id: str
    bidder_name: str
    bidder_type: str # "MSME_SMALL", "LARGE_ENTERPRISE", "DEFECTIVE", "ADVERSARIAL"
    gstin: str
    udyam_number: Optional[str] = None
    submission_timestamp: str
    documents: List[BidderDocument]
    registry_status: RegistryStatus
    evaluations: List[ClauseEvaluationResult] = []
    overall_verdict: VerdictStatus = VerdictStatus.REVIEW
    officer_sign_off: bool = False
    officer_name: Optional[str] = None
    officer_sign_timestamp: Optional[str] = None
    security_alert: Optional[Dict[str, Any]] = None
    pan: Optional[str] = None
    cin: Optional[str] = None
    epfo_code: Optional[str] = None
    esic_code: Optional[str] = None
    compliance_score: Optional[int] = None
    risk_level: Optional[str] = None
    risk_label: Optional[str] = None
    risk_color: Optional[str] = None
    quoted_price_inr: Optional[float] = None
    score_breakdown: Optional[Dict[str, Any]] = None
    portal_verifications: Optional[List[Dict[str, Any]]] = None
    digilocker_verification: Optional[Dict[str, Any]] = None
    make_in_india: Optional[Dict[str, Any]] = None
    ai_anomalies: Optional[List[Dict[str, Any]]] = None
    officer_recommendation: Optional[Dict[str, Any]] = None

class Tender(BaseModel):
    id: str
    tender_number: str
    title: str
    organization: str
    division: str
    estimated_value_inr: float
    emd_amount_inr: float
    submission_deadline: str
    clauses: List[ClauseRequirement]
    category_id: str

class OverrideRequest(BaseModel):
    bid_id: str
    clause_id: Optional[str] = None # None means overall verdict override
    new_verdict: VerdictStatus
    reason_category: str # "GFR_RULE_173_DISCRETION", "MSME_RELAXATION_APPROVED", "TYPO_VERIFIED_VIA_DIGILOCKER", "SPECIAL_COMMITTEE_APPROVAL"
    justification: str
    officer_id: str
    officer_name: str

class FinalizeRequest(BaseModel):
    bid_id: str
    officer_id: str
    officer_name: str
    decision_summary: str

class AuditEvent(BaseModel):
    block_index: int
    timestamp: str
    event_type: str # "TENDER_INGESTION", "EVIDENCE_EXTRACTION", "RULE_EVALUATION", "AI_SEMANTIC_CHECK", "SECURITY_ALERT", "OFFICER_OVERRIDE", "FINAL_DECISION"
    actor: str
    role: str
    bid_id: Optional[str] = None
    tender_id: Optional[str] = None
    details: Dict[str, Any]
    previous_hash: str
    hash: str
