'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AuthErrorAlert } from '@/components/auth';
import { userService, getAuthErrorMessage } from '@/services/user.service';
import { mapProfileToStoreUser } from '@/utils/user';
import { splitFullName } from '@/utils/validation';
import { useSyncUserProfile } from '@/hooks/useSyncUserProfile';

export default function MyProfile() {
    const { user, setUser } = useAuthStore();
    const { syncProfile } = useSyncUserProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({ firstName: '', lastName: '' });

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            await syncProfile();
            setIsLoading(false);
        }
        load();
    }, [syncProfile]);

    useEffect(() => {
        if (user?.name) {
            const { firstName, lastName } = splitFullName(user.name);
            setFormData({ firstName, lastName });
        }
    }, [user?.name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError('First name and last name are required');
            return;
        }

        setIsSaving(true);
        try {
            const data = await userService.updateProfile({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
            });
            if (data.user) {
                setUser(mapProfileToStoreUser(data.user));
            }
            setSuccess('Profile updated successfully');
        } catch (err) {
            setError(getAuthErrorMessage(err, 'Failed to update profile'));
        } finally {
            setIsSaving(false);
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
        <div className="animate-fade-in">
            <div className="hidden lg:block mb-8">
                <h1 className="text-section-title font-black text-heading mb-2 uppercase tracking-tight">Update Profile</h1>
                <p className="text-body text-gray-600">Manage your account information</p>
            </div>

            <form onSubmit={handleSubmit} className="lg:bg-white lg:border lg:border-gray-300 lg:rounded-md lg:p-8 space-y-8">
                <div className="flex flex-col items-center lg:flex-row lg:items-center gap-6 pb-8 border-b border-gray-300">
                    <div className="w-28 h-28 rounded-md bg-linear-to-br from-primary to-gray-800 flex items-center justify-center text-white text-4xl font-black">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-center lg:text-left">
                        <h2 className="text-section-title font-black text-heading mb-1 uppercase tracking-tight">{user?.name || 'User'}</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Member since {new Date(user?.createdAt || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <AuthErrorAlert message={error} />
                {success && (
                    <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md animate-fade-in">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <Input
                        label="First Name"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="h-14"
                    />
                    <Input
                        label="Last Name"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="h-14"
                    />
                    <div className="md:col-span-2">
                        <Input
                            label="Email Address"
                            type="email"
                            value={user?.email || ''}
                            disabled
                            helperText="Email cannot be changed"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    isLoading={isSaving}
                    className="h-14 lg:px-12 rounded-md bg-primary text-on-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary-hover transition-all"
                >
                    Update Profile
                </Button>
            </form>
        </div>
    );
}
