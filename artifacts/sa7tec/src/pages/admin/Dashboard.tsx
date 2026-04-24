import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useContent } from "@/lib/content-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, Download } from "lucide-react";

export default function Dashboard() {
  const { content, updateContent, deleteSubmission } = useContent();
  const { toast } = useToast();
  
  // Local state for fast editing
  const [siteInfo, setSiteInfo] = useState(content.siteInfo);
  const [contactInfo, setContactInfo] = useState(content.contactInfo);

  const handleSaveSiteInfo = () => {
    updateContent({ siteInfo });
    toast({ title: "Saved", description: "Site information updated successfully." });
  };

  const handleSaveContactInfo = () => {
    updateContent({ contactInfo });
    toast({ title: "Saved", description: "Contact information updated successfully." });
  };

  const handleExportSubmissions = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content.submissions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "sa7tec_submissions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Content Management</h2>
          <p className="text-muted-foreground">Manage your website's content and view submissions.</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            <TabsTrigger value="submissions">Form Submissions ({content.submissions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Site Identity</CardTitle>
                <CardDescription>Main titles and hero section text.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Site Title</Label>
                  <Input 
                    value={siteInfo.title} 
                    onChange={e => setSiteInfo({...siteInfo, title: e.target.value})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tagline</Label>
                  <Input 
                    value={siteInfo.tagline} 
                    onChange={e => setSiteInfo({...siteInfo, tagline: e.target.value})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Hero Headline</Label>
                  <Input 
                    value={siteInfo.heroHeadline} 
                    onChange={e => setSiteInfo({...siteInfo, heroHeadline: e.target.value})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Hero Subheadline</Label>
                  <Textarea 
                    value={siteInfo.heroSubheadline} 
                    onChange={e => setSiteInfo({...siteInfo, heroSubheadline: e.target.value})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>About Text (Footer)</Label>
                  <Textarea 
                    value={siteInfo.aboutText} 
                    onChange={e => setSiteInfo({...siteInfo, aboutText: e.target.value})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <Button onClick={handleSaveSiteInfo} className="mt-4">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Email, phone, and social links.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input 
                    value={contactInfo.email} 
                    onChange={e => setContactInfo({...contactInfo, email: e.target.value})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input 
                    value={contactInfo.phone} 
                    onChange={e => setContactInfo({...contactInfo, phone: e.target.value})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Address</Label>
                  <Input 
                    value={contactInfo.address} 
                    onChange={e => setContactInfo({...contactInfo, address: e.target.value})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                
                <h4 className="font-semibold mt-6 mb-2">Social Links</h4>
                <div className="grid gap-2">
                  <Label>Twitter/X URL</Label>
                  <Input 
                    value={contactInfo.social.twitter} 
                    onChange={e => setContactInfo({...contactInfo, social: {...contactInfo.social, twitter: e.target.value}})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>LinkedIn URL</Label>
                  <Input 
                    value={contactInfo.social.linkedin} 
                    onChange={e => setContactInfo({...contactInfo, social: {...contactInfo.social, linkedin: e.target.value}})}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>

                <Button onClick={handleSaveContactInfo} className="mt-4">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Contact Form Submissions</CardTitle>
                  <CardDescription>Inquiries from potential clients.</CardDescription>
                </div>
                <Button variant="outline" onClick={handleExportSubmissions} disabled={content.submissions.length === 0}>
                  <Download className="w-4 h-4 mr-2" /> Export JSON
                </Button>
              </CardHeader>
              <CardContent>
                {content.submissions.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    No submissions yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {content.submissions.map(sub => (
                      <div key={sub.id} className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="destructive" size="icon" onClick={() => deleteSubmission(sub.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-zinc-500">Name</p>
                            <p className="font-medium">{sub.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Email</p>
                            <p className="font-medium"><a href={`mailto:${sub.email}`} className="text-primary hover:underline">{sub.email}</a></p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Project Type</p>
                            <p className="font-medium">{sub.projectType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Budget</p>
                            <p className="font-medium">{sub.budgetRange}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500">Message</p>
                          <p className="mt-1 text-sm bg-zinc-900 p-3 rounded-md">{sub.message}</p>
                        </div>
                        <p className="text-xs text-zinc-600 mt-4">
                          Received: {new Date(sub.date).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
