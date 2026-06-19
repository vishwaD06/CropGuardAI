import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ScanLine } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { UploadPanel } from "@/components/UploadPanel";
import { ResultPanel } from "@/components/ResultPanel";
import { AdvisoryPanel } from "@/components/AdvisoryPanel";
import { HistorySection } from "@/components/HistorySection";
import { DiseaseInfoPanel } from "@/components/DiseaseInfoPanel";
import { QuickActions } from "@/components/QuickActions";
import { useLang } from "@/lib/i18n";
import { predictDisease } from "@/lib/mockData";
import { useDisease } from "@/lib/diseaseContext";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CropGuard AI — AI Crop Disease Detection for Farmers" },
      {
        name: "description",
        content:
          "Detect crop diseases instantly with AI. Upload a leaf photo and get diagnosis, severity, and treatment advice in English or Marathi.",
      },
      { property: "og:title", content: "CropGuard AI — AI Crop Disease Detection" },
      {
        property: "og:description",
        content: "Instant AI-powered crop disease diagnosis and farming advisory.",
      },
    ],
  }),
  component: () => (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  ),
});

function Dashboard() {
  const { t } = useLang();
  const { current, setCurrent, addScan } = useDisease();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const prediction = current?.prediction ?? null;

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setCurrent(null);
    try {
      const result = await predictDisease(image);
      const scan = {
        id: crypto.randomUUID(),
        image,
        prediction: result,
        timestamp: Date.now(),
      };
      setCurrent(scan);
      addScan(scan);
    } finally {
      setLoading(false);
    }
  };

  const scrollToUpload = () => {
    document.getElementById("scan-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[image:var(--gradient-hero)]">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {t("heroBadge")}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              {t("heroDesc")}
            </p>
            <Button
              onClick={scrollToUpload}
              size="lg"
              className="mt-6 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95"
            >
              <ScanLine className="mr-2 h-5 w-5" />
              {t("startScan")}
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section id="scan-section" className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <UploadPanel
            image={image}
            setImage={setImage}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
          <ResultPanel prediction={prediction} loading={loading} />
        </div>

        {prediction && (
          <div className="mt-6">
            <QuickActions />
          </div>
        )}

        <div className="mt-6">
          <AdvisoryPanel prediction={prediction} />
        </div>

        {prediction && (
          <div className="mt-6">
            <DiseaseInfoPanel prediction={prediction} />
          </div>
        )}

        <div className="mt-6">
          <HistorySection />
        </div>
      </section>
    </>
  );
}
