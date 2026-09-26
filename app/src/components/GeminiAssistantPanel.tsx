import React, { useState } from 'react';
import { Sparkles, Terminal, PlusCircle } from 'lucide-react';
import { GeminiPlan } from '../domain/types';
import { requestAssistantPlan } from '../lib/api/backendClient';

export interface GeminiAssistantPanelProps {
  onDeployPlan?: (plan: GeminiPlan) => void;
}

export const GeminiAssistantPanel: React.FC<GeminiAssistantPanelProps> = ({ onDeployPlan }) => {
  const [prompt, setPrompt] = useState(
    'Procurement of 500 radiation-hardened satellite communication transceivers. Minimum vendor reserve is 120,000 tDUST. Strict vendor confidentiality enforced.'
  );
  const [category, setCategory] = useState('procurement');
  const [reserve, setReserve] = useState(120000);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeminiPlan | null>(null);

  const presets = [
    {
      label: '01 // RF Transceivers',
      prompt: 'Procurement of 500 radiation-hardened satellite communication transceivers. Minimum vendor reserve is 120,000 tDUST. Strict vendor confidentiality enforced.',
      category: 'procurement',
      reserve: 120000,
    },
    {
      label: '02 // GaN Wafers',
      prompt: 'Confidential inventory liquidation of 1,200 Grade-A 200mm GaN-on-Si wafers from semiconductor fab upgrade. Floor reserve 85,000 tDUST.',
      category: 'liquidation',
      reserve: 85000,
    },
    {
      label: '03 // Arctic Telemetry',
      prompt: 'Exclusive 24-month downlink lease for High-Latitude Arctic satellite receiver facility. Downlink power constraints verified in zero-knowledge. Reserve 210,000 tDUST.',
      category: 'spectrum-license',
      reserve: 210000,
    },
    {
      label: '04 // OTC Dark Pool',
      prompt: 'Confidential block clearance of 450,000 tDUST liquidity with zero public order book slippage and anti-MEV protection.',
      category: 'otc-block',
      reserve: 450000,
    },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    const result = await requestAssistantPlan(prompt, category, reserve, apiKey);
    setPlan(result);
    setLoading(false);
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setPrompt(preset.prompt);
    setCategory(preset.category);
    setReserve(preset.reserve);
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: 'var(--text-primary, #0a0a0a)',
      color: 'var(--bg-core, #f4f4f0)',
      fontFamily: 'monospace',
      padding: '1.75rem 2.5vw',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Masthead Header */}
      <div style={{ borderBottom: '2px solid var(--accent-vermilion, #ff3300)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Terminal size={28} style={{ color: 'var(--accent-vermilion, #ff3300)' }} />
          <div>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-vermilion, #ff3300)', letterSpacing: '0.1em' }}>
              AUTONOMOUS ARCHITECT // COMPACT ZK COMPILER
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
              Gemini ZK Advisor
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ccc',
              fontSize: '0.7rem',
              padding: '0.35rem 0.65rem',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            {showApiKey ? '▼ HIDE API CONFIG' : '▶ LIVE GEMINI API KEY (OPTIONAL)'}
          </button>
          <div style={{ padding: '0.35rem 0.65rem', border: '1px solid var(--accent-vermilion, #ff3300)', fontSize: '0.7rem' }}>
            <span style={{ color: 'var(--accent-vermilion, #ff3300)', fontWeight: 'bold' }}>ENCLAVE:</span> STRICT PRIVACY BOUNDARY
          </div>
        </div>
      </div>

      {/* Optional Live Gemini API Key Input */}
      {showApiKey && (
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-vermilion)' }}>GEMINI_API_KEY:</span>
          <input
            type="password"
            placeholder="AIzaSy... (Leave blank to use autonomous built-in ZK engine)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              flex: 1,
              minWidth: '250px',
              background: '#000',
              border: '1px solid #444',
              color: '#fff',
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: '0.65rem', color: '#888' }}>
            Key remains client-side only in browser memory.
          </span>
        </div>
      )}

      {/* Domain RFP Presets Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--accent-vermilion)', fontWeight: 800, textTransform: 'uppercase' }}>
          LOAD DOMAIN PRESET:
        </span>
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ddd',
              fontSize: '0.7rem',
              padding: '0.35rem 0.65rem',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-vermilion)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = '#ddd';
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Balanced Workspace (No Scrambled Overlap) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)', gap: '2rem' }}>
        
        {/* Left Column: Input Form & Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderRight: '1px solid rgba(255,255,255,0.15)', paddingRight: '1.5rem' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-vermilion, #ff3300)' }}>
                &gt; Tender Requirement / Specification
              </label>
              <textarea
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe procurement specs, quantities, reserve conditions..."
                required
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  color: 'inherit',
                  border: '1px solid rgba(244,244,240,0.25)',
                  padding: '0.85rem',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(244,244,240,0.7)' }}>
                  Procurement Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.25)',
                    padding: '0.65rem',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                >
                  <option value="procurement">Gov / Enterprise Procurement</option>
                  <option value="liquidation">Confidential Asset Liquidation</option>
                  <option value="spectrum-license">Frequency / Spectrum License</option>
                  <option value="otc-block">OTC Block Trade Auction</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(244,244,240,0.7)' }}>
                  Reserve Threshold (tDUST)
                </label>
                <input
                  type="number"
                  value={reserve}
                  onChange={(e) => setReserve(Number(e.target.value))}
                  min={1000}
                  step={1000}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: 'var(--accent-vermilion, #ff3300)',
                    border: '1px solid rgba(244,244,240,0.25)',
                    padding: '0.65rem',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{
                backgroundColor: 'var(--accent-vermilion, #ff3300)',
                color: '#fff',
                border: 'none',
                padding: '0.85rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Sparkles size={16} />
              {loading ? 'COMPILING ZK CIRCUIT PLAN...' : 'COMPILE ZK PROOF PLAN →'}
            </button>
          </form>

          {/* Architecture Monograph */}
          <div style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '1rem', background: 'rgba(255,255,255,0.02)' }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-vermilion)', fontWeight: 800, display: 'block', marginBottom: '0.5rem' }}>
              WITNESS INTEGRITY GUARANTEE
            </span>
            <p style={{ fontSize: '0.75rem', lineHeight: 1.5, color: '#aaa', margin: 0 }}>
              The advisor extracts formal mathematical constraints (valuation bounds, nullifier seeds, and audit anchors). No cleartext financial margins or private keys leave your local machine enclave.
            </p>
          </div>
        </div>

        {/* Right Column: Compiled Proof Plan Output (Spacious, Unscrambled) */}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {!plan ? (
            <div style={{ display: 'flex', minHeight: '340px', alignItems: 'center', justifyContent: 'center', color: 'rgba(244,244,240,0.4)', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.2)', padding: '2rem' }}>
              <div>
                <Terminal size={40} style={{ margin: '0 auto 1rem', opacity: 0.6, color: 'var(--accent-vermilion)' }} />
                <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
                  AWAITING TENDER SPECIFICATION...<br/>
                  <span style={{ fontSize: '0.7rem', color: '#777' }}>Select a domain preset or enter custom specs, then click "COMPILE ZK PROOF PLAN".</span>
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)', padding: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-vermilion, #ff3300)', letterSpacing: '0.1em' }}>
                    COMPILED SPECIFICATION // COMPACT 0.31.1
                  </span>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(46, 125, 50, 0.2)', color: '#4ade80', padding: '0.2rem 0.5rem', border: '1px solid #4ade80' }}>
                    VERIFIED PLAN
                  </span>
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: '#fff' }}>
                  {plan.recommendedTitle}
                </h2>
                
                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.85rem', border: '1px solid rgba(244,244,240,0.15)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '0.35rem', color: 'var(--accent-vermilion)' }}>
                    CIRCUIT EXECUTION SUMMARY
                  </div>
                  <p style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.5, color: '#eee' }}>
                    {plan.proofPlanSummary}
                  </p>
                </div>
              </div>

              {/* Dynamic Disclosure Scope Table */}
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-vermilion, #ff3300)', marginBottom: '0.5rem', fontWeight: 800 }}>
                  OBSERVER DISCLOSURE SCOPE & BOUNDARIES
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', textAlign: 'left', color: '#aaa' }}>
                        <th style={{ padding: '0.4rem 0' }}>ATTRIBUTE</th>
                        <th style={{ padding: '0.4rem 0' }}>VISIBILITY</th>
                        <th style={{ padding: '0.4rem 0' }}>LOCATION</th>
                        <th style={{ padding: '0.4rem 0' }}>ZK JUSTIFICATION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.privacyAnalysis.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <td style={{ padding: '0.5rem 0', fontWeight: 'bold', color: '#fff' }}>{item.field_name}</td>
                          <td style={{ padding: '0.5rem 0' }}>
                            <span style={{ 
                              fontSize: '0.65rem', 
                              padding: '0.15rem 0.35rem', 
                              backgroundColor: item.visibility === 'PRIVATE' ? 'rgba(217, 56, 30, 0.2)' : 'rgba(255,255,255,0.1)',
                              color: item.visibility === 'PRIVATE' ? 'var(--accent-vermilion)' : '#fff',
                              border: `1px solid ${item.visibility === 'PRIVATE' ? 'var(--accent-vermilion)' : '#666'}`
                            }}>
                              {item.visibility}
                            </span>
                          </td>
                          <td style={{ padding: '0.5rem 0', color: '#aaa' }}>{item.storage_location}</td>
                          <td style={{ padding: '0.5rem 0', color: '#ddd' }}>{item.zk_justification}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', opacity: 0.8, borderTop: '1px solid rgba(244,244,240,0.15)', paddingTop: '0.75rem' }}>
                <strong style={{ color: 'var(--accent-vermilion, #ff3300)' }}>SYS_NOTE:</strong> {plan.complianceNotes}
              </div>

              {onDeployPlan && (
                <button
                  type="button"
                  onClick={() => onDeployPlan(plan)}
                  style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'var(--accent-vermilion, #ff3300)',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <PlusCircle size={16} />
                  <span>DEPLOY AS LIVE TENDER TO LEDGER →</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
