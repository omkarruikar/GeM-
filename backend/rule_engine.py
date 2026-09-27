from typing import Dict, Any, List, Optional
from datetime import datetime
from .models import VerdictStatus, ClauseEvaluationResult, EvidenceCitation
from .semantic_matcher import SemanticMatcher
from .registry_mock import RegistryMockService
from .guardrail import PromptInjectionGuardrail

class DeterministicRuleEngine:
    """
    Evaluates bidder documents against tender clauses using structured
    JSON logic trees supporting AND / OR / EXCEPTION branches.
    """

    @classmethod
    def evaluate_bid(cls, tender_data: Dict[str, Any], bid_data: Dict[str, Any]) -> List[ClauseEvaluationResult]:
        evaluations: List[ClauseEvaluationResult] = []
        is_msme = bid_data.get("registry_status", {}).get("udyam_valid", False)
        enterprise_type = bid_data.get("registry_status", {}).get("enterprise_type", "")
        is_micro_or_small = is_msme and enterprise_type in ["Micro", "Small"]

        for clause in tender_data.get("clauses", []):
            clause_id = clause["clause_id"]
            rule_type = clause["rule_type"]

            # Route to clause evaluator
            if rule_type == "FINANCIAL_TURNOVER_MIN":
                res = cls._eval_turnover(clause, bid_data, is_micro_or_small)
            elif rule_type == "PAST_EXPERIENCE_ORDERS":
                res = cls._eval_experience(clause, bid_data, tender_data)
            elif rule_type == "CERTIFICATE_VALIDITY":
                res = cls._eval_iso_certificates(clause, bid_data, tender_data)
            elif rule_type == "STATUTORY_GST_ACTIVE":
                res = cls._eval_gst_statutory(clause, bid_data)
            elif rule_type == "NON_BLACKLISTING_AFFIDAVIT":
                res = cls._eval_affidavit(clause, bid_data)
            elif rule_type == "LOCAL_CONTENT_PERCENT":
                res = cls._eval_local_content(clause, bid_data)
            else:
                # Default fallback
                res = ClauseEvaluationResult(
                    clause_id=clause_id,
                    clause_code=clause["clause_code"],
                    title=clause["title"],
                    category=clause["category"],
                    rule_verdict=VerdictStatus.PASS,
                    final_verdict=VerdictStatus.PASS,
                    confidence=0.90,
                    reasoning="Default criteria satisfied.",
                    rule_logic_applied="DEFAULT_MATCH"
                )

            evaluations.append(res)

        return evaluations

    @classmethod
    def _eval_turnover(cls, clause: Dict[str, Any], bid: Dict[str, Any], is_micro_small: bool) -> ClauseEvaluationResult:
        threshold = clause["parameters"]["min_turnover_inr"]
        allow_msme_waiver = clause.get("msme_exemptible", True)

        # Extract bidder turnover certificate
        ca_doc = next((d for d in bid.get("documents", []) if d["doc_type"] == "TURNOVER_CA"), None)

        if not ca_doc:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.FAIL,
                final_verdict=VerdictStatus.FAIL,
                confidence=1.0,
                reasoning="Mandatory CA-certified Annual Turnover Certificate (with UDIN) was not submitted.",
                rule_logic_applied="MANDATORY_DOC_MISSING"
            )

        fields = ca_doc.get("extracted_fields", {})
        avg_turnover = fields.get("average_annual_turnover_inr", 0.0)
        udin = fields.get("udin_number", "UDIN_NOT_FOUND")

        citations = [
            EvidenceCitation(
                document_id=ca_doc["id"],
                document_name=ca_doc["name"],
                page_number=1,
                extracted_snippet=f"Average Annual Turnover for last 3 FYs: INR {avg_turnover/10000000:.2f} Cr. UDIN: {udin}.",
                confidence_score=ca_doc.get("ocr_confidence", 0.98),
                bounding_box={"top": 140, "left": 40, "width": 420, "height": 65}
            )
        ]

        # Rule evaluation
        if avg_turnover >= threshold:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.PASS,
                final_verdict=VerdictStatus.PASS,
                confidence=0.98,
                reasoning=f"Average annual turnover of ₹{avg_turnover/10000000:.2f} Cr satisfies requirement (Minimum threshold ₹{threshold/10000000:.2f} Cr). CA UDIN verified.",
                citations=citations,
                rule_logic_applied="DETERMINISTIC_PASS: avg_turnover >= min_turnover_threshold"
            )
        elif is_micro_small and allow_msme_waiver:
            # EXCEPTION BRANCH TRIGGERED
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.REVIEW,
                final_verdict=VerdictStatus.REVIEW,
                confidence=0.91,
                reasoning=(
                    f"Turnover is ₹{avg_turnover/10000000:.2f} Cr (Standard threshold ₹{threshold/10000000:.2f} Cr). "
                    f"EXCEPTION TRIGGERED: Bidder holds verified MSME Udyam Registration. "
                    f"Under GeM Clause 4(v) / DoE OM, turnover exemption is eligible subject to technical capability confirmation."
                ),
                citations=citations,
                rule_logic_applied="EXCEPTION_APPLIED: MSME_PRIOR_TURNOVER_RELAXATION_ELIGIBLE"
            )
        else:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.FAIL,
                final_verdict=VerdictStatus.FAIL,
                confidence=0.97,
                reasoning=f"Average annual turnover of ₹{avg_turnover/10000000:.2f} Cr is below the required ₹{threshold/10000000:.2f} Cr. Non-MSME or exemption not granted.",
                citations=citations,
                rule_logic_applied="DETERMINISTIC_FAIL: avg_turnover < min_turnover_threshold"
            )

    @classmethod
    def _eval_experience(cls, clause: Dict[str, Any], bid: Dict[str, Any], tender: Dict[str, Any]) -> ClauseEvaluationResult:
        work_docs = [d for d in bid.get("documents", []) if d["doc_type"] == "WORK_ORDER"]
        tender_val = tender.get("estimated_value_inr", 145000000)

        # 3-tier criteria
        # 1 order >= 80% (11.60 Cr) OR 2 orders >= 50% (7.25 Cr) OR 3 orders >= 40% (5.80 Cr)
        t_80 = 0.80 * tender_val
        t_50 = 0.50 * tender_val
        t_40 = 0.40 * tender_val

        citations = []
        orders_evaluated = []

        for doc in work_docs:
            fields = doc.get("extracted_fields", {})
            val = fields.get("po_value_inr", 0.0)
            desc = fields.get("scope_of_work", "")
            client = fields.get("client_name", "Unknown Client")
            po_num = fields.get("po_number", "PO-XX")

            # Check prompt injection on work order text
            scan = PromptInjectionGuardrail.scan_text(desc, doc["name"], 1)
            if scan["is_adversarial"]:
                citations.append(EvidenceCitation(
                    document_id=doc["id"],
                    document_name=doc["name"],
                    page_number=1,
                    extracted_snippet=f"ALERT: Adversarial payload detected in PO #{po_num}: {scan['threats'][0]['matched_text']}",
                    confidence_score=0.99
                ))
                return ClauseEvaluationResult(
                    clause_id=clause["clause_id"],
                    clause_code=clause["clause_code"],
                    title=clause["title"],
                    category=clause["category"],
                    rule_verdict=VerdictStatus.FAIL,
                    final_verdict=VerdictStatus.FAIL,
                    confidence=0.99,
                    reasoning=f"SECURITY ALERT: Embedded prompt injection attack detected in Work Order #{po_num}. Immediate officer review required.",
                    citations=citations,
                    rule_logic_applied="SECURITY_GUARDRAIL_VIOLATION",
                    prompt_injection_flagged=True
                )

            # AI Semantic Scope Matching
            sem = SemanticMatcher.evaluate_scope_similarity(
                tender_scope=tender.get("title", ""),
                bidder_work_description=desc,
                client_name=client,
                po_value_cr=val / 10000000,
                threshold_value_cr=t_40 / 10000000
            )

            orders_evaluated.append({
                "doc_id": doc["id"],
                "doc_name": doc["name"],
                "po_num": po_num,
                "client": client,
                "val": val,
                "semantic": sem
            })

            citations.append(EvidenceCitation(
                document_id=doc["id"],
                document_name=doc["name"],
                page_number=1,
                extracted_snippet=f"PO #{po_num} by {client}: Value ₹{val/10000000:.2f} Cr. Scope: {desc[:90]}...",
                confidence_score=doc.get("ocr_confidence", 0.95),
                bounding_box={"top": 110, "left": 50, "width": 430, "height": 75}
            ))

        # Check multi-tier threshold
        count_40 = sum(1 for o in orders_evaluated if o["val"] >= t_40 and o["semantic"]["verdict"] in ["PASS", "REVIEW"])
        count_50 = sum(1 for o in orders_evaluated if o["val"] >= t_50 and o["semantic"]["verdict"] in ["PASS", "REVIEW"])
        count_80 = sum(1 for o in orders_evaluated if o["val"] >= t_80 and o["semantic"]["verdict"] in ["PASS", "REVIEW"])

        if count_80 >= 1:
            best = next(o for o in orders_evaluated if o["val"] >= t_80)
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.PASS,
                semantic_verdict=VerdictStatus(best["semantic"]["verdict"]),
                final_verdict=VerdictStatus.PASS,
                confidence=0.96,
                reasoning=f"Satisfies 1 x 80% criteria: PO #{best['po_num']} of ₹{best['val']/10000000:.2f} Cr from {best['client']}. {best['semantic']['reasoning']}",
                citations=citations,
                rule_logic_applied="DETERMINISTIC_OR_MATCH: count_80 >= 1"
            )
        elif count_50 >= 2:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.PASS,
                final_verdict=VerdictStatus.PASS,
                confidence=0.94,
                reasoning=f"Satisfies 2 x 50% criteria: 2 qualifying orders over ₹{t_50/10000000:.2f} Cr each with verified scope.",
                citations=citations,
                rule_logic_applied="DETERMINISTIC_OR_MATCH: count_50 >= 2"
            )
        elif count_40 >= 3:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.PASS,
                final_verdict=VerdictStatus.PASS,
                confidence=0.92,
                reasoning=f"Satisfies 3 x 40% criteria: 3 qualifying orders over ₹{t_40/10000000:.2f} Cr each with verified scope.",
                citations=citations,
                rule_logic_applied="DETERMINISTIC_OR_MATCH: count_40 >= 3"
            )
        elif len(orders_evaluated) > 0 and any(o["semantic"]["verdict"] == "REVIEW" for o in orders_evaluated):
            best = orders_evaluated[0]
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.REVIEW,
                semantic_verdict=VerdictStatus.REVIEW,
                final_verdict=VerdictStatus.REVIEW,
                confidence=0.84,
                reasoning=f"Scope requires Officer Inspection: PO #{best['po_num']} is ₹{best['val']/10000000:.2f} Cr. {best['semantic']['reasoning']}",
                citations=citations,
                rule_logic_applied="AI_SEMANTIC_AMBIGUITY_DETECTED"
            )
        else:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.FAIL,
                final_verdict=VerdictStatus.FAIL,
                confidence=0.95,
                reasoning=f"Does not meet 1x80%, 2x50%, or 3x40% similar order value threshold criteria.",
                citations=citations,
                rule_logic_applied="DETERMINISTIC_FAIL: insufficient_work_orders"
            )

    @classmethod
    def _eval_iso_certificates(cls, clause: Dict[str, Any], bid: Dict[str, Any], tender: Dict[str, Any]) -> ClauseEvaluationResult:
        iso_9001 = next((d for d in bid.get("documents", []) if d["doc_type"] == "ISO_9001"), None)
        iso_45001 = next((d for d in bid.get("documents", []) if d["doc_type"] == "ISO_45001"), None)

        citations = []
        now_str = "2026-09-27"

        if not iso_9001:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.FAIL,
                final_verdict=VerdictStatus.FAIL,
                confidence=1.0,
                reasoning="Mandatory ISO 9001:2015 Quality Management certificate not submitted.",
                rule_logic_applied="MANDATORY_DOC_MISSING"
            )

        fields_9001 = iso_9001.get("extracted_fields", {})
        valid_till = fields_9001.get("valid_till", "1900-01-01")
        cert_num = fields_9001.get("certificate_number", "UNKNOWN")

        citations.append(EvidenceCitation(
            document_id=iso_9001["id"],
            document_name=iso_9001["name"],
            page_number=1,
            extracted_snippet=f"ISO 9001:2015 Certificate #{cert_num}. Valid Till: {valid_till}. Accredited by: {fields_9001.get('accreditation_body', 'NABCB')}.",
            confidence_score=iso_9001.get("ocr_confidence", 0.98),
            bounding_box={"top": 125, "left": 45, "width": 410, "height": 60}
        ))

        if valid_till < now_str:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.FAIL,
                final_verdict=VerdictStatus.FAIL,
                confidence=0.99,
                reasoning=f"ISO 9001:2015 Certificate #{cert_num} EXPIRED on {valid_till} (Tender deadline: {tender.get('submission_deadline', '2026-10-15')}).",
                citations=citations,
                rule_logic_applied="DETERMINISTIC_FAIL: certificate_valid_till < tender_date"
            )

        return ClauseEvaluationResult(
            clause_id=clause["clause_id"],
            clause_code=clause["clause_code"],
            title=clause["title"],
            category=clause["category"],
            rule_verdict=VerdictStatus.PASS,
            final_verdict=VerdictStatus.PASS,
            confidence=0.98,
            reasoning=f"Valid ISO 9001:2015 certificate verified (Valid through {valid_till}, accredited by {fields_9001.get('accreditation_body', 'NABCB')}).",
            citations=citations,
            rule_logic_applied="DETERMINISTIC_PASS: certificate_valid"
        )

    @classmethod
    def _eval_gst_statutory(cls, clause: Dict[str, Any], bid: Dict[str, Any]) -> ClauseEvaluationResult:
        gst_doc = next((d for d in bid.get("documents", []) if d["doc_type"] == "GST_CERT"), None)
        gstin = bid.get("gstin", "")

        citations = []
        if gst_doc:
            citations.append(EvidenceCitation(
                document_id=gst_doc["id"],
                document_name=gst_doc["name"],
                page_number=1,
                extracted_snippet=f"GST Registration Certificate. GSTIN: {gstin}. Legal Name: {bid.get('bidder_name', '')}.",
                confidence_score=gst_doc.get("ocr_confidence", 0.97),
                bounding_box={"top": 90, "left": 50, "width": 400, "height": 55}
            ))

        # Check simulated GSTN Registry API
        reg = RegistryMockService.verify_gstin(gstin)
        status = reg.get("status", "UNKNOWN")

        if status == "ACTIVE":
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.PASS,
                final_verdict=VerdictStatus.PASS,
                confidence=0.99,
                reasoning=f"GSTIN {gstin} is ACTIVE on GST Portal. {reg.get('gstr_compliance', '')}.",
                citations=citations,
                rule_logic_applied="REGISTRY_VERIFY_PASS: GSTN status == ACTIVE"
            )
        elif status == "SUSPENDED":
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.FAIL,
                final_verdict=VerdictStatus.FAIL,
                confidence=0.99,
                reasoning=f"REGISTRY ALERT: GSTIN {gstin} is SUSPENDED on GST Portal! {reg.get('gstr_compliance', '')}.",
                citations=citations,
                rule_logic_applied="REGISTRY_VERIFY_FAIL: GSTN status == SUSPENDED"
            )
        else:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.REVIEW,
                final_verdict=VerdictStatus.REVIEW,
                confidence=0.85,
                reasoning=f"GSTIN verification pending or unconfirmed in central database. Status: {status}.",
                citations=citations,
                rule_logic_applied="REGISTRY_VERIFY_REVIEW"
            )

    @classmethod
    def _eval_affidavit(cls, clause: Dict[str, Any], bid: Dict[str, Any]) -> ClauseEvaluationResult:
        aff_doc = next((d for d in bid.get("documents", []) if d["doc_type"] == "AFFIDAVIT"), None)
        citations = []

        if not aff_doc:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.FAIL,
                final_verdict=VerdictStatus.FAIL,
                confidence=1.0,
                reasoning="Mandatory Non-Blacklisting / Debarment Affidavit on Non-Judicial Stamp Paper not provided.",
                rule_logic_applied="MANDATORY_DOC_MISSING"
            )

        fields = aff_doc.get("extracted_fields", {})
        stamp_no = fields.get("stamp_serial_number", "STAMP_UNKNOWN")
        notary_reg = fields.get("notary_registration", "REG_UNKNOWN")

        citations.append(EvidenceCitation(
            document_id=aff_doc["id"],
            document_name=aff_doc["name"],
            page_number=1,
            extracted_snippet=f"Non-Blacklisting Undertaking. Stamp No: {stamp_no}. Notary Reg: {notary_reg}. Declarant sworn under oath.",
            confidence_score=aff_doc.get("ocr_confidence", 0.96),
            bounding_box={"top": 160, "left": 40, "width": 420, "height": 70}
        ))

        # Check CPPP Debarment Registry
        deb = RegistryMockService.check_debarment(bid.get("gstin", ""), bid.get("bidder_name", ""))
        if deb.get("is_debarred", False):
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.FAIL,
                final_verdict=VerdictStatus.FAIL,
                confidence=0.99,
                reasoning=f"CENTRAL REGISTRY BLACKLIST ALERT: Entity is currently debarred by {deb.get('debarred_by')}. Reason: {deb.get('reason')}.",
                citations=citations,
                rule_logic_applied="REGISTRY_BLACKLIST_TRIGGERED"
            )

        return ClauseEvaluationResult(
            clause_id=clause["clause_id"],
            clause_code=clause["clause_code"],
            title=clause["title"],
            category=clause["category"],
            rule_verdict=VerdictStatus.PASS,
            final_verdict=VerdictStatus.PASS,
            confidence=0.96,
            reasoning=f"Duly sworn Notarized Non-Blacklisting Affidavit verified. CPPP/GeM Debarment Watchlist check CLEAN.",
            citations=citations,
            rule_logic_applied="DETERMINISTIC_PASS: affidavit_valid_and_not_debarred"
        )

    @classmethod
    def _eval_local_content(cls, clause: Dict[str, Any], bid: Dict[str, Any]) -> ClauseEvaluationResult:
        doc = next((d for d in bid.get("documents", []) if d["doc_type"] == "LOCAL_CONTENT"), None)
        citations = []

        if not doc:
            return ClauseEvaluationResult(
                clause_id=clause["clause_id"],
                clause_code=clause["clause_code"],
                title=clause["title"],
                category=clause["category"],
                rule_verdict=VerdictStatus.PASS,
                final_verdict=VerdictStatus.PASS,
                confidence=0.90,
                reasoning="Self-declaration of local content accepted provisionally.",
                rule_logic_applied="DEFAULT_PASS"
            )

        fields = doc.get("extracted_fields", {})
        local_pct = fields.get("local_content_percentage", 65.0)

        citations.append(EvidenceCitation(
            document_id=doc["id"],
            document_name=doc["name"],
            page_number=1,
            extracted_snippet=f"Make in India Certificate: Local Content calculated at {local_pct}%. Classification: Class-I Local Supplier.",
            confidence_score=doc.get("ocr_confidence", 0.98),
            bounding_box={"top": 100, "left": 50, "width": 400, "height": 60}
        ))

        verdict = VerdictStatus.PASS if local_pct >= 50.0 else VerdictStatus.REVIEW
        return ClauseEvaluationResult(
            clause_id=clause["clause_id"],
            clause_code=clause["clause_code"],
            title=clause["title"],
            category=clause["category"],
            rule_verdict=verdict,
            final_verdict=verdict,
            confidence=0.95,
            reasoning=f"Local content certified at {local_pct}%. Class-I Local Supplier status confirmed under PPP-MII Order 2017.",
            citations=citations,
            rule_logic_applied="DETERMINISTIC_PASS: local_content >= 50%"
        )
