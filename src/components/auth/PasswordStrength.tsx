'use client';

import { CheckCircle2, X } from 'lucide-react';
import { STRONG_PASSWORD_CRITERIA, getPasswordStrength } from '@/utils/validation';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  const strengthColor =
    strength.label === 'Weak' ? 'bg-red-500' : strength.label === 'Medium' ? 'bg-yellow-500' : 'bg-primary';

  const labelColor =
    strength.label === 'Weak' ? 'text-red-500' : strength.label === 'Medium' ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="space-y-4 pt-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">Strength:</span>
        <span className={`text-xs font-semibold ${labelColor}`}>{strength.label}</span>
      </div>
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${strengthColor} transition-all duration-500 ease-out`}
          style={{ width: strength.width }}
        />
      </div>
      <div className="grid grid-cols-1 gap-2 pt-2">
        {STRONG_PASSWORD_CRITERIA.map((criterion) => {
          const passed = criterion.test(password);
          return (
            <div
              key={criterion.label}
              className={`flex items-center gap-2 text-xs font-medium transition-all duration-300 ${
                passed ? 'text-heading' : 'text-gray-400'
              }`}
            >
              {passed ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
              <span>{criterion.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
