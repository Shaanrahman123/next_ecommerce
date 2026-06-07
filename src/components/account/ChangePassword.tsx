'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PasswordField } from '@/components/auth';
import { AuthErrorAlert } from '@/components/auth';
import { userService, getAuthErrorMessage } from '@/services/user.service';
import { validatePassword, validateConfirmPassword } from '@/utils/validation';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');
        setSuccess('');

        const newErrors: Record<string, string> = {};
        if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) newErrors.newPassword = passwordError;
        const confirmError = validateConfirmPassword(formData.newPassword, formData.confirmPassword);
        if (confirmError) newErrors.confirmPassword = confirmError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        try {
            await userService.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setSuccess('Password changed successfully');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setErrors({});
        } catch (err) {
            setApiError(getAuthErrorMessage(err, 'Failed to change password'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="hidden lg:block mb-8">
                <h1 className="text-section-title font-black text-heading mb-2 uppercase tracking-tight">Change Password</h1>
                <p className="text-body text-gray-600">Update your password to keep your account secure</p>
            </div>

            <div className="lg:bg-white lg:border lg:border-gray-300 lg:rounded-md lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <AuthErrorAlert message={apiError} />
                    {success && (
                        <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md animate-fade-in">
                            {success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:gap-8 max-w-2xl">
                        <div className="relative">
                            <Input
                                label="Current Password"
                                type={showCurrent ? 'text' : 'password'}
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
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-[38px] text-gray-400 hover:text-heading transition-colors"
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <PasswordField
                            label="New Password"
                            value={formData.newPassword}
                            onChange={(value) => {
                                setFormData({ ...formData, newPassword: value });
                                setErrors({ ...errors, newPassword: '' });
                            }}
                            error={errors.newPassword}
                            required
                        />

                        <PasswordField
                            label="Confirm New Password"
                            value={formData.confirmPassword}
                            onChange={(value) => {
                                setFormData({ ...formData, confirmPassword: value });
                                setErrors({ ...errors, confirmPassword: '' });
                            }}
                            error={errors.confirmPassword}
                            required
                        />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 pt-4 max-w-2xl">
                        <Button type="submit" isLoading={isLoading} className="h-14 lg:px-12 rounded-md bg-primary text-on-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary-hover transition-all">
                            Update Password
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()} className="h-14 lg:px-12 rounded-md font-black uppercase tracking-widest text-[10px] border-gray-300 text-gray-500 hover:bg-primary hover:text-on-primary transition-all shadow-none">
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
