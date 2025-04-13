"use client";

type ConfirmModalProps = {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  title,
  message,
  confirmText,
  cancelText,
  confirmButtonClass = "btn-primary",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn ${confirmButtonClass}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onCancel}></div>
    </div>
  );
}
