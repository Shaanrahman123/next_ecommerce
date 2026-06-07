'use client';

import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function AuthLayout({ children, className = '' }: AuthLayoutProps) {
  return (
    <div className={`min-h-[80vh] flex items-center justify-center px-4 py-12 ${className}`}>
      <div className="max-w-md w-full space-y-8">{children}</div>
    </div>
  );
}
