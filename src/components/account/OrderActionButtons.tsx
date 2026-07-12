'use client';

import { useState } from 'react';
import { XCircle, RotateCcw, Loader2, Headphones } from 'lucide-react';
import Button from '@/components/ui/Button';
import AlertModal from '@/components/ui/AlertModal';
import Link from 'next/link';
import { orderService } from '@/services/order.service';
import type { OrderSummary } from '@/types/order';

const CANCEL_REASONS = [
  'Changed my mind',
  'Ordered by mistake',
  'Found a better price',
  'Delivery taking too long',
  'Other',
];

const RETURN_REASONS = [
  'Wrong size / fit',
  'Product not as described',
  'Quality issue',
  'Received damaged item',
  'Other',
];

interface OrderActionButtonsProps {
  order: OrderSummary;
  onUpdated: (order: OrderSummary) => void;
  layout?: 'row' | 'stack';
  size?: 'sm' | 'md';
}

export default function OrderActionButtons({
  order,
  onUpdated,
  layout = 'stack',
  size = 'md',
}: OrderActionButtonsProps) {
  const [modal, setModal] = useState<'cancel' | 'return' | null>(null);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ title: string; message: string; variant?: 'warning' | 'success' } | null>(
    null
  );

  const actions = order.actions;
  const canCancel = actions?.canCancel ?? false;
  const canReturn = actions?.canReturn ?? false;

  const btnSize = size === 'sm' ? 'sm' : 'md';

  const openModal = (type: 'cancel' | 'return') => {
    setModal(type);
    setReason('');
    setCustomReason('');
  };

  const handleSubmit = async () => {
    const finalReason = reason === 'Other' ? customReason.trim() : reason;
    if (!finalReason) {
      setAlert({ title: 'Reason required', message: 'Please select or enter a reason.', variant: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res =
        modal === 'cancel'
          ? await orderService.cancelOrder(order._id, finalReason)
          : await orderService.requestReturn(order._id, finalReason);

      if (res.data) onUpdated(res.data);
      setModal(null);
      setAlert({
        title: modal === 'cancel' ? 'Order cancelled' : 'Return requested',
        message:
          modal === 'cancel'
            ? 'Your order has been cancelled. Refund will be processed if payment was made online.'
            : 'We have received your return request. Our team will contact you within 24–48 hours.',
        variant: 'success',
      });
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Something went wrong. Please try again.';
      setAlert({ title: 'Action failed', message: msg, variant: 'warning' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasons = modal === 'cancel' ? CANCEL_REASONS : RETURN_REASONS;

  return (
    <>
      <div className={layout === 'row' ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' : 'flex flex-col gap-2.5'}>
        {canCancel && (
          <Button
            type="button"
            variant="outline"
            size={btnSize}
            fullWidth
            onClick={() => openModal('cancel')}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 uppercase tracking-wider text-[10px] font-bold"
          >
            <XCircle className="w-4 h-4 mr-1.5 shrink-0" />
            Cancel Order
          </Button>
        )}
        {canReturn && (
          <Button
            type="button"
            variant="premium-outline"
            size={btnSize}
            fullWidth
            onClick={() => openModal('return')}
            className="uppercase tracking-wider text-[10px] font-bold"
          >
            <RotateCcw className="w-4 h-4 mr-1.5 shrink-0" />
            Return Order
          </Button>
        )}
        <Link href={`/account?section=support&action=create&orderId=${order._id}`} className="block">
          <Button
            type="button"
            variant="premium-soft"
            size={btnSize}
            fullWidth
            className="uppercase tracking-wider text-[10px] font-bold"
          >
            <Headphones className="w-4 h-4 mr-1.5 shrink-0" />
            Raise Ticket
          </Button>
        </Link>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-heading mb-1">
              {modal === 'cancel' ? 'Cancel this order?' : 'Request a return'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {modal === 'cancel'
                ? actions?.cancelMessage ||
                  'You can cancel anytime before delivery. For COD orders, no payment is collected.'
                : actions?.returnMessage || 'Tell us why you want to return this order.'}
            </p>

            <div className="space-y-2 mb-4">
              {reasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    reason === r ? 'border-amber-400 bg-amber-50/60' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-amber-600"
                  />
                  <span className="text-sm text-heading">{r}</span>
                </label>
              ))}
            </div>

            {reason === 'Other' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please describe your reason..."
                rows={3}
                className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
              />
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setModal(null)}
                disabled={isSubmitting}
                className="order-2 sm:order-1"
              >
                Keep Order
              </Button>
              <Button
                variant="premium"
                fullWidth
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="order-1 sm:order-2 uppercase tracking-wider text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    Processing…
                  </>
                ) : modal === 'cancel' ? (
                  'Confirm Cancel'
                ) : (
                  'Submit Return'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        isOpen={!!alert}
        title={alert?.title || ''}
        message={alert?.message || ''}
        variant={alert?.variant === 'success' ? 'success' : 'warning'}
        onClose={() => setAlert(null)}
      />
    </>
  );
}
