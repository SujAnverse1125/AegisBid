import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, NavigationTab } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuctionList } from './components/AuctionList';
import { BidderHaven } from './components/BidderHaven';
import { PrivacyBoundaryView } from './components/PrivacyBoundaryView';
import { GeminiAssistantPanel } from './components/GeminiAssistantPanel';
import { MetricsDashboard } from './components/MetricsDashboard';
import { WalletModal } from './components/WalletModal';
import { BidModal } from './components/BidModal';
import { ReceiptModal } from './components/ReceiptModal';
import { MarketingLanding } from './components/MarketingLanding';
import { Auction, FinalizedReceipt, MidnightNetwork, WalletState } from './domain/types';
import { getInitialWalletState } from './lib/midnight/walletConnector';

const INITIAL_AUCTIONS: Auction[] = [
  {
    id: 'auc-001',
    auctionIdHex: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
    title: 'Radiation-Hardened Transceiver Batch Procurement',
    description: 'Defense & Aerospace tender for 500 space-qualified RF transceivers. Strict vendor confidentiality enforced.',
    category: 'procurement',
    reservePrice: 120_000n,
    currency: 'tDUST',
    biddingDeadlineBlock: 185_400n,
    sellerIdentityHex: '0x888877776666555544443333222211110000ffffaaabbbbccccddddeeeeffff',
    status: 'Open',
    network: 'mainnet',
    bidsCount: 4,
  },
  {
    id: 'auc-002',
    auctionIdHex: '0x222233334444555566667777888899990000aaaabbbbccccddddeeeeffff1111',
    title: 'High-Purity Gallium Nitride Wafer Liquidation',
    description: 'Confidential inventory liquidation of 1,200 Grade-A 200mm GaN-on-Si wafers from semiconductor fab upgrade.',
    category: 'liquidation',
    reservePrice: 85_000n,
    currency: 'tDUST',
    biddingDeadlineBlock: 186_200n,
    sellerIdentityHex: '0x77776666555544443333222211110000ffffaaabbbbccccddddeeeeffff2222',
    status: 'Open',
    network: 'mainnet',
    bidsCount: 7,
  },
  {
    id: 'auc-003',
    auctionIdHex: '0x33334444555566667777888899990000aaaabbbbccccddddeeeeffff11112222',
    title: 'Sub-Orbital Optical Telemetry Ground Station Lease',
    description: 'Exclusive 24-month downlink lease for High-Latitude Arctic satellite receiver facility.',
    category: 'spectrum-license',
    reservePrice: 210_000n,
    currency: 'tDUST',
    biddingDeadlineBlock: 184_950n,
    sellerIdentityHex: '0x6666555544443333222211110000ffffaaabbbbccccddddeeeeffff3333',
    status: 'Settled',
    clearedAmount: 245_000n,
    network: 'mainnet',
    bidsCount: 3,
  },
];

export function App() {
  const [enteredApp, setEnteredApp] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [wallet, setWallet] = useState<WalletState>(getInitialWalletState());
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [auctions, setAuctions] = useState<Auction[]>(INITIAL_AUCTIONS);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<FinalizedReceipt | null>(null);
  const [recentReceipts, setRecentReceipts] = useState<FinalizedReceipt[]>([]);

  const handleNetworkChange = (network: MidnightNetwork) => {
    if (wallet.connected && wallet.network !== network) {
      setWallet({
        ...getInitialWalletState(),
        network,
      });
    } else {
      setWallet(prev => ({ ...prev, network }));
    }
  };

  const handleDisconnect = () => {
    setWallet(getInitialWalletState());
  };

  const handleReceiptGenerated = (receipt: FinalizedReceipt) => {
    setActiveReceipt(receipt);
    setRecentReceipts(prev => [receipt, ...prev]);
    setAuctions(prev =>
      prev.map(a =>
        a.auctionIdHex === receipt.auctionIdHex ? { ...a, bidsCount: a.bidsCount + 1 } : a
      )
    );
  };

  return (
    <div className={enteredApp ? "app-container" : ""}>
      {!enteredApp ? (
        <MarketingLanding 
          onEnterWorkspace={(name) => { setUserName(name); setEnteredApp(true); }} 
          wallet={wallet} 
          onConnectWallet={() => setShowWalletModal(true)} 
        />
      ) : (
        <>
          <Header
            wallet={wallet}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenWalletModal={() => setShowWalletModal(true)}
            onDisconnectWallet={handleDisconnect}
            onNetworkChange={handleNetworkChange}
            userName={userName}
            recentReceiptsCount={recentReceipts.length}
            onOpenReceipts={() => {
              if (recentReceipts.length > 0) {
                setActiveReceipt(recentReceipts[0]);
              } else {
                setActiveTab('bidder');
              }
            }}
          />

          <main style={{ position: 'relative', flexGrow: 1, overflowX: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100vw' }}
              >
                {activeTab === 'overview' && (
                  <LandingPage
                    wallet={wallet}
                    auctions={auctions}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onSelectBid={(auc) => setSelectedAuction(auc)}
                  />
                )}

                {activeTab === 'auctions' && (
                  <AuctionList
                    auctions={auctions}
                    recentReceipts={recentReceipts}
                    onSelectBid={(auc) => setSelectedAuction(auc)}
                    onViewReceipt={(rec) => setActiveReceipt(rec)}
                  />
                )}

                {activeTab === 'bidder' && (
                  <BidderHaven
                    wallet={wallet}
                    auctions={auctions}
                    recentReceipts={recentReceipts}
                    onSelectBid={(auc) => setSelectedAuction(auc)}
                    onViewReceipt={(rec) => setActiveReceipt(rec)}
                  />
                )}

                {activeTab === 'privacy' && <PrivacyBoundaryView />}

                {activeTab === 'assistant' && <GeminiAssistantPanel />}

                {activeTab === 'metrics' && (
                  <MetricsDashboard
                    wallet={wallet}
                    auctions={auctions}
                    recentReceipts={recentReceipts}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      )}

      {/* Modals */}
      {showWalletModal && (
        <WalletModal
          network={wallet.network}
          onClose={() => setShowWalletModal(false)}
          onConnected={(connectedState) => setWallet(connectedState)}
        />
      )}

      {selectedAuction && (
        <BidModal
          auction={selectedAuction}
          wallet={wallet}
          onClose={() => setSelectedAuction(null)}
          onReceiptGenerated={handleReceiptGenerated}
          onRequireWallet={() => {
            setSelectedAuction(null);
            setShowWalletModal(true);
          }}
        />
      )}

      {activeReceipt && (
        <ReceiptModal
          receipt={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
}

export default App;
