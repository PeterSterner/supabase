import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export default function Modal({
  title,
  children,
  isOpen,
  onClose,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 text-gray-800 shadow-lg backdrop:bg-black/50"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-2xl">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-2 py-1 text-gray-500 hover:text-gray-800"
          aria-label="Luk"
        >
          ✕
        </button>
      </div>
      {children}
    </dialog>
  );
}
