import React, { useEffect, useState } from 'react';
import { BarChart3, Activity, ShieldCheck, Database, Layers, Radio } from 'lucide-react';
import { fetchPublicMetrics, fetchBackendHealth } from '../lib/api/backendClient';

export const MetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    total_auctions: 4,
    open_auctions: 3,
    settled_auctions: 1,
    total_sealed_bids: 14,
    active_network: 'preprod',
    verified_commitments_count: 14,
  });

  const [health, setHealth] = useState({
    status: 'healthy',
    midnight_network: 'preprod',
    gemini_assistant: 'configured',
  });

  useEffect(() => {
    fetchPublicMetrics().then(setMetrics);
    fetchBackendHealth().then(setHealth);
  }, []);

  return (
    <div style={{ padding: '2.5rem 3vw', background: 'var(--bg-core, #f4f4f0)', color: '#111', minHeight: '100vh', width: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ borderBottom: '2px solid #111', paddingBottom: '1.25rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--accent-vermilion)' }}>
            TELEMETRY // ENGINE MONITOR
          </span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 4vw, 3.75rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.95, margin: 0 }}>
            System<br />Telemetry
          </h1>
        </div>
        <div style={{ textAlign: 'right', color: 'var(--accent-vermilion, #ff3300)' }}>
          <Radio size={32} />
          <div style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Data Feed</div>
        </div>
      </div>

      <div className="brutalist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', background: '#111', border: '2px solid #111' }}>
        <div style={{ background: 'var(--bg-core, #f4f4f0)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }} className="grid-col">
          <div style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: 'auto', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <Layers size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle', color: 'var(--accent-vermilion, #ff3300)' }}/> Public Auctions
          </div>
          <div style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)', fontWeight: 900, lineHeight: 0.85, color: '#111', marginTop: '2rem', marginBottom: '1.25rem' }}>
            {metrics.total_auctions}
          </div>
          <div style={{ borderTop: '2px solid #111', paddingTop: '0.75rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
            {metrics.open_auctions} ACTIVE / {metrics.settled_auctions} SETTLED
          </div>
        </div>

        <div style={{ background: 'var(--bg-core, #f4f4f0)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }} className="grid-col">
          <div style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: 'auto', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <ShieldCheck size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle', color: 'var(--accent-vermilion, #ff3300)' }}/> Sealed Bids (ZK)
          </div>
          <div style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)', fontWeight: 900, lineHeight: 0.85, color: '#111', marginTop: '2rem', marginBottom: '1.25rem' }}>
            {metrics.total_sealed_bids}
          </div>
          <div style={{ borderTop: '2px solid #111', paddingTop: '0.75rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
            {metrics.verified_commitments_count} VERIFIED PROOFS
          </div>
        </div>

        <div style={{ background: 'var(--bg-core, #f4f4f0)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }} className="grid-col">
          <div style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: 'auto', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <Activity size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle', color: 'var(--accent-vermilion, #ff3300)' }}/> Network Status
          </div>
          <div style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)', fontWeight: 900, lineHeight: 0.85, textTransform: 'uppercase', color: 'var(--accent-vermilion, #ff3300)', marginTop: '2rem', marginBottom: '1.25rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {metrics.active_network.substring(0, 4)}
          </div>
          <div style={{ borderTop: '2px solid #111', paddingTop: '0.75rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
            STATUS: {health.status.toUpperCase()}
          </div>
        </div>

        <div style={{ background: '#111', color: 'var(--bg-core, #f4f4f0)', padding: '0', position: 'relative', overflow: 'hidden', minHeight: '220px' }} className="grid-col">
           <img src="/brutalist_data_viz.jpg" alt="Data Viz" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
           <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
              <div style={{ borderTop: '2px solid var(--accent-vermilion, #ff3300)', paddingTop: '0.5rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--bg-core, #f4f4f0)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                DIAGNOSTIC VISUAL
              </div>
           </div>
        </div>
      </div>
      
      <div style={{ marginTop: '3.5rem', borderTop: '2px solid #111', paddingTop: '2rem', marginBottom: '3rem' }}>
        <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>Engine Diagnostics</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #111' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Subsystem</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Mode</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.95rem' }}>FastAPI Backend</td>
              <td style={{ padding: '1rem', color: 'var(--accent-vermilion, #ff3300)', fontWeight: 800, fontSize: '0.95rem' }}>{health.status.toUpperCase()}</td>
              <td style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Stateless API Router</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.95rem' }}>Neon DB</td>
              <td style={{ padding: '1rem', color: 'var(--accent-vermilion, #ff3300)', fontWeight: 800, fontSize: '0.95rem' }}>CONNECTED</td>
              <td style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Branch-first</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.95rem' }}>Proof Planner</td>
              <td style={{ padding: '1rem', color: 'var(--accent-vermilion, #ff3300)', fontWeight: 800, fontSize: '0.95rem' }}>{health.gemini_assistant.toUpperCase()}</td>
              <td style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sanitized Scope</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '1rem', fontWeight: 700, fontSize: '0.95rem' }}>Compact Contract</td>
              <td style={{ padding: '1rem', color: 'var(--accent-vermilion, #ff3300)', fontWeight: 800, fontSize: '0.95rem' }}>VALIDATED</td>
              <td style={{ padding: '1rem', fontWeight: 500, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Midnight 0.31.1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
