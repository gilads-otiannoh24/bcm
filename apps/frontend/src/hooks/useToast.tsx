// stores/toastStore.ts
import { create } from "zustand";

export type ToastType =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "destructive";

export interface ToastOptions {
  id?: number;
  title: string;
  description?: string;
  duration?: number;
  variant?: ToastType;
  autoDismiss: boolean;
}

type ToastState = {
  toasts: ToastOptions[];
  toast: {
    success: (title: string, description?: string) => number;
    error: (title: string, description?: string) => number;
    warning: (title: string, description?: string) => number;
    info: (title: string, description?: string) => number;
    destructive: (title: string, description?: string) => number;
  };
  dismiss: (id: number) => void;
  getToasts: () => ToastOptions[];
};

const defaults: Partial<ToastOptions> = {
  autoDismiss: true,
  duration: 4000,
  variant: "default",
};

const useToastStore = create<ToastState>((set, get) => {
  const saveToast = (options: Partial<ToastOptions>): number => {
    const id = Date.now();
    const newToast: ToastOptions = {
      ...defaults,
      ...options,
      id,
    } as ToastOptions;

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (newToast.autoDismiss) {
      setTimeout(() => {
        get().dismiss(id);
      }, newToast.duration);
    }

    return id;
  };

  return {
    toasts: [],
    toast: {
      success: (title, description) =>
        saveToast({ title, description, variant: "success" }),
      error: (title, description) =>
        saveToast({ title, description, variant: "error" }),
      warning: (title, description) =>
        saveToast({ title, description, variant: "warning" }),
      info: (title, description) =>
        saveToast({ title, description, variant: "info" }),
      destructive: (title, description) =>
        saveToast({ title, description, variant: "destructive" }),
    },
    dismiss: (id) => {
      const filtered = get().toasts.filter((t) => t.id !== id);
      set({ toasts: filtered });
    },
    getToasts: () => get().toasts,
  };
});

export default useToastStore;
