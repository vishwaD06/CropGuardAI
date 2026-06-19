import { Activity, CheckCircle2, AlertTriangle, Loader2, Microscope } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLang } from "@/lib/i18n";
import type { Prediction } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface Props {
  prediction: Prediction | null;
  loading: boolean;
}

const severityStyle: Record<string, string> = {
  healthy: "bg-[oklch(0.65_0.18_145)]/15 text-[oklch(0.45_0.16_145)] border-[oklch(0.65_0.18_145)]/30",
  mild: "bg-[oklch(0.78_0.16_75)]/15 text-[oklch(0.5_0.16_75)] border-[oklch(0.78_0.16_75)]/30",
  moderate: "bg-[oklch(0.7_0.18_50)]/15 text-[oklch(0.5_0.18_50)] border-[oklch(0.7_0.18_50)]/30",
  severe: "bg-destructive/15 text-destructive border-destructive/30",
};

export function ResultPanel({ prediction, loading }: Props) {
  const { t, lang } = useLang();

  return (
    <Card className="border-border/60 p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">{t("result")}</h2>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
            <Loader2 className="absolute inset-0 m-auto h-16 w-16 animate-spin text-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">{t("analyzing")}</p>
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
          </div>
        </div>
      ) : !prediction ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <Microscope className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Upload an image and click analyze to see results
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                {prediction.isHealthy ? (
                  <CheckCircle2 className="h-5 w-5 text-[oklch(0.55_0.16_145)]" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-[oklch(0.65_0.2_50)]" />
                )}
                <h3 className="text-xl font-bold text-foreground">
                  {lang === "en" ? prediction.disease : prediction.diseaseMr}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">via /predict endpoint</p>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold capitalize",
                severityStyle[prediction.severity],
              )}
            >
              {t(prediction.severity)}
            </span>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{t("confidence")}</span>
              <span className="text-2xl font-bold text-primary">{prediction.confidence}%</span>
            </div>
            <Progress value={prediction.confidence} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3">
            <div>
              <p className="text-xs text-muted-foreground">{t("severity")}</p>
              <p className="text-sm font-semibold capitalize">{t(prediction.severity)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm font-semibold">
                {prediction.isHealthy ? t("healthy") : "Diseased"}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
