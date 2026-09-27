# AegisBid: 60-Second Video & Judging Walkthrough

▶️ **Recorded Video Demonstration:** [Watch on Google Drive](https://drive.google.com/file/d/1u8NSukxyiwpSuwenCp-n6fEvgPbmaHdH/view?usp=sharing)

## Scene 1: Problem & Concept (0:00 - 0:15)
- **Visual:** Open AegisBid terminal interface at `http://localhost:5173`.
- **Narration:** *"In public smart contracts, sealed-bid procurement is impossible: bids are transparent, enabling front-running and competitor surveillance. AegisBid solves this on Midnight with zero-knowledge proofs."*
- **Action:** Point out the Swiss Information Design interface, active auctions, and telemetry counters.

## Scene 2: Gemini Proof Planner (0:15 - 0:28)
- **Visual:** Click on the **GEMINI ARCHITECT** tab.
- **Narration:** *"Enter a procurement specification. Gemini parses the tender requirements and formulates a Compact zero-knowledge proof plan. Notice the strict privacy boundary: Gemini only processes sanitized public parameters—zero confidential witnesses are shared."*
- **Action:** Click "GENERATE ZK PROOF PLAN", showing the instant structured response and disclosure breakdown table.

## Scene 3: Sealed-Bid Execution (0:28 - 0:48)
- **Visual:** Navigate back to **AUCTIONS** and click **PLACE SEALED BID** on the Satellite Transceiver tender.
- **Narration:** *"Connect using the 1AM wallet or the interactive sandbox. The bidder enters their valuation, e.g. 150,000 tDUST. In real-time, the client computes the 32-byte commitment and nullifier. Review the disclosure checklist—only the commitment and nullifier will be disclosed."*
- **Action:** Click "GENERATE ZK PROOF & SUBMIT BID". Show the 5-phase proof progress animation.

## Scene 4: Verification & Final Receipt (0:48 - 1:00)
- **Visual:** The **ZK Proof Receipt** appears with checkmarks and transaction hash.
- **Narration:** *"The transaction is confirmed on Midnight Preprod. The circuit proved in zero-knowledge that the bid satisfied the reserve price. The exact valuation remains confidential on the bidder's device."*
- **Action:** Click "DOWNLOAD RECEIPT (.JSON)" to conclude.
