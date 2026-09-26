# AegisBid

## Application Screenshots


### CI/CD Pipeline & Passing Tests
![Passing Tests](docs/tests-passing.png)

### Authentication Gate
![Landing Page](docs/landing.png)

### Main Workspace
![Workspace](docs/workspace.png)

[![AegisBid CI/CD Pipeline](https://github.com/SujAnverse1125/AegisBid/actions/workflows/ci.yml/badge.svg)](https://github.com/SujAnverse1125/AegisBid/actions/workflows/ci.yml)

> Confidential Zero-Knowledge Sealed-Bid Procurement & Liquidation Engine on Midnight.

AegisBid enables government agencies, defense contractors, and financial institutions to conduct sealed-bid procurement and asset liquidations. Bidders mathematically prove eligibility and reserve-price compliance in zero-knowledge without revealing their exact valuations or bidding strategies.

---

## 1. Product Overview & Real-World Problem

In traditional public smart contract auctions, all bids are visible in the mempool or on-chain. This creates:
1. **Front-running & Sniping:** Malicious actors outbid legitimate participants by tiny increments at the last second.
2. **Strategy Leakage:** Competitors inspect counterparties' financial capacity, pricing models, and commercial margin.

In traditional centralized auctions, bidders must trust a third-party auctioneer who can collude, leak bids, or censor participants.

**AegisBid uses Midnight to eliminate this trade-off:**
- Bidders formulate a **private witness** on their device containing their valuation, secret key, and salt entropy.
- A **Compact zero-knowledge circuit** verifies on-chain that the bid satisfies the reserve price (`bidAmount >= reservePrice`).
- An anti-replay **nullifier** prevents double-bidding without revealing the bidder's identity.
- Winning bids are revealed upon settlement, while all losing bids remain confidential forever.

---

## 2. Privacy Model

| Observer | What They CAN Learn | What They CANNOT Learn |
|---|---|---|
| **Public Observer / Explorer** | 32-byte commitment hash, 32-byte nullifier, auction ID, block height, reserve compliance boolean (`true`) | Exact bid amount, bidder secret identity, random salt entropy, losing bids |
| **Auction Seller / Verifier** | Proof that bid exceeds reserve price, total bids count, winning bid upon settlement | Non-winning bid amounts, bidder balance, unselected vendor strategy |
| **Gemini AI Assistant** | Public RFP description, procurement category, minimum reserve price | Private witnesses, holder secrets, seed phrases, wallet addresses, raw bids |
| **Backend Database (Neon/SQLite)** | Public auction records, finalized transaction IDs, public proof receipts | Confidential witness fields (strictly rejected by Pydantic schema validation) |
| **Local Client Device** | Complete private witness, secret key, salt, exact bid, generated proof | Other participants' private witnesses |

---

## 3. Technology Stack

- **Smart Contract:** Compact 0.31.1 smart contract with 5 circuits (`createAuction`, `submitSealedBid`, `closeBidding`, `revealAndSettle`, `cancelAuction`).
- **Privacy Network:** Midnight Preview and Preprod compatibility, Docker proof server 8.1.0, Compact devtools 0.5.1.
- **Frontend:** React 19, TypeScript, Vite 6, Framer Motion, Midnight DApp Connector v4 (with 1AM wallet priority and interactive simulation fallback), Swiss Information Design system.
- **Backend:** FastAPI, Python 3.12+, SQLAlchemy async, Alembic migrations, Pydantic v2 validation with privacy guardrails.
- **Database:** Neon Postgres (branch-first workflow: direct URL for migrations, pooled URL for API) with SQLite local dev fallback.
- **AI Integration:** Google GenAI SDK (`google-genai`) with regex sanitization, structured output, and deterministic local fallback.
- **CI/CD:** GitHub Actions compiling Compact contracts, verifying ZK artifacts, running 35+ tests across contract, frontend, and backend, and building production bundles.

---

## 4. Quick Start & Local Setup

### Prerequisites
- Node.js 22 or newer
- Python 3.11 or newer
- Docker Desktop (for Midnight proof server)
- WSL2 Ubuntu-22.04 with Compact devtools 0.5.1 (for contract compilation)

### 1. Install Dependencies
```bash
# Install root, frontend, and contract dependencies
npm install

# Install Python backend dependencies
pip install -r backend/requirements.txt
```

### 2. Run Quality Gates & Tests (35 Tests)
```bash
# Run contract & frontend tests (vitest)
npm test

# Run backend tests (pytest)
python -m pytest backend/tests -v

# Run full TypeScript typecheck
npm run typecheck

# Build contract & frontend production bundle
npm run build
```

### 3. Start Local Proof Server (Docker)
```bash
docker compose -f proof-server.yml up -d
docker compose -f proof-server.yml ps
```
The proof server listens on `http://127.0.0.1:6300`.

### 4. Run Development Services
```bash
# Terminal 1: Start FastAPI Backend
uvicorn backend.src.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Start Frontend Application
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 5. Wallet Connection & 1AM Integration

1. Click **Connect Wallet** in the top navigation bar.
2. AegisBid scans `window.midnight` for UUID-keyed providers, prioritizing the **1AM Wallet**.
3. Select your network (**Midnight Preprod** or **Midnight Preview**).
4. If running without browser extensions, click **Launch Demo Simulation Wallet** to test the entire zero-knowledge workflow in an interactive sandbox.
5. Switching networks automatically resets the wallet session to prevent cross-network credential leakage.

---

## 6. Neon Database Setup (Branch-First Workflow)

AegisBid supports Neon's branch-first branching model:
1. Set `DATABASE_URL` in `.env` to your **pooled** Neon connection string (for async API traffic).
2. Set `DIRECT_DATABASE_URL` in `.env` to your **direct** Neon connection string (for Alembic migrations).
3. Run migrations:
```bash
cd backend
alembic upgrade head
```
*(By default, AegisBid falls back to SQLite `sqlite+aiosqlite:///./aegisbid.db` for zero-configuration local development.)*

---

## 7. Gemini Assistant Privacy Boundary

To enable the AI Procurement Architect with live Google GenAI:
1. Set `GEMINI_API_KEY=your_key_here` in `.env`.
2. The backend actively redacts 64-character hex strings, secret clauses, and confidential valuations before transmitting the prompt.
3. If no key is set or the service is offline, AegisBid automatically engages its **deterministic offline proof planner**.

---

## 8. Repository Structure

```text
â”œâ”€â”€ .github/workflows/ci.yml       # GitHub Actions CI/CD pipeline
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ alembic/                   # Alembic migrations & environment
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ config.py              # Environment configuration
â”‚   â”‚   â”œâ”€â”€ database.py            # Async SQLAlchemy connection
â”‚   â”‚   â”œâ”€â”€ models.py              # Public auction & receipt models
â”‚   â”‚   â”œâ”€â”€ schemas.py             # Pydantic schemas with privacy guardrails
â”‚   â”‚   â”œâ”€â”€ gemini_service.py      # Sanitized Google GenAI integration
â”‚   â”‚   â”œâ”€â”€ routes/                # Health, metrics, assistant & receipts
â”‚   â”‚   â””â”€â”€ main.py                # FastAPI application entrypoint
â”‚   â””â”€â”€ tests/                     # Pytest suite (health, privacy, receipts)
â”œâ”€â”€ contract/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ aegisbid.compact       # Compact 0.31.1 smart contract
â”‚   â”‚   â”œâ”€â”€ aegisbid.test.ts       # Contract invariant & ZK circuit tests
â”‚   â”‚   â””â”€â”€ managed/aegisbid/      # Compiled ZK-IR, keys, and JS bindings
â”‚   â””â”€â”€ scripts/compile-contract.mjs
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/            # Header, AuctionList, BidModal, etc.
â”‚   â”‚   â”œâ”€â”€ domain/                # Domain types & client privateState manager
â”‚   â”‚   â”œâ”€â”€ lib/                   # Wallet connector & contract client
â”‚   â”‚   â”œâ”€â”€ tests/                 # Vitest frontend test suite
â”‚   â”‚   â”œâ”€â”€ styles.css             # Swiss Information Design system
â”‚   â”‚   â””â”€â”€ App.tsx                # Application shell
â”‚   â””â”€â”€ index.html
â”œâ”€â”€ docs/                          # Proposal, Privacy Model, Architecture, Demo Script
â”œâ”€â”€ proof-server.yml               # Docker Compose for Midnight proof server
â”œâ”€â”€ .env.example                   # Environment variable template
â””â”€â”€ README.md
```

---

## 9. Honest Limitations & Future Work

- **Asset Settlement:** The current prototype demonstrates cryptographic bid commitment, nullifier enforcement, and reserve verification. Settlement of secondary tokens requires integration with unshielded Midnight tokens or bridge contracts.
- **Tie-Breaking:** If two bidders disclose identical valuations upon settlement, the contract awards the earliest committed block timestamp. Future iterations can implement multi-party threshold decryption.

---

## 10. License

Apache-2.0. Built for the Midnight Privacy Network.

## Privacy Model

AegisBid leverages the Midnight network's zero-knowledge capabilities to ensure maximum privacy.

**What an observer CAN learn:**
- The fact that an auction exists and its public parameters (reserve price, deadline, category).
- The number of bids submitted.
- The cryptographic proof that a bid was processed.
- When an auction is finalized, the total cleared amount.

**What an observer CANNOT learn:**
- The exact bid amount of any participant.
- The identity of the bidder (protected via Pedersen commitments and zero-knowledge proofs).
- Whether a specific bidder met the reserve price (they only see a valid proof of execution).
- The private keys or entropy used to formulate the bid.



