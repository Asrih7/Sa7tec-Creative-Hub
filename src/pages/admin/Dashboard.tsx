import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, Download } from "lucide-react";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { ServicesEditor } from "@/components/admin/ServicesEditor";
import { PortfolioEditor } from "@/components/admin/PortfolioEditor";
import { StatsEditor } from "@/components/admin/StatsEditor";
import { ProcessEditor } from "@/components/admin/ProcessEditor";
import { TestimonialsEditor } from "@/components/admin/TestimonialsEditor";
import { MediaEditor } from "@/components/admin/MediaEditor";
import { changeAdminPassword } from "@/lib/admin-auth";

export default function Dashboard() {
  const { content, updateContent, deleteSubmission } = useContent();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [siteInfo, setSiteInfo] = useState(content.siteInfo);
  const [contactInfo, setContactInfo] = useState(content.contactInfo);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  const handleSaveSiteInfo = () => {
    updateContent({ siteInfo });
    toast({ title: t("admin.toast_saved"), description: t("admin.toast_saved_site") });
  };

  const handleSaveContactInfo = () => {
    updateContent({ contactInfo });
    toast({ title: t("admin.toast_saved"), description: t("admin.toast_saved_contact") });
  };

  const handleExportSubmissions = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content.submissions, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "sa7tec_submissions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next.length < 12) {
      toast({ title: t("admin.toast_denied"), description: t("admin.password_short"), variant: "destructive" });
      return;
    }
    if (pwd.next !== pwd.confirm) {
      toast({ title: t("admin.toast_denied"), description: t("admin.password_mismatch"), variant: "destructive" });
      return;
    }
    const updated = await changeAdminPassword(pwd.current, pwd.next);
    if (!updated) {
      toast({ title: t("admin.toast_denied"), description: t("admin.password_wrong"), variant: "destructive" });
      return;
    }
    setPwd({ current: "", next: "", confirm: "" });
    toast({ title: t("admin.password_updated"), description: t("admin.password_updated_desc") });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">{t("admin.cm_title")}</h2>
          <p className="text-muted-foreground">{t("admin.cm_sub")}</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-zinc-900 border-zinc-800 flex-wrap h-auto">
            <TabsTrigger value="general">{t("admin.tab.general")}</TabsTrigger>
            <TabsTrigger value="services">{t("admin.tab.services")}</TabsTrigger>
            <TabsTrigger value="portfolio">{t("admin.tab.portfolio")}</TabsTrigger>
            <TabsTrigger value="stats">{t("admin.tab.stats")}</TabsTrigger>
            <TabsTrigger value="process">{t("admin.tab.process")}</TabsTrigger>
            <TabsTrigger value="testimonials">{t("admin.tab.testimonials")}</TabsTrigger>
            <TabsTrigger value="media">{t("admin.tab.media")}</TabsTrigger>
            <TabsTrigger value="contact">{t("admin.tab.contact")}</TabsTrigger>
            <TabsTrigger value="submissions">
              {t("admin.tab.submissions")} ({content.submissions.length})
            </TabsTrigger>
            <TabsTrigger value="password">{t("admin.tab.password")}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>{t("admin.site_identity")}</CardTitle>
                <CardDescription>{t("admin.site_identity_sub")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>{t("admin.field.site_title")}</Label>
                  <Input
                    value={siteInfo.title}
                    onChange={(e) => setSiteInfo({ ...siteInfo, title: e.target.value })}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>

                <LocalizedField
                  label={t("admin.field.tagline")}
                  value={siteInfo.tagline}
                  onChange={(next) => setSiteInfo({ ...siteInfo, tagline: next })}
                />

                <LocalizedField
                  label={t("admin.field.hero_headline")}
                  value={siteInfo.heroHeadline}
                  onChange={(next) => setSiteInfo({ ...siteInfo, heroHeadline: next })}
                />

                <LocalizedField
                  label={t("admin.field.hero_sub")}
                  value={siteInfo.heroSubheadline}
                  onChange={(next) => setSiteInfo({ ...siteInfo, heroSubheadline: next })}
                  multiline
                />

                <LocalizedField
                  label={t("admin.field.about")}
                  value={siteInfo.aboutText}
                  onChange={(next) => setSiteInfo({ ...siteInfo, aboutText: next })}
                  multiline
                />

                <Button onClick={handleSaveSiteInfo} className="mt-4">
                  <Save className="w-4 h-4 me-2" /> {t("admin.save")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServicesEditor />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioEditor />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <StatsEditor />
          </TabsContent>

          <TabsContent value="process" className="space-y-6">
            <ProcessEditor />
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            <TestimonialsEditor />
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <MediaEditor />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>{t("admin.contact_info")}</CardTitle>
                <CardDescription>{t("admin.contact_info_sub")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>{t("admin.field.email")}</Label>
                  <Input
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("admin.field.phone")}</Label>
                  <Input
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("admin.field.whatsapp")}</Label>
                  <Input
                    value={contactInfo.whatsapp}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                    placeholder="+15551234567"
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>

                <LocalizedField
                  label={t("admin.field.address")}
                  value={contactInfo.address}
                  onChange={(next) => setContactInfo({ ...contactInfo, address: next })}
                />

                <h4 className="font-semibold mt-6 mb-2">{t("admin.social_links")}</h4>
              
                <div className="grid gap-2">
                  <Label>{t("admin.field.linkedin")}</Label>
                  <Input
                    value={contactInfo.social.linkedin}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, social: { ...contactInfo.social, linkedin: e.target.value } })
                    }
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("admin.field.instagram")}</Label>
                  <Input
                    value={contactInfo.social.instagram}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, social: { ...contactInfo.social, instagram: e.target.value } })
                    }
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("admin.field.github")}</Label>
                  <Input
                    value={contactInfo.social.github}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, social: { ...contactInfo.social, github: e.target.value } })
                    }
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>

                <Button onClick={handleSaveContactInfo} className="mt-4">
                  <Save className="w-4 h-4 me-2" /> {t("admin.save")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t("admin.submissions_title")}</CardTitle>
                  <CardDescription>{t("admin.submissions_sub")}</CardDescription>
                </div>
                <Button variant="outline" onClick={handleExportSubmissions} disabled={content.submissions.length === 0}>
                  <Download className="w-4 h-4 me-2" /> {t("admin.export_json")}
                </Button>
              </CardHeader>
              <CardContent>
                {content.submissions.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">{t("admin.no_submissions")}</div>
                ) : (
                  <div className="space-y-4">
                    {content.submissions.map((sub) => (
                      <div key={sub.id} className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 relative group">
                        <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="destructive" size="icon" onClick={() => deleteSubmission(sub.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-zinc-500">{t("admin.field.name")}</p>
                            <p className="font-medium">{sub.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">{t("admin.field.email")}</p>
                            <p className="font-medium">
                              <a href={`mailto:${sub.email}`} className="text-primary hover:underline">
                                {sub.email}
                              </a>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">{t("contact.project_type")}</p>
                            <p className="font-medium">{sub.projectType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">{t("admin.field.budget")}</p>
                            <p className="font-medium">{sub.budgetRange}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500">{t("admin.field.message")}</p>
                          <p className="mt-1 text-sm bg-zinc-900 p-3 rounded-md">{sub.message}</p>
                        </div>
                        <p className="text-xs text-zinc-600 mt-4">
                          {t("admin.received")}: {new Date(sub.date).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>{t("admin.password_card")}</CardTitle>
                <CardDescription>{t("admin.password_card_sub")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="grid gap-2">
                    <Label>{t("admin.current_password")}</Label>
                    <Input
                      type="password"
                      value={pwd.current}
                      onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                      className="bg-zinc-950 border-zinc-800"
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("admin.new_password")}</Label>
                    <Input
                      type="password"
                      value={pwd.next}
                      onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                      className="bg-zinc-950 border-zinc-800"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>{t("admin.confirm_password")}</Label>
                    <Input
                      type="password"
                      value={pwd.confirm}
                      onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                      className="bg-zinc-950 border-zinc-800"
                      autoComplete="new-password"
                    />
                  </div>
                  <Button type="submit" className="mt-2">
                    <Save className="w-4 h-4 me-2" /> {t("admin.update_password")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
