import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createGeminiProvider } from "@/lib/ai-gateway";

const BASE_SYSTEM_PROMPT = `You are CropGuard AI Assistant, a friendly bilingual (English & Marathi) expert helping farmers with:
- Crop disease identification, symptoms, and treatment (pesticides, fungicides, dosage)
- Preventive farming practices and integrated pest management
- Soil health, irrigation, fertilizer recommendations
- Seasonal farming tips and weather considerations
- General agronomy questions

Keep responses concise, practical, and farmer-friendly. Reply in the language the user writes in. Use markdown formatting (bullets, bold) for clarity. If asked something unrelated to farming, politely steer back to crop & farming topics.`;

type Diagnosis = {
  disease?: string;
  plantName?: string;
  confidence?: number;
  severity?: string;
  isHealthy?: boolean;
  description?: string;
  symptoms?: string[];
  causes?: string[];
  affectedParts?: string[];
  treatment?: string[];
  prevention?: string[];
  tips?: string[];
  recoveryPeriod?: string;
};

type ChatRequestBody = { messages?: unknown; diagnosis?: Diagnosis | null };

function buildDiagnosisContext(d: Diagnosis | null | undefined): string {
  if (!d || !d.disease) return "";
  const list = (xs?: string[]) => (xs && xs.length ? xs.map((x) => `  - ${x}`).join("\n") : "  - (none provided)");
  return `\n\nCURRENT FARMER'S SCAN CONTEXT (use this to personalize every answer; do NOT ask them to re-upload):
- Plant: ${d.plantName ?? "Unknown"}
- Disease: ${d.disease}
- Health status: ${d.isHealthy ? "Healthy" : "Diseased"}
- Severity: ${d.severity ?? "unknown"}
- Confidence: ${d.confidence ?? "?"}%
- Description: ${d.description ?? "(none)"}
- Recovery period: ${d.recoveryPeriod ?? "(unknown)"}
- Symptoms:\n${list(d.symptoms)}
- Causes:\n${list(d.causes)}
- Affected parts:\n${list(d.affectedParts)}
- Treatment already suggested:\n${list(d.treatment)}
- Prevention already suggested:\n${list(d.prevention)}
- General tips already given:\n${list(d.tips)}

When the farmer asks about "this disease" or "my crop", refer to the above context. Expand on overview, causes, symptoms, severity impact on yield, organic & chemical treatment, prevention, recovery timeline, best practices, and weather precautions as needed.`;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages, diagnosis } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.GEMINI_API_KEY;
        if (!key) return new Response("Missing GEMINI_API_KEY", { status: 500 });

        try {
          const gateway = createGeminiProvider(key);
          const model = gateway("gemini-2.5-flash");
          const system = BASE_SYSTEM_PROMPT + buildDiagnosisContext(diagnosis);
          const result = streamText({
            model,
            system,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });
          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Chat failed";
          console.error("/api/chat error:", err);
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});