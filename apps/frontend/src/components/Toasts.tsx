import { XIcon } from "lucide-react";
import useToastStore, { ToastType } from "../hooks/useToast";

export default function Toasts() {
  const { getToasts, dismiss } = useToastStore();
  const toasts = getToasts();

  const getToastClass = (variant: ToastType = "default") => {
    switch (variant) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-error";
      case "warning":
        return "alert-warning";
      case "info":
        return "alert-info";
      case "destructive":
        return "alert-error";
      case "default":
      default:
        return "";
    }
  };

  return (
    <div>
      {toasts.map((t, i) => (
        <div
          key={t.id ?? i}
          className={`z-[1000] toast toast-top toast-center alert p-2 mt-4 ${getToastClass(
            t.variant
          )}`}
        >
          <div className="flex items-center gap-4">
            <p>{t.title}</p>
            <button
              className="btn btn-ghost btn-circle btn-sm"
              onClick={() => {
                t.id ? dismiss(t.id) : null;
              }}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
