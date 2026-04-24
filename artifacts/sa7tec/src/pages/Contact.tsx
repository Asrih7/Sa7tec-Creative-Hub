import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useContent } from "@/lib/content-store";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle2, MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { content, addSubmission } = useContent();
  const { toast } = useToast();
  const { t, tr } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, t("contact.err_name")),
    email: z.string().email(t("contact.err_email")),
    projectType: z.string().min(1, t("contact.err_project")),
    budgetRange: z.string().min(1, t("contact.err_budget")),
    message: z.string().min(10, t("contact.err_message")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      projectType: "",
      budgetRange: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addSubmission(values);
    setIsSubmitted(true);
    toast({
      title: t("contact.toast_sent"),
      description: t("contact.toast_sent_desc"),
    });
  }

  return (
    <PublicLayout>
      <div className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold mb-6 text-foreground"
            >
              {t("contact.title_a")} <span className="text-gradient">{t("contact.title_b")}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              {t("contact.subtitle")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="lg:col-span-1 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-8 rounded-3xl"
              >
                <h3 className="text-2xl font-display font-semibold mb-6">{t("contact.info")}</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t("contact.email_us")}</p>
                      <a href={`mailto:${content.contactInfo.email}`} className="text-lg font-medium hover:text-primary transition-colors">
                        {content.contactInfo.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t("contact.call_us")}</p>
                      <a href={`tel:${content.contactInfo.phone}`} dir="ltr" className="text-lg font-medium hover:text-secondary transition-colors">
                        {content.contactInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-lime-500/10 flex items-center justify-center text-lime-500 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t("contact.visit_us")}</p>
                      <p className="text-lg font-medium">
                        {tr(content.contactInfo.address)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden"
            >
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 glow-cyan">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-4">{t("contact.success_title")}</h3>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md">
                    {t("contact.success_desc")}
                  </p>
                  <Button 
                    onClick={() => {
                      setIsSubmitted(false);
                      form.reset();
                    }}
                    variant="outline"
                    className="rounded-full px-8 border-primary/20 hover:bg-primary/10"
                  >
                    {t("contact.send_another")}
                  </Button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">{t("contact.full_name")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("contact.placeholder_name")} className="bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">{t("contact.email")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("contact.placeholder_email")} type="email" dir="ltr" className="bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">{t("contact.project_type")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20">
                                  <SelectValue placeholder={t("contact.placeholder_select_service")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {content.services.map(s => {
                                  const label = tr(s.title);
                                  return <SelectItem key={s.id} value={label}>{label}</SelectItem>;
                                })}
                                <SelectItem value="Other">{t("contact.other")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budgetRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">{t("contact.budget")}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20">
                                  <SelectValue placeholder={t("contact.placeholder_select_range")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="<10k">Under $10,000</SelectItem>
                                <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                                <SelectItem value="50k+">$50,000+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80">{t("contact.message")}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={t("contact.placeholder_message")} 
                              className="min-h-[150px] bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full sm:w-auto px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full glow-cyan mt-4">
                      <MessageSquare className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("contact.send")}
                    </Button>
                  </form>
                </Form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
