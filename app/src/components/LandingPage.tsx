import React from 'react';
import { Auction, MidnightNetwork, WalletState } from '../domain/types';
import { Wallet, Shield, Lock, Activity, LogOut, ArrowRight, ArrowUpRight, Radio } from 'lucide-react';
import { NavigationTab } from './Header';

export interface LandingPageProps {
  wallet: WalletState;
  auctions: Auction[];
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectBid: (auction: Auction) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  wallet,
  auctions,
  onNavigateTab,
  onSelectBid,
}) => {
  const [timeStr, setTimeStr] = React.useState<string>(() => new Date().toISOString().split('T')[1].slice(0, 8));
  const [latency, setLatency] = React.useState<number>(12);
  const [blockHeight, setBlockHeight] = React.useState<number>(185420);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toISOString().split('T')[1].slice(0, 8));
      setLatency(Math.floor(11 + Math.random() * 4));
      setBlockHeight(prev => prev + (Math.random() > 0.85 ? 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAuctions = auctions.filter((a) => a.status === 'Open');

  return (
    <div className="brutalist-grid">
      
      {/* Column 1: Far Left - Full Height Editorial Image */}
      <div className="grid-col">
        <div className="editorial-img-container">
          <img src="/editorial-pillar-left.jpg" alt="Stark architectural monolith" style={{ mixBlendMode: 'multiply' }} />
        </div>
      </div>

      {/* Column 2: Navigation & Data Context */}
      <div className="grid-col">
        <div className="content-panel" style={{ height: '100%', background: 'var(--bg-elevated)' }}>
          <h2 className="font-display" style={{ fontSize: '2rem', borderBottom: '2px solid var(--border-strong)', paddingBottom: '1rem', textTransform: 'uppercase' }}>
            System Analytics
          </h2>
          <p style={{ marginTop: '2rem', fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Real-time monitoring of Zero-Knowledge inputs across the ultra-wide viewport. 
          </p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            <tbody>
              <tr>
                <th style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'left', color: 'var(--text-secondary)' }}>SYS.TIME</th>
                <td style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'right' }}>{timeStr} GMT</td>
              </tr>
              <tr>
                <th style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'left', color: 'var(--text-secondary)' }}>BLOCK HEIGHT</th>
                <td style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'right' }}>#{blockHeight}</td>
              </tr>
              <tr>
                <th style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'left', color: 'var(--text-secondary)' }}>NETWORK</th>
                <td style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'right' }}>{wallet.network.toUpperCase()}</td>
              </tr>
              <tr>
                <th style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'left', color: 'var(--text-secondary)' }}>ACTIVE TENDERS</th>
                <td style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'right' }}>{activeAuctions.length}</td>
              </tr>
              <tr>
                <th style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'left', color: 'var(--text-secondary)' }}>WALLET ENCLAVE</th>
                <td style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'right' }}>
                  {wallet.connected && wallet.unshieldedAddress ? `${wallet.unshieldedAddress.slice(0, 6)}...${wallet.unshieldedAddress.slice(-4)}` : 'DISCONNECTED'}
                </td>
              </tr>
              <tr>
                <th style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'left', color: 'var(--text-secondary)' }}>CIRCUIT LATENCY</th>
                <td style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'right' }}>{latency}ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Column 3: Primary Content & Giant Typography */}
      <div className="grid-col">
        <div className="content-panel" style={{ height: '100%' }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '1rem' }}>
            AegisBid Protocol — Midnight Network
          </span>
          <h1 className="font-display" style={{ 
            fontSize: 'clamp(2.25rem, 3.5vw, 4rem)', 
            lineHeight: 1.05, 
            color: 'var(--text-primary)',
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em'
          }}>
            The End of <br />
            <span className="text-vermilion">Margin</span> <br />
            Espionage.
          </h1>
          
          <div style={{ marginTop: 'auto', marginBottom: '1.75rem' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Traditional procurement forces vendors to surrender commercial leverage before contracts are awarded. AegisBid replaces trusted operators with zero-knowledge circuits, guaranteeing absolute price secrecy until settlement.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={() => onNavigateTab('auctions')}>
                View Tenders
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigateTab('bidder')}>
                Bidder Workspace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Column 4: Far Right - Mixed Data & Imagery */}
      <div className="grid-col">
        <div className="editorial-img-container" style={{ height: '60vh', borderBottom: '2px solid var(--border-strong)' }}>
          <img src="/editorial-server-rack.jpg" alt="Cryptography Hardware" style={{ mixBlendMode: 'multiply' }} />
        </div>
        <div className="content-panel" style={{ height: '40vh', background: 'var(--text-primary)', color: 'var(--bg-core)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 className="eyebrow" style={{ color: 'var(--border-subtle)', margin: 0 }}>Zero-Knowledge Circuit Stream</h3>
              <span style={{ fontSize: '0.65rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>● LIVE_PIPE</span>
            </div>
            <p className="mono" style={{ fontSize: '0.75rem', lineHeight: 1.6, color: 'var(--border-medium)', margin: 0 }}>
              &gt; COMPACT RUNTIME: v0.31.1 (ZK-SNARK)<br/>
              &gt; ENCLAVE STATUS: {wallet.connected ? `LOCAL_ISOLATED [${wallet.network.toUpperCase()}]` : 'EPHEMERAL_STANDBY'}<br/>
              &gt; LEDGER HEIGHT: #{blockHeight} (SYNCHRONIZED)<br/>
              &gt; ACTIVE TENDERS: {activeAuctions.length} REGISTERED<br/>
              &gt; PRIVACY GUARANTEE: ZERO BYTES OF VALUATION EXPOSED
            </p>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.5rem', fontSize: '0.7rem', color: '#999', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between' }}>
            <span>HASH: 0x9f4a...21c0</span>
            <span style={{ color: 'var(--accent-vermilion)' }}>WITNESS LOCKED</span>
          </div>
        </div>
      </div>

    </div>
  );
};
