'use client';

import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Button from '@/components/ui/Button';

export type AlertModalVariant = 'info' | 'warning' | 'success';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: AlertModalVariant;
  onClose: () => void;
}

const variantConfig: Record<
  AlertModalVariant,
  { icon: typeof Info; iconBg: string; iconColor: string }
> = {
  info: {
    icon: Info,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
};

export default function AlertModal({
  isOpen,
  title,
  message,
  confirmLabel = 'OK',
  variant = 'info',
  onClose,
}: AlertModalProps) {
  if (!isOpen) return null;

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-modal-title"
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${config.iconBg}`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 id="alert-modal-title" className="text-lg font-bold text-heading">
                {title}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="mt-8">
            <Button type="button" fullWidth onClick={onClose} className="bg-primary text-on-primary hover:bg-primary-hover">
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
