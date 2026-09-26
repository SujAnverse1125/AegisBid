import React, { useState, useEffect } from 'react';
import { Shield, EyeOff, Lock, CheckCircle, RefreshCw, Key, Database } from 'lucide-react';
import {
  LocalBidderSecret,
  loadStoredIdentities,
  rotateIdentity,
  getOrCreateDefaultIdentity,
} from '../domain/privateState';

export const PrivacyBoundaryView: React.FC = () => {
  const [currentIdentity, setCurrentIdentity] = useState<LocalBidderSecret | null>(null);
  const [identities, setIdentities] = useState<LocalBidderSecret[]>([]);

  useEffect(() => {
    getOrCreateDefaultIdentity().then((ident) => {
      setCurrentIdentity(ident);
      setIdentities(loadStoredIdentities());
    });
  }, []);

  const handleRotate = async () => {
    const rotated = await rotateIdentity();
    setCurrentIdentity(rotated);
    setIdentities(loadStoredIdentities());
  };

  return (
    <div className="brutalist-grid" style={{ minHeight: '100vh', padding: '2rem 2vw' }}>
      {/* Col 1: Title and Image */}
      <div className="grid-col" style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '1.5rem' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent-vermilion)' }}>ZERO-KNOWLEDGE ARCHITECTURE</span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.75rem)', fontWeight: 900, lineHeight: 1.05, margin: '0.75rem 0' }}>
            CRYPTOGRAPHIC<br/>PRIVACY<br/>BOUNDARY
          </h1>
          <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
            AegisBid utilizes Midnight’s Compact smart contract to evaluate bid eligibility inside zero-knowledge SNARK proofs.
          </p>
        </div>
        <div style={{ border: '2px solid var(--text-primary)', padding: '0.5rem', background: 'var(--bg-core)' }}>
          <img 
            src="/crypto-blueprint.jpg" 
            alt="Cryptographic Blueprint" 
            style={{ width: '100%', height: 'auto', display: 'block', filter: 'grayscale(100%) contrast(1.2)' }} 
          />
        </div>
      </div>

      {/* Col 2 & 3: Observation Table */}
      <div className="grid-col" style={{ gridColumn: 'span 2', padding: '0 1.5rem', minWidth: 0 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid var(--text-primary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          <Shield size={20} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-vermilion)' }} />
          Observer Disclosure Matrix
        </h3>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid var(--text-primary)', minWidth: '450px' }}>
          <thead>
            <tr style={{ background: 'var(--text-primary)', color: 'var(--bg-core)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 800 }}>Entity / Attribute</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 800 }}>Network Visibility</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 800 }}>Storage Location</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--text-primary)' }}>
              <td style={{ padding: '1rem', fontWeight: 700 }}>Exact Bid Valuation</td>
              <td style={{ padding: '1rem', color: 'var(--accent-vermilion)', fontWeight: 800 }}><EyeOff size={16} style={{ display: 'inline' }}/> CONFIDENTIAL</td>
              <td style={{ padding: '1rem', fontFamily: 'monospace' }}>Local Client Memory</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--text-primary)' }}>
              <td style={{ padding: '1rem', fontWeight: 700 }}>Bidder Secret Key</td>
              <td style={{ padding: '1rem', fontWeight: 800 }}><Lock size={16} style={{ display: 'inline' }}/> PRIVATE WITNESS</td>
              <td style={{ padding: '1rem', fontFamily: 'monospace' }}>Browser IndexedDB</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--text-primary)' }}>
              <td style={{ padding: '1rem', fontWeight: 700 }}>Salt Entropy</td>
              <td style={{ padding: '1rem', fontWeight: 800 }}><Lock size={16} style={{ display: 'inline' }}/> PRIVATE WITNESS</td>
              <td style={{ padding: '1rem', fontFamily: 'monospace' }}>Local Client Memory</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--text-primary)' }}>
              <td style={{ padding: '1rem', fontWeight: 700 }}>Bid Commitment Hash</td>
              <td style={{ padding: '1rem', fontWeight: 800 }}><CheckCircle size={16} style={{ display: 'inline' }}/> PUBLIC LEDGER</td>
              <td style={{ padding: '1rem', fontFamily: 'monospace' }}>Midnight State Map</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--text-primary)' }}>
              <td style={{ padding: '1rem', fontWeight: 700 }}>Bid Nullifier</td>
              <td style={{ padding: '1rem', fontWeight: 800 }}><CheckCircle size={16} style={{ display: 'inline' }}/> PUBLIC LEDGER</td>
              <td style={{ padding: '1rem', fontFamily: 'monospace' }}>Midnight State Set</td>
            </tr>
            <tr>
              <td style={{ padding: '1rem', fontWeight: 700 }}>Reserve Compliance</td>
              <td style={{ padding: '1rem', fontWeight: 800 }}><CheckCircle size={16} style={{ display: 'inline' }}/> PROVEN IN CIRCUIT</td>
              <td style={{ padding: '1rem', fontFamily: 'monospace' }}>ZK SNARK</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      {/* Col 4: Local Private State Manager */}
      <div className="grid-col" style={{ gridColumn: 'span 1' }}>
        <div style={{ border: '4px solid var(--text-primary)', padding: '1.5rem', height: '100%', background: 'var(--bg-core)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
            <Key size={20} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-vermilion)' }} />
            Client-Side Enclave
          </h3>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '2rem' }}>
            Ephemeral secret identities isolated on this device.
          </p>
          
          <button 
            onClick={handleRotate}
            style={{ width: '100%', padding: '1rem', background: 'var(--text-primary)', color: 'var(--bg-core)', fontWeight: 800, border: 'none', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={16} /> ROTATE IDENTITY
          </button>

          {currentIdentity && (
            <div style={{ borderTop: '2px dashed var(--text-primary)', paddingTop: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-vermilion)', marginBottom: '0.5rem' }}>
                  ACTIVE EPHEMERAL SECRET
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', background: '#e0e0e0', padding: '0.5rem', border: '1px solid var(--text-primary)' }}>
                  {currentIdentity.secretHex}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  DERIVED PUBLIC IDENTITY
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', background: '#e0e0e0', padding: '0.5rem', border: '1px solid var(--text-primary)' }}>
                  {currentIdentity.derivedIdentityHex}
                </div>
              </div>
              
              <div style={{ marginTop: '2rem', fontSize: '0.85rem', fontWeight: 700, textAlign: 'right' }}>
                STORED IDENTITIES: {identities.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
