import { useState, type ReactNode } from "react";
import { Header } from "./Header";
import { ChatWidget } from "./ChatWidget";
import { LangContext, translations, type Lang, type TranslationKey } from "@/lib/i18n";
import { DiseaseProvider } from "@/lib/diseaseContext";

export function AppLayout({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = (k: TranslationKey) => translations[lang][k];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <DiseaseProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main>{children}</main>
          <footer className="mt-16 border-t border-border/60 bg-muted/30 py-6">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} CropGuard AI — Empowering farmers with AI
            </div>
          </footer>
          <ChatWidget />
        </div>
      </DiseaseProvider>
    </LangContext.Provider>
  );
}
