'use client';

import { RefreshCw } from 'lucide-react';

interface ResendOtpButtonProps {
  canResend: boolean;
  timer: number;
  isResending: boolean;
  onResend: () => void;
  message?: string;
  error?: string;
}

export default function ResendOtpButton({
  canResend,
  timer,
  isResending,
  onResend,
  message,
  error,
}: ResendOtpButtonProps) {
  return (
    <div className="text-center space-y-4">
      <p className="text-sm font-medium text-gray-600">Didn&apos;t receive the code?</p>

      {message && (
        <p className="text-sm font-medium text-green-600 animate-fade-in">{message}</p>
      )}
      {error && (
        <p className="text-sm font-medium text-red-500 animate-fade-in">{error}</p>
      )}

      <button
        type="button"
        onClick={onResend}
        disabled={!canResend || isResending}
        className={`
          inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300
          ${canResend && !isResending
            ? 'text-heading hover:underline cursor-pointer'
            : 'text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <RefreshCw
          className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : canResend ? 'hover:rotate-180 transition-transform duration-500' : ''}`}
        />
        {isResending ? 'Sending...' : canResend ? 'Resend Code' : `Resend in ${timer}s`}
      </button>
    </div>
  );
}
