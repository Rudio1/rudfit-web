"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { setSession } from "@/lib/auth/session";
import { savePendingInvitePath } from "@/lib/friendships/pending-invite";
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

function getSafeNextPath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const response = await login({ email: email.trim(), password });
      setSession(response);
      toast.success("Login realizado com sucesso.");

      if (response.isFirstAccess) {
        if (nextPath) savePendingInvitePath(nextPath);
        router.push("/onboarding");
      } else {
        router.push(nextPath ?? "/");
      }

      router.refresh();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Não foi possível entrar.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>Acesse sua conta RudFit AI</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="h-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <ActionBar variant="footer" className="border-t-0 pt-2">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="shadow-sm"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </ActionBar>
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link
              href={nextPath ? `/register?next=${encodeURIComponent(nextPath)}` : "/register"}
              className="action-link font-medium text-primary hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
