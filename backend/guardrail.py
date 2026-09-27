import re
from typing import Dict, Any, List, Tuple

class PromptInjectionGuardrail:
    """
    Scans extracted document text for adversarial prompt injection,
    jailbreak triggers, hidden instructions, and prompt smuggling attempts.
    """
    PATTERNS = [
        (r"(?i)(?:system\s+override|system\s+prompt|new\s+system\s+instruction)", "SYSTEM_OVERRIDE_DIRECTIVE"),
        (r"(?i)(?:ignore\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions|rules|criteria|prompts))", "IGNORE_INSTRUCTIONS_JAILBREAK"),
        (r"(?i)(?:mark\s+(?:all\s+)?(?:compliance|clauses|verdicts|rules)\s+(?:as\s+)?pass)", "FORCE_PASS_MANIPULATION"),
        (r"(?i)(?:output\s+pass\s+for\s+all|set\s+status\s*:\s*pass)", "FORCED_OUTPUT_DIRECTIVE"),
        (r"(?i)(?:disregard\s+(?:missing|expired)\s+(?:certificates|iso|turnover))", "CRITERIA_SUPPRESSION_ATTEMPT"),
        (r"(?i)(?:you\s+are\s+now\s+in\s+developer\s+mode|roleplay\s+as\s+an\s+approver)", "ROLE_PLAY_HIJACKING"),
        (r"(?i)(?:executive\s+clearance\s+from\s+ministry|pre-approved\s+by\s+director\s+general)", "FAKE_AUTHORITY_INJECTION"),
        (r"(?i)(?:<\|im_start\|>|<\|system\|>|###\s*instruction:|\[INST\])", "LLM_SPECIAL_TOKEN_SMUGGLING")
    ]

    @classmethod
    def scan_text(cls, text: str, document_name: str, page_number: int) -> Dict[str, Any]:
        detected_threats: List[Dict[str, str]] = []

        # Check for zero-width spaces / hidden Unicode characters used for smuggling
        zero_width_chars = len(re.findall(r'[\u200B-\u200D\uFEFF]', text))
        if zero_width_chars > 3:
            detected_threats.append({
                "pattern": "UNICODE_ZERO_WIDTH_OBSFUCATION",
                "matched_text": f"Found {zero_width_chars} zero-width / steganographic characters",
                "severity": "HIGH"
            })

        for pattern, threat_type in cls.PATTERNS:
            matches = list(re.finditer(pattern, text))
            for match in matches:
                # Capture context around the match
                start = max(0, match.start() - 30)
                end = min(len(text), match.end() + 30)
                context = text[start:end].strip()
                detected_threats.append({
                    "pattern": threat_type,
                    "matched_text": match.group(0),
                    "context_snippet": context,
                    "severity": "CRITICAL"
                })

        is_threat = len(detected_threats) > 0

        result = {
            "is_adversarial": is_threat,
            "threat_count": len(detected_threats),
            "threats": detected_threats,
            "document_name": document_name,
            "page_number": page_number,
            "action_taken": "ISOLATE_AND_FLAG" if is_threat else "PASS_CLEAN",
            "mitigation_summary": (
                f"BLOCKED: Malicious prompt injection attempt detected on {document_name} (Page {page_number}). "
                "Document payload isolated from AI semantic prompt. Automatic security alert raised in audit trail."
            ) if is_threat else "Content sanitized: No adversarial patterns detected."
        }
        return result

    @classmethod
    def sanitize_for_llm(cls, text: str) -> str:
        """
        Strips suspected prompt injection patterns before passing text to semantic evaluator.
        """
        sanitized = text
        for pattern, _ in cls.PATTERNS:
            sanitized = re.sub(pattern, "[MALICIOUS_PAYLOAD_REDACTED_BY_GUARDRAIL]", sanitized)
        return sanitized
