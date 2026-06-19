import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Prediction, ScanHistory } from "./mockData";

const HISTORY_KEY = "cropguard_history";

function loadHistory(): ScanHistory[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveHistory(h: ScanHistory[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 50)));
}

export interface CurrentScan {
  id: string;
  image: string;
  prediction: Prediction;
  timestamp: number;
}

interface DiseaseCtx {
  current: CurrentScan | null;
  setCurrent: (s: CurrentScan | null) => void;
  history: ScanHistory[];
  addScan: (s: CurrentScan) => void;
  deleteScan: (id: string) => void;
  deleteAll: () => void;
  openChat: () => void;
  registerChatOpener: (fn: () => void) => () => void;
  getDiagnosisForChat: () => Prediction | null;
}

const Ctx = createContext<DiseaseCtx | null>(null);

export function DiseaseProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<CurrentScan | null>(null);
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const openerRef = useRef<(() => void) | null>(null);
  const currentRef = useRef<CurrentScan | null>(null);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addScan = useCallback((s: CurrentScan) => {
    setHistory((prev) => {
      const entry: ScanHistory = {
        id: s.id,
        image: s.image,
        disease: s.prediction.disease,
        diseaseMr: s.prediction.diseaseMr,
        confidence: s.prediction.confidence,
        severity: s.prediction.severity,
        timestamp: s.timestamp,
        plantName: s.prediction.plantName,
        isHealthy: s.prediction.isHealthy,
      };
      const next = [entry, ...prev.filter((p) => p.id !== s.id)];
      saveHistory(next);
      return next;
    });
  }, []);

  const deleteScan = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveHistory(next);
      return next;
    });
    setCurrent((c) => (c?.id === id ? null : c));
  }, []);

  const deleteAll = useCallback(() => {
    saveHistory([]);
    setHistory([]);
    setCurrent(null);
  }, []);

  const registerChatOpener = useCallback((fn: () => void) => {
    openerRef.current = fn;
    return () => {
      if (openerRef.current === fn) openerRef.current = null;
    };
  }, []);

  const openChat = useCallback(() => {
    openerRef.current?.();
  }, []);

  const getDiagnosisForChat = useCallback(() => currentRef.current?.prediction ?? null, []);

  const value = useMemo(
    () => ({
      current,
      setCurrent,
      history,
      addScan,
      deleteScan,
      deleteAll,
      openChat,
      registerChatOpener,
      getDiagnosisForChat,
    }),
    [current, history, addScan, deleteScan, deleteAll, openChat, registerChatOpener, getDiagnosisForChat],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDisease() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDisease must be used inside DiseaseProvider");
  return ctx;
}