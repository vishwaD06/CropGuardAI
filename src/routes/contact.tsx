import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CropGuard AI" },
      {
        name: "description",
        content: "Get in touch with the CropGuard AI team for support, feedback, or partnerships.",
      },
      { property: "og:title", content: "Contact CropGuard AI" },
      { property: "og:description", content: "Reach out to the CropGuard AI team." },
    ],
  }),
  component: () => (
    <AppLayout>
      <ContactContent />
      <Toaster />
    </AppLayout>
  ),
});

function ContactContent() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success(t("sent"));
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{t("contactTitle")}</h1>
        <p className="mt-3 text-muted-foreground">
          We'd love to hear from farmers, partners, and supporters.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          {[
            { icon: Mail, label: "Email", value: "hello@cropguard.ai" },
            { icon: Phone, label: "Phone", value: "+91 99887766XX" },
            { icon: MapPin, label: "Location", value: "Pune, Maharashtra" },
          ].map((c) => (
            <Card key={c.label} className="flex items-center gap-3 border-border/60 p-4 shadow-[var(--shadow-card)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-sm font-semibold">{c.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="border-border/60 p-6 shadow-[var(--shadow-card)] lg:col-span-2">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">{t("message")}</Label>
              <Textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-95"
            >
              <Send className="mr-2 h-4 w-4" />
              {t("send")}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
