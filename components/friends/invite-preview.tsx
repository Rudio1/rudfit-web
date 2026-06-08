"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { acceptInvite, getInvitePreview } from "@/lib/api/friendships";
import { ApiError } from "@/lib/api/errors";
import { getProfileMe } from "@/lib/api/profile";
import { savePendingInvitePath } from "@/lib/friendships/pending-invite";
import type { InvitePreview } from "@/lib/types/friendships";
import type { UserProfile } from "@/lib/types/profile";
import { FriendAvatar } from "@/components/friends/friend-avatar";
import { Alert } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface InvitePreviewProps {
  token: string;
}

export function InvitePreview({ token }: InvitePreviewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    savePendingInvitePath(`/invite/${token}`);
  }, [token]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfileMe();
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    }

    void loadProfile();
  }, []);

  useEffect(() => {
    async function loadPreview() {
      try {
        const data = await getInvitePreview(token);
        setPreview(data);
      } catch (error) {
        if (error instanceof ApiError) {
          setErrorStatus(error.status);
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Não foi possível carregar o convite.");
        }
      } finally {
        setLoading(false);
      }
    }

    void loadPreview();
  }, [token]);

  const isSelfInvite =
    preview && profile && preview.userId === profile.userId;

  async function handleAccept() {
    if (accepting || !preview) return;

    setAccepting(true);
    try {
      const friendship = await acceptInvite(token);
      toast.success(`${friendship.name} foi adicionado como amigo.`);
      router.push(`/friends/${friendship.friendUserId}`);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409 && preview) {
          toast.info("Vocês já são amigos.");
          router.push(`/friends/${preview.userId}`);
          router.refresh();
          return;
        }
        toast.error(error.message);
      } else {
        toast.error("Não foi possível aceitar o convite.");
      }
    } finally {
      setAccepting(false);
    }
  }

  if (loading || profileLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Convite de amizade</CardTitle>
          <CardDescription>
            {errorStatus === 410
              ? "Este convite não está mais disponível."
              : "Não foi possível abrir este convite."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert
            variant={errorStatus === 410 ? "warning" : "destructive"}
            title={
              errorStatus === 410
                ? "Link desativado"
                : errorStatus === 404
                  ? "Link inválido"
                  : "Erro no convite"
            }
          >
            {errorMessage}
          </Alert>
          <Link
            href="/friends"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Ir para amigos
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!preview) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Users className="size-5 text-primary" aria-hidden />
          Convite de amizade
        </CardTitle>
        <CardDescription>
          {isSelfInvite
            ? "Este é o seu próprio link de convite."
            : "Você foi convidado para acompanhar o progresso diário juntos."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <FriendAvatar
            name={preview.name}
            profileImageUrl={preview.profileImageUrl}
            size="lg"
          />
          <div>
            <p className="text-lg font-semibold">{preview.name}</p>
            {preview.username ? (
              <p className="text-sm text-muted-foreground">
                @{preview.username}
              </p>
            ) : null}
          </div>
        </div>

        {isSelfInvite ? (
          <Alert variant="info" title="Link próprio">
            Compartilhe este link com outras pessoas para adicioná-las como
            amigos.
          </Alert>
        ) : (
          <Button
            type="button"
            size="lg"
            className="w-full shadow-sm"
            onClick={() => void handleAccept()}
            disabled={accepting}
          >
            <UserPlus className="size-4" />
            {accepting ? "Adicionando..." : "Adicionar como amigo"}
          </Button>
        )}

        <Link
          href="/friends"
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          Ver meus amigos
        </Link>
      </CardContent>
    </Card>
  );
}
