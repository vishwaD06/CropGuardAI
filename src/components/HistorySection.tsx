import { History, Clock, Trash2, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { useDisease } from "@/lib/diseaseContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function HistorySection() {
  const { t, lang } = useLang();
  const { history, deleteScan, deleteAll } = useDisease();

  return (
    <Card className="border-border/60 p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <History className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">{t("history")}</h2>
        </div>
        {history.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all scans?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes every saved scan from this device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAll}>Delete All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <Clock className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{t("noHistory")}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {history.map((h) => (
            <div
              key={h.id}
              className="group relative flex gap-3 overflow-hidden rounded-xl border border-border/60 bg-card p-3 transition-all hover:shadow-[var(--shadow-soft)]"
            >
              <img
                src={h.image}
                alt={h.disease}
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {lang === "en" ? h.disease : h.diseaseMr}
                </p>
                {h.plantName && (
                  <p className="truncate text-[11px] text-muted-foreground">{h.plantName}</p>
                )}
                <p className="text-xs text-primary">{h.confidence}% • {t(h.severity)}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {new Date(h.timestamp).toLocaleString()}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    aria-label="Delete scan"
                    className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this scan?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Remove “{lang === "en" ? h.disease : h.diseaseMr}” from your history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteScan(h.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
