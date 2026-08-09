import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { CollectionToolbar, reorder } from "@/components/admin/CollectionToolbar";
import { useContent, type SiteContent } from "@/lib/content-store";
import { useLanguage, type StringKey } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type Service = SiteContent["services"][number];

const ICON_OPTIONS = ["Gamepad2", "ShoppingCart", "GraduationCap", "HeartPulse", "Smartphone"] as const;
const COLOR_OPTIONS = ["cyan", "violet", "lime", "orange"] as const;

export function ServicesEditor() {
  const { content, updateContent } = useContent();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<Service[]>(content.services);

  const update = (idx: number, patch: Partial<Service>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const add = () =>
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: { en: "New service", fr: "Nouveau service", ar: "خدمة جديدة" },
        description: { en: "Short description.", fr: "Brève description.", ar: "وصف موجز." },
        iconName: "Smartphone",
        color: "cyan",
      },
    ]);

  const save = () => {
    updateContent({ services: items });
    toast({ title: t("admin.toast_saved") });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{t("admin.services_card")}</CardTitle>
          <CardDescription>{t("admin.services_card_sub")}</CardDescription>
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
            <div key={item.id} className="rounded-lg border border-border/60 bg-background/40 p-4 space-y-4">
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
              <LocalizedField
                label={t("admin.field.title")}
                value={item.title}
                onChange={(v) => update(idx, { title: v })}
              />
              <LocalizedField
                label={t("admin.field.description")}
                value={item.description}
                onChange={(v) => update(idx, { description: v })}
                multiline
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("admin.field.icon")}</Label>
                  <Select value={item.iconName} onValueChange={(v) => update(idx, { iconName: v })}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {t(`admin.icon.${opt}` as StringKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("admin.field.color")}</Label>
                  <Select value={item.color} onValueChange={(v) => update(idx, { color: v })}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {t(`admin.color.${opt}` as StringKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
