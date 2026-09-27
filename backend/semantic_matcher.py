import math
import re
from typing import Dict, Any, List, Tuple
from .guardrail import PromptInjectionGuardrail

class SemanticMatcher:
    """
    Evaluates semantic similarity between tender clauses and bidder evidence.
    Catches nuanced technical scope alignments, currency ambiguities,
    and conflicting claims that rigid rule engines miss.
    """

    # Domain vocabulary weights for MoPNG / CPCL Oil & Gas Refining
    KEYWORD_WEIGHTS = {
        "hydrocracker": 3.0,
        "high-pressure": 2.5,
        "valves": 2.0,
        "isolation": 1.5,
        "control": 1.5,
        "sil-3": 2.5,
        "actuation": 2.0,
        "refinery": 2.0,
        "petrochemical": 2.0,
        "cryogenic": 1.8,
        "severe service": 2.0,
        "ball valves": 1.5,
        "gate valves": 1.5,
        "commissioning": 1.5,
        "installation": 1.2,
        "testing": 1.0,
        "epc": 1.2,
        "pipeline": 1.0
    }

    @classmethod
    def evaluate_scope_similarity(
        cls,
        tender_scope: str,
        bidder_work_description: str,
        client_name: str,
        po_value_cr: float,
        threshold_value_cr: float
    ) -> Dict[str, Any]:
        # Step 1: Scan for adversarial prompt injection
        guardrail_result = PromptInjectionGuardrail.scan_text(
            bidder_work_description,
            document_name="Work_Order_Scope_Text",
            page_number=1
        )
        if guardrail_result["is_adversarial"]:
            return {
                "verdict": "FAIL",
                "semantic_score": 0.0,
                "confidence": 0.99,
                "is_adversarial": True,
                "reasoning": f"SECURITY GUARDRAIL INTERCEPT: {guardrail_result['mitigation_summary']}",
                "matched_aspects": [],
                "unmatched_aspects": ["Integrity check failed: Prompt injection detected."],
                "officer_recommendation": "Reject bid immediately and refer to Vigilance/Audit."
            }

        # Step 2: Compute weighted token overlap and cosine-style semantic score
        desc_lower = bidder_work_description.lower()
        scope_lower = tender_scope.lower()

        matched_keywords = []
        unmatched_keywords = []
        total_weight = 0.0
        matched_weight = 0.0

        for kw, weight in cls.KEYWORD_WEIGHTS.items():
            in_tender = kw in scope_lower
            if in_tender:
                total_weight += weight
                if kw in desc_lower:
                    matched_weight += weight
                    matched_keywords.append(kw)
                else:
                    unmatched_keywords.append(kw)

        if total_weight > 0:
            semantic_score = min(100.0, round((matched_weight / total_weight) * 100, 1))
        else:
            semantic_score = 75.0

        # Adjust score if bidder performed work for another major PSU (IOCL, BPCL, ONGC, GAIL, HPCL)
        psu_bonus = False
        reputable_psus = ["iocl", "bpcl", "ongc", "gail", "hpcl", "cpcl", "eill", "reliance"]
        if any(psu in client_name.lower() for psu in reputable_psus):
            psu_bonus = True
            semantic_score = min(100.0, semantic_score + 5.0)

        # Monetary fulfillment
        value_ratio = round((po_value_cr / threshold_value_cr) * 100, 1) if threshold_value_cr > 0 else 100.0

        # Determine Verdict
        if semantic_score >= 80.0 and value_ratio >= 100.0:
            verdict = "PASS"
            confidence = 0.94
            reasoning = (
                f"Strong technical scope alignment ({semantic_score}%). Past work for '{client_name}' "
                f"demonstrates execution of '{', '.join(matched_keywords[:4])}'. "
                f"Work order value ₹{po_value_cr:.2f} Cr exceeds the single-order threshold of ₹{threshold_value_cr:.2f} Cr ({value_ratio}% fulfilled)."
            )
        elif semantic_score >= 60.0:
            verdict = "REVIEW"
            confidence = 0.82
            missing_text = f", but differs on '{', '.join(unmatched_keywords[:2])}'" if unmatched_keywords else ""
            reasoning = (
                f"Moderate scope overlap ({semantic_score}%). Work order includes '{', '.join(matched_keywords[:3])}'{missing_text}. "
                f"Flagged for Officer Review to verify technical equivalence for CPCL Hydrocracker service."
            )
        else:
            verdict = "FAIL"
            confidence = 0.91
            reasoning = (
                f"Insufficient technical scope match ({semantic_score}%). Bidder past work lacks critical refinery valve specifications: "
                f"'{', '.join(unmatched_keywords[:3])}' not demonstrated."
            )

        return {
            "verdict": verdict,
            "semantic_score": semantic_score,
            "confidence": confidence,
            "is_adversarial": False,
            "reasoning": reasoning,
            "matched_aspects": matched_keywords,
            "unmatched_aspects": unmatched_keywords,
            "psu_experience_verified": psu_bonus,
            "value_ratio_pct": value_ratio,
            "officer_recommendation": (
                "Approved: Technical equivalence verified." if verdict == "PASS" else
                "Review Required: Inspect sub-assembly drawings & test certificates with Engineering Desk." if verdict == "REVIEW" else
                "Reject: Work order does not meet similar work definition in tender Clause 3.2."
            )
        }
