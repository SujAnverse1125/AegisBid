import React from 'react';
import { Radio, Wallet, LogOut, FileText } from 'lucide-react';
import { MidnightNetwork, WalletState } from '../domain/types';

export type NavigationTab = 'overview' | 'auctions' | 'bidder' | 'privacy' | 'assistant' | 'metrics';

interface HeaderProps {
  wallet: WalletState;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  onNetworkChange: (network: MidnightNetwork) => void;
  userName?: string | null;
  recentReceiptsCount?: number;
  onOpenReceipts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  activeTab,
  onSelectTab,
  onOpenWalletModal,
  onDisconnectWallet,
  onNetworkChange,
  userName,
  recentReceiptsCount = 0,
  onOpenReceipts,
}) => {
  return (
    <header className="header-bar header-grid" style={{ width: '100vw' }}>
      <div className="brand-section" style={{ padding: '1.25rem 2.5rem', borderRight: '2px solid var(--border-strong)' }}>
          <div className="brand-logo" onClick={() => onSelectTab('overview')}>
            AEGISBID
          </div>
          <span className="brand-tag">Sealed-Bid Protocol</span>
        </div>

        <nav style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', width: '100%' }}>
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => onSelectTab('overview')}
            style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, border: 'none', color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'auctions' ? 'active' : ''}`}
            onClick={() => onSelectTab('auctions')}
            style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, border: 'none', color: activeTab === 'auctions' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            Tenders
          </button>
          <button
            className={`tab-btn ${activeTab === 'bidder' ? 'active' : ''}`}
            onClick={() => onSelectTab('bidder')}
            style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, border: 'none', color: activeTab === 'bidder' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            Bidder Haven
          </button>
          <button
            className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => onSelectTab('privacy')}
            style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, border: 'none', color: activeTab === 'privacy' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            Privacy
          </button>
          <button
            className={`tab-btn ${activeTab === 'assistant' ? 'active' : ''}`}
            onClick={() => onSelectTab('assistant')}
            style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, border: 'none', color: activeTab === 'assistant' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            Advisor
          </button>
          <button
            className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => onSelectTab('metrics')}
            style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, border: 'none', color: activeTab === 'metrics' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            Metrics
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end', paddingRight: '2rem' }}>
          <select
            className="form-select"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', border: '1px solid var(--border-medium)', background: 'transparent' }}
            value={wallet.network}
            onChange={(e) => onNetworkChange(e.target.value as MidnightNetwork)}
          >
            <option value="mainnet">Mainnet</option>
            <option value="preprod">Preprod</option>
            <option value="preview">Preview</option>
          </select>

          {recentReceiptsCount > 0 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenReceipts}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderColor: 'var(--accent-vermilion)',
                color: 'var(--accent-vermilion)',
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                fontWeight: 700,
                background: 'var(--bg-core)',
              }}
              title="View Cryptographic Receipts"
            >
              <FileText size={12} />
              RECEIPTS ({recentReceiptsCount})
            </button>
          )}

          {wallet.connected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className={`badge ${wallet.isDemo ? 'badge-amber' : 'badge-mint'}`}>
                <Wallet size={12} />
                {wallet.is1AM ? '1AM' : wallet.isDemo ? 'DEMO' : 'CONNECTED'}
              </span>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {wallet.unshieldedAddress.slice(0, 6)}...{wallet.unshieldedAddress.slice(-4)}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={onDisconnectWallet}
                title="Disconnect"
                style={{ padding: '0.4rem' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onOpenWalletModal}>
              <Wallet size={14} />
              Connect Wallet
            </button>
          )}
        </div>
    </header>
  );
};

