"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  completeInviteRegistration,
  getInvitePreview,
} from "@/lib/api/admin";
import { ApiError } from "@/lib/api/errors";
import { setSession } from "@/lib/auth/session";
import type { InvitePreview } from "@/lib/types/admin";
import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CompleteInviteFormProps {
  token: string;
}

export function CompleteInviteForm({ token }: CompleteInviteFormProps) {
  const router = useRouter();
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingPreview(true);
      try {
        const result = await getInvitePreview(token);
        if (!cancelled) setPreview(result);
      } catch (error) {
        if (!cancelled) {
          setPreview({
            email: "",
            isValid: false,
            message:
              error instanceof ApiError
                ? error.message
                : "Não foi possível carregar o convite.",
          });
        }
      } finally {
        if (!cancelled) setLoadingPreview(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting || !preview?.isValid) return;

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await completeInviteRegistration(token, {
        fullName: fullName.trim(),
        password,
      });
      setSession({
        ...response,
        isAdmin: Boolean(response.isAdmin),
      });
      toast.success("Conta criada com sucesso.");
      router.push("/onboarding");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível criar a conta.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingPreview) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!preview?.isValid) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Convite inválido</CardTitle>
          <CardDescription>
            {preview?.message ?? "Este link de convite não está disponível."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Ir para o login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Criar conta</CardTitle>
        <CardDescription>
          Convite para <span className="font-medium text-foreground">{preview.email}</span>.
          Informe seu nome e defina uma senha para acessar o RudFit AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              required
              maxLength={120}
              className="h-10"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="h-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <ActionBar variant="footer" className="border-t-0 pt-2">
            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="shadow-sm"
            >
              {submitting ? "Criando..." : "Criar conta"}
            </Button>
          </ActionBar>
        </form>
      </CardContent>
    </Card>
  );
}
