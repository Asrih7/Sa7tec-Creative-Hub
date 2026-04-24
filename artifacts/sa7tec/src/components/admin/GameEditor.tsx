import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useContent, type SiteContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

type Game = SiteContent["games"][number];

export function GameEditor() {
  const { content, updateContent } = useContent();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [game, setGame] = useState<Game>(
    content.games[0] ?? {
      id: "rubiks-race",
      title: { en: "Rubik's Race" },
      subtitle: { en: "" },
      description: { en: "" },
      statusBadge: { en: "Available Now" },
      imageUrl: "",
      screenshots: [],
    },
  );

  const screenshots = game.screenshots ?? [];

  const setShot = (i: number, v: string) => {
    const next = screenshots.slice();
    next[i] = v;
    setGame({ ...game, screenshots: next });
  };

  const save = () => {
    updateContent({ games: [game] });
    toast({ title: t("admin.toast_saved") });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>{t("admin.game_card")}</CardTitle>
        <CardDescription>{t("admin.game_card_sub")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LocalizedField
          label={t("admin.field.title")}
          value={game.title}
          onChange={(v) => setGame({ ...game, title: v })}
        />
        <LocalizedField
          label={t("admin.field.subtitle")}
          value={game.subtitle}
          onChange={(v) => setGame({ ...game, subtitle: v })}
        />
        <LocalizedField
          label={t("admin.field.description")}
          value={game.description}
          onChange={(v) => setGame({ ...game, description: v })}
          multiline
        />
        <LocalizedField
          label={t("admin.field.status_badge")}
          value={game.statusBadge}
          onChange={(v) => setGame({ ...game, statusBadge: v })}
        />
        <ImageUpload
          label={t("admin.field.image")}
          value={game.imageUrl}
          onChange={(v) => setGame({ ...game, imageUrl: v })}
        />

        <div className="space-y-3 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between">
            <Label className="text-foreground/80">{t("admin.field.screenshots")}</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGame({ ...game, screenshots: [...screenshots, ""] })}
            >
              <Plus className="h-4 w-4 me-1" />
              {t("admin.add")}
            </Button>
          </div>
          {screenshots.length === 0 ? (
            <p className="text-sm text-foreground/60 py-4 text-center">{t("admin.empty")}</p>
          ) : (
            screenshots.map((url, i) => (
              <div key={i} className="rounded-lg border border-border/40 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-foreground/50">#{i + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => {
                      if (confirm(t("admin.confirm_delete"))) {
                        setGame({ ...game, screenshots: screenshots.filter((_, idx) => idx !== i) });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <ImageUpload value={url} onChange={(v) => setShot(i, v)} />
              </div>
            ))
          )}
        </div>

        <Button onClick={save} className="mt-2">
          <Save className="w-4 h-4 me-2" /> {t("admin.save")}
        </Button>
      </CardContent>
    </Card>
  );
}
