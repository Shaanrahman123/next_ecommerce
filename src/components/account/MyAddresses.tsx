'use client';

import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

import { useAddressStore } from '@/store';

export default function MyAddresses() {
    const { addresses, deleteAddress } = useAddressStore();

    return (
        <div className="animate-fade-in text-full">
            <div className="hidden lg:flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-section-title font-black text-gray-900 mb-2 uppercase tracking-tight">My Addresses</h1>
                    <p className="text-body text-gray-600">Manage your delivery addresses</p>
                </div>
                <Link href="/account?section=add-address">
                    <Button className="flex items-center gap-3 px-8 h-14 bg-black text-white rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all">
                        <Plus className="w-4 h-4" />
                        Add New Address
                    </Button>
                </Link>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded-md border border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center mx-auto mb-6">
                        <MapPin className="w-10 h-10 text-gray-200" />
                    </div>
                    <p className="text-small font-black text-gray-400 uppercase tracking-widest">No saved addresses found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className="bg-white border border-gray-300 rounded-lg p-6 lg:p-8 transition-all duration-500 relative group overflow-hidden"
                        >
                            {address.isDefault && (
                                <span className="absolute top-0 right-0 px-4 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl">
                                    Default
                                </span>
                            )}
                            <div className="flex items-start gap-4 lg:gap-6 mb-8">
                                <div className="p-4 bg-gray-50 rounded-md group-hover:bg-black group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <MapPin className="w-6 h-6 lg:w-7 lg:h-7" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-body font-black text-gray-900 uppercase tracking-tight mb-1">{address.type}</h3>
                                    <p className="text-small font-black text-gray-900 uppercase tracking-tighter mb-4">{address.fullName}</p>
                                    <div className="space-y-1 text-gray-500 font-bold text-[11px] uppercase tracking-tight">
                                        <p className="leading-relaxed">{address.addressLine1}</p>
                                        {address.addressLine2 && (
                                            <p className="leading-relaxed">{address.addressLine2}</p>
                                        )}
                                        <p className="leading-relaxed">
                                            {address.city}, {address.state} {address.zipCode}
                                        </p>
                                        <p className="text-black mt-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-black rounded-full" />
                                            {address.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6 border-t border-gray-300">
                                <Link href={`/account?section=edit-address&addressId=${address.id}`} className="flex-1">
                                    <Button variant="secondary" fullWidth className="h-12 rounded-md flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[9px] bg-gray-50 border-none text-gray-900 hover:bg-black hover:text-white transition-all">
                                        <Edit className="w-3.5 h-3.5" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => deleteAddress(address.id)}
                                    className="flex-1 h-12 rounded-md flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[9px] bg-red-50/50 border-none text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-10 lg:hidden">
                <Link href="/account?section=add-address">
                    <Button className="w-full h-16 bg-black text-white rounded-md font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all flex items-center justify-center gap-3">
                        <Plus className="w-5 h-5" />
                        Add New Address
                    </Button>
                </Link>
            </div>
        </div>
    );
}
