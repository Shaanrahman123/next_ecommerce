'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface AuthBackLinkProps {
  href: string;
  label?: string;
}

export default function AuthBackLink({ href, label = 'Back to Login' }: AuthBackLinkProps) {
  return (
    <div className="text-center pt-4">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-heading hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        {label}
      </Link>
    </div>
  );
}
