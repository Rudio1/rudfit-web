"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { recalculateDailyGoals } from "@/lib/api/profile";
import { ApiError } from "@/lib/api/errors";
import { useProfile } from "@/lib/hooks/use-profile";
import { profileToOnboardingRequest } from "@/lib/profile/map-profile-to-request";
import type { UserProfile } from "@/lib/types/profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileWeightEditorProps {
  profile: UserProfile;
}

function validateWeight(value: string): string | null {
  const weight = Number(value.replace(",", "."));
  if (!weight || weight < 20 || weight > 400) {
    return "Informe um peso válido entre 20 e 400 kg.";
  }
  return null;
}

export function ProfileWeightEditor({ profile }: ProfileWeightEditorProps) {
  const { refresh } = useProfile();
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState(String(profile.weight));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setWeight(String(profile.weight));
      setError(null);
    }
  }

  async function handleSave() {
    const validationError = validateWeight(weight);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newWeight = Math.round(Number(weight.replace(",", ".")));
    if (newWeight === profile.weight) {
      setOpen(false);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await recalculateDailyGoals(
        profileToOnboardingRequest(profile, { weight: newWeight }),
      );
      await refresh();
      toast.success("Peso atualizado e metas recalculadas.");
      setOpen(false);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Não foi possível atualizar o peso.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-border/60 bg-card-elevated/50 p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Peso atual
      </dt>
      <dd className="mt-1 flex items-center justify-between gap-2">
        <span className="font-medium">{profile.weight} kg</span>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger
            render={
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2">
                <Pencil className="size-3.5" />
                Editar
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atualizar peso</DialogTitle>
              <DialogDescription>
                Seu peso atual será salvo e suas metas diárias serão
                recalculadas automaticamente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="profile-weight">Peso (kg)</Label>
              <Input
                id="profile-weight"
                inputMode="decimal"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setError(null);
                }}
              />
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" disabled={saving} onClick={handleSave}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </dd>
    </div>
  );
}
