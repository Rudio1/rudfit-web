"use client";

import { useState } from "react";
import { toast } from "sonner";
import { inviteUser } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/errors";
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

export function InviteUserForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const result = await inviteUser({ email: email.trim() });
      toast.success(`Convite enviado para ${result.email}.`);
      setEmail("");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível enviar o convite.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Convidar usuário</CardTitle>
        <CardDescription>
          Informe o e-mail da pessoa que terá acesso. Ela receberá um link para
          criar a conta e definir a senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="invite-email">E-mail</Label>
            <Input
              id="invite-email"
              type="email"
              autoComplete="email"
              required
              className="h-10"
              placeholder="paciente@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <ActionBar variant="footer" className="border-t-0 pt-2">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="shadow-sm"
            >
              {loading ? "Enviando..." : "Enviar convite"}
            </Button>
          </ActionBar>
        </form>
      </CardContent>
    </Card>
  );
}
