'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function EditProfile() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-01-15',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Profile updated successfully!');
        }, 1500);
    };

    return (
        <div className="animate-fade-in">
            <div className="hidden lg:block mb-8">
                <h1 className="text-section-title font-black text-gray-900 mb-2 uppercase tracking-tight">Edit Profile</h1>
                <p className="text-body text-gray-600">Update your personal information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="lg:bg-white lg:border lg:border-gray-300 lg:rounded-md lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <Input
                            label="Full Name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-gray-50 border-none rounded-md h-14"
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-gray-50 border-none rounded-md h-14"
                        />
                        <Input
                            label="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-gray-50 border-none rounded-md h-14"
                        />
                        <Input
                            label="Date of Birth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="bg-gray-50 border-none rounded-md h-14 text-sm"
                        />
                    </div>

                    <div className="mt-12 pt-10 border-t border-gray-300">
                        <h3 className="text-small font-black text-gray-900 mb-8 uppercase tracking-widest border-l-4 border-black pl-3">Address Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            <div className="md:col-span-2">
                                <Input
                                    label="Street Address"
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="bg-gray-50 border-none rounded-md h-14"
                                />
                            </div>
                            <Input
                                label="City"
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="bg-gray-50 border-none rounded-md h-14"
                            />
                            <Input
                                label="State/Province"
                                type="text"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="bg-gray-50 border-none rounded-md h-14"
                            />
                            <Input
                                label="ZIP/Postal Code"
                                type="text"
                                value={formData.zipCode}
                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                className="bg-gray-50 border-none rounded-md h-14"
                            />
                            <Input
                                label="Country"
                                type="text"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="bg-gray-50 border-none rounded-md h-14"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 pt-12">
                        <Button type="submit" isLoading={isLoading} className="h-14 lg:px-12 rounded-md bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all flex items-center justify-center gap-3">
                            <Save className="w-4 h-4" />
                            Save Changes
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
