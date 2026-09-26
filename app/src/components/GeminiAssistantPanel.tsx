import React, { useState } from 'react';
import { Sparkles, Terminal, PlusCircle } from 'lucide-react';
import { GeminiPlan } from '../domain/types';
import { requestAssistantPlan } from '../lib/api/backendClient';

export interface GeminiAssistantPanelProps {
  onDeployPlan?: (plan: GeminiPlan) => void;
}

export const GeminiAssistantPanel: React.FC<GeminiAssistantPanelProps> = ({ onDeployPlan }) => {
  const [prompt, setPrompt] = useState(
    'Procurement of 500 radiation-hardened satellite communication transceivers. Minimum vendor reserve is 120,000 tDUST.'
  );
  const [category, setCategory] = useState('procurement');
  const [reserve, setReserve] = useState(120000);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeminiPlan | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    const result = await requestAssistantPlan(prompt, category, reserve);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: 'var(--text-primary, #0a0a0a)',
      color: 'var(--bg-core, #f4f4f0)',
      fontFamily: 'monospace',
      padding: '2rem',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <div className="brutalist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', maxWidth: '100%' }}>
        
        {/* Header / Brand Section - Col 1 */}
        <div className="grid-col" style={{ gridColumn: 'span 1', borderRight: '2px solid var(--accent-vermilion, #ff3300)', paddingRight: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-vermilion, #ff3300)' }}>
            <Terminal size={32} />
            <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em', margin: 0 }}>Gemini<br/>Terminal</h1>
          </div>
          <div style={{ padding: '0.5rem', border: '1px solid var(--accent-vermilion, #ff3300)', marginBottom: '2rem' }}>
             <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-vermilion, #ff3300)', fontWeight: 'bold' }}>System Status</span>
             <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>STRICT PRIVACY BOUNDARY ENFORCED</div>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.4', opacity: 0.8 }}>
            Convert natural language procurement specs into formal Compact ZK proof plans.
            <br/><br/>
            <strong>PRIVACY GUARANTEE:</strong> Runs strictly on sanitized public requirements. No private keys, seeds, or valuations are submitted.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <img src="/gemini_architect_blueprint.jpg" alt="Architect Blueprint" style={{ width: '100%', height: 'auto', border: '1px solid var(--accent-vermilion, #ff3300)', filter: 'grayscale(100%) contrast(1.2)' }} />
          </div>
        </div>

        {/* Input Form Section - Col 2 & 3 */}
        <div className="grid-col" style={{ gridColumn: 'span 2' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent-vermilion, #ff3300)' }}>
                &gt; Public RFP / Auction Description
              </label>
              <textarea
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe public tender..."
                required
                style={{
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  border: '1px solid rgba(244,244,240,0.3)',
                  padding: '1rem',
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'rgba(244,244,240,0.7)' }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(244,244,240,0.1)',
                    color: 'inherit',
                    border: 'none',
                    padding: '0.75rem',
                    fontFamily: 'monospace',
                    outline: 'none'
                  }}
                >
                  <option value="procurement" style={{ color: '#000' }}>Gov / Enterprise Procurement</option>
                  <option value="liquidation" style={{ color: '#000' }}>Confidential Asset Liquidation</option>
                  <option value="otc-block" style={{ color: '#000' }}>OTC Block Trade Auction</option>
                  <option value="spectrum-license" style={{ color: '#000' }}>Frequency / Spectrum License</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'rgba(244,244,240,0.7)' }}>Min Reserve Threshold (tDUST)</label>
                <input
                  type="number"
                  value={reserve}
                  onChange={(e) => setReserve(Number(e.target.value))}
                  min={1000}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--accent-vermilion, #ff3300)',
                    border: '1px solid rgba(244,244,240,0.3)',
                    padding: '0.75rem',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{
                marginTop: 'auto',
                backgroundColor: 'var(--accent-vermilion, #ff3300)',
                color: '#000',
                border: 'none',
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'monospace'
              }}
            >
              <Sparkles size={20} />
              {loading ? 'EXECUTING GENERATION...' : 'COMPILE PROOF PLAN'}
            </button>
          </form>
        </div>

        {/* Output Section - Col 4 */}
        <div className="grid-col" style={{ gridColumn: 'span 1', borderLeft: '1px dotted rgba(244,244,240,0.3)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column' }}>
          {!plan ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'rgba(244,244,240,0.3)', textAlign: 'center' }}>
              <div>
                <Terminal size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}>AWAITING INPUT...<br/>SYSTEM IDLE</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-vermilion, #ff3300)', marginBottom: '0.25rem' }}>OUTPUT // PROOF PLAN</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem 0' }}>{plan.recommendedTitle}</h2>
                {plan.fallbackUsed && (
                  <div style={{ display: 'inline-block', backgroundColor: 'var(--accent-vermilion, #ff3300)', color: '#000', padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    DETERMINISTIC FALLBACK
                  </div>
                )}
                
                <div style={{ backgroundColor: 'rgba(244,244,240,0.05)', padding: '1rem', border: '1px solid rgba(244,244,240,0.2)' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '0.5rem' }}>EXECUTION SUMMARY</div>
                  <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{plan.proofPlanSummary}</p>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-vermilion, #ff3300)', marginBottom: '0.5rem' }}>DISCLOSURE SCOPE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {plan.privacyAnalysis.map((item, idx) => (
                    <div key={idx} style={{ borderBottom: '1px solid rgba(244,244,240,0.1)', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{item.field_name}</span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '0.1rem 0.3rem', 
                          backgroundColor: item.visibility === 'PRIVATE' ? 'var(--accent-vermilion, #ff3300)' : 'rgba(244,244,240,0.2)',
                          color: item.visibility === 'PRIVATE' ? '#000' : 'inherit'
                        }}>
                          {item.visibility}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '0.25rem' }}>{item.storage_location}</div>
                      <div style={{ fontSize: '0.75rem' }}>{item.zk_justification}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', opacity: 0.6, borderTop: '1px solid rgba(244,244,240,0.2)', paddingTop: '1rem' }}>
                <strong style={{ color: 'var(--accent-vermilion, #ff3300)' }}>SYS_NOTE:</strong> {plan.complianceNotes}
              </div>

              {onDeployPlan && (
                <button
                  type="button"
                  onClick={() => onDeployPlan(plan)}
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'var(--accent-vermilion, #ff3300)',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'monospace',
                    fontWeight: 700,
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
                  <span>DEPLOY AS LIVE TENDER TO LEDGER &rarr;</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
