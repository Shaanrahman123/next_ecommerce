'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useAddressStore } from '@/store';
import { userService, getAuthErrorMessage } from '@/services/user.service';
import { mapProfileAddresses } from '@/utils/user';
import { useSyncUserProfile } from '@/hooks/useSyncUserProfile';

export default function MyAddresses() {
    const { addresses, setAddresses } = useAddressStore();
    const { syncProfile } = useSyncUserProfile();
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            await syncProfile();
            setIsLoading(false);
        }
        load();
    }, [syncProfile]);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        setError('');
        try {
            const data = await userService.deleteAddress(id);
            if (data.user) {
                setAddresses(mapProfileAddresses(data.user));
            }
        } catch (err) {
            setError(getAuthErrorMessage(err, 'Failed to delete address'));
        } finally {
            setDeletingId(null);
        }
    };

    const handleSetDefault = async (id: string) => {
        setError('');
        try {
            const data = await userService.updateAddress(id, { isDefault: true });
            if (data.user) {
                setAddresses(mapProfileAddresses(data.user));
            }
        } catch (err) {
            setError(getAuthErrorMessage(err, 'Failed to set default address'));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in text-full">
            <div className="hidden lg:flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-section-title font-black text-heading mb-2 uppercase tracking-tight">My Addresses</h1>
                    <p className="text-body text-gray-600">Manage your delivery addresses</p>
                </div>
                {addresses.length > 0 && (
                    <Link href="/account?section=add-address">
                        <Button className="flex items-center gap-3 px-8 h-14 bg-primary text-on-primary rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-primary-hover transition-all">
                            <Plus className="w-4 h-4" />
                            Add New Address
                        </Button>
                    </Link>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

            {addresses.length === 0 ? (
                <div className="text-center py-20 lg:py-24 bg-gray-50 rounded-md border border-dashed border-gray-300">
                    <div className="w-20 h-20 bg-white rounded-md flex items-center justify-center mx-auto mb-6 border border-gray-200">
                        <MapPin className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-body font-black text-heading mb-2 uppercase tracking-tight">No saved addresses</h3>
                    <p className="text-small text-gray-500 mb-8 max-w-sm mx-auto">
                        Add a delivery address to speed up checkout and manage your orders.
                    </p>
                    <Link href="/account?section=add-address">
                        <Button className="inline-flex items-center gap-3 px-8 h-14 bg-primary text-on-primary rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-primary-hover transition-all">
                            <Plus className="w-4 h-4" />
                            Add Your First Address
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`bg-white border rounded-lg p-6 lg:p-8 transition-all duration-500 relative group overflow-hidden ${
                                address.isDefault ? 'border-primary' : 'border-gray-300'
                            }`}
                        >
                            {address.isDefault && (
                                <span className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-on-primary text-[9px] font-black uppercase tracking-widest rounded-bl-2xl">
                                    Default
                                </span>
                            )}
                            <div className="flex items-start gap-4 lg:gap-6 mb-8">
                                <div className="p-4 bg-gray-50 rounded-md group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <MapPin className="w-6 h-6 lg:w-7 lg:h-7" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-body font-black text-heading uppercase tracking-tight mb-1">{address.type}</h3>
                                    <p className="text-small font-black text-heading uppercase tracking-tighter mb-4">{address.fullName}</p>
                                    <div className="space-y-1 text-gray-500 font-bold text-[11px] uppercase tracking-tight">
                                        <p className="leading-relaxed">{address.addressLine1}</p>
                                        {address.addressLine2 && <p className="leading-relaxed">{address.addressLine2}</p>}
                                        <p className="leading-relaxed">{address.city}, {address.state} {address.zipCode}</p>
                                        <p className="leading-relaxed">{address.country}</p>
                                        {address.phone && (
                                            <p className="text-heading mt-3 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                {address.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 pt-6 border-t border-gray-300">
                                {!address.isDefault && (
                                    <Button
                                        variant="secondary"
                                        fullWidth
                                        onClick={() => handleSetDefault(address.id)}
                                        className="h-10 rounded-md font-black uppercase tracking-widest text-[9px] bg-gray-50 border-none text-gray-900 hover:bg-primary hover:text-on-primary transition-all"
                                    >
                                        Set as Default
                                    </Button>
                                )}
                                <div className="flex gap-4">
                                    <Link href={`/account?section=edit-address&addressId=${address.id}`} className="flex-1">
                                        <Button variant="secondary" fullWidth className="h-12 rounded-md flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[9px] bg-gray-50 border-none text-gray-900 hover:bg-primary hover:text-on-primary transition-all">
                                            <Edit className="w-3.5 h-3.5" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="secondary"
                                        fullWidth
                                        onClick={() => handleDelete(address.id)}
                                        isLoading={deletingId === address.id}
                                        className="flex-1 h-12 rounded-md flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[9px] bg-red-50/50 border-none text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {addresses.length > 0 && (
                <div className="mt-10 lg:hidden">
                    <Link href="/account?section=add-address">
                        <Button className="w-full h-16 bg-primary text-on-primary rounded-md font-black uppercase tracking-widest text-xs hover:bg-primary-hover transition-all flex items-center justify-center gap-3">
                            <Plus className="w-5 h-5" />
                            Add New Address
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
