import { X, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "success" | "info" | "warning";
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  type = "info",
  isLoading = false,
}: ConfirmationModalProps) {
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <div className="bg-red-100 p-3 rounded-full"><AlertTriangle className="w-8 h-8 text-red-600" /></div>;
      case "success":
        return <div className="bg-green-100 p-3 rounded-full"><CheckCircle className="w-8 h-8 text-green-600" /></div>;
      case "warning":
        return <div className="bg-yellow-100 p-3 rounded-full"><AlertTriangle className="w-8 h-8 text-yellow-600" /></div>;
      default:
        return <div className="bg-blue-100 p-3 rounded-full"><Info className="w-8 h-8 text-blue-600" /></div>;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "danger": return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "success": return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
      case "warning": return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
      default: return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            {getIcon()}
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {title}
          </h3>

          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            {message}
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLabel}
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${getButtonColor()}`}
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Memproses...</>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
