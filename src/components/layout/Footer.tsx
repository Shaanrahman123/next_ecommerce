'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Award, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { IndianPatternOverlay } from '@/components/home/indian/IndianDecor';

const features = [
  { id: 1, icon: Award, title: 'Best Quality', description: 'Premium products' },
  { id: 2, icon: ShieldCheck, title: 'Secure Payment', description: '100% secure' },
  { id: 3, icon: Truck, title: 'Free Shipping', description: 'Above ₹999' },
  { id: 4, icon: CreditCard, title: 'Easy Returns', description: '7-day returns' },
];

export default function Footer() {
  const pathname = usePathname();

  const hideTotallyPaths = [
    '/order-success',
    '/orders',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
  ];

  const hideOnMobilePaths = ['/checkout', '/products'];

  const isHiddenTotally = hideTotallyPaths.some((path) => pathname.startsWith(path));
  const isHiddenOnMobile = hideOnMobilePaths.some((path) => pathname.startsWith(path));

  if (isHiddenTotally) return null;

  return (
    <footer
      className={`relative overflow-hidden bg-linear-to-r from-[#1a1209] via-heading to-[#1a1209] text-white ${
        isHiddenOnMobile ? 'hidden lg:block' : ''
      }`}
    >
      <IndianPatternOverlay pattern="bandhani" className="text-amber-200" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />

      <div className="relative z-[1]">
        {/* Trust badges — merged with footer, no gap */}
        <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-12 border-b border-amber-500/15">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.id} className="flex flex-col items-center text-center">
                  <div className="mb-2 p-2.5 rounded-full border border-amber-500/30 bg-amber-500/10">
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-amber-200" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[11px] lg:text-xs font-bold uppercase tracking-wide mb-0.5 text-amber-50">
                    {feature.title}
                  </h3>
                  <p className="text-[10px] lg:text-xs text-amber-100/50 hidden sm:block">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main footer links */}
        <div className="container mx-auto px-4 lg:px-8 xl:px-16 py-12 lg:py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-5">
              <BrandLogo />
              <p className="text-sm text-amber-100/60 leading-relaxed">
                Premium fashion for the modern individual. Crafted with purpose, worn with confidence.
              </p>
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
                  { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
                  { Icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 transition-colors duration-300"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4 text-amber-100" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-5 text-amber-50 uppercase tracking-widest text-sm">Shop</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'All Products', href: '/products' },
                  { label: 'Men', href: '/products?gender=men' },
                  { label: 'Women', href: '/products?gender=women' },
                  { label: 'Accessories', href: '/products?category=accessories' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-amber-100/55 hover:text-amber-50 transition-colors duration-300">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-5 text-amber-50 uppercase tracking-widest text-sm">Customer Service</h4>
              <ul className="space-y-3 text-sm">
                {[
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Shipping Info', href: '/shipping' },
                  { label: 'Returns', href: '/returns' },
                  { label: 'FAQ', href: '/faq' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-amber-100/55 hover:text-amber-50 transition-colors duration-300">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-5 text-amber-50 uppercase tracking-widest text-sm">Newsletter</h4>
              <p className="text-sm text-amber-100/55 mb-4 leading-relaxed">
                Subscribe to get special offers and updates.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 bg-amber-500/10 border border-amber-500/25 border-r-0 text-amber-50 placeholder-amber-100/35 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-amber-400/40 text-sm"
                />
                <button className="px-4 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/25 rounded-r-lg transition-colors duration-300">
                  <Mail className="w-5 h-5 text-amber-100" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-amber-500/15 text-center text-sm text-amber-100/50">
            <p>&copy; {new Date().getFullYear()} BLAK BLAZE. All rights reserved.</p>
            <div className="mt-3 flex justify-center gap-6">
              <Link href="/privacy" className="hover:text-amber-50 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-amber-50 transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
