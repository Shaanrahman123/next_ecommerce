'use client';

import { useRef, useEffect, useCallback } from 'react';

interface OtpInputProps {
  value: string[];
  onChange: (otp: string[]) => void;
  onComplete: (code: string) => void;
  disabled?: boolean;
  error?: string;
}

const OTP_LENGTH = 6;

export default function OtpInput({ value, onChange, onComplete, disabled, error }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, digit: string) => {
      if (digit && !/^\d$/.test(digit)) return;

      const next = [...value];
      next[index] = digit;
      onChange(next);

      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (index === OTP_LENGTH - 1 && digit) {
        const code = [...next.slice(0, OTP_LENGTH - 1), digit].join('');
        if (code.length === OTP_LENGTH) onComplete(code);
      }
    },
    [value, onChange, onComplete]
  );

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const next = [...value];
        next[index] = '';
        onChange(next);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pasted)) return;

    onChange(pasted.split(''));
    inputRefs.current[OTP_LENGTH - 1]?.focus();
    setTimeout(() => onComplete(pasted), 100);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-6 text-center">
        Enter Verification Code
      </label>
      <div className="flex gap-2 sm:gap-3 justify-center">
        {value.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-black
              bg-white border rounded-md transition-all duration-300
              focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
              ${digit ? 'border-primary bg-gray-50' : 'border-gray-300 hover:border-gray-400'}
              ${error ? 'border-red-500 bg-red-50' : ''}
              focus:border-primary focus:ring-0
            `}
          />
        ))}
      </div>
      {error && (
        <p className="mt-4 text-sm font-medium text-red-500 text-center animate-fade-in">{error}</p>
      )}
    </div>
  );
}
