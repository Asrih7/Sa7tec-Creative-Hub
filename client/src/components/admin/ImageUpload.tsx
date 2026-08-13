import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

function resolveSrc(value?: string): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("data:") || /^https?:/i.test(value)) return value;
  if (value.startsWith("/assets/")) return `${BASE}${value.slice(1)}`;
  return value;
}

interface Props {
  label?: string;
  value?: string;
  onChange: (next: string) => void;
}

export function ImageUpload({ label, value, onChange }: Props) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlMode, setUrlMode] = useState(false);

  const handleFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: t("admin.toast_image_too_large"), variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label ? <Label className="text-foreground/80">{label}</Label> : null}
      <div className="flex items-start gap-3">
        <div className="h-24 w-24 shrink-0 rounded-lg border border-border/60 bg-background/40 overflow-hidden flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveSrc(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <Upload className="h-6 w-6 text-foreground/40" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              {t("admin.field.upload")}
            </Button>
            {value ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onChange("")}
              >
                <X className="h-4 w-4 me-1" />
                {t("admin.field.clear")}
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setUrlMode((v) => !v)}
            >
              {t("admin.field.image_url")}
            </Button>
          </div>
          {urlMode ? (
            <Input
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://…"
            />
          ) : (
            <p className="text-xs text-foreground/50">{t("admin.field.image_hint")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
