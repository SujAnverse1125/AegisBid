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
  const activeAuctions = auctions.filter((a) => a.status === 'Open').slice(0, 3);

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
                <td style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'right' }}>{new Date().toISOString().split('T')[1].slice(0, 8)} GMT</td>
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
                <th style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'left', color: 'var(--text-secondary)' }}>LATENCY</th>
                <td style={{ borderTop: '1px solid var(--border-medium)', padding: '1rem 0', textAlign: 'right' }}>12ms</td>
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
        <div className="content-panel" style={{ height: '40vh', background: 'var(--text-primary)', color: 'var(--bg-core)' }}>
          <h3 className="eyebrow" style={{ color: 'var(--border-subtle)', marginBottom: '1rem' }}>Zero-Knowledge Circuit Stream</h3>
          <p className="mono" style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--border-medium)' }}>
            &gt; INITIALIZING COMPACT 0.31.1...<br/>
            &gt; SECURING ENCLAVE BOUNDARIES...<br/>
            &gt; EVALUATING BID ≥ RESERVE...<br/>
            &gt; ZK PROOF VERIFIED.<br/>
            &gt; 0 BYTES OF DATA DISCLOSED.
          </p>
        </div>
      </div>

    </div>
  );
};
