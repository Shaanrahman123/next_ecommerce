'use client';

import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

import { useAddressStore } from '@/store';

export default function MyAddresses() {
    const { addresses, deleteAddress } = useAddressStore();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-page-title text-gray-900 mb-2">My Addresses</h1>
                    <p className="text-gray-600">Manage your delivery addresses</p>
                </div>
                <Link href="/account?section=add-address">
                    <Button size="md" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Address
                    </Button>
                </Link>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No saved addresses found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative"
                        >
                            {address.isDefault && (
                                <span className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    Default
                                </span>
                            )}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <MapPin className="w-6 h-6 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{address.type}</h3>
                                    <p className="text-gray-900 font-medium">{address.fullName}</p>
                                    <p className="text-gray-600 text-sm mt-2">{address.addressLine1}</p>
                                    {address.addressLine2 && (
                                        <p className="text-gray-600 text-sm">{address.addressLine2}</p>
                                    )}
                                    <p className="text-gray-600 text-sm">
                                        {address.city}, {address.state} {address.zipCode}
                                    </p>
                                    <p className="text-gray-600 text-sm mt-1">{address.phone}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <Link href={`/account?section=edit-address&addressId=${address.id}`} className="flex-1">
                                    <Button variant="secondary" size="sm" fullWidth className="flex items-center justify-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    fullWidth
                                    onClick={() => deleteAddress(address.id)}
                                    className="flex-1 flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
