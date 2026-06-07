'use client';

interface AuthTipProps {
  label: string;
  text: string;
}

export default function AuthTip({ label, text }: AuthTipProps) {
  return (
    <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-xs font-medium text-gray-600 text-center leading-relaxed">
        <span className="text-heading font-semibold">{label}:</span> {text}
      </p>
    </div>
  );
}
