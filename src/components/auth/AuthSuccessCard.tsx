'use client';

import { CheckCircle2 } from 'lucide-react';

interface AuthSuccessCardProps {
  title: string;
  description: string;
  highlight?: string;
}

export default function AuthSuccessCard({ title, description, highlight }: AuthSuccessCardProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-300 rounded-lg p-8 text-center animate-scale-in">
          <div className="w-16 h-16 bg-primary rounded-md flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-heading tracking-tight mb-3">{title}</h2>
          <p className="text-sm font-medium text-gray-500 mb-2">{description}</p>
          {highlight && <p className="text-base font-semibold text-heading mb-8">{highlight}</p>}
          <div className="w-12 h-0.5 bg-primary mx-auto rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
