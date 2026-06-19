import { MessageCircle, FileText, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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

function downloadReport(scanId: string, prediction: ReturnType<typeof useDisease>["current"] extends infer T ? T extends { prediction: infer P } ? P : never : never) {
  const lines = [
    "CropGuard AI — Diagnosis Report",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    `Plant: ${prediction.plantName ?? "Unknown"}`,
    `Disease: ${prediction.disease}`,
    `Status: ${prediction.isHealthy ? "Healthy" : "Diseased"}`,
    `Severity: ${prediction.severity}`,
    `Confidence: ${prediction.confidence}%`,
    "",
    `Description: ${prediction.description ?? "-"}`,
    `Recovery: ${prediction.recoveryPeriod ?? "-"}`,
    "",
    "Symptoms:",
    ...(prediction.symptoms ?? []).map((s) => `  - ${s}`),
    "",
    "Causes:",
    ...(prediction.causes ?? []).map((s) => `  - ${s}`),
    "",
    "Affected Parts:",
    ...(prediction.affectedParts ?? []).map((s) => `  - ${s}`),
    "",
    "Treatment:",
    ...prediction.treatment.map((s) => `  - ${s}`),
    "",
    "Prevention:",
    ...prediction.prevention.map((s) => `  - ${s}`),
    "",
    "Farming Tips:",
    ...prediction.tips.map((s) => `  - ${s}`),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cropguard-report-${scanId.slice(0, 8)}.txt`;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function QuickActions() {
  const { current, openChat, deleteScan } = useDisease();
  if (!current) return null;

  const scrollToDetails = () => {
    document.getElementById("disease-details")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={openChat}
        className="bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-95"
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Ask AI Advisor
      </Button>
      <Button variant="outline" onClick={scrollToDetails}>
        <BookOpen className="mr-2 h-4 w-4" />
        View Disease Details
      </Button>
      <Button variant="outline" onClick={() => downloadReport(current.id, current.prediction)}>
        <FileText className="mr-2 h-4 w-4" />
        Save Report
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="text-destructive hover:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Scan
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this scan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the current analysis and its history entry. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteScan(current.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}