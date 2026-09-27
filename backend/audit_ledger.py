import hashlib
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

class AuditLedger:
    def __init__(self):
        self.chain: List[Dict[str, Any]] = []
        self._create_genesis_block()

    def _create_genesis_block(self):
        genesis_event = {
            "block_index": 0,
            "timestamp": "2026-09-27T08:00:00.000Z",
            "event_type": "SYSTEM_GENESIS",
            "actor": "SYSTEM_INITIALIZER",
            "role": "SYSTEM",
            "bid_id": "SYSTEM_GENESIS",
            "tender_id": "CPCL/MANALI/2026/MECH/VALVES-7741",
            "details": {
                "message": "GeM Bid Compliance Immutable Audit Ledger initialized with SHA-256 cryptographic chain.",
                "organization": "Ministry of Petroleum & Natural Gas / CPCL",
                "security_protocol": "STQC-IS-004-COMPLIANT"
            },
            "previous_hash": "0000000000000000000000000000000000000000000000000000000000000000"
        }
        genesis_event["hash"] = self._compute_hash(genesis_event)
        self.chain.append(genesis_event)

    def _compute_hash(self, block: Dict[str, Any]) -> str:
        # Canonical JSON string excluding hash
        block_copy = {k: v for k, v in block.items() if k != "hash"}
        serialized = json.dumps(block_copy, sort_keys=True, default=str)
        return hashlib.sha256(serialized.encode('utf-8')).hexdigest()

    def append_event(
        self,
        event_type: str,
        actor: str,
        role: str,
        details: Dict[str, Any],
        bid_id: Optional[str] = None,
        tender_id: Optional[str] = None
    ) -> Dict[str, Any]:
        previous_block = self.chain[-1]
        new_block = {
            "block_index": len(self.chain),
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "event_type": event_type,
            "actor": actor,
            "role": role,
            "bid_id": bid_id,
            "tender_id": tender_id,
            "details": details,
            "previous_hash": previous_block["hash"]
        }
        new_block["hash"] = self._compute_hash(new_block)
        self.chain.append(new_block)
        return new_block

    def get_events(self, bid_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if bid_id:
            return [b for b in self.chain if b.get("bid_id") == bid_id or b.get("bid_id") == "SYSTEM_GENESIS"]
        return self.chain

    def verify_chain_integrity(self) -> Dict[str, Any]:
        """Validates the cryptographic chain of custody."""
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            prev = self.chain[i - 1]

            # 1. Check previous hash reference
            if current["previous_hash"] != prev["hash"]:
                return {
                    "valid": False,
                    "tampered_block_index": i,
                    "reason": f"Block #{i} previous_hash does not match block #{i-1} hash!"
                }

            # 2. Check current block hash recalculation
            recomputed = self._compute_hash(current)
            if recomputed != current["hash"]:
                return {
                    "valid": False,
                    "tampered_block_index": i,
                    "reason": f"Block #{i} hash mismatch! Computed {recomputed[:12]} vs stored {current['hash'][:12]}"
                }

        return {
            "valid": True,
            "total_blocks": len(self.chain),
            "head_hash": self.chain[-1]["hash"],
            "verification_status": "Cryptographic chain verified. 100% tamper-free."
        }

# Global Singleton Ledger
audit_ledger = AuditLedger()
