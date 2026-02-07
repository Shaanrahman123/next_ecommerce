'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CreditCard, Lock } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCartStore, useAuthStore, useAddressStore } from '@/store';
import { MapPin, Check, Info, ChevronRight, X, Plus, MoreVertical } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const { addresses, updateAddress } = useAddressStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(2); // Start at Order Summary as per mockup
    const orderSummaryRef = useRef<HTMLDivElement>(null);
    const { addAddress } = useAddressStore();

    // Initial address selection
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            handleAddressSelect(addresses[0]);
        }
    }, [addresses, selectedAddressId]);

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
        type: 'HOME' as 'HOME' | 'OFFICE' | 'OTHER'
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

    const handleAddressSelect = (address: any) => {
        setSelectedAddressId(address.id);
        const [first, ...rest] = address.addressLine1.split(',');
        setShippingInfo({
            fullName: address.fullName,
            email: address.email || user?.email || '',
            phone: address.phone,
            addressLine1: first || '',
            addressLine2: address.addressLine2 || rest.join(',') || '',
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country,
        });
    };

    const handleAddAddress = () => {
        const id = Math.random().toString(36).substring(2, 9);
        const address = { ...newAddress, id };
        addAddress(address);
        setIsAddAddressModalOpen(false);
        handleAddressSelect(address);
    };

    const handleUpdateAddress = () => {
        if (selectedAddressId) {
            updateAddress(selectedAddressId, {
                fullName: shippingInfo.fullName,
                phone: shippingInfo.phone,
                addressLine1: shippingInfo.addressLine1,
                addressLine2: shippingInfo.addressLine2,
                city: shippingInfo.city,
                state: shippingInfo.state,
                zipCode: shippingInfo.zipCode,
                country: shippingInfo.country,
            });
        }
    };

    const scrollToSummary = () => {
        orderSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const selectedAddress = addresses.find((a: any) => a.id === selectedAddressId) || addresses[0];

    const steps = [
        { id: 1, label: 'Address' },
        { id: 2, label: 'Order Summary' },
        { id: 3, label: 'Payment' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
            {/* Header / Stepper */}
            <div className="bg-white border-b border-gray-300 pt-5 pb-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-sm font-bold text-gray-900 text-left mb-6 uppercase tracking-widest">Order Summary</h1>

                    <div className="relative w-full">
                        {/* Progressive Background Line */}
                        <div className="absolute top-4 left-0 w-full h-px bg-gray-200 z-0" />
                        <div
                            className="absolute top-4 left-0 h-px bg-black z-0 transition-all duration-500"
                            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                        />

                        <div className="flex justify-between w-full relative z-10">
                            {steps.map((step, idx) => (
                                <div
                                    key={step.id}
                                    className={`flex flex-col ${idx === 0 ? 'items-start' :
                                        idx === steps.length - 1 ? 'items-end' :
                                            'items-center'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentStep >= step.id
                                        ? 'bg-black text-white'
                                        : 'bg-white border-2 border-gray-300 text-gray-400'
                                        }`}>
                                        {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                                    </div>
                                    <span className={`text-[9px] mt-2 font-bold uppercase tracking-tight ${currentStep === step.id ? 'text-black' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Delivery & Summary Sections */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Selected Address Card */}
                        <div className="bg-white border border-gray-300 rounded-2xl p-5 overflow-hidden animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-gray-900">Deliver to:</h2>
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="px-3 py-1.5 text-xs font-bold text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-tight"
                                >
                                    Change
                                </button>
                            </div>

                            {selectedAddress && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-900 text-base uppercase tracking-tight">{selectedAddress.fullName}</p>
                                        <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">{selectedAddress.type || 'HOME'}</span>
                                    </div>
                                    <p className="text-small text-gray-600 leading-normal max-w-md">
                                        {selectedAddress.addressLine1}, {selectedAddress.addressLine2 ? `${selectedAddress.addressLine2}, ` : ''}{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                                    </p>
                                    <p className="text-small font-bold text-gray-900 mt-1 tracking-tight">{selectedAddress.phone}</p>
                                </div>
                            )}
                        </div>

                        {/* Order Items Review */}
                        <div ref={orderSummaryRef} className="bg-white border border-gray-300 rounded-2xl p-5 animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-gray-900">Items in your order</h2>
                                <span className="text-xs text-gray-500 font-medium">{items.length} Product(s)</span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <div key={`${item.productId}-${item.size}-${item.color}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                                        <div className="relative w-20 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                            <Image
                                                src={item.product.images[0] || '/placeholder-product.jpg'}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <p className="text-small font-bold text-gray-900 truncate">
                                                {item.product.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">Size: {item.size}</span>
                                                <span className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">Color: {item.color}</span>
                                            </div>
                                            <p className="text-[10px] font-medium text-gray-400 mt-2 uppercase tracking-tighter">Qty: {item.quantity}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <p className="text-small font-bold text-gray-900">
                                                    ₹{item.product.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Summary Component (Visible on Mobile inside main flow) */}
                        <div className="lg:hidden bg-white border border-gray-300 rounded-2xl p-5 animate-fade-in">
                            <h2 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">Price Details</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium">Price ({items.length} items)</span>
                                    <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium">Shipping Fee</span>
                                    <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium">Tax</span>
                                    <span className="font-semibold text-gray-900">₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-3 mt-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-body font-semibold text-gray-900 ">Total Amount</span>
                                        <span className="text-lg font-semibold text-gray-900">₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-800 text-center mt-4 px-4 leading-relaxed tracking-tight animate-fade-in lg:hidden">
                            By continuing, you agree to our <span className="font-bold text-gray-700 underline">Terms and Conditions</span> and <span className="font-bold text-gray-700 underline">Privacy Policy</span>
                        </p>
                    </div>

                    {/* Right Column: Price Details (Bigger Device Review) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-white border border-gray-300 rounded-2xl p-6 sticky top-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider text-small">Price Details</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-body">
                                    <span className="text-gray-500">Price ({items.length} items)</span>
                                    <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-body">
                                    <span className="text-gray-500">Shipping Fee</span>
                                    <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-body">
                                    <span className="text-gray-500">Tax</span>
                                    <span className="font-bold text-gray-900">₹{tax.toLocaleString()}</span>
                                </div>

                                <div className="border-t border-gray-100 pt-4 mt-6">
                                    <div className="flex justify-between items-baseline mb-8">
                                        <span className="text-lg font-black text-gray-900 uppercase">Total Amount</span>
                                        <span className="text-base lg:text-2xl font-black text-gray-900">₹{total.toLocaleString()}</span>
                                    </div>

                                    <Button
                                        fullWidth
                                        size="lg"
                                        onClick={() => setIsProcessing(true)}
                                        isLoading={isProcessing}
                                        className="rounded-xl h-14 text-lg font-black uppercase tracking-widest shadow-black/10 transition-transform active:scale-95"
                                    >
                                        Place Order
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p className="text-[11px] text-gray-800 text-center mt-6 px-6 leading-relaxed">
                            By placing your order, you agree to our <span className="font-bold text-gray-700 underline">Terms and Conditions</span> and <span className="font-bold text-gray-700 underline">Privacy Policy</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Action Bar (Mobile & Tablet) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-safe z-40 animate-slide-up">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Payable</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-black text-gray-900">₹{total.toLocaleString()}</span>
                                <button
                                    onClick={scrollToSummary}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Info className="w-5 h-5 text-gray-900" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <Button
                        size="md"
                        onClick={() => setIsProcessing(true)}
                        isLoading={isProcessing}
                        className="flex-1 max-w-[200px] h-12 rounded-xl text-body font-black uppercase tracking-widest"
                    >
                        Continue
                    </Button>
                </div>
            </div>

            {/* Address Selection Modal/Drawer Overlay */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsAddressModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Select delivery address</h3>
                                <div className="h-0.5 w-12 bg-black mt-1" />
                            </div>
                            <button onClick={() => setIsAddressModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-body font-bold text-gray-900">Saved addresses</p>
                                <button
                                    onClick={() => setIsAddAddressModalOpen(true)}
                                    className="text-small font-bold text-blue-600 flex items-center gap-1 hover:underline"
                                >
                                    <Plus className="w-4 h-4" /> Add New
                                </button>
                            </div>

                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        onClick={() => {
                                            handleAddressSelect(address);
                                            setIsAddressModalOpen(false);
                                        }}
                                        className={`group relative flex flex-col gap-2 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${selectedAddressId === address.id
                                            ? 'border-black bg-gray-50'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                            }`}
                                    >
                                        {/* Row 1: Radio and Name */}
                                        <div className="flex items-center gap-3">
                                            <div className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${selectedAddressId === address.id ? 'border-black bg-black' : 'border-gray-200'}`}>
                                                {selectedAddressId === address.id && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <div className="flex-1 flex items-center gap-2">
                                                <p className="font-bold text-gray-900">{address.fullName}</p>
                                                {selectedAddressId === address.id && (
                                                    <span className="bg-blue-100 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-tighter">Currently selected</span>
                                                )}
                                            </div>
                                            <button className="p-1 text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Row 2: Address */}
                                        <div className="pl-8">
                                            <p className="text-[11px] text-gray-500 leading-relaxed truncate">
                                                {address.addressLine1}, {address.city}, {address.state} {address.zipCode}
                                            </p>
                                        </div>

                                        {/* Row 3: Email and Phone */}
                                        <div className="pl-8 flex items-center gap-4">
                                            {address.email && (
                                                <p className="text-[11px] text-gray-400 truncate">{address.email}</p>
                                            )}
                                            <p className="text-[11px] font-bold text-gray-900 tracking-tighter">{address.phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Address Modal */}
            {isAddAddressModalOpen && (
                <div className="fixed inset-0 z-110 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsAddAddressModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fade-in overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Add new address</h3>
                                <div className="h-0.5 w-12 bg-black mt-1" />
                            </div>
                            <button onClick={() => setIsAddAddressModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="State"
                                    value={newAddress.state}
                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                    placeholder="State"
                                />
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Address Type</label>
                                    <div className="flex gap-2">
                                        {['HOME', 'OFFICE', 'OTHER'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setNewAddress({ ...newAddress, type: type as any })}
                                                className={`flex-1 py-2 text-[10px] font-bold rounded-lg border-2 transition-all ${newAddress.type === type
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-100 text-gray-500 hover:border-gray-200'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button
                                fullWidth
                                className="mt-6 h-12 rounded-xl text-small font-black uppercase tracking-widest"
                                onClick={handleAddAddress}
                            >
                                Save Address
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
