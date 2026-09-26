import React, { useState, useEffect } from 'react';
import { WalletState } from '../domain/types';

interface MarketingLandingProps {
  onEnterWorkspace: (name: string) => void;
  wallet: WalletState;
  onConnectWallet: () => void;
}

export const MarketingLanding: React.FC<MarketingLandingProps> = ({ onEnterWorkspace, wallet, onConnectWallet }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [userName, setUserName] = useState('');
  const [infoModal, setInfoModal] = useState<'Technology' | 'Manifesto' | 'Audits' | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onEnterWorkspace(userName || 'ANONYMOUS_OPERATOR');
    }, 800);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        backgroundColor: 'var(--bg-core)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: isTransitioning ? 'hidden' : 'auto'
      }}
    >
      {/* Redaction Transition Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'var(--text-primary)',
        transform: isTransitioning ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
        zIndex: 9999,
        pointerEvents: 'none'
      }} />

      {/* Top Navigation - Strict Wireframe */}
      <header style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr 200px',
        alignItems: 'stretch',
        borderBottom: '1px solid var(--text-primary)',
        opacity: isMounted ? 1 : 0,
        transition: 'opacity 0.8s'
      }}>
        <div className="font-display" style={{ 
          padding: '1.5rem 2rem', 
          borderRight: '1px solid var(--text-primary)', 
          fontSize: '1.75rem', 
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center'
        }}>
          AEGISBID
        </div>
        
        {/* Nav Links - Interactive technical references */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '3rem', 
          fontFamily: 'var(--font-mono)', 
          fontSize: '0.65rem', 
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          {[
            { label: 'Technology', action: () => setInfoModal('Technology') },
            { label: 'Manifesto', action: () => setInfoModal('Manifesto') },
            { label: 'Audits', action: () => setInfoModal('Audits') },
            { label: 'GitHub', action: () => window.open('https://github.com/SujAnverse1125/AegisBid', '_blank') }
          ].map((item) => (
            <button 
              key={item.label} 
              type="button"
              onClick={item.action}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'inherit', 
                font: 'inherit', 
                padding: 0, 
                cursor: 'pointer', 
                transition: 'color 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }} 
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-vermilion)'} 
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Empty slot */}
        </div>
      </header>

      {/* Hero Section - Asymmetrical Grid */}
      <main style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: '55% 45%', // Asymmetrical split
      }}>
        {/* Left Column: Dense Typography & Form */}
        <div style={{ 
          borderRight: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            padding: '1rem 4rem', 
            borderBottom: '1px solid var(--border-medium)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            display: 'flex',
            justifyContent: 'space-between',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <span>Vol 01. / Protocol Overview</span>
            <span style={{ color: 'var(--accent-vermilion)' }}>Last Audited: Sep 2026</span>
          </div>

          <div style={{ padding: '2.5rem 3rem 1.5rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="font-display" style={{
              fontSize: 'clamp(3rem, 5.5vw, 5.5rem)',
              lineHeight: 0.95,
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              opacity: isMounted ? 1 : 0,
              transform: isMounted ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
            }}>
              Absolute <br />
              Privacy. <br />
              <span style={{ color: 'var(--accent-vermilion)' }}>Math.</span>
            </h1>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              opacity: isMounted ? 1 : 0,
              transform: isMounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              marginTop: '1.25rem',
              borderTop: '1px solid var(--border-medium)',
              paddingTop: '1.25rem'
            }}>
              <p className="mono" style={{ 
                fontSize: '0.75rem', 
                lineHeight: 1.7, 
                color: 'var(--text-secondary)',
                textAlign: 'justify' // Dense newspaper feel
              }}>
                AegisBid replaces trusted human operators with client-side Pedersen commitments and Compact zero-knowledge circuits. The ledger verifies truth without ever seeing the data. Zero-leakage execution at the edge.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '400px' }}>
                {!wallet.connected ? (
                  <button 
                    onClick={onConnectWallet}
                    style={{
                      background: 'var(--text-primary)',
                      border: '1px solid var(--text-primary)',
                      color: 'var(--bg-core)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      padding: '1.25rem 2rem',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>CONNECT WALLET_</span>
                    <span>&rarr;</span>
                  </button>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>OPERATOR ALIAS</label>
                      <input 
                        type="text" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="ENTER_DESIGNATION"
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border-strong)',
                          padding: '1rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1rem',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          width: '100%'
                        }}
                      />
                    </div>
                    <button 
                      onClick={handleEnter}
                      disabled={!userName.trim()}
                      style={{
                        background: userName.trim() ? 'transparent' : 'rgba(0,0,0,0.05)',
                        border: userName.trim() ? '1px solid var(--accent-vermilion)' : '1px solid var(--border-medium)',
                        color: userName.trim() ? 'var(--accent-vermilion)' : 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        padding: '1.25rem 2rem',
                        cursor: userName.trim() ? 'pointer' : 'not-allowed',
                        textTransform: 'uppercase',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        if (userName.trim()) {
                          e.currentTarget.style.background = 'var(--accent-vermilion)';
                          e.currentTarget.style.color = 'var(--bg-core)';
                          e.currentTarget.style.letterSpacing = '0.2em';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (userName.trim()) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--accent-vermilion)';
                          e.currentTarget.style.letterSpacing = 'normal';
                        }
                      }}
                    >
                      <span>INITIALIZE_</span>
                      <span>&rarr;</span>
                    </button>
                  </>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Full-Bleed Dynamic Abstract Art */}
        <div style={{ 
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f1f0eb'
        }}>
          <div className="mono" style={{
            position: 'absolute',
            top: '1.5rem',
            right: '2rem',
            fontSize: '0.65rem',
            color: 'var(--text-secondary)',
            zIndex: 10
          }}>
            FIG 01. — COMPACT CIRCUIT
          </div>

          <svg 
            viewBox="0 0 1000 1000" 
            style={{ 
              position: 'absolute',
              width: '150%',
              height: '150%',
              opacity: isMounted ? 1 : 0,
              transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px) scale(${isMounted ? 1 : 0.9})`,
              transition: 'opacity 1.5s ease, transform 0.1s ease-out',
              pointerEvents: 'none'
            }}
          >
            <pattern id="gridLarge" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--border-subtle)" strokeWidth="1"/>
            </pattern>
            <rect width="1000" height="1000" fill="url(#gridLarge)" />
            
            <g style={{ transformOrigin: '500px 500px', transform: `rotate(${mousePos.x * 10}deg)`, transition: 'transform 0.3s ease-out' }}>
              <circle cx="500" cy="500" r="400" fill="none" stroke="var(--text-primary)" strokeWidth="1" strokeDasharray="5 10" />
              <circle cx="500" cy="500" r="350" fill="none" stroke="var(--text-primary)" strokeWidth="0.5" />
            </g>
            
            <g style={{ transformOrigin: '500px 500px', transform: `rotate(${mousePos.y * -15}deg)`, transition: 'transform 0.2s ease-out' }}>
              <circle cx="500" cy="500" r="250" fill="none" stroke="var(--text-primary)" strokeWidth="1" />
              <path d="M 0 500 L 1000 500" stroke="var(--text-primary)" strokeWidth="1" />
              <path d="M 500 0 L 500 1000" stroke="var(--text-primary)" strokeWidth="1" />
              <rect x="350" y="350" width="300" height="300" fill="none" stroke="var(--text-primary)" strokeWidth="1" transform="rotate(45 500 500)" />
            </g>
            
            <circle cx={500 + (mousePos.x * 50)} cy={500 + (mousePos.y * 50)} r="80" fill="var(--accent-vermilion)" style={{ transition: 'all 0.1s ease-out' }} />
          </svg>
        </div>
      </main>

      {/* Ticker / Marquee - Adds movement and density */}
      <div style={{
        borderBottom: '1px solid var(--text-primary)',
        padding: '0.75rem 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        background: 'var(--text-primary)',
        color: 'var(--bg-core)'
      }}>
        <div style={{ 
          display: 'inline-block',
          animation: 'scroll 30s linear infinite',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em'
        }}>
          {[...Array(10)].map((_, i) => (
            <span key={i} style={{ paddingRight: '4rem' }}>
              ✦ 100% WITNESS ISOLATION ✦ 0 BYTES LEAKED ✦ COMPACT 0.31.1 EVALUATOR ✦ ANTI-FRONTRUNNING 
            </span>
          ))}
        </div>
      </div>

      {/* Features: The Dense Architecture Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {[
          { num: '01', title: 'Device Enclave', desc: 'Private keys and entropy never touch a network socket. Formulation is strictly isolated to local hardware memory, protecting valuation strategies.' },
          { num: '02', title: 'Dual Anchors', desc: 'Pedersen commitments blind the valuation. Poseidon nullifiers mathematically enforce uniqueness without revealing identity to the sequencer.' },
          { num: '03', title: 'Zero-Knowledge', desc: 'The ledger validates compliance constraints through algebraic circuits, verifying the claim while discarding the inputs instantly.' }
        ].map((feat, idx) => (
          <div 
            key={idx} 
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRight: idx !== 2 ? '1px solid var(--text-primary)' : 'none',
              transition: 'all 0.3s ease',
              cursor: 'default',
              opacity: isMounted ? 1 : 0,
              transform: isMounted ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: `${0.4 + (idx * 0.1)}s`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--text-primary)';
              e.currentTarget.style.color = 'var(--bg-core)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
          >
            {/* Dense Data Header for Feature Box */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              borderBottom: '1px solid var(--border-medium)', 
              padding: '1rem 1.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem'
            }}>
              <span>SYS_REF: {feat.num}</span>
              <span>VERIFIED</span>
            </div>
            
            <div style={{ padding: '3rem 2.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="font-display" style={{ color: 'var(--accent-vermilion)', fontSize: '3rem', marginBottom: '1rem', lineHeight: 1 }}>
                {feat.num}
              </div>
              <div className="font-display" style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                {feat.title}
              </div>
              <div className="mono" style={{ fontSize: '0.8rem', lineHeight: 1.6, marginTop: 'auto' }}>
                {feat.desc}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Information Modal (Technology / Manifesto / Audits) */}
      {infoModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 10, 10, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1.5rem',
          }} 
          onClick={() => setInfoModal(null)}
        >
          <div 
            style={{
              backgroundColor: 'var(--bg-core)',
              color: 'var(--text-primary)',
              border: '2px solid var(--text-primary)',
              maxWidth: '800px',
              width: '100%',
              padding: '2.5rem',
              boxShadow: '12px 12px 0px rgba(0,0,0,1)',
              fontFamily: 'var(--font-mono)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--text-primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-vermilion)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  SPECIFICATION ARCHIVE // {infoModal}
                </span>
                <h2 className="font-display" style={{ margin: '0.25rem 0 0 0', fontSize: '1.8rem', textTransform: 'uppercase' }}>
                  {infoModal === 'Technology' && 'Zero-Knowledge Procurement Architecture'}
                  {infoModal === 'Manifesto' && 'The End of Margin Espionage'}
                  {infoModal === 'Audits' && 'Ledger Verification & Audit Matrix'}
                </h2>
              </div>
              <button 
                type="button"
                onClick={() => setInfoModal(null)}
                style={{
                  background: 'none',
                  border: '1px solid var(--text-primary)',
                  padding: '0.4rem 0.8rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}
              >
                [ESC / CLOSE]
              </button>
            </div>

            {infoModal === 'Technology' && (
              <div style={{ fontSize: '0.85rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p>
                  <strong>Compact 0.31.1 Smart Circuits:</strong> AegisBid deploys state-transition constraints directly to the Midnight network. Commercial bids are represented as private inputs (witnesses) within the client runtime.
                </p>
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', padding: '1rem' }}>
                  <div style={{ color: 'var(--accent-vermilion)', fontWeight: 'bold', marginBottom: '0.25rem' }}>1. LOCAL WITNESS ISOLATION</div>
                  <div>The bidder’s valuation (e.g. 150,000 tDUST) and private 256-bit salt never leave the browser memory sandbox. No remote RPC receives cleartext amounts.</div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', padding: '1rem' }}>
                  <div style={{ color: 'var(--accent-vermilion)', fontWeight: 'bold', marginBottom: '0.25rem' }}>2. PEDERSEN COMMITMENT</div>
                  <div>The enclave calculates a homomorphic commitment <code>C = g^v * h^r (mod p)</code>. Only this 32-byte hash is published to the public ledger state.</div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', padding: '1rem' }}>
                  <div style={{ color: 'var(--accent-vermilion)', fontWeight: 'bold', marginBottom: '0.25rem' }}>3. ZERO-KNOWLEDGE PROOF OF RESERVE</div>
                  <div>A SNARK circuit verifies that the private bid satisfies <code>v &gt;= reserve_price</code> without disclosing <code>v</code> to the auctioneer or competitor bidders.</div>
                </div>
              </div>
            )}

            {infoModal === 'Manifesto' && (
              <div style={{ fontSize: '0.85rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p>
                  Traditional procurement is fundamentally broken. When suppliers submit bids to public or private tenders, their confidential cost structures, margins, and proprietary pricing strategies are exposed to procurement officers, clearinghouses, and rogue insiders.
                </p>
                <blockquote style={{ margin: 0, paddingLeft: '1rem', borderLeft: '3px solid var(--accent-vermilion)', fontStyle: 'italic' }}>
                  "Whoever controls the clearinghouse controls the market. Margin espionage is the quiet tax paid by every honest contractor."
                </blockquote>
                <p>
                  AegisBid ends margin espionage through mathematical guarantees. By combining client-side zero-knowledge proof generation with Midnight’s privacy-centric ledger, tenders achieve verifiable fairness without leaking a single byte of trade secrets.
                </p>
              </div>
            )}

            {infoModal === 'Audits' && (
              <div style={{ fontSize: '0.85rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--text-primary)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem 0' }}>SUITE</th>
                      <th style={{ padding: '0.5rem 0' }}>SCOPE</th>
                      <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)' }}>
                      <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>Frontend Runtime</td>
                      <td style={{ padding: '0.75rem 0' }}>15 Components, Enclave, Pedersen math</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#10b981', fontWeight: 'bold' }}>15 / 15 PASSED</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)' }}>
                      <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>Compact 0.31.1 Circuits</td>
                      <td style={{ padding: '0.75rem 0' }}>8 Invariants, Nullifier uniqueness, Reserve proof</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#10b981', fontWeight: 'bold' }}>8 / 8 PASSED</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)' }}>
                      <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>FastAPI Gateway</td>
                      <td style={{ padding: '0.75rem 0' }}>11 API Endpoints, Gemini proxy, Enclave ledger</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#10b981', fontWeight: 'bold' }}>11 / 11 PASSED</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem 0', fontWeight: 'bold' }}>Formal Soundness</td>
                      <td style={{ padding: '0.75rem 0' }}>Pedersen computational binding + hiding</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#10b981', fontWeight: 'bold' }}>VERIFIED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
