import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md border border-amber-100">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-heading mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn&apos;t find the product you&apos;re looking for. It may have been removed or is no longer
          available.
        </p>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    </div>
  );
}
