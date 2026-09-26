import React from 'react';
import { Auction, FinalizedReceipt } from '../domain/types';
import { Clock, ArrowUpRight, Lock, CheckCircle, FileText } from 'lucide-react';

interface AuctionListProps {
  auctions: Auction[];
  recentReceipts?: FinalizedReceipt[];
  onSelectBid: (auction: Auction) => void;
  onViewReceipt?: (receipt: FinalizedReceipt) => void;
}

export const AuctionList: React.FC<AuctionListProps> = ({
  auctions,
  recentReceipts = [],
  onSelectBid,
  onViewReceipt,
}) => {
  return (
    <div className="brutalist-grid" style={{ width: '100vw', overflowX: 'hidden' }}>
      
      {recentReceipts.length > 0 && (
        <div className="grid-col" style={{
          gridColumn: 'span 4',
          background: '#0a0a0a',
          color: '#fff',
          padding: '0.85rem 3vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid var(--accent-vermilion)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={16} style={{ color: 'var(--accent-vermilion)' }} />
            <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
              VAULT ACTIVE: {recentReceipts.length} SEALED PROOF(S) SECURED LOCALLY
            </span>
          </div>
          {onViewReceipt && (
            <button
              onClick={() => onViewReceipt(recentReceipts[0])}
              style={{
                background: '#fff',
                color: '#000',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.35rem 0.75rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textTransform: 'uppercase'
              }}
            >
              INSPECT LATEST RECEIPT &rarr;
            </button>
          )}
        </div>
      )}

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

      {auctions.map((auction) => {
        const userReceipt = recentReceipts?.find((r) => r.auctionIdHex === auction.auctionIdHex);

        return (
          <div key={auction.id} className="grid-col" style={{ 
            gridColumn: 'span 1', 
            borderRight: '2px solid var(--text-primary)', 
            borderBottom: '2px solid var(--text-primary)', 
            padding: '1.25rem', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: userReceipt ? 'var(--bg-elevated, #f3f1ed)' : 'var(--bg-core)'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--text-primary)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                ID:{auction.auctionIdHex.slice(0, 8)}
              </span>
              <span className="mono" style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: userReceipt ? 'var(--status-success, #2e7d32)' : (auction.status === 'Open' ? 'var(--accent-vermilion)' : 'var(--text-primary)'), 
                border: `1px solid ${userReceipt ? 'var(--status-success, #2e7d32)' : (auction.status === 'Open' ? 'var(--accent-vermilion)' : 'var(--text-primary)')}`, 
                padding: '0.2rem 0.4rem',
                backgroundColor: userReceipt ? 'rgba(46, 125, 50, 0.08)' : 'transparent'
              }}>
                {userReceipt ? '✓ BID COMMITTED' : auction.status.toUpperCase()}
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

            {userReceipt ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', marginTop: 'auto' }}>
                <button 
                  onClick={() => onViewReceipt && onViewReceipt(userReceipt)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: '#0a0a0a',
                    color: '#fff',
                    border: '2px solid #0a0a0a',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textTransform: 'uppercase'
                  }}
                >
                  <span>✓ VIEW RECEIPT</span>
                  <FileText size={16} style={{ color: 'var(--accent-vermilion)' }} />
                </button>
                <button
                  onClick={() => onSelectBid(auction)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '0.25rem 0'
                  }}
                >
                  Submit Alternative Valuation
                </button>
              </div>
            ) : auction.status === 'Open' ? (
              <button 
                onClick={() => onSelectBid(auction)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'var(--accent-vermilion)',
                  color: 'var(--bg-core)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textTransform: 'uppercase',
                  marginTop: 'auto'
                }}
              >
                SEAL BID <ArrowUpRight size={16} />
              </button>
            ) : (
              <div style={{
                width: '100%',
                padding: '1rem',
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '2px solid var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textTransform: 'uppercase',
                marginTop: 'auto'
              }}>
                SETTLED <CheckCircle size={16} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
