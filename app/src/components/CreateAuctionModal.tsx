import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { Auction, WalletState } from '../domain/types';
import { executeCreateAuction } from '../lib/midnight/contractClient';

interface CreateAuctionModalProps {
  wallet: WalletState;
  onClose: () => void;
  onAuctionCreated: (auction: Auction) => void;
  onRequireWallet: () => void;
}

export const CreateAuctionModal: React.FC<CreateAuctionModalProps> = ({
  wallet,
  onClose,
  onAuctionCreated,
  onRequireWallet,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'procurement' | 'liquidation' | 'spectrum-license' | 'otc-block'>('procurement');
  const [reservePriceStr, setReservePriceStr] = useState('100000');
  const [deadlineOffset, setDeadlineOffset] = useState('500');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected) {
      onRequireWallet();
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Title is required');
      return;
    }
    const reservePrice = BigInt(reservePriceStr || '0');
    if (reservePrice <= 0n) {
      setErrorMsg('Reserve price must be greater than 0');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      const newAuction = await executeCreateAuction({
        title: title.trim(),
        description: description.trim() || 'Confidential procurement lot deployed on Midnight zero-knowledge engine.',
        category,
        reservePrice,
        currency: 'tDUST',
        biddingDeadlineBlock: BigInt(185420 + parseInt(deadlineOffset || '500', 10)),
        wallet,
      });

      onAuctionCreated(newAuction);
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to deploy auction');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-strong)', paddingBottom: '1rem' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--accent-vermilion)' }}>LEDGER DEPLOYMENT</span>
            <h2 className="font-display" style={{ fontSize: '1.75rem', textTransform: 'uppercase' }}>
              Create New Tender
            </h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ border: 'none', background: 'none' }}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem 1rem', background: '#ffebee', color: 'var(--status-danger)', border: '1px solid var(--status-danger)', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Tender Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next-Gen Cryogenic Sensor Batch"
              required
              style={{ fontSize: '1rem', padding: '0.75rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Procurement Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                style={{ fontSize: '0.9rem', padding: '0.75rem' }}
              >
                <option value="procurement">Procurement</option>
                <option value="liquidation">Liquidation</option>
                <option value="spectrum-license">Spectrum License</option>
                <option value="otc-block">OTC Block</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Reserve Price (tDUST)</label>
              <input
                type="number"
                className="form-input"
                value={reservePriceStr}
                onChange={(e) => setReservePriceStr(e.target.value)}
                min="1000"
                required
                style={{ fontSize: '1rem', padding: '0.75rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Lot Scope / Description</label>
            <textarea
              rows={3}
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe commercial specs, technical qualifiers, and compliance boundaries..."
              style={{ fontSize: '0.85rem', padding: '0.75rem', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--status-success, #2e7d32)' }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong>Zero-Knowledge Assurance:</strong> Bidders will mathematically prove compliance against this reserve without disclosing their exact valuations.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1, padding: '0.85rem', fontSize: '0.9rem', textTransform: 'uppercase' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ flex: 2, padding: '0.85rem', fontSize: '0.9rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <PlusCircle size={16} />
              {submitting ? 'DEPLOYING TO LEDGER...' : 'PUBLISH TENDER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
