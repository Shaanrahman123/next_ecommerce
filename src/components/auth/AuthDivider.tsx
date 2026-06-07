'use client';

interface AuthDividerProps {
  label: string;
}

export default function AuthDivider({ label }: AuthDividerProps) {
  return (
    <div className="relative flex items-center justify-center my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <span className="relative px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 bg-white">
        {label}
      </span>
    </div>
  );
}
