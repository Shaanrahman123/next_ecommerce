'use client';

import { useAuthStore } from '@/store';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function MyProfile() {
    const { user } = useAuthStore();

    const profileData = [
        { label: 'Full Name', value: user?.name || 'John Doe', icon: null },
        { label: 'Email Address', value: user?.email || 'john@example.com', icon: Mail },
        { label: 'Phone Number', value: '+1 (555) 123-4567', icon: Phone },
        { label: 'Date of Birth', value: 'January 15, 1990', icon: Calendar },
        { label: 'Location', value: 'New York, USA', icon: MapPin },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-page-title text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">View your personal information</p>
                </div>
                <Link
                    href="/account?section=edit-profile"
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-black to-gray-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-section-title font-bold text-gray-900 mb-1">{user?.name || 'User'}</h2>
                        <p className="text-gray-600">Member since {new Date(user?.createdAt || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {profileData.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.label} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                    {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                                    <span className="text-gray-600 font-medium">{item.label}</span>
                                </div>
                                <span className="text-gray-900 font-semibold">{item.value}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
