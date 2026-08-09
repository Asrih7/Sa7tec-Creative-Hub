import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

interface Props {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export function CollectionToolbar({ index, total, onMoveUp, onMoveDown, onDelete }: Props) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={index === 0}
        onClick={onMoveUp}
        title={t("admin.move_up")}
        aria-label={t("admin.move_up")}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={index === total - 1}
        onClick={onMoveDown}
        title={t("admin.move_down")}
        aria-label={t("admin.move_down")}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:bg-destructive/10"
        onClick={() => {
          if (confirm(t("admin.confirm_delete"))) onDelete();
        }}
        title={t("admin.delete")}
        aria-label={t("admin.delete")}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function reorder<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
