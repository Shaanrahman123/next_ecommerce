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
        <section className="py-16 px-8 lg:px-16 xl:px-24 container mx-auto">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-12">
                    {/* Left Content */}
                    <div className="text-white space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-black">
                                JOIN THE CLUB
                            </h2>
                        </div>
                        <p className="text-xl font-medium opacity-90">
                            Subscribe to our newsletter and get exclusive offers, early access to sales, and style tips!
                        </p>
                        <div className="flex items-start gap-4">
                            <Gift className="w-6 h-6 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg mb-1">Get ₹500 OFF</h3>
                                <p className="opacity-90">On your first purchase above ₹2,999</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="flex items-center">
                        <div className="w-full">
                            {subscribed ? (
                                <div className="bg-white rounded-2xl p-8 text-center animate-scale-in">
                                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        You're In! 🎉
                                    </h3>
                                    <p className="text-gray-600">
                                        Check your email for your exclusive discount code!
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="w-full px-6 py-4 rounded-full text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="lg"
                                        className="bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-full shadow-lg"
                                    >
                                        Subscribe Now
                                    </Button>
                                    <p className="text-white/80 text-sm text-center">
                                        By subscribing, you agree to our Privacy Policy and consent to receive updates.
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
