import { BookOpen, AlertCircle, Leaf, Clock, Stethoscope, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Prediction } from "@/lib/mockData";

function Section({
  icon: Icon,
  title,
  items,
  text,
  tone = "primary",
}: {
  icon: typeof BookOpen;
  title: string;
  items?: string[];
  text?: string;
  tone?: "primary" | "warn" | "success";
}) {
  if (!text && (!items || items.length === 0)) return null;
  const toneCls =
    tone === "warn"
      ? "bg-[oklch(0.7_0.18_50)]/10 text-[oklch(0.5_0.18_50)]"
      : tone === "success"
      ? "bg-[oklch(0.65_0.18_145)]/10 text-[oklch(0.45_0.16_145)]"
      : "bg-primary/10 text-primary";
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneCls}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
      {items && items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DiseaseInfoPanel({ prediction }: { prediction: Prediction }) {
  return (
    <Card id="disease-details" className="border-border/60 p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-tight">{prediction.disease}</h2>
            {prediction.plantName && (
              <p className="text-xs text-muted-foreground">Plant: {prediction.plantName}</p>
            )}
          </div>
        </div>
        <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium capitalize">
          {prediction.severity}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Section icon={BookOpen} title="Scientific Description" text={prediction.description} />
        <Section icon={Stethoscope} title="Symptoms" items={prediction.symptoms} tone="warn" />
        <Section icon={AlertCircle} title="Causes" items={prediction.causes} tone="warn" />
        <Section icon={Leaf} title="Affected Plant Parts" items={prediction.affectedParts} />
        <Section icon={ShieldCheck} title="Prevention Tips" items={prediction.prevention} tone="success" />
        <Section
          icon={Clock}
          title="Expected Recovery"
          text={prediction.recoveryPeriod || "Varies based on treatment adherence and weather."}
          tone="success"
        />
      </div>
    </Card>
  );
}