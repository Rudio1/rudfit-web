"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import {
  analyzePhoto,
  estimateDetectedFoodsNutrition,
  saveFromDetectedFoods,
} from "@/lib/api/meal-logs";
import { ApiError } from "@/lib/api/errors";
import { sumFoodMacros } from "@/lib/meals/macros";
import { getMealTypeLabel } from "@/lib/meals/constants";
import type { DetectedFood } from "@/lib/types/meals";
import type { MealType } from "@/lib/types/meals";
import { MealConfirmPanel } from "@/components/meals/meal-confirm-panel";
import { MealPhotoScanOverlay } from "@/components/scanner/meal-photo-scan-overlay";
import { MealTypeImage } from "@/components/meals/meal-type-image";
import { MealTypePicker } from "@/components/meals/meal-type-picker";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { ActionBar } from "@/components/ui/action-bar";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Step = "type" | "photo" | "analyzing" | "confirm";

export function AddMealFlow() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("type");
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [foods, setFoods] = useState<DetectedFood[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const macroTotals = useMemo(() => sumFoodMacros(foods), [foods]);

  function handleSelectMealType(value: MealType) {
    setMealType(value);
    setStep("photo");
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !mealType) return;

    if (file.size > 6 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 6 MB.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setStep("analyzing");
    setStatusMessage("Analisando foto com IA...");

    try {
      const analyzed = await analyzePhoto(file);
      if (!analyzed.foods.length) {
        throw new Error(
          "Não conseguimos identificar alimentos nessa foto. Tente outra com melhor iluminação.",
        );
      }

      setStatusMessage("Calculando micronutrientes...");
      const estimated = await estimateDetectedFoodsNutrition(analyzed.foods);
      if (!estimated.foods.length) {
        throw new Error("Não foi possível estimar a nutrição. Tente novamente.");
      }

      setFoods(estimated.foods);
      setStep("confirm");
      setStatusMessage(null);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Não foi possível analisar a foto.";
      toast.error(message);
      setStep("photo");
      setStatusMessage(null);
    } finally {
      event.target.value = "";
    }
  }

  function updateFood(index: number, food: DetectedFood) {
    setFoods((current) => current.map((item, i) => (i === index ? food : item)));
  }

  function removeFood(index: number) {
    setFoods((current) => current.filter((_, i) => i !== index));
  }

  function addFood() {
    setFoods((current) => [
      ...current,
      { name: "", estimatedQuantityGrams: 100 },
    ]);
  }

  async function handleSave() {
    if (!mealType || saving) return;

    if (!foods.length) {
      toast.error("Adicione pelo menos um item.");
      return;
    }

    if (foods.some((food) => !food.name.trim())) {
      toast.error("Preencha o nome de todos os itens.");
      return;
    }

    setSaving(true);
    try {
      const estimated = await estimateDetectedFoodsNutrition(foods);
      const missingFoodId = estimated.foods.find(
        (food) => !food.foodId?.trim(),
      );
      if (missingFoodId) {
        toast.error(
          "Não encontramos um alimento cadastrado para um dos itens. Ajuste o nome ou a quantidade.",
        );
        return;
      }

      await saveFromDetectedFoods({
        mealType,
        consumedAtUtc: new Date().toISOString(),
        foods: estimated.foods,
      });

      toast.success("Refeição registrada com sucesso.");
      router.push("/meals");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível salvar a refeição.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageScaffold
      title="Adicionar refeição"
      subtitle={
        step === "type"
          ? "Escolha o tipo de refeição."
          : step === "photo" && mealType
            ? `Envie uma foto do seu ${getMealTypeLabel(mealType).toLowerCase()}.`
            : step === "analyzing"
              ? (statusMessage ?? "Processando...")
              : step === "confirm"
                ? "Confira os alimentos identificados e edite nome ou quantidade antes de salvar."
                : undefined
      }
      breadcrumbs={[
        { label: "Refeições", href: "/meals" },
        { label: "Adicionar" },
      ]}
      action={
        <ActionBar variant="header">
          <Link
            href="/meals"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Cancelar
          </Link>
        </ActionBar>
      }
    >

      {step === "type" ? (
        <div className="space-y-4">
          <MealTypePicker value={mealType} onChange={handleSelectMealType} />
        </div>
      ) : null}

      {step === "photo" ? (
        <Card className="shadow-xs">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Prévia da refeição"
                className="max-h-64 w-full rounded-xl object-cover"
              />
            ) : mealType ? (
              <MealTypeImage
                mealType={mealType}
                alt={getMealTypeLabel(mealType)}
                className="h-40 w-full max-w-sm rounded-xl"
                sizes="(max-width: 640px) 100vw, 384px"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full bg-card-elevated">
                <Camera className="size-9 text-primary" />
              </div>
            )}
            <div>
              <p className="font-medium">Tire ou envie uma foto do prato</p>
              <p className="mt-1 text-sm text-muted-foreground">
                JPEG, PNG ou WebP · até 6 MB
              </p>
            </div>
            <ActionBar variant="single">
              <Button
                type="button"
                size="lg"
                className="shadow-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Escolher foto
              </Button>
            </ActionBar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </CardContent>
        </Card>
      ) : null}

      {step === "analyzing" && previewUrl ? (
        <MealPhotoScanOverlay
          imageUrl={previewUrl}
          message={statusMessage ?? "Analisando foto…"}
        />
      ) : null}

      {step === "confirm" && mealType ? (
        <MealConfirmPanel
          mealType={mealType}
          previewUrl={previewUrl}
          foods={foods}
          macroTotals={macroTotals}
          saving={saving}
          onUpdateFood={updateFood}
          onRemoveFood={removeFood}
          onAddFood={addFood}
          onSave={handleSave}
        />
      ) : null}
    </PageScaffold>
  );
}
