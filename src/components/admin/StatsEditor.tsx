import { Plus, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { CollectionToolbar, reorder } from "@/components/admin/CollectionToolbar";
import { useContent, type SiteContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

type Stat = SiteContent["stats"][number];

export function StatsEditor() {
  const { content, updateContent } = useContent();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<Stat[]>(content.stats);

  const update = (idx: number, patch: Partial<Stat>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const add = () =>
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: { en: "New stat", fr: "Nouvelle stat", ar: "إحصائية جديدة" }, value: "50+" },
    ]);

  const save = () => {
    updateContent({ stats: items });
    toast({ title: t("admin.toast_saved") });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{t("admin.stats_card")}</CardTitle>
          <CardDescription>{t("admin.stats_card_sub")}</CardDescription>
        </div>
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="h-4 w-4 me-2" />
          {t("admin.add")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-foreground/60 py-6 text-center">{t("admin.empty")}</p>
        ) : (
          items.map((item, idx) => (
            <div key={item.id} className="rounded-lg border border-border/60 bg-background/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-foreground/50">#{idx + 1}</span>
                <CollectionToolbar
                  index={idx}
                  total={items.length}
                  onMoveUp={() => setItems((p) => reorder(p, idx, idx - 1))}
                  onMoveDown={() => setItems((p) => reorder(p, idx, idx + 1))}
                  onDelete={() => setItems((p) => p.filter((_, i) => i !== idx))}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t("admin.field.value")}</Label>
                <Input
                  value={item.value}
                  onChange={(e) => update(idx, { value: e.target.value })}
                  className="bg-zinc-950 border-zinc-800"
                />
              </div>
              <LocalizedField
                label={t("admin.field.title")}
                value={item.label}
                onChange={(v) => update(idx, { label: v })}
              />
            </div>
          ))
        )}
        <Button onClick={save} className="mt-2">
          <Save className="w-4 h-4 me-2" /> {t("admin.save")}
        </Button>
      </CardContent>
    </Card>
  );
}
