
import React, { useEffect, useRef } from 'react';
import { X as CancelIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'lg' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      setTimeout(() => modalRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
  };

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-text-primary/60 backdrop-blur-sm animate-fade-in-fast" 
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
        onClick={onClose}
    >
      <div 
        ref={modalRef} 
        className={`bg-white rounded-xl shadow-xl w-full m-4 flex flex-col ${sizeClasses[size]}`} 
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 id="modal-title" className="text-lg font-bold text-brand-text-primary">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-brand-text-secondary hover:bg-brand-background-medium">
            <CancelIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex-grow overflow-y-auto max-h-[75vh]">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t bg-brand-background-soft rounded-b-xl flex justify-end gap-3 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fade-in-fast {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in-fast {
            animation: fade-in-fast 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
