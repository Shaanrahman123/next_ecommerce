'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  Lock,
  MapPin,
  Check,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAddressStore, useAuthStore } from '@/store';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { useCartProductSync } from '@/hooks/useCartProductSync';
import { computeOrderTotals, formatINR } from '@/lib/shippingUtils';
import { orderService } from '@/services/order.service';
import { CHECKOUT_ADDRESS_KEY } from '@/constants/checkout';
import AlertModal from '@/components/ui/AlertModal';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import CheckoutPriceSummary from '@/components/checkout/CheckoutPriceSummary';
import { IndianPatternOverlay } from '@/components/home/indian/IndianDecor';

type PaymentMethodId = 'cod' | 'upi' | 'card' | 'netbanking';

const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  description: string;
  icon: typeof Banknote;
  available: boolean;
}[] = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives at your doorstep',
    icon: Banknote,
    available: true,
  },
  {
    id: 'upi',
    label: 'UPI',
    description: 'Google Pay, PhonePe, Paytm & more',
    icon: Smartphone,
    available: false,
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
    available: false,
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    description: 'All major banks supported',
    icon: Building2,
    available: false,
  },
];

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { items, isLoading: productsLoading, clearCart } = useCartProductSync();
  const { addresses } = useAddressStore();
  const { isAuthenticated } = useAuthStore();
  const { settings, isLoading: settingsLoading } = useShippingSettings();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [storedAddressId, setStoredAddressId] = useState<string | null>(null);
  const orderPlacedRef = useRef(false);

  useEffect(() => {
    setStoredAddressId(sessionStorage.getItem(CHECKOUT_ADDRESS_KEY));
  }, []);

  const totals = useMemo(() => computeOrderTotals(items, settings), [items, settings]);
  const summaryLoading = productsLoading || settingsLoading;
  const currentStep = 3;

  const selectedAddress =
    addresses.find((a) => a.id === storedAddressId) ||
    addresses.find((a) => a.isDefault) ||
    addresses[0];

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login?redirect=/checkout/payment');
      return;
    }
    if (orderPlacedRef.current) return;
    if (!productsLoading && items.length === 0) {
      router.replace('/cart');
    }
  }, [isAuthenticated, items.length, productsLoading, router]);

  useEffect(() => {
    if (!productsLoading && items.length > 0 && storedAddressId !== null && !selectedAddress) {
      router.replace('/checkout');
    }
  }, [productsLoading, items.length, storedAddressId, selectedAddress, router]);

  if (items.length === 0 && !isProcessing && !orderPlacedRef.current) {
    return null;
  }

  const handlePayNow = async () => {
    if (!selectedAddress) {
      setOrderError('Please select a delivery address.');
      router.push('/checkout');
      return;
    }
    if (selectedMethod !== 'cod') {
      setOrderError('Only Cash on Delivery is available right now.');
      return;
    }

    setIsProcessing(true);
    setOrderError(null);
    let orderSucceeded = false;

    try {
      const res = await orderService.createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone,
          email: selectedAddress.email,
          type: selectedAddress.type,
        },
        paymentMethod: 'cod',
      });

      const orderId = res.data?._id;
      orderSucceeded = true;
      orderPlacedRef.current = true;
      sessionStorage.removeItem(CHECKOUT_ADDRESS_KEY);
      clearCart();
      router.replace(orderId ? `/order-success?orderId=${orderId}` : '/order-success');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Could not place order';
      router.push(`/order-failed?message=${encodeURIComponent(msg)}`);
    } finally {
      if (!orderSucceeded) {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-12">
      <div className="relative bg-white border-b border-amber-200/50 pt-5 pb-6 overflow-hidden">
        <IndianPatternOverlay pattern="bandhani" className="text-amber-900" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/checkout"
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-amber-200/80 bg-white text-heading hover:bg-amber-50 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-sm font-bold text-heading uppercase tracking-[0.2em]">Payment</h1>
          </div>
          <CheckoutStepper currentStep={currentStep} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery summary */}
            {selectedAddress && (
              <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-white p-5 shadow-sm">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/30 to-transparent" />
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-amber-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Delivering to
                    </p>
                    <p className="font-bold text-heading">{selectedAddress.fullName}</p>
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                      {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state}{' '}
                      {selectedAddress.zipCode}
                    </p>
                    <p className="text-sm font-semibold text-heading mt-1">{selectedAddress.phone}</p>
                  </div>
                  <Link href="/checkout" className="text-xs font-bold text-amber-800 hover:underline shrink-0">
                    Change
                  </Link>
                </div>
              </div>
            )}

            {/* Payment methods */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/30 to-transparent" />
              <div className="px-5 py-4 border-b border-amber-100/80 bg-[#faf8f5]">
                <h2 className="text-xs font-bold text-heading uppercase tracking-wider">Select Payment Method</h2>
                <p className="text-xs text-gray-500 mt-0.5">Choose how you would like to pay</p>
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  const isDisabled = !method.available;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => method.available && setSelectedMethod(method.id)}
                      className={`relative w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        isDisabled
                          ? 'border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed'
                          : isSelected
                            ? 'border-amber-500/70 bg-amber-50/40 shadow-sm'
                            : 'border-gray-100 bg-white hover:border-amber-200 hover:bg-amber-50/20'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected && method.available
                            ? 'bg-heading text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-heading text-sm">{method.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                      </div>
                      {isDisabled ? (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                          Unavailable
                        </span>
                      ) : (
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-amber-600 bg-amber-600' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mx-4 sm:mx-5 mb-5 flex items-center gap-2 rounded-xl bg-emerald-50/80 border border-emerald-200/60 px-4 py-3">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
                <p className="text-xs text-emerald-900">
                  <span className="font-bold">100% secure.</span> Your payment information is encrypted and protected.
                </p>
              </div>
            </div>

            {/* Mobile summary */}
            <div className="lg:hidden">
              <CheckoutPriceSummary
                items={items}
                totals={totals}
                settings={settings}
                isLoading={summaryLoading}
                showPlaceOrder={false}
                compact
              />
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <CheckoutPriceSummary
                items={items}
                totals={totals}
                settings={settings}
                isLoading={summaryLoading}
                isProcessing={isProcessing}
                onPlaceOrder={handlePayNow}
                actionLabel="Pay Now"
              />

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <Lock className="w-3.5 h-3.5" />
                <span>Secured by SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky pay bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Payable</span>
            <p className="text-xl font-black text-heading">{formatINR(totals.total)}</p>
          </div>
          <Button
            variant="premium"
            size="lg"
            onClick={handlePayNow}
            isLoading={isProcessing}
            className="flex-1 max-w-[220px] uppercase tracking-widest text-xs"
          >
            Pay Now
          </Button>
        </div>
      </div>

      <AlertModal
        isOpen={!!orderError}
        title="Cannot complete payment"
        message={orderError || ''}
        variant="warning"
        onClose={() => setOrderError(null)}
      />
    </div>
  );
}
