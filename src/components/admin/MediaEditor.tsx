import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

export function MediaEditor() {
  const { content, updateContent } = useContent();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [bg, setBg] = useState(content.siteInfo.heroBackgroundUrl ?? "");

  const save = () => {
    updateContent({ siteInfo: { ...content.siteInfo, heroBackgroundUrl: bg } });
    toast({ title: t("admin.toast_saved") });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>{t("admin.media_card")}</CardTitle>
        <CardDescription>{t("admin.media_card_sub")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImageUpload
          label={t("admin.field.hero_bg")}
          value={bg}
          onChange={setBg}
        />
        <Button onClick={save} className="mt-2">
          <Save className="w-4 h-4 me-2" /> {t("admin.save")}
        </Button>
      </CardContent>
    </Card>
  );
}
