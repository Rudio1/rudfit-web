import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMacro, type MacroTotals } from "@/lib/meals/macros";

interface MacroSummaryCardProps {
  totals: MacroTotals;
  title?: string;
}

export function MacroSummaryCard({
  totals,
  title = "Micronutrientes estimados",
}: MacroSummaryCardProps) {
  const items = [
    { label: "Calorias", value: formatMacro(totals.calories, " kcal") },
    { label: "Proteína", value: formatMacro(totals.protein, " g") },
    { label: "Carboidratos", value: formatMacro(totals.carbs, " g") },
    { label: "Gorduras", value: formatMacro(totals.fat, " g") },
  ];

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg bg-card-elevated p-3">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
