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
        <div className="animate-fade-in">
            <div className="hidden lg:flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-section-title font-black text-gray-900 mb-2 uppercase tracking-tight">My Profile</h1>
                    <p className="text-body text-gray-600">View your personal information</p>
                </div>
                <Link
                    href="/account?section=edit-profile"
                    className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-300 font-black uppercase tracking-widest text-[10px]"
                >
                    Edit Profile
                </Link>
            </div>

            <div className="lg:bg-white lg:border lg:border-gray-300 lg:rounded-md lg:p-8">
                <div className="flex flex-col items-center lg:flex-row lg:items-center gap-6 mb-8 lg:pb-8 lg:border-b lg:border-gray-300">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-md bg-linear-to-br from-black to-gray-800 flex items-center justify-center text-white text-4xl font-black transition-transform duration-500 group-hover:rotate-3">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-md border border-gray-300 lg:hidden">
                            <Link href="/account?section=edit-profile">
                                <Mail className="w-4 h-4 text-black" />
                            </Link>
                        </div>
                    </div>
                    <div className="text-center lg:text-left">
                        <h2 className="text-section-title font-black text-gray-900 mb-1 uppercase tracking-tight">{user?.name || 'User'}</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">Member since {new Date(user?.createdAt || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>

                <div className="divide-y divide-gray-300 border-t border-b border-gray-300 lg:border-none lg:divide-y lg:divide-gray-300">
                    {profileData.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.label} className="flex flex-col py-5 lg:py-6 lg:flex-row lg:items-center lg:justify-between lg:border-b lg:border-gray-300 last:border-0 group">
                                <div className="flex items-center gap-3 mb-2 lg:mb-0">
                                    <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                        {Icon ? <Icon className="w-4 h-4" /> : <Mail className="w-4 h-4 outline-hidden" />}
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                                </div>
                                <span className="text-body font-black text-gray-900 lg:text-right uppercase tracking-tight ml-11 lg:ml-0">{item.value}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 lg:hidden">
                    <Link href="/account?section=edit-profile">
                        <button className="w-full py-5 bg-black text-white rounded-md font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-colors">
                            Edit Profile
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
