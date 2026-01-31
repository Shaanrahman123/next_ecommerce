'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, Lock } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCartStore, useAuthStore } from '@/store';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const subtotal = getTotal();
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    if (items.length === 0) {
        router.push('/cart');
        return null;
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Shipping validation
        if (!shippingInfo.fullName) newErrors.fullName = 'Full name is required';
        if (!shippingInfo.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(shippingInfo.email))
            newErrors.email = 'Email is invalid';
        if (!shippingInfo.phone) newErrors.phone = 'Phone is required';
        if (!shippingInfo.addressLine1) newErrors.addressLine1 = 'Address is required';
        if (!shippingInfo.city) newErrors.city = 'City is required';
        if (!shippingInfo.state) newErrors.state = 'State is required';
        if (!shippingInfo.zipCode) newErrors.zipCode = 'ZIP code is required';
        if (!shippingInfo.country) newErrors.country = 'Country is required';

        // Payment validation
        if (!paymentInfo.cardNumber) newErrors.cardNumber = 'Card number is required';
        else if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16)
            newErrors.cardNumber = 'Card number must be 16 digits';
        if (!paymentInfo.cardHolder) newErrors.cardHolder = 'Cardholder name is required';
        if (!paymentInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required';
        if (!paymentInfo.cvv) newErrors.cvv = 'CVV is required';
        else if (paymentInfo.cvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            clearCart();
            router.push('/order-success');
        }, 2000);
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-[var(--theme-primary)] mb-8">
                Checkout
            </h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Information */}
                        <div className="bg-[var(--theme-secondary)] border border-[var(--theme-border)] rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-[var(--theme-primary)] mb-6">
                                Shipping Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Full Name"
                                        value={shippingInfo.fullName}
                                        onChange={(e) =>
                                            setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                                        }
                                        error={errors.fullName}
                                        required
                                    />
                                </div>
                                <Input
                                    label="Email"
                                    type="email"
                                    value={shippingInfo.email}
                                    onChange={(e) =>
                                        setShippingInfo({ ...shippingInfo, email: e.target.value })
                                    }
                                    error={errors.email}
                                    required
                                />
                                <Input
                                    label="Phone"
                                    type="tel"
                                    value={shippingInfo.phone}
                                    onChange={(e) =>
                                        setShippingInfo({ ...shippingInfo, phone: e.target.value })
                                    }
                                    error={errors.phone}
                                    required
                                />
                                <div className="md:col-span-2">
                                    <Input
                                        label="Address Line 1"
                                        value={shippingInfo.addressLine1}
                                        onChange={(e) =>
                                            setShippingInfo({ ...shippingInfo, addressLine1: e.target.value })
                                        }
                                        error={errors.addressLine1}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        label="Address Line 2 (Optional)"
                                        value={shippingInfo.addressLine2}
                                        onChange={(e) =>
                                            setShippingInfo({ ...shippingInfo, addressLine2: e.target.value })
                                        }
                                    />
                                </div>
                                <Input
                                    label="City"
                                    value={shippingInfo.city}
                                    onChange={(e) =>
                                        setShippingInfo({ ...shippingInfo, city: e.target.value })
                                    }
                                    error={errors.city}
                                    required
                                />
                                <Input
                                    label="State/Province"
                                    value={shippingInfo.state}
                                    onChange={(e) =>
                                        setShippingInfo({ ...shippingInfo, state: e.target.value })
                                    }
                                    error={errors.state}
                                    required
                                />
                                <Input
                                    label="ZIP/Postal Code"
                                    value={shippingInfo.zipCode}
                                    onChange={(e) =>
                                        setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                                    }
                                    error={errors.zipCode}
                                    required
                                />
                                <Input
                                    label="Country"
                                    value={shippingInfo.country}
                                    onChange={(e) =>
                                        setShippingInfo({ ...shippingInfo, country: e.target.value })
                                    }
                                    error={errors.country}
                                    required
                                />
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-[var(--theme-secondary)] border border-[var(--theme-border)] rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard className="w-6 h-6" />
                                <h2 className="text-2xl font-bold text-[var(--theme-primary)]">
                                    Payment Information
                                </h2>
                                <Lock className="w-5 h-5 text-green-600 ml-auto" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Card Number"
                                        value={paymentInfo.cardNumber}
                                        onChange={(e) =>
                                            setPaymentInfo({
                                                ...paymentInfo,
                                                cardNumber: formatCardNumber(e.target.value),
                                            })
                                        }
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        error={errors.cardNumber}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        label="Cardholder Name"
                                        value={paymentInfo.cardHolder}
                                        onChange={(e) =>
                                            setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })
                                        }
                                        error={errors.cardHolder}
                                        required
                                    />
                                </div>
                                <Input
                                    label="Expiry Date"
                                    value={paymentInfo.expiryDate}
                                    onChange={(e) =>
                                        setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })
                                    }
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    error={errors.expiryDate}
                                    required
                                />
                                <Input
                                    label="CVV"
                                    type="password"
                                    value={paymentInfo.cvv}
                                    onChange={(e) =>
                                        setPaymentInfo({ ...paymentInfo, cvv: e.target.value })
                                    }
                                    placeholder="123"
                                    maxLength={3}
                                    error={errors.cvv}
                                    required
                                />
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-sm text-[var(--theme-text-muted)]">
                                <Lock className="w-4 h-4" />
                                <span>Your payment information is secure and encrypted</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[var(--theme-secondary)] border border-[var(--theme-border)] rounded-lg p-6 sticky top-24">
                            <h2 className="text-2xl font-bold text-[var(--theme-primary)] mb-6">
                                Order Summary
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div
                                        key={`${item.productId}-${item.size}-${item.color}`}
                                        className="flex gap-3"
                                    >
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                                            <Image
                                                src={item.product.images[0] || '/placeholder-product.jpg'}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {item.product.name}
                                            </p>
                                            <p className="text-xs text-[var(--theme-text-muted)]">
                                                {item.size} | {item.color} | Qty: {item.quantity}
                                            </p>
                                            <p className="text-sm font-bold">
                                                ₹{(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 border-t border-[var(--theme-border)] pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--theme-text-secondary)]">Subtotal</span>
                                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--theme-text-secondary)]">Shipping</span>
                                    <span className="font-medium">
                                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--theme-text-secondary)]">Tax</span>
                                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-[var(--theme-border)] pt-3">
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span className="text-[var(--theme-primary)]">
                                            ₹{total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                className="mt-6"
                                isLoading={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
