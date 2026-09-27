# AegisBid: Privacy & Disclosure Model

## Kept Private During Proof Generation
- Bidder valuation / exact bid amount
- Bidder private key / secret identity
- Salt entropy / Pedersen blinding factors
- Unsuccessful / losing bids (remain private forever)

## Intentionally Disclosed to Midnight Ledger
- 32-byte Pedersen commitment hash
- 32-byte anti-replay nullifier
- Public auction ID and lot classification
- Verification boolean: `bidAmount >= reservePrice` (satisfied in ZK)
- Winning bid upon auction settlement and closure

## AI Assistant Privacy Enclave
- The client-side Gemini 3.8 Assistant operates within a strictly isolated browser enclave.
- Only the high-level RFP scope description, category, and reserve threshold are processed.
- No private keys, salts, addresses, or bid amounts are ever exposed to Google Cloud or external APIs.\n