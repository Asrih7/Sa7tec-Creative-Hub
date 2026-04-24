import { Globe, Check } from "lucide-react";
import { useLanguage, LANGUAGES, type Lang } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Variant = "header" | "drawer" | "admin";

export function LanguageSwitcher({ variant = "header" }: { variant?: Variant }) {
  const { lang, setLang } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const triggerClass =
    variant === "header"
      ? "h-9 px-3 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-foreground gap-2"
      : variant === "admin"
        ? "h-9 px-3 rounded-md border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 gap-2"
        : "h-12 px-4 rounded-full border-border w-full justify-between";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={triggerClass} aria-label="Change language">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium uppercase">{current.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLang(l.code as Lang)}
            className="flex items-center justify-between gap-3 cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{l.nativeLabel}</span>
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
            {l.code === lang && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
