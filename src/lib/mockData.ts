import { predictDiseaseFn, type PredictionResult } from "./predict.functions";

export type Severity = "healthy" | "mild" | "moderate" | "severe";

export type Prediction = PredictionResult;

export interface ScanHistory {
  id: string;
  image: string;
  disease: string;
  diseaseMr: string;
  confidence: number;
  severity: Severity;
  timestamp: number;
  plantName?: string;
  isHealthy?: boolean;
}

export async function predictDisease(imageData: string): Promise<Prediction> {
  return await predictDiseaseFn({ data: { imageBase64: imageData } });
}

const HISTORY_KEY = "cropguard_history";

export function getHistory(): ScanHistory[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToHistory(entry: ScanHistory) {
  if (typeof window === "undefined") return;
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 12)));
}