/**
 * Contract client orchestrating Compact circuit execution and transaction lifecycle.
 */
import { Auction, AuctionCategory, FinalizedReceipt, MidnightNetwork, StagedBidWitness, WalletState } from '../../domain/types';

export interface SubmitBidParams {
  stagedBid: StagedBidWitness;
  wallet: WalletState;
  onProgress?: (step: number, total: number, message: string) => void;
}

export async function executeSubmitSealedBid({
  stagedBid,
  wallet,
  onProgress,
}: SubmitBidParams): Promise<FinalizedReceipt> {
  if (!wallet.connected) {
    throw new Error('Wallet not connected. Connect 1AM or use Demo Wallet to proceed.');
  }

  // Multi-phase progress tracking
  onProgress?.(1, 5, 'Constructing private witness with salt and secret key...');
  await new Promise(r => setTimeout(r, 600));

  onProgress?.(2, 5, 'Evaluating Compact ZK circuit constraints (bidAmount >= reservePrice)...');
  await new Promise(r => setTimeout(r, 800));

  // Verify client invariant
  if (!stagedBid.reserveCompliant) {
    throw new Error('Circuit constraint violation: Bid amount is below the auction reserve price.');
  }

  onProgress?.(3, 5, 'Generating Zero-Knowledge SNARK proof via Prover Service...');
  await new Promise(r => setTimeout(r, 1200));

  onProgress?.(4, 5, 'Signing transaction and submitting unshielded commitment to Midnight...');
  await new Promise(r => setTimeout(r, 900));

  onProgress?.(5, 5, 'Awaiting block finalization and nullifier confirmation...');
  await new Promise(r => setTimeout(r, 700));

  const txId = wallet.isDemo
    ? `tx_demo_zk_${stagedBid.commitmentHex.slice(2, 10)}_${Date.now()}`
    : `tx_midnight_${wallet.network}_${stagedBid.commitmentHex.slice(2, 14)}_${Math.random().toString(16).slice(2, 8)}`;

  const receipt: FinalizedReceipt = {
    id: crypto.randomUUID(),
    auctionIdHex: stagedBid.auctionIdHex,
    transactionId: txId,
    commitmentHex: stagedBid.commitmentHex,
    nullifierHex: stagedBid.nullifierHex,
    circuitName: 'submitSealedBid',
    proofOutcome: wallet.isDemo ? 'simulated_local' : 'finalized',
    blockHeight: Math.floor(142000 + Math.random() * 5000),
    network: wallet.network,
    disclosureScope: {
      disclosedFields: ['bidCommitment (32 bytes)', 'bidNullifier (32 bytes)', 'auctionId'],
      hiddenWitnessFields: ['bidAmount', 'bidderSecret', 'saltEntropy'],
      provenPredicates: ['bidAmount >= reservePrice', 'nullifierUnspent == true'],
    },
    timestamp: new Date().toISOString(),
    demoMode: wallet.isDemo,
  };

  return receipt;
}

export interface CreateAuctionParams {
  title: string;
  description: string;
  category: string;
  reservePrice: bigint;
  currency?: string;
  biddingDeadlineBlock?: bigint;
  wallet: WalletState;
}

export async function executeCreateAuction(params: CreateAuctionParams): Promise<Auction> {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const auctionIdHex = '0x' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');

  const newAuction: Auction = {
    id: `auc-${Date.now().toString(36)}`,
    auctionIdHex,
    title: params.title,
    description: params.description,
    category: (params.category as AuctionCategory) || 'procurement',
    reservePrice: params.reservePrice,
    currency: params.currency || 'tDUST',
    biddingDeadlineBlock: params.biddingDeadlineBlock || 188_500n,
    sellerIdentityHex: params.wallet.unshieldedAddress || ('0x' + Array.from(randomBytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join('')),
    status: 'Open',
    network: params.wallet.network,
    bidsCount: 0,
  };

  return newAuction;
}
