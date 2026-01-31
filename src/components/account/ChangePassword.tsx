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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h1>
                <p className="text-gray-600">Update your password to keep your account secure</p>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
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
                            className="pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="relative">
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
                            className="pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="relative">
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
                            className="pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600"
                        >
                            {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Password Requirements
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                At least 8 characters long
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                Include uppercase and lowercase letters
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                Include at least one number
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Button type="submit" isLoading={isLoading}>
                            Update Password
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
