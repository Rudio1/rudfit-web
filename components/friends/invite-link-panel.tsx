"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Link2, RefreshCw, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  getInviteLink,
  patchInviteLink,
  regenerateInviteLink,
} from "@/lib/api/friendships";
import { ApiError } from "@/lib/api/errors";
import type { FriendInviteLink } from "@/lib/types/friendships";
import { messageService } from "@/lib/services/message-service";
import { PageScaffold } from "@/components/layout/page-scaffold";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function buildInviteUrl(token: string): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/invite/${token}`;
}

export function InviteLinkPanel() {
  const [inviteLink, setInviteLink] = useState<FriendInviteLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const displayUrl = inviteLink ? buildInviteUrl(inviteLink.token) : null;

  async function loadInviteLink() {
    try {
      const data = await getInviteLink();
      setInviteLink(data);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível carregar seu link de convite.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadInviteLink();
  }, []);

  async function handleCopy() {
    if (!displayUrl) return;

    try {
      await navigator.clipboard.writeText(displayUrl);
      toast.success("Link copiado!");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  async function handleShare() {
    if (!displayUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Convite RudFit AI",
          text: "Vamos acompanhar nossas metas juntos no RudFit AI!",
          url: displayUrl,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await handleCopy();
  }

  async function handleToggleActive() {
    if (!inviteLink || updating) return;

    const nextActive = !inviteLink.isActive;
    const confirmed = await messageService.confirm({
      title: nextActive ? "Ativar link de convite?" : "Desativar link de convite?",
      text: nextActive
        ? "Novos usuários poderão aceitar seu convite novamente."
        : "Links compartilhados deixarão de aceitar novos amigos.",
      confirmLabel: nextActive ? "Ativar" : "Desativar",
      variant: nextActive ? "default" : "warning",
    });

    if (!confirmed) return;

    setUpdating(true);
    try {
      const data = await patchInviteLink({ isActive: nextActive });
      setInviteLink(data);
      toast.success(
        nextActive ? "Link de convite ativado." : "Link de convite desativado.",
      );
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível atualizar o link.";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  }

  async function handleRegenerate() {
    if (updating) return;

    const confirmed = await messageService.confirm({
      title: "Gerar novo link?",
      text: "O link atual deixará de funcionar. Quem já recebeu o link antigo não poderá mais usá-lo.",
      confirmLabel: "Gerar novo",
      variant: "warning",
    });

    if (!confirmed) return;

    setUpdating(true);
    try {
      const data = await regenerateInviteLink();
      setInviteLink(data);
      toast.success("Novo link gerado com sucesso.");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível gerar um novo link.";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <PageScaffold
        title="Convidar amigo"
        subtitle="Carregando seu link..."
        breadcrumbs={[
          { label: "Amigos", href: "/friends" },
          { label: "Convidar" },
        ]}
      >
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold
      title="Convidar amigo"
      subtitle="Compartilhe seu link permanente para adicionar amigos"
      breadcrumbs={[
        { label: "Amigos", href: "/friends" },
        { label: "Convidar" },
      ]}
    >
      <Card className="shadow-xs">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="flex items-center gap-2 text-section-title">
            <Link2 className="size-5 text-primary" aria-hidden />
            Seu link de convite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          {!inviteLink?.isActive ? (
            <Alert
              variant="warning"
              title="Link desativado"
            >
              Ative o link para que novos convites possam ser aceitos.
            </Alert>
          ) : null}

          <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
            <p className="break-all text-sm text-foreground">
              {displayUrl ?? "—"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => void handleCopy()}
              disabled={!displayUrl}
            >
              <Copy className="size-4" />
              Copiar link
            </Button>
            <Button
              type="button"
              size="lg"
              className="shadow-sm"
              onClick={() => void handleShare()}
              disabled={!displayUrl}
            >
              <Share2 className="size-4" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xs">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-section-title">Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Status do link</p>
              <p className="text-sm text-muted-foreground">
                {inviteLink?.isActive
                  ? "Ativo — novos convites podem ser aceitos"
                  : "Desativado — novos convites bloqueados"}
              </p>
            </div>
            <Button
              type="button"
              variant={inviteLink?.isActive ? "outline" : "default"}
              onClick={() => void handleToggleActive()}
              disabled={updating}
            >
              {inviteLink?.isActive ? "Desativar" : "Ativar"}
            </Button>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Gerar novo link</p>
              <p className="text-sm text-muted-foreground">
                Invalida o link atual e cria um novo token.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleRegenerate()}
              disabled={updating}
            >
              <RefreshCw className="size-4" />
              Gerar novo link
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/friends" className="action-link text-primary hover:underline">
          Voltar para amigos
        </Link>
      </p>
    </PageScaffold>
  );
}
