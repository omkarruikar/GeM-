from typing import Dict, Any, Optional, List
from datetime import datetime

class RegistryMockService:
    """
    Central Government Automated Portals & Regulatory Database Verification Adapters:
    1. GSTN (Goods and Services Tax Network)
    2. Ministry of MSME Udyam Portal
    3. Income Tax Department / NSDL PAN Portal (26AS & Sec 206AB)
    4. EPFO Shram Suvidha Portal
    5. ESIC National Database
    6. DPIIT Startup India Portal
    7. NSIC Single Point Registration Scheme (SPRS)
    8. Central OEM Vendor Master
    9. DigiLocker National Document Depository (Govt. of India)
    10. Central Debarment Watchlist (CPPP / GeM IMS / MoPNG)
    """

    GSTN_DATABASE = {
        "33AAACL1972K1Z9": {
            "legal_name": "Larsen & Toubro Limited",
            "trade_name": "L&T Valves Division",
            "status": "ACTIVE",
            "registration_date": "2017-07-01",
            "taxpayer_type": "Regular",
            "state_jurisdiction": "Tamil Nadu (Code 33)",
            "gstr_3b_compliance": "100% Compliant (All 12 recent returns filed)",
            "last_return_period": "August 2026",
            "risk_score": "LOW",
            "is_compliant": True
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
            "risk_score": "LOW",
            "is_compliant": True
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
            "risk_score": "HIGH_ALERT",
            "is_compliant": False
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
            "risk_score": "MEDIUM",
            "is_compliant": True
        }
    }

    UDYAM_DATABASE = {
        "UDYAM-TN-02-0049182": {
            "enterprise_name": "Delta Flowtech Solutions Private Limited",
            "enterprise_type": "Small",
            "major_activity": "Manufacturing",
            "nic_codes": ["28121 - Manufacture of valves and taps", "28199 - Manufacture of machinery"],
            "date_of_incorporation": "2019-10-02",
            "date_of_udyam_reg": "2020-08-15",
            "valid": True,
            "ppp_mse_preference_eligible": True,
            "emd_waiver_applicable": True,
            "turnover_waiver_eligible": True
        }
    }

    PAN_ITD_DATABASE = {
        "AAACL1972K": {
            "legal_name": "LARSEN & TOUBRO LIMITED",
            "status": "ACTIVE",
            "section_206ab_compliant": True,
            "itr_filed_last_3_years": True,
            "valid_ca_udin": "26084920AAAAKL4910"
        },
        "AABCD9842F": {
            "legal_name": "DELTA FLOWTECH SOLUTIONS PRIVATE LIMITED",
            "status": "ACTIVE",
            "section_206ab_compliant": True,
            "itr_filed_last_3_years": True,
            "valid_ca_udin": "26099310BBCC4912"
        },
        "AABCA3319M": {
            "legal_name": "APEX ENGINEERING & EQUIPMENT CORPORATION",
            "status": "ACTIVE",
            "section_206ab_compliant": False, # Non-filer!
            "itr_filed_last_3_years": False,
            "valid_ca_udin": "INVALID_OR_MISSING"
        },
        "AAGCS9912E": {
            "legal_name": "SHADOWTECH DYNAMICS LLC",
            "status": "PROVISIONAL",
            "section_206ab_compliant": False,
            "itr_filed_last_3_years": False,
            "valid_ca_udin": "NONE"
        }
    }

    EPFO_DATABASE = {
        "TN/MAS/0019720/000": {
            "establishment_name": "Larsen & Toubro Limited",
            "status": "ACTIVE",
            "active_workforce": 420,
            "last_ecr_period": "August 2026",
            "defaults": 0
        },
        "TN/MAS/0049182/000": {
            "establishment_name": "Delta Flowtech Solutions Pvt Ltd",
            "status": "ACTIVE",
            "active_workforce": 38,
            "last_ecr_period": "August 2026",
            "defaults": 0
        },
        "DL/CPM/0033190/000": {
            "establishment_name": "Apex Engineering",
            "status": "DEFAULT_NOTICE",
            "active_workforce": 12,
            "last_ecr_period": "December 2025 (Overdue)",
            "defaults": 8
        }
    }

    ESIC_DATABASE = {
        "51000197200000607": { "status": "ACTIVE_COMPLIANT", "last_payment": "August 2026" },
        "51000491820000607": { "status": "ACTIVE_COMPLIANT", "last_payment": "August 2026" },
        "51000331900000607": { "status": "DEFAULT_ALERT", "last_payment": "Overdue" }
    }

    STARTUP_DATABASE = {
        "DIPP98412": {
            "startup_name": "Delta Flowtech Solutions Private Limited",
            "valid": True,
            "eligible_for_turnover_relaxation": True
        }
    }

    NSIC_DATABASE = {
        "NSIC/TN/2022/491": {
            "firm_name": "Delta Flowtech Solutions Private Limited",
            "valid_till": "2027-12-31",
            "monetary_limit": "INR 15.00 Crores",
            "status": "ACTIVE"
        }
    }

    DEBARMENT_BLACKLIST_DATABASE = {
        "07AABCA3319M1ZP": {
            "debarred": True,
            "debarred_by": "State PWD & Central Public Procurement Watch",
            "reason": "Repeated contractual default & forged bank guarantee in Project PR-410",
            "period": "2026-01-10 to 2027-01-09",
            "status": "BLACKLISTED"
        }
    }

    @classmethod
    def verify_gstin(cls, gstin: str) -> Dict[str, Any]:
        cleaned = gstin.strip().upper()
        if cleaned in cls.GSTN_DATABASE:
            rec = cls.GSTN_DATABASE[cleaned]
            return {
                "source": "SIMULATED_GSTN_API_V2",
                "verified": rec["is_compliant"],
                "gstin": cleaned,
                "status": rec["status"],
                "legal_name": rec["legal_name"],
                "gstr_compliance": rec["gstr_3b_compliance"],
                "state": rec["state_jurisdiction"],
                "risk_score": rec["risk_score"],
                "latency_ms": 142,
                "tx_id": f"TX-GSTN-2026-{abs(hash(cleaned)) % 100000}",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        return {
            "source": "SIMULATED_GSTN_API_V2",
            "verified": False,
            "gstin": cleaned,
            "status": "NOT_FOUND",
            "legal_name": "Unknown Entity",
            "gstr_compliance": "Record Not Found in GST Portal",
            "risk_score": "HIGH",
            "latency_ms": 190,
            "tx_id": "TX-GSTN-NOTFOUND",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    @classmethod
    def verify_udyam(cls, udyam_no: Optional[str]) -> Dict[str, Any]:
        if not udyam_no:
            return {
                "source": "SIMULATED_MSME_UDYAM_API",
                "verified": True,
                "enterprise_type": "LARGE_OR_NON_MSME",
                "valid": False,
                "latency_ms": 118,
                "tx_id": "TX-UDYAM-LARGE",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        cleaned = udyam_no.strip().upper()
        if cleaned in cls.UDYAM_DATABASE:
            rec = cls.UDYAM_DATABASE[cleaned]
            return {
                "source": "SIMULATED_MSME_UDYAM_API",
                "verified": True,
                "udyam_number": cleaned,
                "enterprise_name": rec["enterprise_name"],
                "enterprise_type": rec["enterprise_type"],
                "major_activity": rec["major_activity"],
                "valid": rec["valid"],
                "ppp_mse_eligible": rec["ppp_mse_preference_eligible"],
                "emd_waiver_applicable": rec["emd_waiver_applicable"],
                "turnover_waiver_eligible": rec["turnover_waiver_eligible"],
                "latency_ms": 145,
                "tx_id": f"TX-UDYAM-2026-{abs(hash(cleaned)) % 100000}",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        return {
            "source": "SIMULATED_MSME_UDYAM_API",
            "verified": False,
            "udyam_number": cleaned,
            "valid": False,
            "enterprise_type": "INVALID_REGISTRATION",
            "latency_ms": 160,
            "tx_id": "TX-UDYAM-INVALID",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    @classmethod
    def verify_pan_itd(cls, pan: str) -> Dict[str, Any]:
        cleaned = pan.strip().upper()
        if cleaned in cls.PAN_ITD_DATABASE:
            rec = cls.PAN_ITD_DATABASE[cleaned]
            return {
                "source": "SIMULATED_INCOMETAX_NSDL_API",
                "verified": rec["section_206ab_compliant"],
                "pan": cleaned,
                "legal_name": rec["legal_name"],
                "section_206ab_status": "COMPLIANT" if rec["section_206ab_compliant"] else "SPECIFIED_NON_FILER",
                "itr_compliance": "Filed 3 consecutive years" if rec["itr_filed_last_3_years"] else "Defaults detected",
                "ca_udin": rec["valid_ca_udin"],
                "latency_ms": 152,
                "tx_id": f"TX-ITD-2026-{abs(hash(cleaned)) % 100000}",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        return {
            "source": "SIMULATED_INCOMETAX_NSDL_API",
            "verified": False,
            "pan": cleaned,
            "section_206ab_status": "UNVERIFIED",
            "latency_ms": 175,
            "tx_id": "TX-ITD-UNKNOWN",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    @classmethod
    def verify_epfo(cls, code: str) -> Dict[str, Any]:
        cleaned = code.strip().upper()
        if cleaned in cls.EPFO_DATABASE:
            rec = cls.EPFO_DATABASE[cleaned]
            return {
                "source": "SIMULATED_EPFO_SHRAM_SUVIDHA_API",
                "verified": rec["status"] == "ACTIVE",
                "establishment_code": cleaned,
                "status": rec["status"],
                "active_workforce": rec["active_workforce"],
                "last_ecr_period": rec["last_ecr_period"],
                "latency_ms": 165,
                "tx_id": f"TX-EPFO-2026-{abs(hash(cleaned)) % 100000}",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        return {
            "source": "SIMULATED_EPFO_SHRAM_SUVIDHA_API",
            "verified": False,
            "establishment_code": cleaned,
            "status": "NOT_FOUND",
            "latency_ms": 180,
            "tx_id": "TX-EPFO-NOTFOUND",
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
                "latency_ms": 195,
                "tx_id": f"TX-DEBAR-2026-{abs(hash(key)) % 100000}",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        return {
            "source": "SIMULATED_CPPP_DEBARMENT_WATCHLIST",
            "is_debarred": False,
            "status": "CLEAN - No Adverse Records Found across Central Watchlists",
            "latency_ms": 155,
            "tx_id": f"TX-DEBAR-2026-{abs(hash(key)) % 100000}",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    @classmethod
    def verify_all_portals(cls, gstin: str, udyam: Optional[str] = None, pan: Optional[str] = None, epfo: Optional[str] = None) -> List[Dict[str, Any]]:
        gst = cls.verify_gstin(gstin)
        ud = cls.verify_udyam(udyam)
        p = cls.verify_pan_itd(pan or gstin[2:12])
        ep = cls.verify_epfo(epfo or "UNKNOWN")
        deb = cls.check_debarment(gstin, "")
        
        return [
            {
                "portal_id": "PORTAL_GSTN",
                "name": "GSTN Portal API",
                "ministry": "Ministry of Finance",
                "status": "ACTIVE_VERIFIED" if gst["status"] == "ACTIVE" else "SUSPENDED",
                "latency_ms": gst["latency_ms"],
                "tx_id": gst["tx_id"],
                "details": gst
            },
            {
                "portal_id": "PORTAL_UDYAM",
                "name": "Ministry of MSME Udyam Portal",
                "ministry": "Ministry of MSME",
                "status": "ACTIVE_VERIFIED" if ud.get("valid") else "EXEMPTED",
                "latency_ms": ud["latency_ms"],
                "tx_id": ud["tx_id"],
                "details": ud
            },
            {
                "portal_id": "PORTAL_PAN_ITD",
                "name": "Income Tax Department / NSDL PAN",
                "ministry": "CBDT / Ministry of Finance",
                "status": "ACTIVE_VERIFIED" if p.get("verified") else "FLAGGED",
                "latency_ms": p["latency_ms"],
                "tx_id": p["tx_id"],
                "details": p
            },
            {
                "portal_id": "PORTAL_EPFO",
                "name": "EPFO Shram Suvidha Portal",
                "ministry": "Ministry of Labour & Employment",
                "status": "ACTIVE_VERIFIED" if ep.get("verified") else "FLAGGED",
                "latency_ms": ep["latency_ms"],
                "tx_id": ep["tx_id"],
                "details": ep
            },
            {
                "portal_id": "PORTAL_DEBARMENT",
                "name": "Central Debarment & Debarment Watch",
                "ministry": "Ministry of Finance (DoE) / CPPP",
                "status": "FLAGGED" if deb["is_debarred"] else "ACTIVE_VERIFIED",
                "latency_ms": deb["latency_ms"],
                "tx_id": deb["tx_id"],
                "details": deb
            }
        ]
