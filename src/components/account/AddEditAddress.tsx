'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Save, MapPin } from 'lucide-react';
import { AuthErrorAlert } from '@/components/auth';
import { useAddressStore } from '@/store';
import { userService, getAuthErrorMessage } from '@/services/user.service';
import { mapProfileAddresses } from '@/utils/user';

interface AddEditAddressProps {
    addressId: string | null;
}

export default function AddEditAddress({ addressId }: AddEditAddressProps) {
    const router = useRouter();
    const { addresses, setAddresses } = useAddressStore();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [formData, setFormData] = useState({
        type: '',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (addressId) {
            const existing = addresses.find((a) => a.id === addressId);
            if (existing) {
                setFormData({
                    type: existing.type || 'Home',
                    fullName: existing.fullName,
                    phone: existing.phone || '',
                    addressLine1: existing.addressLine1,
                    addressLine2: existing.addressLine2 || '',
                    city: existing.city,
                    state: existing.state,
                    zipCode: existing.zipCode,
                    country: existing.country,
                    isDefault: existing.isDefault ?? false,
                });
            }
        }
    }, [addressId, addresses]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.type) newErrors.type = 'Address type is required';
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setApiError('');

        const payload = {
            type: formData.type,
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim(),
            addressLine1: formData.addressLine1.trim(),
            addressLine2: formData.addressLine2.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            zipCode: formData.zipCode.trim(),
            country: formData.country.trim(),
            isDefault: formData.isDefault,
        };

        try {
            const data = addressId
                ? await userService.updateAddress(addressId, payload)
                : await userService.addAddress(payload);

            if (data.user) {
                setAddresses(mapProfileAddresses(data.user));
            }
            router.push('/account?section=addresses');
        } catch (err) {
            setApiError(getAuthErrorMessage(err, `Failed to ${addressId ? 'update' : 'add'} address`));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="hidden lg:flex items-center gap-5 mb-10">
                <div className="w-16 h-16 bg-primary rounded-md flex items-center justify-center text-white">
                    <MapPin className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-section-title font-black text-heading uppercase tracking-tight">
                        {addressId ? 'Edit Address' : 'Add New Address'}
                    </h1>
                    <p className="text-body text-gray-600">Enter your delivery address details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="lg:bg-white lg:border lg:border-gray-300 lg:rounded-md lg:p-8">
                <AuthErrorAlert message={apiError} />

                <div className="space-y-10 mt-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-5">
                            Address Type <span className="text-red-500 font-bold">*</span>
                        </label>
                        <div className="flex gap-3">
                            {['Home', 'Work', 'Other'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, type });
                                        setErrors({ ...errors, type: '' });
                                    }}
                                    className={`flex-1 px-4 py-4 rounded-md font-black uppercase tracking-widest text-[10px] border transition-all duration-300 ${
                                        formData.type === type
                                            ? 'bg-primary text-on-primary border-primary'
                                            : 'bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-100'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        {errors.type && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.type}</p>}
                    </div>

                    <div className="pt-4 border-t border-gray-300">
                        <h3 className="text-small font-black text-heading mb-8 uppercase tracking-widest border-l-4 border-primary pl-3">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            <Input
                                label="Full Name"
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => {
                                    setFormData({ ...formData, fullName: e.target.value });
                                    setErrors({ ...errors, fullName: '' });
                                }}
                                error={errors.fullName}
                                placeholder="e.g. John Doe"
                                required
                                className="bg-gray-50 border-none rounded-md h-14"
                            />
                            <Input
                                label="Phone Number (Optional)"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="e.g. +91 98765 43210"
                                className="bg-gray-50 border-none rounded-md h-14"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-300">
                        <h3 className="text-small font-black text-heading mb-8 uppercase tracking-widest border-l-4 border-primary pl-3">Address Details</h3>
                        <div className="space-y-6">
                            <Input
                                label="Address Line 1"
                                type="text"
                                value={formData.addressLine1}
                                onChange={(e) => {
                                    setFormData({ ...formData, addressLine1: e.target.value });
                                    setErrors({ ...errors, addressLine1: '' });
                                }}
                                error={errors.addressLine1}
                                placeholder="Street address, P.O. box"
                                required
                                className="bg-gray-50 border-none rounded-md h-14"
                            />
                            <Input
                                label="Address Line 2 (Optional)"
                                type="text"
                                value={formData.addressLine2}
                                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                placeholder="Apartment, suite, unit, etc."
                                className="bg-gray-50 border-none rounded-md h-14"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                <Input
                                    label="City"
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => {
                                        setFormData({ ...formData, city: e.target.value });
                                        setErrors({ ...errors, city: '' });
                                    }}
                                    error={errors.city}
                                    required
                                    className="bg-gray-50 border-none rounded-md h-14"
                                />
                                <Input
                                    label="State / Province"
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => {
                                        setFormData({ ...formData, state: e.target.value });
                                        setErrors({ ...errors, state: '' });
                                    }}
                                    error={errors.state}
                                    required
                                    className="bg-gray-50 border-none rounded-md h-14"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                <Input
                                    label="ZIP / Postal Code"
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => {
                                        setFormData({ ...formData, zipCode: e.target.value });
                                        setErrors({ ...errors, zipCode: '' });
                                    }}
                                    error={errors.zipCode}
                                    required
                                    className="bg-gray-50 border-none rounded-md h-14"
                                />
                                <Input
                                    label="Country"
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => {
                                        setFormData({ ...formData, country: e.target.value });
                                        setErrors({ ...errors, country: '' });
                                    }}
                                    error={errors.country}
                                    required
                                    className="bg-gray-50 border-none rounded-md h-14"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-300">
                        <label className="flex items-center gap-5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                className="w-7 h-7 rounded-md border-gray-300 text-heading cursor-pointer bg-gray-50 transition-all focus:ring-0 focus:ring-offset-0 checked:bg-primary"
                            />
                            <div>
                                <span className="text-small font-black text-heading uppercase tracking-tight">Set as default address</span>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mt-0.5">Primary address for future orders</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 pt-4">
                        <Button type="submit" isLoading={isLoading} className="h-14 lg:px-12 rounded-md bg-primary text-on-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary-hover transition-all flex items-center justify-center gap-3">
                            <Save className="w-4 h-4" />
                            {addressId ? 'Update Address' : 'Save Address'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/account?section=addresses')} className="h-14 lg:px-12 rounded-md font-black uppercase tracking-widest text-[10px] bg-gray-50 border-none text-gray-500 hover:bg-gray-100">
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
