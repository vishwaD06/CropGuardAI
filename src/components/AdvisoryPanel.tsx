import { Pill, Shield, Sprout, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";
import type { Prediction } from "@/lib/mockData";

interface Props {
  prediction: Prediction | null;
}

export function AdvisoryPanel({ prediction }: Props) {
  const { t, lang } = useLang();

  const sections = prediction
    ? [
        {
          icon: Pill,
          title: t("pesticides"),
          items: lang === "en" ? prediction.treatment : prediction.treatmentMr,
          color: "text-[oklch(0.6_0.2_30)]",
          bg: "bg-[oklch(0.6_0.2_30)]/10",
        },
        {
          icon: Shield,
          title: t("prevention"),
          items: lang === "en" ? prediction.prevention : prediction.preventionMr,
          color: "text-primary",
          bg: "bg-primary/10",
        },
        {
          icon: Sprout,
          title: t("tips"),
          items: lang === "en" ? prediction.tips : prediction.tipsMr,
          color: "text-[oklch(0.6_0.18_140)]",
          bg: "bg-[oklch(0.6_0.18_140)]/10",
        },
      ]
    : [];

  return (
    <Card className="border-border/60 p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Lightbulb className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">{t("advisory")}</h2>
      </div>

      {!prediction ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <Lightbulb className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Recommendations will appear after analysis
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((s) => (
            <div key={s.title} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <h3 className="font-semibold">{s.title}</h3>
              </div>
              <ul className="space-y-2">
                {s.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${s.bg.replace("/10", "")}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
