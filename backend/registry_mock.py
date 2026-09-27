from typing import Dict, Any, Optional
from datetime import datetime

class RegistryMockService:
    """
    Simulated government portal verification adapters for:
    - GSTN (Goods and Services Tax Network)
    - Udyam (Ministry of MSME)
    - CPPP / GeM Central Vendor Debarment / Blacklist Watchlist
    """

    # Simulated Mock Database of Registries
    GSTN_DATABASE = {
        "33AAACL1972K1Z9": {
            "legal_name": "Larsen & Toubro Limited - Valve Manufacturing Division",
            "trade_name": "L&T Valves",
            "status": "ACTIVE",
            "registration_date": "2017-07-01",
            "taxpayer_type": "Regular",
            "state_jurisdiction": "Tamil Nadu (Code 33)",
            "gstr_3b_compliance": "100% Compliant (All 12 recent returns filed)",
            "last_return_period": "August 2026",
            "risk_score": "LOW"
        },
        "33AABCD9842F1Z4": {
            "legal_name": "Delta Flowtech Solutions Private Limited",
            "trade_name": "Delta Flowtech",
            "status": "ACTIVE",
            "registration_date": "2019-11-14",
            "taxpayer_type": "Regular",
            "state_jurisdiction": "Tamil Nadu (Code 33)",
            "gstr_3b_compliance": "Compliant (Last return filed on time)",
            "last_return_period": "August 2026",
            "risk_score": "LOW"
        },
        "07AABCA3319M1ZP": {
            "legal_name": "Apex Engineering & Equipment Corporation",
            "trade_name": "Apex Equipments",
            "status": "SUSPENDED",
            "registration_date": "2018-04-10",
            "taxpayer_type": "Regular",
            "state_jurisdiction": "Delhi (Code 07)",
            "gstr_3b_compliance": "NON-COMPLIANT: 4 consecutive tax returns overdue (Rule 21A suspension)",
            "last_return_period": "April 2026 (Overdue)",
            "risk_score": "HIGH_ALERT"
        },
        "27AAGCS9912E1Z8": {
            "legal_name": "ShadowTech Dynamics LLC",
            "trade_name": "ShadowTech",
            "status": "ACTIVE",
            "registration_date": "2025-01-20",
            "taxpayer_type": "Regular",
            "state_jurisdiction": "Maharashtra (Code 27)",
            "gstr_3b_compliance": "Provisional filing",
            "last_return_period": "July 2026",
            "risk_score": "MEDIUM"
        }
    }

    UDYAM_DATABASE = {
        "UDYAM-TN-02-0049182": {
            "enterprise_name": "Delta Flowtech Solutions Private Limited",
            "enterprise_type": "Small",
            "major_activity": "Manufacturing",
            "nic_codes": ["28121 - Manufacture of valves and taps", "28199 - Manufacture of other general purpose machinery"],
            "date_of_incorporation": "2019-10-02",
            "date_of_udyam_reg": "2020-08-15",
            "valid": True,
            "ppp_mii_preference_eligible": True
        }
    }

    DEBARMENT_BLACKLIST_DATABASE = {
        "07AABCA3319M1ZP": {
            "debarred": True,
            "debarred_by": "State PWD / Central Public Procurement Watch",
            "reason": "Repeated contractual default & forged bank guarantee in Project PR-410",
            "period": "2026-01-10 to 2027-01-09",
            "status": "BLACKLISTED"
        }
    }

    @classmethod
    def verify_gstin(cls, gstin: str) -> Dict[str, Any]:
        cleaned = gstin.strip().upper()
        if cleaned in cls.GSTN_DATABASE:
            record = cls.GSTN_DATABASE[cleaned]
            return {
                "source": "SIMULATED_GSTN_API_V2",
                "verified": True,
                "gstin": cleaned,
                "status": record["status"],
                "legal_name": record["legal_name"],
                "gstr_compliance": record["gstr_3b_compliance"],
                "state": record["state_jurisdiction"],
                "risk_score": record["risk_score"],
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        # Unknown/Unregistered Fallback
        return {
            "source": "SIMULATED_GSTN_API_V2",
            "verified": False,
            "gstin": cleaned,
            "status": "NOT_FOUND",
            "legal_name": "Unknown Entity",
            "gstr_compliance": "Record Not Found in GST Portal",
            "risk_score": "UNKNOWN",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    @classmethod
    def verify_udyam(cls, udyam_no: Optional[str]) -> Dict[str, Any]:
        if not udyam_no:
            return {
                "source": "SIMULATED_MSME_UDYAM_API",
                "verified": False,
                "enterprise_type": "NOT_MSME",
                "valid": False,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        cleaned = udyam_no.strip().upper()
        if cleaned in cls.UDYAM_DATABASE:
            record = cls.UDYAM_DATABASE[cleaned]
            return {
                "source": "SIMULATED_MSME_UDYAM_API",
                "verified": True,
                "udyam_number": cleaned,
                "enterprise_name": record["enterprise_name"],
                "enterprise_type": record["enterprise_type"],
                "major_activity": record["major_activity"],
                "valid": record["valid"],
                "ppp_mii_eligible": record["ppp_mii_preference_eligible"],
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        return {
            "source": "SIMULATED_MSME_UDYAM_API",
            "verified": False,
            "udyam_number": cleaned,
            "valid": False,
            "enterprise_type": "INVALID_REGISTRATION",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    @classmethod
    def check_debarment(cls, gstin_or_pan: str, company_name: str) -> Dict[str, Any]:
        key = gstin_or_pan.strip().upper()
        if key in cls.DEBARMENT_BLACKLIST_DATABASE:
            info = cls.DEBARMENT_BLACKLIST_DATABASE[key]
            return {
                "source": "SIMULATED_CPPP_DEBARMENT_WATCHLIST",
                "is_debarred": True,
                "status": info["status"],
                "debarred_by": info["debarred_by"],
                "reason": info["reason"],
                "period": info["period"],
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        return {
            "source": "SIMULATED_CPPP_DEBARMENT_WATCHLIST",
            "is_debarred": False,
            "status": "CLEAN - No Adverse Records Found",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
