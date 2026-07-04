interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, destructive }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onCancel}>
      <div
        className="rounded-xl p-5 mx-4 max-w-sm w-full shadow-2xl border"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
        onClick={e => e.stopPropagation()}
      >
        <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--foreground)" }}>{title}</p>
        <p className="text-[11px] font-mono mb-5" style={{ color: "var(--muted-foreground)" }}>{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded text-[11px] font-mono transition-colors hover:opacity-80"
            style={{ background: "var(--secondary)", color: "var(--secondary-foreground)" }}
          >
            {cancelLabel || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded text-[11px] font-mono transition-colors hover:opacity-80"
            style={{
              background: destructive ? "var(--destructive)" : "var(--primary)",
              color: destructive ? "var(--destructive-foreground)" : "var(--primary-foreground)",
            }}
          >
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
