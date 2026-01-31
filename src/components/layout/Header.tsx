'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Heart, User, Menu, X, Search, ChevronDown, LayoutDashboard, UserCircle, Lock, Package, MapPin, Star, Wallet, Headphones, Bell, LogOut } from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore } from '@/store';
import { useRouter } from 'next/navigation';
import MegaMenu from './MegaMenu';
import { mainNavigation, megaMenuImages } from '@/data/categories';
import MobileSidebar from './MobileSidebar';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();
    const { getItemCount } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();
    const router = useRouter();

    const cartItemCount = getItemCount();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // Close dropdown when clicking outside
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuOpen]);

    return (
        <header className="sticky top-9 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-8 lg:px-16 xl:px-24">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="text-2xl font-bold text-black tracking-tight transition-transform duration-300 group-hover:scale-105">
                            MINIMAL
                        </div>
                    </Link>

                    {/* Desktop Navigation with Mega Menus */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {mainNavigation.map((category) => (
                            <div key={category.id} className="relative group">
                                <Link
                                    href={category.basePath}
                                    className="text-sm font-semibold text-gray-900 hover:text-black transition-colors duration-300 py-6 inline-block uppercase tracking-wide"
                                >
                                    {category.label}
                                </Link>
                                <MegaMenu
                                    items={category.items}
                                    image={megaMenuImages[category.id as keyof typeof megaMenuImages]}
                                    type={category.label}
                                />
                            </div>
                        ))}
                    </nav>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-6">
                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="text-gray-700 hover:text-black transition-all duration-300 hover:scale-110"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="relative text-gray-700 hover:text-black transition-all duration-300 hover:scale-110"
                            aria-label="Wishlist"
                        >
                            <Heart className="w-5 h-5" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative text-gray-700 hover:text-black transition-all duration-300 hover:scale-110"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* User Account */}
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 text-gray-700 hover:text-black transition-all duration-300 group"
                                    aria-label="User Account"
                                >
                                    {/* User Avatar with First Letter */}
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-black to-gray-700 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-all duration-300">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    {/* Rotating Chevron - Hidden on Mobile since it opens a drawer */}
                                    <ChevronDown
                                        className={`hidden lg:block w-4 h-4 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Desktop Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="hidden lg:block absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl animate-scale-in z-50">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {user?.name || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email || ''}
                                            </p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <Link
                                                href="/account"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/account?section=profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <UserCircle className="w-4 h-4" />
                                                My Profile
                                            </Link>
                                            <Link
                                                href="/account?section=password"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <Lock className="w-4 h-4" />
                                                Change Password
                                            </Link>
                                            <Link
                                                href="/account?section=orders"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <Package className="w-4 h-4" />
                                                My Orders
                                            </Link>
                                            <Link
                                                href="/account?section=addresses"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <MapPin className="w-4 h-4" />
                                                My Addresses
                                            </Link>
                                            <Link
                                                href="/wishlist"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <Heart className="w-4 h-4" />
                                                My Wishlist
                                            </Link>
                                            <Link
                                                href="/account?section=reviews"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <Star className="w-4 h-4" />
                                                My Reviews
                                            </Link>
                                            {/* Wallet removed */}
                                            <Link
                                                href="/account?section=support"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <Headphones className="w-4 h-4" />
                                                Support
                                            </Link>
                                            <Link
                                                href="/account?section=notifications"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <Bell className="w-4 h-4" />
                                                Notifications
                                            </Link>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-gray-100 py-2">
                                            <button
                                                onClick={() => {
                                                    setUserMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Mobile Drawer */}
                                {userMenuOpen && (
                                    <>
                                        {/* Overlay - black-40 */}
                                        <div
                                            className="fixed inset-0 bg-black/40 z-[60] lg:hidden animate-fade-in"
                                            onClick={() => setUserMenuOpen(false)}
                                        />

                                        {/* Drawer - Left to Right, 80% width */}
                                        <div className="fixed inset-y-0 left-0 z-[70] w-[80%] bg-white shadow-2xl transform transition-transform duration-300 animate-slide-right lg:hidden flex flex-col">
                                            {/* User Info Header */}
                                            <div className="p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-black to-gray-700 flex items-center justify-center text-white font-semibold text-xl shadow-md">
                                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-semibold text-gray-900 truncate max-w-[150px]">
                                                            {user?.name || 'User'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                                            {user?.email || ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                                                <Link
                                                    href="/account"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-body text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <LayoutDashboard className="w-5 h-5" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href="/account?section=profile"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-body text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <UserCircle className="w-5 h-5" />
                                                    My Profile
                                                </Link>
                                                <Link
                                                    href="/account?section=password"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-body text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Lock className="w-5 h-5" />
                                                    Change Password
                                                </Link>
                                                <Link
                                                    href="/account?section=orders"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-body text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Package className="w-5 h-5" />
                                                    My Orders
                                                </Link>
                                                <Link
                                                    href="/account?section=addresses"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-body text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <MapPin className="w-5 h-5" />
                                                    My Addresses
                                                </Link>
                                                <Link
                                                    href="/wishlist"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-body text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Heart className="w-5 h-5" />
                                                    My Wishlist
                                                </Link>
                                                <Link
                                                    href="/account?section=reviews"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-body text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Star className="w-5 h-5" />
                                                    My Reviews
                                                </Link>
                                                <Link
                                                    href="/account?section=support"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-body text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Headphones className="w-5 h-5" />
                                                    Support
                                                </Link>
                                                <Link
                                                    href="/account?section=notifications"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-body text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Bell className="w-5 h-5" />
                                                    Notifications
                                                </Link>
                                            </div>

                                            {/* Logout Button at Bottom */}
                                            <div className="p-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => {
                                                        setUserMenuOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="flex items-center gap-4 w-full px-4 py-3 text-body font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <LogOut className="w-5 h-5" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="text-gray-700 hover:text-black transition-all duration-300 hover:scale-110"
                                aria-label="Login"
                            >
                                <User className="w-5 h-5" />
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-gray-700 hover:text-black transition-all duration-300"
                            aria-label="Toggle Menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {searchOpen && (
                    <div className="py-4 animate-slide-in">
                        <input
                            type="text"
                            placeholder="Search for products, brands and more..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300"
                            autoFocus
                        />
                    </div>
                )}
            </div>

            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
            />
        </header>
    );
}
