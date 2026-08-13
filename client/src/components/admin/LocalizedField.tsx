import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LANGUAGES, toLocalized, type LocalizedString } from "@/lib/i18n";

type Props = {
  label: string;
  value: LocalizedString | undefined;
  onChange: (next: { en: string; fr: string; ar: string }) => void;
  multiline?: boolean;
  placeholder?: string;
};

export function LocalizedField({ label, value, onChange, multiline = false, placeholder }: Props) {
  const v = toLocalized(value);

  const update = (lang: "en" | "fr" | "ar", next: string) => {
    onChange({ ...v, [lang]: next });
  };

  const FieldComp = multiline ? Textarea : Input;

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="bg-zinc-950 border border-zinc-800">
          {LANGUAGES.map((l) => (
            <TabsTrigger key={l.code} value={l.code} className="text-xs uppercase">
              {l.code}
            </TabsTrigger>
          ))}
        </TabsList>
        {LANGUAGES.map((l) => (
          <TabsContent key={l.code} value={l.code} className="mt-2">
            <FieldComp
              value={v[l.code]}
              onChange={(e: any) => update(l.code, e.target.value)}
              placeholder={placeholder}
              dir={l.dir}
              className="bg-zinc-950 border-zinc-800"
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
