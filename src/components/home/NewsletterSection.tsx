'use client';

import { useState } from 'react';
import { Mail, Gift } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setTimeout(() => {
                setEmail('');
                setSubscribed(false);
            }, 3000);
        }
    };

    return (
        <section className="py-6 lg:py-16 px-4 lg:px-4 xl:px-4 container mx-auto">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-12">
                    {/* Left Content */}
                    <div className="text-white space-y-3 md:space-y-6">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="bg-white/10 backdrop-blur-sm p-1.5 md:p-3 rounded-full">
                                <Mail className="w-4 h-4 md:w-8 md:h-8" />
                            </div>
                            <h2 className="text-lg md:text-4xl font-black">
                                JOIN THE CLUB
                            </h2>
                        </div>
                        <p className="text-[10px] md:text-xl font-medium opacity-90 leading-tight">
                            Subscribe to our newsletter and get exclusive offers, early access to sales, and style tips!
                        </p>
                        <div className="flex items-start gap-2 md:gap-4">
                            <Gift className="w-4 h-4 md:w-6 md:h-6 mt-0.5 md:mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-[9px] md:text-lg mb-0.5">Get ₹500 OFF</h3>
                                <p className="text-[8px] md:text-base opacity-90">On your first purchase above ₹2,999</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="flex items-center">
                        <div className="w-full">
                            {subscribed ? (
                                <div className="bg-white rounded-xl p-4 md:p-8 text-center animate-scale-in">
                                    <div className="w-8 h-8 md:w-16 md:h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                                        <svg className="w-4 h-4 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm md:text-2xl font-bold text-gray-900 mb-1">
                                        You're In! 🎉
                                    </h3>
                                    <p className="text-[10px] md:text-base text-gray-600">
                                        Check your email for your exclusive discount code!
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="space-y-2 md:space-y-4">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-2 md:px-6 md:py-4 rounded-full text-gray-900 text-xs md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="lg"
                                        className="bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-full shadow-lg text-xs md:text-base h-10 md:h-auto"
                                    >
                                        Subscribe Now
                                    </Button>
                                    <p className="text-white/80 text-[7px] md:text-sm text-center">
                                        By subscribing, you agree to our Privacy Policy.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
