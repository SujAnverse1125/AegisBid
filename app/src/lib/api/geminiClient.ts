/**
 * Direct Client-Side Gemini API integration for AegisBid ZK Advisor.
 */
import { GeminiPlan } from '../../domain/types';

export interface KeyValidationResult {
  valid: boolean;
  model: string;
  latencyMs: number;
  error?: string;
}

/**
 * Validates a user-provided Gemini API key with a fast ping request.
 */
export async function validateGeminiKey(apiKey: string): Promise<KeyValidationResult> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return { valid: false, model: 'none', latencyMs: 0, error: 'API key is required.' };
  }

  const startTime = Date.now();
  const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash'];
  let lastError = '';

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'ping' }] }],
        }),
        signal: AbortSignal.timeout(6000),
      });

      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        return { valid: true, model, latencyMs };
      } else {
        const errJson = await res.json().catch(() => ({}));
        lastError = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      }
    } catch (e: any) {
      lastError = e?.message || 'Network connectivity error';
    }
  }

  return {
    valid: false,
    model: 'none',
    latencyMs: Date.now() - startTime,
    error: lastError || 'Failed to authenticate with Google Gemini API.',
  };
}

/**
 * Calls Gemini to generate a live, AI-compiled ZK proof plan.
 */
export async function generateGeminiPlan(
  apiKey: string,
  prompt: string,
  category: string,
  reserve: number
): Promise<GeminiPlan> {
  const cleanKey = apiKey.trim();
  const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash'];
  let lastError = '';

  const systemInstruction = `You are the Lead Zero-Knowledge Procurement Architect on the Midnight Network (Compact v0.31.1).
Analyze the tender requirements and compile a rigorous, authentic Zero-Knowledge Proof Plan for private sealed bidding.
Public RFP: "${prompt}"
Category: "${category}"
Reserve Price: ${reserve} tDUST

Respond ONLY with valid, raw JSON matching this schema:
{
  "recommendedTitle": "Executive Tender Title with lot number and asset classification",
  "auctionCategory": "${category}",
  "suggestedReservePrice": ${reserve},
  "proofPlanSummary": "Precise mathematical formulation of the zero-knowledge circuit, Pedersen commitments, and witness boundary guarantees.",
  "privacyAnalysis": [
    {
      "field_name": "exact attribute name (e.g. vendorCommercialValuation)",
      "visibility": "PRIVATE" or "PUBLIC",
      "storage_location": "e.g. Local Memory Enclave, Client IndexedDB, or Midnight Public State",
      "zk_justification": "Exact cryptographic justification (e.g. Blinded under Pedersen base; only clearance predicate proven)"
    }
  ],
  "complianceNotes": "Clear regulatory, ITAR, or commercial risk assessment."
}`;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemInstruction }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        lastError = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response received from Gemini model.');

      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        recommendedTitle: parsed.recommendedTitle || `AegisBid ZK: ${prompt.slice(0, 35)}...`,
        auctionCategory: parsed.auctionCategory || category,
        suggestedReservePrice: Number(parsed.suggestedReservePrice) || reserve,
        proofPlanSummary: parsed.proofPlanSummary || 'ZK circuit constraint proof verified.',
        privacyAnalysis: Array.isArray(parsed.privacyAnalysis) ? parsed.privacyAnalysis : [],
        complianceNotes: parsed.complianceNotes || `Compiled via live Google Cloud Model: ${model}`,
        fallbackUsed: false,
      };
    } catch (e: any) {
      lastError = e?.message || 'Error executing Gemini generation';
    }
  }

  throw new Error(lastError || 'Gemini API call failed across all available models.');
}
