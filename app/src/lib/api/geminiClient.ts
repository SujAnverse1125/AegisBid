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
export async function validateGeminiKey(apiKey: string): Promise<KeyValidationResult> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return { valid: false, model: 'none', latencyMs: 0, error: 'API key is required.' };
  }

  const startTime = Date.now();

  // Step 1: Auto-discover models available for this specific project / key
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
    const listRes = await fetch(listUrl, { signal: AbortSignal.timeout(6000) });

    if (!listRes.ok) {
      const errJson = await listRes.json().catch(() => ({}));
      const msg = errJson?.error?.message || `HTTP ${listRes.status}: ${listRes.statusText}`;
      return {
        valid: false,
        model: 'none',
        latencyMs: Date.now() - startTime,
        error: msg,
      };
    }

    const listData = await listRes.json();
    const availableModels: string[] = (listData?.models || [])
      .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => m.name.replace(/^models\//, ''));

    // Priority ordering: 2026 active models for new accounts first
    const preferredOrder = [
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-3.0-flash',
      'gemini-2.5-flash',
      'gemini-2.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-3.8-pro',
      'gemini-3.5-pro',
      'gemini-3.0-pro',
      'gemini-2.5-pro',
      'gemini-1.5-pro',
    ];

    let selectedModel = '';
    for (const pref of preferredOrder) {
      if (availableModels.includes(pref)) {
        selectedModel = pref;
        break;
      }
    }

    // If none of the preferred matched in catalog, default to gemini-3.8-flash or first available
    if (!selectedModel && availableModels.length > 0) {
      selectedModel = availableModels[0];
    }

    if (!selectedModel) {
      selectedModel = 'gemini-3.8-flash';
    }

    // Step 2: Validate by sending a small ping with self-healing fallback
    const sendPing = async (modelName: string) => {
      const pingUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`;
      const pingRes = await fetch(pingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'ping' }] }],
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (pingRes.ok) {
        return { ok: true, error: '' };
      }
      const errJson = await pingRes.json().catch(() => ({}));
      return { ok: false, error: errJson?.error?.message || `Ping failed on ${modelName}` };
    };

    let pingResult = await sendPing(selectedModel);
    let activeModel = selectedModel;

    // Self-healing: If rejected because of account-level model gating, extract Google's recommended model and re-test
    if (!pingResult.ok) {
      const recommended = extractRecommendedModel(pingResult.error);
      if (recommended && recommended !== selectedModel) {
        const retryResult = await sendPing(recommended);
        if (retryResult.ok) {
          activeModel = recommended;
          pingResult = retryResult;
        }
      }
    }

    const latencyMs = Date.now() - startTime;

    if (pingResult.ok) {
      cachedWorkingModel = activeModel;
      return { valid: true, model: activeModel, latencyMs };
    } else {
      return {
        valid: false,
        model: activeModel,
        latencyMs,
        error: pingResult.error,
      };
    }
  } catch (e: any) {
    return {
      valid: false,
      model: 'none',
      latencyMs: Date.now() - startTime,
      error: e?.message || 'Network connectivity error contacting Google Gemini API.',
    };
  }
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
        signal: AbortSignal.timeout(12000),
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
      lastError = e?.message || 'Error executing Gemini generation';
    }
  }

  throw new Error(lastError || 'Gemini API call failed across all available models.');
}
