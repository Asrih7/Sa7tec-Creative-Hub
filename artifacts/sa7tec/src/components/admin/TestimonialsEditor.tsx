import { Plus, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { CollectionToolbar, reorder } from "@/components/admin/CollectionToolbar";
import { useContent, type SiteContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

type Item = SiteContent["testimonials"][number];

export function TestimonialsEditor() {
  const { content, updateContent } = useContent();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>(content.testimonials);

  const update = (idx: number, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const add = () =>
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "Client name",
        role: { en: "Role", fr: "Rôle", ar: "المنصب" },
        company: "Company",
        quote: { en: "What they said.", fr: "Ce qu'ils ont dit.", ar: "ما قالوه." },
        avatarUrl: "",
      },
    ]);

  const save = () => {
    updateContent({ testimonials: items });
    toast({ title: t("admin.toast_saved") });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{t("admin.testimonials_card")}</CardTitle>
          <CardDescription>{t("admin.testimonials_card_sub")}</CardDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>{t("admin.field.name")}</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => update(idx, { name: e.target.value })}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("admin.field.company")}</Label>
                  <Input
                    value={item.company}
                    onChange={(e) => update(idx, { company: e.target.value })}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
              </div>
              <LocalizedField
                label={t("admin.field.role")}
                value={item.role}
                onChange={(v) => update(idx, { role: v })}
              />
              <LocalizedField
                label={t("admin.field.quote")}
                value={item.quote}
                onChange={(v) => update(idx, { quote: v })}
                multiline
              />
              <ImageUpload
                label={t("admin.field.avatar")}
                value={item.avatarUrl ?? ""}
                onChange={(v) => update(idx, { avatarUrl: v })}
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
