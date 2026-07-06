'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ShoppingCart, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

function OrderFailedContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Something went wrong while placing your order. Please try again.';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-100 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden p-8 md:p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.1 }}
            className="inline-flex mb-6"
          >
            <div className="bg-red-50 rounded-full p-4 border border-red-100">
              <XCircle className="w-14 h-14 text-red-500" strokeWidth={1.5} />
            </div>
          </motion.div>

          <h1 className="text-2xl font-bold text-heading mb-2">Order Failed</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">{decodeURIComponent(message)}</p>

          <div className="space-y-3">
            <Link href="/checkout">
              <Button fullWidth variant="premium" size="lg" className="uppercase tracking-widest text-xs">
                <RefreshCw className="w-4 h-4 mr-1.5" />
                Try Again
              </Button>
            </Link>
            <Link href="/cart">
              <Button fullWidth variant="premium-soft" size="lg" className="uppercase tracking-widest text-xs">
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                Back to Cart
              </Button>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-heading mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue shopping
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading…</div>}>
      <OrderFailedContent />
    </Suspense>
  );
}
