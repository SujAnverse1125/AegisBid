# AegisBid — Rise In Hackathon Submission Packet

## 1. Project Overview

- **Project Name:** AegisBid
- **Track / Category:** Privacy-Preserving Applications / Smart Compliance & Finance
- **One-Line Pitch:** Confidential Zero-Knowledge Sealed-Bid Procurement & Liquidation Engine on Midnight.
- **Target Platform:** Midnight Network (Compact v0.31.1, Midnight Proof Server 8.1.0, Midnight DApp Connector v4)
- **Live Deployment:** [https://midnight-aegisbid1125.vercel.app/](https://midnight-aegisbid1125.vercel.app/)
- **GitHub Repository:** [https://github.com/SujAnverse1125/AegisBid.git](https://github.com/SujAnverse1125/AegisBid.git)

---

## 2. Real-World Problem & Midnight Solution

### The Problem
Public smart contracts fail at sealed-bid procurement: all bids submitted to the mempool or on-chain are transparent to miners and competitors. This enables front-running, bid-sniping, and competitive espionage. Traditional centralized auction platforms require blind trust in a third-party auctioneer who can collude, leak valuations, or manipulate outcomes.

### The Solution
AegisBid utilizes the **Midnight Network** and **Compact zero-knowledge circuits** to execute sealed-bid auctions with zero data leakage:
1. **Local Witness Generation:** Bidders compute a 32-byte cryptographic Pedersen commitment and an anti-replay nullifier on their local device using random salt entropy and their private key.
2. **Zero-Knowledge Reserve Verification:** The Compact smart contract executes a ZK proof verifying that `bidAmount >= reservePrice` without revealing the valuation to the public or seller.
3. **Anti-Replay Nullifiers:** Spent nullifiers prevent multiple submissions from the same bidder without linking bids to a wallet identity.
4. **Autonomous AI Procurement Compiler:** Directly integrates with Google Cloud Gemini 3.8 Flash inside the client browser to parse RFP requirements and synthesize verifiable ZK proof plans.

---

## 3. Cryptographic Privacy & Disclosure Model

| Observer | What They CAN Learn | What They CANNOT Learn |
|---|---|---|
| **Public Observer / Explorer** | 32-byte commitment hash, 32-byte nullifier, auction ID, block height, reserve compliance boolean (`true`) | Exact bid amount, bidder secret identity, random salt entropy, losing bids |
| **Auction Seller / Verifier** | Proof that bid exceeds reserve price, total bids count, winning bid upon settlement | Non-winning bid amounts, bidder balance, unselected vendor strategy |
| **Gemini AI Assistant** | Public RFP description, procurement category, minimum reserve price threshold | Private witnesses, holder secrets, seed phrases, wallet addresses, raw bids |
| **Central Database (Neon/SQLite)** | Public auction records, finalized transaction IDs, public proof receipts | Confidential witness parameters, user private keys, unshielded values |
| **Local Client Device** | Complete private witness, secret key, salt, exact bid, generated proof | Other participants' private witnesses |

---

## 4. Verification & Testing Evidence

AegisBid includes an automated test matrix with **35+ automated tests** verifying every layer:

- **Compact Smart Contract Tests (`contract/src/aegisbid.test.ts` - 8 tests):**
  - Proves `createAuction` initializes with seller identity and reserve threshold.
  - Verifies `submitSealedBid` enforces reserve price predicate in zero-knowledge.
  - Verifies rejection of bids beneath the reserve price.
  - Verifies double-bidding rejection via nullifier reuse protection.
  - Verifies non-seller rejection on auction cancellation.
- **Frontend & Integration Tests (`app/src/tests/` - 15 tests):**
  - Discovers 1AM wallet provider on `window.midnight` with simulation fallback.
  - Evaluates client-side private witness generation and ephemeral secret storage.
  - Verifies Gemini 3.8/3.5 self-healing model discovery and `AQ.` Authorization Key parsing.
- **Backend Tests (`backend/tests/` - 11 tests):**
  - Confirms schema rejection of confidential witness data.
  - Verifies regex redaction of private keys and valuation tokens before AI transmission.
  - Tests health diagnostics and Neon database connection pool.

---

## 5. Submission Checklist

- [x] Working Compact 0.31.1 smart contract with 5 circuits.
- [x] Modern Japanese Editorial / Swiss Brutalist responsive web application.
- [x] Native 1AM wallet integration with interactive simulation sandbox fallback.
- [x] Direct client-side Google Cloud Gemini 3.8 Flash ZK proof compiler with 2026 `AQ.` auth key support.
- [x] FastAPI async backend with Neon branch-first PostgreSQL schema.
- [x] Comprehensive documentation, privacy matrix, and 60-second walkthrough script.
- [x] GitHub Actions CI/CD pipeline compiling contracts and passing all tests.
- [x] Live public production deployment on Vercel.\n