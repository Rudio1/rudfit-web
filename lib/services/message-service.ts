import type { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

export type MessageVariant = "default" | "destructive" | "warning";

export interface ConfirmMessageOptions {
  title: string;
  text?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: MessageVariant;
  icon?: SweetAlertIcon | false;
  reverseButtons?: boolean;
}

export interface ConfirmRemoveOptions
  extends Partial<Omit<ConfirmMessageOptions, "variant">> {
  itemLabel?: string;
}

const DEFAULT_CONFIRM_LABEL = "Confirmar";
const DEFAULT_CANCEL_LABEL = "Cancelar";

const SWAL_CUSTOM_CLASS = {
  container: "rudfit-swal-container",
  popup: "rudfit-swal-popup",
  title: "rudfit-swal-title",
  htmlContainer: "rudfit-swal-text",
  actions: "rudfit-swal-actions",
  cancelButton: "rudfit-swal-btn rudfit-swal-btn-cancel",
  icon: "rudfit-swal-icon",
  backdrop: "rudfit-swal-backdrop",
} as const;

function getConfirmButtonClass(variant: MessageVariant): string {
  switch (variant) {
    case "destructive":
      return "rudfit-swal-btn rudfit-swal-btn-destructive";
    case "warning":
      return "rudfit-swal-btn rudfit-swal-btn-warning";
    default:
      return "rudfit-swal-btn rudfit-swal-btn-primary";
  }
}

type SwalModule = typeof import("sweetalert2");
type SwalInstance = SwalModule["default"];

class MessageService {
  private swalInstance: SwalInstance | null = null;

  private async getSwal(): Promise<SwalInstance | null> {
    if (typeof window === "undefined") {
      return null;
    }

    if (!this.swalInstance) {
      const { default: Swal } = await import("sweetalert2");
      this.swalInstance = Swal.mixin({
        buttonsStyling: false,
        reverseButtons: false,
        focusCancel: true,
        heightAuto: false,
        customClass: SWAL_CUSTOM_CLASS,
      });
    }

    return this.swalInstance;
  }

  private async fire(options: SweetAlertOptions): Promise<boolean> {
    const swal = await this.getSwal();
    if (!swal) {
      return false;
    }

    const result = await swal.fire(options);
    return result.isConfirmed ?? false;
  }

  async confirm(options: ConfirmMessageOptions): Promise<boolean> {
    const {
      title,
      text,
      confirmLabel = DEFAULT_CONFIRM_LABEL,
      cancelLabel = DEFAULT_CANCEL_LABEL,
      variant = "default",
      icon = variant === "destructive" ? "warning" : "question",
      reverseButtons = false,
    } = options;

    return this.fire({
      title,
      text,
      icon: icon === false ? undefined : icon,
      showCancelButton: true,
      confirmButtonText: confirmLabel,
      cancelButtonText: cancelLabel,
      reverseButtons,
      customClass: {
        ...SWAL_CUSTOM_CLASS,
        confirmButton: getConfirmButtonClass(variant),
      },
    });
  }

  async confirmRemove(options: ConfirmRemoveOptions = {}): Promise<boolean> {
    const {
      itemLabel = "este item",
      title,
      text,
      confirmLabel = "Remover",
      cancelLabel = "Cancelar",
      ...rest
    } = options;

    return this.confirm({
      title: title ?? "Remover item?",
      text: text ?? `Deseja remover ${itemLabel}?`,
      confirmLabel,
      cancelLabel,
      variant: "destructive",
      icon: "warning",
      ...rest,
    });
  }

  async confirmLogout(): Promise<boolean> {
    return this.confirm({
      title: "Sair da conta?",
      text: "Será necessário entrar novamente.",
      confirmLabel: "Sair",
      cancelLabel: "Continuar",
      variant: "default",
      icon: "question",
    });
  }

  async alert(
    title: string,
    text?: string,
    icon: SweetAlertIcon = "info",
  ): Promise<void> {
    await this.fire({
      title,
      text,
      icon,
      confirmButtonText: "Entendi",
      customClass: {
        ...SWAL_CUSTOM_CLASS,
        confirmButton: getConfirmButtonClass("default"),
      },
    });
  }

  async success(title: string, text?: string): Promise<void> {
    await this.alert(title, text, "success");
  }

  async error(title: string, text?: string): Promise<void> {
    await this.alert(title, text, "error");
  }

  async warning(title: string, text?: string): Promise<void> {
    await this.alert(title, text, "warning");
  }
}

export const messageService = new MessageService();
