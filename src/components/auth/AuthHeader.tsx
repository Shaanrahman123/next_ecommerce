'use client';

interface AuthHeaderProps {
  badge: string;
  title: string;
  description: string;
  subtitle?: string;
}

export default function AuthHeader({ badge, title, description, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-6 h-0.5 bg-primary rounded-full" />
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{badge}</span>
      </div>
      <h1 className="text-3xl font-bold text-heading tracking-tight">{title}</h1>
      <p className="text-sm font-medium text-gray-500">{description}</p>
      {subtitle && <p className="text-base font-semibold text-heading">{subtitle}</p>}
    </div>
  );
}
