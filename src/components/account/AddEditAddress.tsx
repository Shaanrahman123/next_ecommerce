'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Save, MapPin } from 'lucide-react';

interface AddEditAddressProps {
    addressId: string | null;
}

export default function AddEditAddress({ addressId }: AddEditAddressProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: addressId ? 'Home' : '',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        isDefault: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.type) newErrors.type = 'Address type is required';
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
        if (!formData.country) newErrors.country = 'Country is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert(`Address ${addressId ? 'updated' : 'added'} successfully!`);
            window.history.back();
        }, 1500);
    };

    return (
        <div className="animate-fade-in">
            <div className="hidden lg:flex items-center gap-5 mb-10">
                <div className="w-16 h-16 bg-black rounded-md flex items-center justify-center text-white">
                    <MapPin className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-section-title font-black text-gray-900 uppercase tracking-tight">
                        {addressId ? 'Edit Address' : 'Add New Address'}
                    </h1>
                    <p className="text-body text-gray-600">Enter your delivery address details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="lg:bg-white lg:border lg:border-gray-300 lg:rounded-md lg:p-8">
                <div className="space-y-10">
                    {/* Address Type */}
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
                                    className={`flex-1 px-4 py-4 rounded-md font-black uppercase tracking-widest text-[10px] border transition-all duration-300 ${formData.type === type
                                        ? 'bg-black text-white border-black'
                                        : 'bg-gray-50 text-gray-500 border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        {errors.type && <p className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.type}</p>}
                    </div>

                    {/* Contact Information */}
                    <div className="pt-4 border-t border-gray-300">
                        <h3 className="text-small font-black text-gray-900 mb-8 uppercase tracking-widest border-l-4 border-black pl-3">Contact Information</h3>
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
                                label="Phone Number"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => {
                                    setFormData({ ...formData, phone: e.target.value });
                                    setErrors({ ...errors, phone: '' });
                                }}
                                error={errors.phone}
                                placeholder="e.g. +1 (555) 123-4567"
                                required
                                className="bg-gray-50 border-none rounded-md h-14"
                            />
                        </div>
                    </div>

                    {/* Address Details */}
                    <div className="pt-4 border-t border-gray-300">
                        <h3 className="text-small font-black text-gray-900 mb-8 uppercase tracking-widest border-l-4 border-black pl-3">Address Details</h3>
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
                                    placeholder="New York"
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
                                    placeholder="NY"
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
                                    placeholder="10001"
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
                                    placeholder="USA"
                                    required
                                    className="bg-gray-50 border-none rounded-md h-14"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Default Address */}
                    <div className="pt-8 border-t border-gray-300">
                        <label className="flex items-center gap-5 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                    className="w-7 h-7 rounded-md border-gray-300 text-black cursor-pointer bg-gray-50 transition-all focus:ring-0 focus:ring-offset-0 checked:bg-black"
                                />
                            </div>
                            <div>
                                <span className="text-small font-black text-gray-900 uppercase tracking-tight">Set as default address</span>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mt-0.5">Primary address for future orders</p>
                            </div>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col lg:flex-row gap-4 pt-4">
                        <Button type="submit" isLoading={isLoading} className="h-14 lg:px-12 rounded-md bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all flex items-center justify-center gap-3">
                            <Save className="w-4 h-4" />
                            {addressId ? 'Update Address' : 'Save Address'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => window.history.back()} className="h-14 lg:px-12 rounded-md font-black uppercase tracking-widest text-[10px] bg-gray-50 border-none text-gray-500 hover:bg-gray-100">
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
