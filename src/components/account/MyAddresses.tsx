'use client';

import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function MyAddresses() {
    const addresses = [
        {
            id: '1',
            type: 'Home',
            name: 'John Doe',
            address: '123 Main Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            phone: '+1 (555) 123-4567',
            isDefault: true,
        },
        {
            id: '2',
            type: 'Work',
            name: 'John Doe',
            address: '456 Office Plaza, Suite 200',
            city: 'New York',
            state: 'NY',
            zip: '10002',
            phone: '+1 (555) 987-6543',
            isDefault: false,
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-page-title text-gray-900 mb-2">My Addresses</h1>
                    <p className="text-gray-600">Manage your delivery addresses</p>
                </div>
                <Link
                    href="/account?section=add-address"
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add New Address
                </Link>
            </div>

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
                                <p className="text-gray-900 font-medium">{address.name}</p>
                                <p className="text-gray-600 text-sm mt-2">{address.address}</p>
                                <p className="text-gray-600 text-sm">
                                    {address.city}, {address.state} {address.zip}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">{address.phone}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <Link
                                href={`/account?section=edit-address&addressId=${address.id}`}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium flex-1 justify-center"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </Link>
                            <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm font-medium flex-1 justify-center">
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
