'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Info, X, Plus } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAddressStore, useAuthStore } from '@/store';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { useCartProductSync } from '@/hooks/useCartProductSync';
import { useSyncUserProfile } from '@/hooks/useSyncUserProfile';
import { computeOrderTotals } from '@/lib/shippingUtils';
import { userService } from '@/services/user.service';
import { mapProfileAddresses } from '@/utils/user';
import { getMaxAllowedQuantity } from '@/constants/cart';
import { CHECKOUT_ADDRESS_KEY } from '@/constants/checkout';
import AlertModal from '@/components/ui/AlertModal';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import CheckoutItemRow from '@/components/checkout/CheckoutItemRow';
import CheckoutPriceSummary from '@/components/checkout/CheckoutPriceSummary';
import { IndianPatternOverlay } from '@/components/home/indian/IndianDecor';
import type { Address } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isLoading: productsLoading, getItemStock, removeItem, updateQuantity } =
    useCartProductSync();
  const { addresses, setAddresses } = useAddressStore();
  const { isAuthenticated } = useAuthStore();
  const { syncProfile } = useSyncUserProfile();
  const { settings, isLoading: settingsLoading } = useShippingSettings();

  const [qtyAlert, setQtyAlert] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const currentStep = 2;
  const orderSummaryRef = useRef<HTMLDivElement>(null);
  const priceSummaryRef = useRef<HTMLDivElement>(null);

  const totals = useMemo(() => computeOrderTotals(items, settings), [items, settings]);
  const summaryLoading = productsLoading || settingsLoading;

  const [newAddress, setNewAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    type: 'HOME' as 'HOME' | 'OFFICE' | 'OTHER',
  });

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id);
  };

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
      handleAddressSelect(defaultAddr);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (isAuthenticated) {
      syncProfile();
    }
  }, [isAuthenticated, syncProfile]);

  useEffect(() => {
    if (!productsLoading && items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, productsLoading, router]);

  if (items.length === 0 && !productsLoading) {
    return null;
  }

  const handleContinueToPayment = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
    if (!selectedAddress) {
      setOrderError('Please select a delivery address.');
      return;
    }
    sessionStorage.setItem(CHECKOUT_ADDRESS_KEY, selectedAddress.id);
    router.push('/checkout/payment');
  };

  const handleIncreaseQty = (productId: string, size: string, color: string, currentQty: number) => {
    const stock = getItemStock(productId);
    const max = getMaxAllowedQuantity(stock);
    if (currentQty >= max) return;
    updateQuantity(productId, size, color, currentQty + 1);
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.fullName.trim() ||
      !newAddress.addressLine1.trim() ||
      !newAddress.city.trim() ||
      !newAddress.state.trim() ||
      !newAddress.zipCode.trim()
    ) {
      setOrderError('Please fill all required address fields.');
      return;
    }

    setIsSavingAddress(true);
    setOrderError(null);
    try {
      const res = await userService.addAddress({
        type: newAddress.type,
        fullName: newAddress.fullName.trim(),
        addressLine1: newAddress.addressLine1.trim(),
        addressLine2: newAddress.addressLine2.trim(),
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        zipCode: newAddress.zipCode.trim(),
        country: newAddress.country,
        phone: newAddress.phone.trim(),
      });

      if (res.user) {
        const synced = mapProfileAddresses(res.user);
        setAddresses(synced);
        const added = res.address
          ? synced.find((a) => a.id === res.address!.id) || res.address
          : synced[synced.length - 1];
        if (added) handleAddressSelect({ ...added, email: newAddress.email || undefined });
      }

      setIsAddAddressModalOpen(false);
      setNewAddress({
        fullName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        type: 'HOME',
      });
    } catch {
      setOrderError('Could not save address. Please try again.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const scrollToSummary = () => {
    priceSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-12">
      {/* Header / Stepper */}
      <div className="relative bg-white border-b border-amber-200/50 pt-5 pb-6 overflow-hidden">
        <IndianPatternOverlay pattern="bandhani" className="text-amber-900" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-sm font-bold text-heading text-left mb-6 uppercase tracking-[0.2em]">
            Order Summary
          </h1>
          <CheckoutStepper currentStep={currentStep} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Card */}
            <div className="relative overflow-hidden bg-white border border-amber-200/70 rounded-2xl p-5 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/30 to-transparent" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-heading uppercase tracking-wide">Deliver to</h2>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-bold text-amber-900 border border-amber-300/60 rounded-lg hover:bg-amber-50 transition-colors uppercase tracking-tight"
                >
                  Change
                </button>
              </div>

              {selectedAddress && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-heading uppercase tracking-tight">{selectedAddress.fullName}</p>
                    <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200/60 uppercase">
                      {selectedAddress.type || 'HOME'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                    {selectedAddress.addressLine1}
                    {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}, {selectedAddress.city},{' '}
                    {selectedAddress.state} {selectedAddress.zipCode}
                  </p>
                  <p className="text-sm font-semibold text-heading mt-1">{selectedAddress.phone}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div
              ref={orderSummaryRef}
              className="relative overflow-hidden bg-white border border-amber-200/70 rounded-2xl p-5 shadow-sm"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/30 to-transparent" />
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-heading uppercase tracking-wide">Items in your order</h2>
                <span className="text-xs text-amber-800/60 font-semibold">{totals.itemCount} item(s)</span>
              </div>

              <div>
                {items.map((item) => (
                  <CheckoutItemRow
                    key={`${item.productId}-${item.size}-${item.color}`}
                    item={item}
                    stockQuantity={getItemStock(item.productId)}
                    onRemove={() => removeItem(item.productId, item.size, item.color)}
                    onDecrease={() => {
                      if (item.quantity <= 1) {
                        removeItem(item.productId, item.size, item.color);
                      } else {
                        updateQuantity(item.productId, item.size, item.color, item.quantity - 1);
                      }
                    }}
                    onIncrease={() =>
                      handleIncreaseQty(item.productId, item.size, item.color, item.quantity)
                    }
                    onLimitReached={setQtyAlert}
                  />
                ))}
              </div>
            </div>

            {/* Mobile price summary */}
            <div className="lg:hidden" ref={priceSummaryRef}>
              <CheckoutPriceSummary
                items={items}
                totals={totals}
                settings={settings}
                isLoading={summaryLoading}
                showPlaceOrder={false}
                compact
              />
            </div>

            <p className="text-[10px] text-gray-600 text-center px-4 leading-relaxed lg:hidden">
              By continuing, you agree to our{' '}
              <span className="font-semibold text-heading underline">Terms and Conditions</span> and{' '}
              <span className="font-semibold text-heading underline">Privacy Policy</span>
            </p>
          </div>

          {/* Right Column — Desktop summary */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8">
              <CheckoutPriceSummary
                items={items}
                totals={totals}
                settings={settings}
                isLoading={summaryLoading}
                onPlaceOrder={handleContinueToPayment}
                actionLabel="Continue to Payment"
              />
              <p className="text-[11px] text-gray-600 text-center mt-6 px-2 leading-relaxed">
                By placing your order, you agree to our{' '}
                <span className="font-semibold text-heading underline">Terms and Conditions</span> and{' '}
                <span className="font-semibold text-heading underline">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Payable</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-heading">
                ₹{totals.total.toLocaleString('en-IN')}
              </span>
              <button
                type="button"
                onClick={scrollToSummary}
                className="p-1 hover:bg-amber-100/60 rounded-full transition-colors"
              >
                <Info className="w-4 h-4 text-amber-900" />
              </button>
            </div>
          </div>
          <Button
            variant="premium"
            size="lg"
            onClick={handleContinueToPayment}
            className="flex-1 max-w-[220px] uppercase tracking-widest text-xs"
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsAddressModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up overflow-hidden border border-amber-200/50">
            <div className="p-6 border-b border-amber-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-heading">Select delivery address</h3>
                <div className="h-0.5 w-12 bg-linear-to-r from-amber-500 to-rose-400 mt-1 rounded-full" />
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="p-2 hover:bg-amber-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-heading text-sm">Saved addresses</p>
                <button
                  type="button"
                  onClick={() => setIsAddAddressModalOpen(true)}
                  className="text-xs font-bold text-amber-800 flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>

              {addresses.map((address) => (
                <div
                  key={address.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    handleAddressSelect(address);
                    setIsAddressModalOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleAddressSelect(address);
                      setIsAddressModalOpen(false);
                    }
                  }}
                  className={`group relative w-full text-left flex flex-col gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedAddressId === address.id
                      ? 'border-amber-500/60 bg-amber-50/50'
                      : 'border-gray-100 hover:border-amber-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                        selectedAddressId === address.id ? 'border-amber-600 bg-amber-600' : 'border-gray-200'
                      }`}
                    >
                      {selectedAddressId === address.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <p className="font-bold text-heading">{address.fullName}</p>
                  </div>
                  <p className="pl-8 text-xs text-gray-500 leading-relaxed">
                    {address.addressLine1}, {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="pl-8 text-xs font-semibold text-heading">{address.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 z-110 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsAddAddressModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-amber-200/50">
            <div className="p-6 border-b border-amber-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-heading">Add new address</h3>
                <div className="h-0.5 w-12 bg-linear-to-r from-amber-500 to-rose-400 mt-1 rounded-full" />
              </div>
              <button
                type="button"
                onClick={() => setIsAddAddressModalOpen(false)}
                className="p-2 hover:bg-amber-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <Input
                label="Full Name"
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                placeholder="Receiver's name"
              />
              <Input
                label="Phone Number"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                placeholder="10-digit mobile number"
              />
              <Input
                label="Email Address"
                value={newAddress.email}
                onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                placeholder="Email for order updates"
              />
              <Input
                label="Address Line 1"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                placeholder="House No, Building, Street"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="City"
                />
                <Input
                  label="ZIP Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  placeholder="Pincode"
                />
              </div>
              <Input
                label="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                placeholder="State"
              />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Address Type</label>
                <div className="flex gap-2">
                  {(['HOME', 'OFFICE', 'OTHER'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddress({ ...newAddress, type })}
                      className={`flex-1 py-2 text-[10px] font-bold rounded-lg border-2 transition-all ${
                        newAddress.type === type
                          ? 'border-amber-600 bg-heading text-white'
                          : 'border-gray-100 text-gray-500 hover:border-amber-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                fullWidth
                variant="premium"
                size="lg"
                className="mt-4 uppercase tracking-widest"
                onClick={handleAddAddress}
                isLoading={isSavingAddress}
              >
                Save Address
              </Button>
            </div>
          </div>
        </div>
      )}
      <AlertModal
        isOpen={!!qtyAlert}
        title="Quantity limit"
        message={qtyAlert || ''}
        variant="warning"
        onClose={() => setQtyAlert(null)}
      />
      <AlertModal
        isOpen={!!orderError}
        title="Cannot continue"
        message={orderError || ''}
        variant="warning"
        onClose={() => setOrderError(null)}
      />
    </div>
  );
}
