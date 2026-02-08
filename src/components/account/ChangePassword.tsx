'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function ChangePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: Record<string, string> = {};
        if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!formData.newPassword) newErrors.newPassword = 'New password is required';
        if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
        if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Password changed successfully!');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }, 1500);
    };

    return (
        <div className="animate-fade-in">
            <div className="hidden lg:block mb-8">
                <h1 className="text-section-title font-black text-gray-900 mb-2 uppercase tracking-tight">Change Password</h1>
                <p className="text-body text-gray-600">Update your password to keep your account secure</p>
            </div>

            <div className="lg:bg-white lg:border lg:border-gray-300 lg:rounded-md lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 lg:gap-8 max-w-2xl">
                        <div className="relative group">
                            <Input
                                label="Current Password"
                                type={showPasswords.current ? 'text' : 'password'}
                                value={formData.currentPassword}
                                onChange={(e) => {
                                    setFormData({ ...formData, currentPassword: e.target.value });
                                    setErrors({ ...errors, currentPassword: '' });
                                }}
                                error={errors.currentPassword}
                                required
                                className="h-14 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute right-4 top-[38px] text-gray-400 hover:text-black transition-colors"
                            >
                                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="relative group">
                            <Input
                                label="New Password"
                                type={showPasswords.new ? 'text' : 'password'}
                                value={formData.newPassword}
                                onChange={(e) => {
                                    setFormData({ ...formData, newPassword: e.target.value });
                                    setErrors({ ...errors, newPassword: '' });
                                }}
                                error={errors.newPassword}
                                required
                                className="h-14 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute right-4 top-[38px] text-gray-400 hover:text-black transition-colors"
                            >
                                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="relative group">
                            <Input
                                label="Confirm New Password"
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => {
                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                    setErrors({ ...errors, confirmPassword: '' });
                                }}
                                error={errors.confirmPassword}
                                required
                                className="h-14 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute right-4 top-[38px] text-gray-400 hover:text-black transition-colors"
                            >
                                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50/50 rounded-md p-6 lg:p-8 max-w-2xl border border-gray-300">
                        <h4 className="text-[10px] font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center text-white">
                                <Lock className="w-4 h-4" />
                            </div>
                            Password Requirements
                        </h4>
                        <ul className="space-y-4">
                            {[
                                'At least 8 characters long',
                                'Include uppercase and lowercase letters',
                                'Include at least one number'
                            ].map((req, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-small font-bold text-gray-500 uppercase tracking-tight">
                                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center border border-gray-300">
                                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                                    </div>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 pt-4 max-w-2xl">
                        <Button type="submit" isLoading={isLoading} className="h-14 lg:px-12 rounded-md bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all">
                            Update Password
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()} className="h-14 lg:px-12 rounded-md font-black uppercase tracking-widest text-[10px] border-gray-300 text-gray-500 hover:bg-black hover:text-white transition-all shadow-none">
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
