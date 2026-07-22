import { InviteUserForm } from "@/components/admin/invite-user-form";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Cadastro de usuários
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Convide pacientes por e-mail para liberar o acesso ao sistema.
        </p>
      </div>
      <InviteUserForm />
    </div>
  );
}
