import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  showClose?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = "lg",
  showClose = true,
}) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white rounded-3xl shadow-2xl border border-brand-100 overflow-hidden ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] flex flex-col`}
      >
        {(title || showClose) && (
          <div className="p-6 border-b border-brand-100 flex items-center justify-between">
            {title && (
              <h2 className="font-serif text-2xl text-brand-900">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-brand-50 rounded-full text-brand-400 hover:text-brand-900 transition-colors ml-auto"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
