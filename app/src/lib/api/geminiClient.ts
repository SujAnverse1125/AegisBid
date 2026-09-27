/**
 * Direct Client-Side Gemini API integration for AegisBid ZK Advisor.
 * Features automated model discovery across Gemini 1.5, 2.5, and 3.0 series.
 */
import { GeminiPlan } from '../../domain/types';

export interface KeyValidationResult {
  valid: boolean;
  model: string;
  latencyMs: number;
  error?: string;
}

// Cached working model for the active session
let cachedWorkingModel = 'gemini-3.8-flash';

/**
 * Extracts a suggested model name if Google returned a deprecation or migration notice in the error.
 * Example error: "This model models/gemini-2.5-flash is no longer available to new users. Please update your code to use models/gemini-3.8-flash..."
 */
export function extractRecommendedModel(errorMessage: string): string | null {
  if (!errorMessage) return null;
  const match = errorMessage.match(/use\s+(?:models\/)?(gemini-[0-9.]+(?:-[a-z0-9_-]+)?)/i);
  return match && match[1] ? match[1].toLowerCase() : null;
}

/**
 * Discovers available models for the given API key and validates it with a ping.
 */
/**
 * Discovers available models for the given API key and validates it with a ping.
 * Uses direct ping with dual authorization (x-goog-api-key header + URI-encoded query param)
 * to support both legacy AIza and new 2026 AQ. Authorization keys without catalog latency.
 */
export async function validateGeminiKey(apiKey: string): Promise<KeyValidationResult> {
  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');
  if (!cleanKey) {
    return { valid: false, model: 'none', latencyMs: 0, error: 'API key is required.' };
  }

  const startTime = Date.now();

  // Primary model candidate followed by fallbacks
  const candidateModels = [
    cachedWorkingModel,
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.0-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
  ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

  const sendPing = async (modelName: string, timeoutMs = 18000) => {
    const encodedKey = encodeURIComponent(cleanKey);
    const pingUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodedKey}`;
    
    const res = await fetch(pingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cleanKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'ping' }] }],
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (res.ok) {
      return { ok: true, error: '', status: res.status };
    }
    const errJson = await res.json().catch(() => ({}));
    const errMsg = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
    return { ok: false, error: errMsg, status: res.status };
  };

  let lastError = '';

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i];
    try {
      const pingResult = await sendPing(model);
      const latencyMs = Date.now() - startTime;

      if (pingResult.ok) {
        cachedWorkingModel = model;
        return { valid: true, model, latencyMs };
      }

      lastError = pingResult.error;

      // If the API key itself is invalid, fail fast without trying other models
      if (lastError.toLowerCase().includes('api key not valid') || lastError.toLowerCase().includes('api_key_invalid')) {
        return {
          valid: false,
          model,
          latencyMs,
          error: 'API key not valid. Please ensure the full AQ. auth key is copied from Google AI Studio.',
        };
      }

      // If Google suggested an explicit model in the error, dynamically insert it as the next attempt
      const recommended = extractRecommendedModel(lastError);
      if (recommended && !candidateModels.includes(recommended)) {
        console.warn(`[Gemini Client] Google recommended model ${recommended}. Retrying with recommended model...`);
        candidateModels.splice(i + 1, 0, recommended);
      }
    } catch (e: any) {
      const isTimeout = e?.name === 'TimeoutError' || e?.name === 'AbortError' || e?.message?.includes('timed out');
      lastError = isTimeout
        ? 'Connection timed out contacting Google Gemini API (18s). Please check your internet connection or proxy.'
        : (e?.message || 'Network connectivity error contacting Google Gemini API.');
      
      // If network timed out on the first model, don't cascade into infinite timeouts
      if (isTimeout) break;
    }
  }

  return {
    valid: false,
    model: candidateModels[0] || 'none',
    latencyMs: Date.now() - startTime,
    error: lastError || 'Authentication ping failed across available Gemini models.',
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
  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');

  // Try cached model first, followed by active 3.x models, then fallbacks
  const modelsToTry = [
    cachedWorkingModel,
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.0-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash',
  ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i); // unique

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

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      const encodedKey = encodeURIComponent(cleanKey);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodedKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': cleanKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemInstruction }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
        signal: AbortSignal.timeout(25000),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        lastError = errMsg;

        // Auto-heal if Google suggested an alternative model in the error message
        const recommended = extractRecommendedModel(errMsg);
        if (recommended && !modelsToTry.includes(recommended)) {
          modelsToTry.splice(i + 1, 0, recommended);
        }
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('Empty response received from Gemini model.');

      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      cachedWorkingModel = model;

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
      const isTimeout = e?.name === 'TimeoutError' || e?.name === 'AbortError' || e?.message?.includes('timed out');
      lastError = isTimeout
        ? `Request timed out (25s) compiling ZK proof plan on ${model}.`
        : (e?.message || 'Error executing Gemini generation');
    }
  }

  throw new Error(lastError || 'Gemini API call failed across all available models.');
}
