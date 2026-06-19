import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Brain, Users, Globe2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CropGuard AI" },
      {
        name: "description",
        content:
          "Learn how CropGuard AI uses artificial intelligence to help farmers diagnose crop diseases and improve harvests.",
      },
      { property: "og:title", content: "About CropGuard AI" },
      {
        property: "og:description",
        content: "AI-powered crop disease detection built for farmers.",
      },
    ],
  }),
  component: () => (
    <AppLayout>
      <AboutContent />
    </AppLayout>
  ),
});

function AboutContent() {
  const { t } = useLang();
  const features = [
    { icon: Brain, title: "AI-Powered", desc: "Deep learning model trained on thousands of crop images." },
    { icon: Leaf, title: "Crop-Focused", desc: "Specialized for common crop diseases across regions." },
    { icon: Users, title: "Farmer-First", desc: "Designed with simplicity for on-field use." },
    { icon: Globe2, title: "Multilingual", desc: "Works in English and Marathi for wider reach." },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t("aboutTitle")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("aboutDesc")}</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Card key={f.title} className="border-border/60 p-5 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)]">
              <f.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
