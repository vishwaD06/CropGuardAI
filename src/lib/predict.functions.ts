import { createServerFn } from "@tanstack/react-start";

export interface PredictionResult {
  disease: string;
  diseaseMr: string;
  confidence: number;
  severity: "healthy" | "mild" | "moderate" | "severe";
  isHealthy: boolean;
  treatment: string[];
  treatmentMr: string[];
  prevention: string[];
  preventionMr: string[];
  tips: string[];
  tipsMr: string[];
  plantName?: string;
  description?: string;
  causes?: string[];
  symptoms?: string[];
  affectedParts?: string[];
  recoveryPeriod?: string;
}

const SYSTEM_PROMPT = `You are an expert plant pathologist analyzing crop leaf images for disease detection.

Carefully examine the provided image and identify:
1. Whether this is actually a plant/leaf image (if not, return isHealthy=false with disease="Not a plant image")
2. The plant/crop name (e.g. Tomato, Wheat, Grape)
3. The specific disease present (or confirm if healthy)
4. A short scientific description of the disease
5. Common causes, visible symptoms, affected plant parts
6. The severity level and expected recovery period
7. Treatment recommendations (specific pesticides/fungicides with dosage)
8. Prevention measures
9. General farming tips

Provide ALL text fields in BOTH English AND Marathi (Devanagari script).
Be deterministic and consistent: the same image must always yield the same diagnosis.
Base confidence strictly on visual evidence (0-100).`;

export const predictDiseaseFn = createServerFn({ method: "POST" })
  .inputValidator((input: { imageBase64: string }) => {
    if (!input?.imageBase64 || typeof input.imageBase64 !== "string") {
      throw new Error("imageBase64 is required");
    }
    return input;
  })
  .handler(async ({ data }): Promise<PredictionResult> => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const imageUrl = data.imageBase64.startsWith("data:")
      ? data.imageBase64
      : `data:image/jpeg;base64,${data.imageBase64}`;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        temperature: 0,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this crop leaf image and diagnose any disease." },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_diagnosis",
              description: "Report the crop disease diagnosis with bilingual advisory.",
              parameters: {
                type: "object",
                properties: {
                  disease: { type: "string", description: "Disease name in English (or 'Healthy Leaf')" },
                  diseaseMr: { type: "string", description: "Disease name in Marathi (Devanagari)" },
                  confidence: { type: "number", description: "0-100 confidence score" },
                  severity: { type: "string", enum: ["healthy", "mild", "moderate", "severe"] },
                  isHealthy: { type: "boolean" },
                  treatment: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
                  treatmentMr: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
                  prevention: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
                  preventionMr: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
                  tips: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
                  tipsMr: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
                  plantName: { type: "string", description: "Crop/plant name in English" },
                  description: { type: "string", description: "1-2 sentence scientific description of the disease" },
                  causes: { type: "array", items: { type: "string" }, maxItems: 5 },
                  symptoms: { type: "array", items: { type: "string" }, maxItems: 5 },
                  affectedParts: { type: "array", items: { type: "string" }, maxItems: 5 },
                  recoveryPeriod: { type: "string", description: "Expected recovery period, e.g. '2-3 weeks with treatment'" },
                },
                required: [
                  "disease", "diseaseMr", "confidence", "severity", "isHealthy",
                  "treatment", "treatmentMr", "prevention", "preventionMr", "tips", "tipsMr",
                  "plantName", "description", "causes", "symptoms", "affectedParts", "recoveryPeriod",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_diagnosis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
      if (response.status === 402) throw new Error("AI credits exhausted. Please add funds in Settings → Workspace → Usage.");
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI analysis failed (${response.status})`);
    }

    const json = await response.json();
    const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return a structured diagnosis");
    }

    const result = JSON.parse(toolCall.function.arguments) as PredictionResult;
    result.confidence = Math.max(0, Math.min(100, Math.round(result.confidence)));
    return result;
  });