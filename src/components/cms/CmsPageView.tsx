'use client';

import Link from 'next/link';
import { ChevronRight, Home, FileText } from 'lucide-react';

interface CmsPageViewProps {
  title: string;
  slug: string;
  content: string;
  updatedAt?: string;
}

export default function CmsPageView({ title, slug, content, updatedAt }: CmsPageViewProps) {
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Clean, simple header section */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 lg:px-8 xl:px-16 py-12 lg:py-16 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{title}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-heading tracking-tight">
            {title}
          </h1>
          
          {formattedDate && (
            <p className="mt-4 text-gray-500 text-sm">
              Last updated: {formattedDate}
            </p>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="container mx-auto px-4 lg:px-8 xl:px-16 py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {content ? (
            <article
              className="cms-content prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            /* Empty state with prompt to admin */
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-heading">Content Coming Soon</h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                This page is being prepared. Please check back shortly.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary hover:bg-primary-hover text-on-primary rounded-xl font-semibold text-sm transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
