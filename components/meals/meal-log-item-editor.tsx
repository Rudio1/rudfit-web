import { PencilLine, Trash2 } from "lucide-react";
import type { EditableMealItem } from "@/lib/meals/meal-log-utils";
import { messageService } from "@/lib/services/message-service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MealLogItemEditorProps {
  item: EditableMealItem;
  index: number;
  onChange: (index: number, item: EditableMealItem) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function MealLogItemEditor({
  item,
  index,
  onChange,
  onRemove,
  canRemove,
}: MealLogItemEditorProps) {
  async function handleRemove() {
    const confirmed = await messageService.confirmRemove({
      itemLabel: item.name.trim() || "este item",
    });
    if (!confirmed) return;
    onRemove(index);
  }

  return (
    <article className="overflow-hidden rounded-xl border border-primary/20 bg-card shadow-xs ring-1 ring-primary/5">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
            {index + 1}
          </span>
          <span className="text-sm font-medium">Item da refeição</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
          <PencilLine className="size-3" aria-hidden />
          Editável
        </span>
      </header>

      <div className="space-y-4 p-4">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
          <div className="space-y-2">
            <Label htmlFor={`meal-item-name-${index}`}>Nome do alimento</Label>
            <Input
              id={`meal-item-name-${index}`}
              className="h-10 border-primary/20 bg-background focus-visible:border-primary focus-visible:ring-primary/20"
              value={item.name}
              onChange={(e) =>
                onChange(index, { ...item, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`meal-item-grams-${index}`}>Quantidade</Label>
            <div className="relative">
              <Input
                id={`meal-item-grams-${index}`}
                className="h-10 border-primary/20 bg-background pr-10 focus-visible:border-primary focus-visible:ring-primary/20"
                inputMode="numeric"
                value={item.estimatedQuantityGrams || ""}
                onChange={(e) =>
                  onChange(index, {
                    ...item,
                    estimatedQuantityGrams: Number(e.target.value) || 0,
                  })
                }
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-muted-foreground">
                g
              </span>
            </div>
          </div>
        </div>
      </div>

      {canRemove ? (
        <footer className="border-t border-border bg-muted/20 px-4 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("h-8 text-muted-foreground hover:text-destructive")}
            onClick={handleRemove}
          >
            <Trash2 className="size-3.5" />
            Remover item
          </Button>
        </footer>
      ) : null}
    </article>
  );
}
