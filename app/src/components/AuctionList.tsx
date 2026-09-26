import React from 'react';
import { Auction } from '../domain/types';
import { Clock, ArrowUpRight, Lock, CheckCircle } from 'lucide-react';

interface AuctionListProps {
  auctions: Auction[];
  onSelectBid: (auction: Auction) => void;
}

export const AuctionList: React.FC<AuctionListProps> = ({ auctions, onSelectBid }) => {
  return (
    <div className="brutalist-grid" style={{ width: '100vw', overflowX: 'hidden' }}>
      
      <div className="grid-col" style={{ gridColumn: 'span 4', borderBottom: '4px solid var(--text-primary)', padding: 0 }}>
        <img 
          src="/brutalist_registry_anchor.jpg" 
          alt="Financial Registry Blueprint" 
          style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} 
        />
      </div>

      <div className="grid-col" style={{ gridColumn: 'span 4', borderBottom: '2px solid var(--text-primary)', padding: '1.75rem 3vw', backgroundColor: 'var(--bg-core)' }}>
        <span className="eyebrow" style={{ display: 'block', color: 'var(--accent-vermilion)', marginBottom: '0.5rem', fontWeight: 600 }}>
          TENDER REGISTRY // FINANCIAL DESK
        </span>
        <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', textTransform: 'uppercase', lineHeight: 1 }}>
          Confidential Procurement
        </h1>
        <p className="mono" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', maxWidth: '80ch', fontWeight: 500, margin: 0 }}>
          CLIENT-SIDE ZERO-KNOWLEDGE PROOFS. NEITHER COMPETING BIDDERS NOR THE PROCUREMENT DESK CAN SEE YOUR VALUATION BEFORE THE DEADLINE.
        </p>
      </div>

      {auctions.map((auction) => (
        <div key={auction.id} className="grid-col" style={{ 
          gridColumn: 'span 1', 
          borderRight: '2px solid var(--text-primary)', 
          borderBottom: '2px solid var(--text-primary)', 
          padding: '1.25rem', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'var(--bg-core)'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--text-primary)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              ID:{auction.auctionIdHex.slice(0, 8)}
            </span>
            <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: auction.status === 'Open' ? 'var(--accent-vermilion)' : 'var(--text-primary)', border: `1px solid ${auction.status === 'Open' ? 'var(--accent-vermilion)' : 'var(--text-primary)'}`, padding: '0.2rem 0.4rem' }}>
              {auction.status.toUpperCase()}
            </span>
          </div>

          <h3 className="font-display" style={{ fontSize: '1.25rem', lineHeight: 1.15, marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            {auction.title}
          </h3>
          
          <p className="mono" style={{ fontSize: '0.8rem', marginBottom: '1.5rem', flexGrow: 1, opacity: 0.8, lineHeight: 1.4 }}>
            {auction.description}
          </p>

          <div style={{ background: 'var(--text-primary)', color: 'var(--bg-core)', padding: '1rem', marginBottom: '1rem' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--bg-core)', opacity: 0.7, fontSize: '0.65rem' }}>RESERVE AMOUNT</span>
            <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {auction.reservePrice.toLocaleString()} {auction.currency}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '1.5rem' }} className="mono">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Clock size={14} /> BLK #{auction.biddingDeadlineBlock.toString()}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Lock size={14} /> BID &ge; RESERVE
            </span>
          </div>

          {auction.status === 'Open' ? (
            <button 
              onClick={() => onSelectBid(auction)}
              style={{
                width: '100%',
                padding: '1.25rem',
                background: 'var(--accent-vermilion)',
                color: 'var(--bg-core)',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textTransform: 'uppercase'
              }}
            >
              SEAL BID <ArrowUpRight size={20} />
            </button>
          ) : (
            <div style={{
              width: '100%',
              padding: '1.25rem',
              background: 'transparent',
              color: 'var(--text-primary)',
              border: '2px solid var(--text-primary)',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textTransform: 'uppercase'
            }}>
              SETTLED <CheckCircle size={20} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
