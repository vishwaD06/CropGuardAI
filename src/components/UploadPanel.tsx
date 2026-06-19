import { useRef, useState, type DragEvent } from "react";
import { Upload, Camera, ImageIcon, Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Props {
  image: string | null;
  setImage: (img: string | null) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export function UploadPanel({ image, setImage, onAnalyze, loading }: Props) {
  const { t } = useLang();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <Card className="overflow-hidden border-border/60 p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Upload className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">{t("uploadTitle")}</h2>
      </div>

      {!image ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-all",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5",
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <ImageIcon className="h-7 w-7 text-primary" />
          </div>
          <p className="text-center text-sm text-muted-foreground">{t("uploadHint")}</p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img src={image} alt="Uploaded crop leaf" className="h-64 w-full object-cover" />
          <button
            onClick={() => setImage(null)}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-transform hover:scale-110"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={loading}>
          <Upload className="mr-2 h-4 w-4" /> {t("chooseFile")}
        </Button>
        <Button variant="outline" onClick={() => cameraRef.current?.click()} disabled={loading}>
          <Camera className="mr-2 h-4 w-4" /> {t("useCamera")}
        </Button>
      </div>

      <Button
        onClick={onAnalyze}
        disabled={!image || loading}
        className="mt-3 w-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-95"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("analyzing")}
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" /> {t("analyze")}
          </>
        )}
      </Button>
    </Card>
  );
}
