import React, { useState, useEffect } from 'react';
import { Terminal, Sparkles, PlusCircle, CheckCircle2, AlertCircle, RefreshCw, Key, Shield, Radio, Eye, EyeOff } from 'lucide-react';
import { GeminiPlan } from '../domain/types';
import { requestAssistantPlan } from '../lib/api/backendClient';
import { validateGeminiKey, generateGeminiPlan } from '../lib/api/geminiClient';

export interface GeminiAssistantPanelProps {
  onDeployPlan?: (plan: GeminiPlan) => void;
}

type UplinkState = 'IDLE' | 'VALIDATING' | 'LIVE_CLOUD' | 'OFFLINE_ENGINE' | 'ERROR';

export const GeminiAssistantPanel: React.FC<GeminiAssistantPanelProps> = ({ onDeployPlan }) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('aegisbid_gemini_key') || '';
    } catch {
      return '';
    }
  });

  const [showKey, setShowKey] = useState(false);
  const [uplinkState, setUplinkState] = useState<UplinkState>(() => {
    return localStorage.getItem('aegisbid_gemini_key') ? 'LIVE_CLOUD' : 'IDLE';
  });
  const [activeModel, setActiveModel] = useState<string>('gemini-1.5-flash');
  const [keyLatency, setKeyLatency] = useState<number | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);

  const [prompt, setPrompt] = useState(
    'Procurement of 500 radiation-hardened satellite communication transceivers. Minimum vendor reserve is 120,000 tDUST. Strict vendor confidentiality enforced.'
  );
  const [category, setCategory] = useState('procurement');
  const [reserve, setReserve] = useState(120000);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeminiPlan | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

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

  // Auto-validate on mount if key exists
  useEffect(() => {
    if (apiKey) {
      handleValidateKey(apiKey, false);
    }
  }, []);

  const handleValidateKey = async (keyToTest = apiKey, showAlert = true) => {
    const cleanKey = keyToTest.trim();
    if (!cleanKey) {
      setUplinkState('IDLE');
      setKeyError('Please paste your Google Gemini API key first.');
      return;
    }

    setUplinkState('VALIDATING');
    setKeyError(null);

    const result = await validateGeminiKey(cleanKey);

    if (result.valid) {
      setUplinkState('LIVE_CLOUD');
      setActiveModel(result.model);
      setKeyLatency(result.latencyMs);
      setKeyError(null);
      try {
        localStorage.setItem('aegisbid_gemini_key', cleanKey);
      } catch {}
    } else {
      setUplinkState('ERROR');
      setKeyError(result.error || 'Authentication rejected by Google Gemini API.');
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setGenerationError(null);

    // If key is validated, call live Gemini
    if (apiKey.trim() && uplinkState === 'LIVE_CLOUD') {
      try {
        const livePlan = await generateGeminiPlan(apiKey.trim(), prompt, category, reserve);
        setPlan(livePlan);
        setLoading(false);
        return;
      } catch (err: any) {
        setGenerationError(`Live Cloud Generation notice: ${err.message || 'Error'}. Generated plan via autonomous ZK engine.`);
      }
    }

    // Fallback to autonomous dynamic ZK synthesis engine
    const fallbackResult = await requestAssistantPlan(prompt, category, reserve, apiKey);
    setPlan(fallbackResult);
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
      backgroundColor: '#0a0a0a',
      color: '#f4f4f0',
      fontFamily: 'var(--font-mono, monospace)',
      padding: '2rem 3vw',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      
      {/* Editorial Masthead */}
      <div style={{
        borderBottom: '2px solid var(--accent-vermilion, #D9381E)',
        paddingBottom: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <Terminal size={24} style={{ color: 'var(--accent-vermilion, #D9381E)' }} />
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-vermilion, #D9381E)', fontWeight: 700 }}>
              TERMINAL // AUTONOMOUS ZK COMPILER
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display, serif)',
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: 0
          }}>
            Gemini ZK Advisor
          </h1>
        </div>

        {/* Live Enclave & Uplink Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            border: '1px solid #333',
            background: '#111',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Radio size={14} style={{
              color: uplinkState === 'LIVE_CLOUD' ? '#4ade80' : (uplinkState === 'VALIDATING' ? '#f59e0b' : '#888')
            }} />
            <div style={{ fontSize: '0.75rem' }}>
              <span style={{ color: '#888', textTransform: 'uppercase' }}>UPLINK: </span>
              <strong style={{
                color: uplinkState === 'LIVE_CLOUD' ? '#4ade80' : (uplinkState === 'VALIDATING' ? '#f59e0b' : (uplinkState === 'ERROR' ? '#ef4444' : '#f4f4f0'))
              }}>
                {uplinkState === 'LIVE_CLOUD' && `LIVE CLOUD LINK (${activeModel}${keyLatency ? ` // ${keyLatency}ms` : ''})`}
                {uplinkState === 'VALIDATING' && 'VALIDATING KEY...'}
                {uplinkState === 'IDLE' && 'OFFLINE ENGINE (BUILT-IN)'}
                {uplinkState === 'ERROR' && 'KEY AUTH ERROR'}
              </strong>
            </div>
          </div>

          <div style={{
            border: '1px solid var(--accent-vermilion, #D9381E)',
            padding: '0.5rem 1rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--accent-vermilion, #D9381E)'
          }}>
            ENCLAVE: STRICT PRIVACY BOUNDARY
          </div>
        </div>
      </div>

      {/* SECTION 1: API Key Uplink Configuration */}
      <div style={{
        background: '#111',
        border: '1px solid #333',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, color: 'var(--accent-vermilion, #D9381E)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={14} /> ENCLAVE UPLINK // GOOGLE GEMINI API CONFIGURATION
          </span>
          <span style={{ fontSize: '0.7rem', color: '#888' }}>
            KEYS STORED IN LOCAL CLIENT BROWSER STORAGE ONLY
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="Paste Google Gemini API Key (e.g. AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleValidateKey();
                }
              }}
              style={{
                width: '100%',
                background: '#050505',
                border: uplinkState === 'LIVE_CLOUD' ? '1px solid #4ade80' : '1px solid #444',
                color: '#fff',
                padding: '0.75rem 2.5rem 0.75rem 1rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleValidateKey()}
            disabled={uplinkState === 'VALIDATING'}
            style={{
              backgroundColor: uplinkState === 'LIVE_CLOUD' ? '#166534' : 'var(--accent-vermilion, #D9381E)',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.75rem',
              fontWeight: 800,
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: uplinkState === 'VALIDATING' ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'opacity 0.2s ease',
            }}
          >
            {uplinkState === 'VALIDATING' ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>TESTING LINK...</span>
              </>
            ) : uplinkState === 'LIVE_CLOUD' ? (
              <>
                <CheckCircle2 size={16} />
                <span>LINK ACTIVE (RE-TEST)</span>
              </>
            ) : (
              <>
                <span>VALIDATE & ACTIVATE KEY →</span>
              </>
            )}
          </button>
        </div>

        {keyError && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.65rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={14} style={{ color: '#ef4444' }} />
            <span>ERR: {keyError}</span>
          </div>
        )}

        {uplinkState === 'LIVE_CLOUD' && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.5rem 1rem',
            background: 'rgba(74, 222, 128, 0.08)',
            border: '1px solid #4ade80',
            color: '#4ade80',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={14} />
            <span>KEY VERIFIED: Direct client-side calls to Google Cloud Gemini 1.5/2.0 Flash enabled with live reasoning.</span>
          </div>
        )}
      </div>

      {/* Domain RFP Presets Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        borderBottom: '1px solid #222',
        paddingBottom: '1.25rem'
      }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--accent-vermilion, #D9381E)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          LOAD DOMAIN PRESET:
        </span>
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p)}
            style={{
              background: '#141414',
              border: '1px solid #333',
              color: '#ccc',
              fontSize: '0.75rem',
              padding: '0.4rem 0.85rem',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-vermilion, #D9381E)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = '#ccc';
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main 2-Column Split Workspace (Form on Left / Clean Plan on Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.35fr)',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Interactive RFP Composer */}
        <div style={{
          background: '#111',
          border: '1px solid #333',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-vermilion, #D9381E)', fontWeight: 800, letterSpacing: '0.1em' }}>
              STEP 01 // COMPOSE SPECIFICATION
            </span>
            <h2 style={{ fontSize: '1.25rem', margin: '0.25rem 0 0 0', textTransform: 'uppercase' }}>
              Interactive RFP Composer
            </h2>
          </div>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#aaa', fontWeight: 700 }}>
                &gt; Tender Requirement / Scope Description
              </label>
              <textarea
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe equipment specifications, delivery milestones, batch quantities..."
                required
                style={{
                  width: '100%',
                  backgroundColor: '#050505',
                  color: '#fff',
                  border: '1px solid #444',
                  padding: '1rem',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#aaa', fontWeight: 700 }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    backgroundColor: '#050505',
                    color: '#fff',
                    border: '1px solid #444',
                    padding: '0.75rem',
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
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#aaa', fontWeight: 700 }}>
                  Reserve Threshold (tDUST)
                </label>
                <input
                  type="number"
                  value={reserve}
                  onChange={(e) => setReserve(Number(e.target.value))}
                  min={1000}
                  step={1000}
                  style={{
                    backgroundColor: '#050505',
                    color: 'var(--accent-vermilion, #D9381E)',
                    border: '1px solid #444',
                    padding: '0.75rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
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
                backgroundColor: 'var(--accent-vermilion, #D9381E)',
                color: '#fff',
                border: 'none',
                padding: '1rem',
                fontSize: '0.9rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                transition: 'opacity 0.2s ease',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Sparkles size={16} />
              {loading ? 'COMPILING ZK PROOF INVARIANTS...' : 'COMPILE ZK PROOF PLAN →'}
            </button>
          </form>

          {generationError && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid #f59e0b',
              color: '#fcd34d',
              fontSize: '0.75rem',
              lineHeight: 1.4
            }}>
              {generationError}
            </div>
          )}

          <div style={{ borderTop: '1px solid #222', paddingTop: '1rem', fontSize: '0.75rem', color: '#777', lineHeight: 1.5 }}>
            <strong style={{ color: '#aaa' }}>COMPACT 0.31.1 CIRCUIT TARGET:</strong> Evaluates bidder compliance predicate strictly inside a client-side SNARK. Neither the procurement desk nor competitor bidders discover your valuation.
          </div>
        </div>

        {/* Right Column: Compiled Proof Plan Output & Disclosure Scope Matrix */}
        <div style={{ minWidth: 0 }}>
          {!plan ? (
            <div style={{
              background: '#111',
              border: '2px dashed #333',
              padding: '4rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#666'
            }}>
              <Terminal size={48} style={{ opacity: 0.4, color: 'var(--accent-vermilion, #D9381E)', marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', color: '#888', margin: '0 0 0.5rem 0' }}>
                Awaiting Tender Specification
              </h3>
              <p style={{ fontSize: '0.8rem', maxWidth: '40ch', margin: 0, lineHeight: 1.5 }}>
                Select a domain preset or write a procurement requirement on the left, then click <strong>COMPILE ZK PROOF PLAN</strong>.
              </p>
            </div>
          ) : (
            <div style={{
              background: '#111',
              border: '1px solid #333',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem'
            }}>
              
              {/* Header with Title & Live Source Badge */}
              <div style={{ borderBottom: '1px solid #333', paddingBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-vermilion, #D9381E)', fontWeight: 800, letterSpacing: '0.1em' }}>
                    OUTPUT // COMPILED ZK SPECIFICATION
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.5rem',
                    background: plan.fallbackUsed ? '#222' : 'rgba(74, 222, 128, 0.15)',
                    color: plan.fallbackUsed ? '#ccc' : '#4ade80',
                    border: `1px solid ${plan.fallbackUsed ? '#444' : '#4ade80'}`
                  }}>
                    {plan.fallbackUsed ? 'AUTONOMOUS ZK ENGINE' : `LIVE AI MODEL // ${activeModel.toUpperCase()}`}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-display, serif)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  margin: '0.5rem 0',
                  color: '#fff',
                  textTransform: 'uppercase',
                  lineHeight: 1.2
                }}>
                  {plan.recommendedTitle}
                </h2>
                
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
                  <span>CATEGORY: <strong style={{ color: '#fff' }}>{plan.auctionCategory.toUpperCase()}</strong></span>
                  <span>SUGGESTED RESERVE: <strong style={{ color: 'var(--accent-vermilion, #D9381E)' }}>{plan.suggestedReservePrice.toLocaleString()} tDUST</strong></span>
                </div>
              </div>

              {/* Execution Summary Box */}
              <div style={{
                background: '#080808',
                border: '1px solid #282828',
                borderLeft: '4px solid var(--accent-vermilion, #D9381E)',
                padding: '1.25rem'
              }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-vermilion, #D9381E)', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                  CIRCUIT EXECUTION SUMMARY
                </div>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#e5e5e5', margin: 0 }}>
                  {plan.proofPlanSummary}
                </p>
              </div>

              {/* Disclosure Scope Matrix Table (With strict fixed column widths) */}
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-vermilion, #D9381E)', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                  OBSERVER DISCLOSURE MATRIX & STORAGE BOUNDARIES
                </div>
                
                <div style={{ overflowX: 'auto', border: '1px solid #333' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    tableLayout: 'fixed',
                    minWidth: '550px'
                  }}>
                    <thead>
                      <tr style={{ background: '#1c1c1c', borderBottom: '2px solid #333' }}>
                        <th style={{ width: '24%', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          ATTRIBUTE
                        </th>
                        <th style={{ width: '16%', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          VISIBILITY
                        </th>
                        <th style={{ width: '22%', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          STORAGE LOCATION
                        </th>
                        <th style={{ width: '38%', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          ZK JUSTIFICATION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.privacyAnalysis.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #222', background: idx % 2 === 0 ? '#111' : '#0d0d0d' }}>
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#fff', wordBreak: 'break-word' }}>
                            {item.field_name}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              padding: '0.2rem 0.5rem',
                              background: item.visibility === 'PRIVATE' ? 'rgba(217, 56, 30, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                              color: item.visibility === 'PRIVATE' ? 'var(--accent-vermilion, #D9381E)' : '#aaa',
                              border: `1px solid ${item.visibility === 'PRIVATE' ? 'var(--accent-vermilion, #D9381E)' : '#444'}`,
                              display: 'inline-block'
                            }}>
                              {item.visibility}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', color: '#aaa', wordBreak: 'break-word' }}>
                            {item.storage_location}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', color: '#ddd', lineHeight: 1.5, wordBreak: 'break-word' }}>
                            {item.zk_justification}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Compliance Notes */}
              <div style={{
                borderTop: '1px solid #333',
                paddingTop: '1rem',
                fontSize: '0.75rem',
                lineHeight: 1.5,
                color: '#999'
              }}>
                <strong style={{ color: 'var(--accent-vermilion, #D9381E)' }}>COMPLIANCE NOTE:</strong> {plan.complianceNotes}
              </div>

              {/* Action Button: Instant Deploy */}
              {onDeployPlan && (
                <button
                  type="button"
                  onClick={() => onDeployPlan(plan)}
                  style={{
                    backgroundColor: 'var(--accent-vermilion, #D9381E)',
                    color: '#fff',
                    border: 'none',
                    padding: '1rem',
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <PlusCircle size={18} />
                  <span>DEPLOY AS LIVE TENDER TO MIDNIGHT LEDGER →</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
