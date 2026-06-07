'use client';

import { useState } from 'react';
import { Mail, Gift, Sparkles, ArrowRight } from 'lucide-react';
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
            }, 4000);
        }
    };

    return (
        <section className="py-8 lg:py-20 px-4 lg:px-4 xl:px-4 container mx-auto">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-[var(--theme-primary)] shadow-2xl">
                {/* Decorative background */}
                <div className="absolute inset-0 opacity-[0.07]">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 md:p-10 lg:p-14">
                    {/* Left Content */}
                    <div className="text-white space-y-5 lg:space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-widest">
                            <Sparkles className="w-3.5 h-3.5" />
                            Exclusive Access
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                                Join the Club
                            </h2>
                        </div>

                        <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-md">
                            Subscribe to our newsletter for exclusive offers, early access to sales, and curated style tips delivered to your inbox.
                        </p>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm max-w-sm">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/15 shrink-0">
                                <Gift className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white mb-0.5">Get ₹500 OFF</h3>
                                <p className="text-sm text-white/70">On your first purchase above ₹2,999</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="flex items-center">
                        <div className="w-full">
                            {subscribed ? (
                                <div className="bg-white rounded-2xl p-8 md:p-10 text-center animate-scale-in shadow-xl">
                                    <div className="w-16 h-16 bg-[var(--theme-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--theme-heading)] mb-2">You&apos;re In!</h3>
                                    <p className="text-sm text-gray-600">
                                        Check your email for your exclusive discount code.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="space-y-4">
                                    <div>
                                        <label htmlFor="newsletter-email" className="block text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            id="newsletter-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/25 text-white placeholder-white/40 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all backdrop-blur-sm"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        size="lg"
                                        className="group bg-white text-[var(--theme-primary)] hover:bg-white/90 font-bold rounded-xl shadow-lg text-sm md:text-base h-12 md:h-14 border-0"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            Subscribe Now
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                    <p className="text-white/50 text-xs text-center leading-relaxed">
                                        By subscribing, you agree to our{' '}
                                        <a href="/privacy" className="underline hover:text-white/80">Privacy Policy</a>.
                                        Unsubscribe anytime.
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
