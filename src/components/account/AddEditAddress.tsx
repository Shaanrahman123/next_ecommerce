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
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-black rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {addressId ? 'Edit Address' : 'Add New Address'}
                    </h1>
                    <p className="text-gray-600">Enter your delivery address details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Address Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                        Address Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        {['Home', 'Work', 'Other'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => {
                                    setFormData({ ...formData, type });
                                    setErrors({ ...errors, type: '' });
                                }}
                                className={`flex-1 px-6 py-3 rounded-lg border-2 font-medium transition-all duration-300 ${formData.type === type
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                </div>

                {/* Contact Information */}
                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Full Name"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => {
                                setFormData({ ...formData, fullName: e.target.value });
                                setErrors({ ...errors, fullName: '' });
                            }}
                            error={errors.fullName}
                            placeholder="John Doe"
                            required
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
                            placeholder="+1 (555) 123-4567"
                            required
                        />
                    </div>
                </div>

                {/* Address Details */}
                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h3>
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
                            placeholder="Street address, P.O. box, company name"
                            required
                        />
                        <Input
                            label="Address Line 2"
                            type="text"
                            value={formData.addressLine2}
                            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                            placeholder="Apartment, suite, unit, building, floor, etc. (optional)"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            />
                        </div>
                    </div>
                </div>

                {/* Default Address */}
                <div className="pt-4 border-t border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isDefault}
                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black focus:ring-offset-0"
                        />
                        <div>
                            <span className="font-medium text-gray-900">Set as default address</span>
                            <p className="text-sm text-gray-600">This address will be used by default for future orders</p>
                        </div>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <Button type="submit" isLoading={isLoading} className="flex flex-row items-center">
                        <Save className="w-4 h-4 mr-2" />
                        {addressId ? 'Update Address' : 'Save Address'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
