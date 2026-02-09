'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer for resend OTP
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (index === 5 && value) {
            const completeOtp = [...newOtp];
            completeOtp[5] = value;
            if (completeOtp.every(digit => digit !== '')) {
                handleVerify(completeOtp.join(''));
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        // Only accept 6 digits
        if (/^\d{6}$/.test(pastedData)) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            setError('');
            inputRefs.current[5]?.focus();

            // Auto-submit after paste
            setTimeout(() => {
                handleVerify(pastedData);
            }, 100);
        }
    };

    const handleVerify = async (otpCode: string) => {
        setIsLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            // Mock validation - in production, verify with backend
            if (otpCode === '123456') {
                router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${otpCode}`);
            } else {
                setError('Invalid verification code. Please try again.');
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        handleVerify(otpCode);
    };

    const handleResend = () => {
        if (!canResend) return;

        setCanResend(false);
        setResendTimer(60);
        setOtp(['', '', '', '', '', '']);
        setError('');
        inputRefs.current[0]?.focus();

        // Simulate resend API call
        setTimeout(() => {
            // Show success message or toast
            console.log('OTP resent successfully');
        }, 500);
    };

    const isComplete = otp.every(digit => digit !== '');

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-6 h-0.5 bg-black rounded-full" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Identity Verification</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Verify Your Email
                    </h1>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                        We've sent a 6-digit code to
                    </p>
                    <p className="text-base font-semibold text-black">
                        {email || 'your email'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-6 text-center">
                            Enter Verification Code
                        </label>
                        <div className="flex gap-2 sm:gap-3 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    disabled={isLoading}
                                    className={`
                                        w-12 h-14 sm:w-14 sm:h-16 
                                        text-center text-xl font-black
                                        bg-white
                                        border border-gray-300 rounded-md
                                        transition-all duration-300
                                        focus:outline-none
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        ${digit
                                            ? 'border-black bg-gray-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }
                                        ${error ? 'border-red-500 bg-red-50' : ''}
                                        focus:border-black focus:ring-0
                                    `}
                                />
                            ))}
                        </div>
                        {error && (
                            <p className="mt-4 text-sm font-medium text-red-500 text-center animate-fade-in">
                                {error}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        disabled={!isComplete || isLoading}
                        className="h-14 bg-black text-white rounded-md font-semibold text-base hover:bg-gray-900 transition-all shadow-none"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                    </Button>

                    <div className="text-center space-y-4">
                        <p className="text-sm font-medium text-gray-600">
                            Didn't receive the code?
                        </p>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={!canResend}
                            className={`
                                inline-flex items-center gap-2 text-sm font-semibold
                                transition-all duration-300
                                ${canResend
                                    ? 'text-black hover:underline cursor-pointer'
                                    : 'text-gray-400 cursor-not-allowed'
                                }
                            `}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${canResend ? 'hover:rotate-180 transition-transform duration-500' : ''}`} />
                            {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
                        </button>
                    </div>

                    <div className="text-center pt-4">
                        <Link
                            href="/forgot-password"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                    </div>
                </form>

                <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-600 text-center leading-relaxed">
                        <span className="text-black font-semibold">Security:</span> Never share this code with anyone. Our team will never ask for it.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--theme-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <VerifyOTPContent />
        </Suspense>
    );
}
