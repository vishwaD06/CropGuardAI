import { Link, useLocation } from "@tanstack/react-router";
import { Leaf, Languages } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const { lang, setLang, t } = useLang();
  const location = useLocation();

  const links = [
    { to: "/", label: t("home") },
    { to: "/about", label: t("about") },
    { to: "/contact", label: t("contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-soft)]">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-foreground">{t("appName")}</span>
            <span className="hidden text-[10px] text-muted-foreground sm:block">{t("tagline")}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setLang(lang === "en" ? "mr" : "en")}
          className="gap-2"
        >
          <Languages className="h-4 w-4" />
          <span className="font-semibold">{lang === "en" ? "मराठी" : "English"}</span>
        </Button>
      </div>

      <nav className="flex items-center justify-center gap-1 border-t border-border/60 px-4 py-2 md:hidden">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              location.pathname === l.to
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
