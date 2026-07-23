import { useEffect } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  autoClose?: number;
}

const typeStyles = {
  success: "bg-success-50 border-success-500 text-success-700",
  error: "bg-error-50 border-error-500 text-error-700",
  warning: "bg-warning-50 border-warning-500 text-warning-700",
  info: "bg-blue-light-50 border-blue-light-500 text-blue-light-700",
};

const typeIcons = {
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function Popup({ isOpen, onClose, message, type = "error", autoClose = 4000 }: PopupProps) {
  useEffect(() => {
    if (isOpen && autoClose > 0) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-xl border shadow-lg max-w-md animate-slideDown ${typeStyles[type]}`}
      >
        <span className="flex-shrink-0 mt-0.5">{typeIcons[type]}</span>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
