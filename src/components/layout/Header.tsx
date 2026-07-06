'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Heart, User, Menu, X, Search, ChevronDown, LayoutDashboard, UserCircle, Lock, Package, MapPin, Star, Wallet, Headphones, Bell, LogOut } from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore, useAddressStore } from '@/store';
import { performLogout } from '@/utils/logout';
import { useRouter } from 'next/navigation';
import MegaMenu from './MegaMenu';
import { mainNavigation, megaMenuImages } from '@/data/categories';
import { useCategoryTree } from '@/hooks/useCategoryTree';
import MobileSidebar from './MobileSidebar';
import { usePathname } from 'next/navigation';
import SearchBar from './Search';
import BrandLogo from './BrandLogo';

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const { isAuthenticated, user, logout } = useAuthStore();
    const clearAddresses = useAddressStore((s) => s.clearAddresses);
    const { getItemCount } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();
    const router = useRouter();
    const { tree: categoryTree } = useCategoryTree();

    type NavItem = {
        id: string;
        label: string;
        basePath: string;
        featuredImage: string;
        sections: Array<{
            title: string;
            basePath: string;
            items: Array<{ name: string; slug: string; image: string }>;
        }>;
    };

    const navigation: NavItem[] = categoryTree.length > 0
        ? categoryTree.map((dept) => ({
            id: dept.slug,
            label: dept.label,
            basePath: dept.basePath,
            featuredImage: dept.imageUrl,
            sections: dept.sections.map((section) => ({
                title: section.title,
                basePath: section.basePath,
                items: section.items.map((item) => ({
                    name: item.name,
                    slug: item.slug,
                    image: item.imageUrl,
                })),
            })),
        }))
        : mainNavigation
            .filter((nav) => nav.id !== 'sale')
            .map((nav) => ({
                id: nav.id,
                label: nav.label,
                basePath: nav.basePath,
                featuredImage: megaMenuImages[nav.id as keyof typeof megaMenuImages] || megaMenuImages.men,
                sections: nav.sections,
            }));

    const cartItemCount = getItemCount();

    const handleLogout = async () => {
        await performLogout(logout, () => router.push('/'), clearAddresses);
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

    // Close all menus on navigation
    useEffect(() => {
        setActiveMegaMenu(null);
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    const hideOnMobilePaths = [
        '/checkout',
        '/order-success',
        '/products'
    ];

    const isHiddenOnMobile = hideOnMobilePaths.some(path => pathname.startsWith(path));

    const activeCategory = navigation.find((c) => c.id === activeMegaMenu);

    return (
        <header
            className={`relative sticky top-8 z-[100] bg-[#faf7f2] backdrop-blur-lg text-heading shadow-sm ${
                activeMegaMenu ? 'border-b-0' : 'border-b border-amber-200/60'
            } ${isHiddenOnMobile ? 'hidden lg:block' : ''}`}
            onMouseLeave={() => setActiveMegaMenu(null)}
        >
            <div className="container mx-auto px-4 lg:px-6 xl:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    <BrandLogo />

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
                        {navigation.map((category) => (
                            <div
                                key={category.id}
                                className="relative"
                                onMouseEnter={() => setActiveMegaMenu(category.id)}
                            >
                                <Link
                                    href={category.basePath}
                                    onClick={() => setActiveMegaMenu(null)}
                                    className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-300 py-6 capitalize whitespace-nowrap ${
                                        activeMegaMenu === category.id
                                            ? 'text-amber-900'
                                            : 'text-heading/75 hover:text-amber-900'
                                    }`}
                                >
                                    {category.label}
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                            activeMegaMenu === category.id ? 'rotate-180 text-amber-700' : 'text-amber-600/60'
                                        }`}
                                    />
                                </Link>
                            </div>
                        ))}
                    </nav>

                    {/* Search Bar */}
                    <SearchBar variant="desktop" theme="premium" />

                    {/* Right Icons */}
                    <div className="flex items-center space-x-2 lg:space-x-8">
                        {/* Profile - Desktop with Label */}
                        {isAuthenticated ? (
                            <div className="hidden lg:block relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex flex-col items-center gap-1 text-heading/75 hover:text-amber-900 transition-all duration-300 group"
                                    aria-label="User Account"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="text-sm font-bold capitalize">Profile</span>
                                </button>
                                {/* Dropdown logic remains same */}

                                {/* Desktop Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="hidden lg:block absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl animate-scale-in z-50">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                            <p className="text-sm font-semibold text-heading truncate">
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
                                                href="/account?section=support"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <Headphones className="w-4 h-4" />
                                                Support
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
                                            className="fixed inset-0 bg-black/40 z-60 lg:hidden animate-fade-in"
                                            onClick={() => setUserMenuOpen(false)}
                                        />

                                        {/* Drawer - Left to Right, 80% width */}
                                        <div className="fixed inset-y-0 left-0 z-70 w-[80%] bg-white shadow-2xl transform transition-transform duration-300 animate-slide-right lg:hidden flex flex-col">
                                            {/* User Info Header */}
                                            <div className="p-6 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-gray-700 flex items-center justify-center text-white font-semibold text-xl shadow-md">
                                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-semibold text-heading truncate max-w-[150px]">
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
                                                    href="/account?section=support"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-4 px-4 py-3 text-body text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Headphones className="w-5 h-5" />
                                                    Support
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
                                className="hidden lg:flex flex-col items-center gap-1 text-heading/75 hover:text-amber-900 transition-all duration-300"
                                aria-label="Login"
                            >
                                <User className="w-5 h-5" />
                                <span className="text-sm font-bold capitalize">Account</span>
                            </Link>
                        )}

                        {/* Wishlist - Desktop with Label */}
                        <Link
                            href="/wishlist"
                            className="hidden lg:flex flex-col items-center gap-1 relative text-heading/75 hover:text-amber-900 transition-colors"
                            aria-label="Wishlist"
                        >
                            <div className="relative">
                                <Heart className="w-5 h-5" />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-bold capitalize">Wishlist</span>
                        </Link>

                        {/* Cart - Desktop with Label */}
                        <Link
                            href="/cart"
                            className="hidden lg:flex flex-col items-center gap-1 relative text-heading/75 hover:text-amber-900 transition-colors"
                            aria-label="Shopping Cart"
                        >
                            <div className="relative">
                                <ShoppingCart className="w-5 h-5" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                        {cartItemCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-bold capitalize">Bag</span>
                        </Link>

                        {/* Mobile Actions */}
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setIsSearchOverlayOpen(true)}
                                className="text-heading/75 hover:text-amber-900 p-2"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-heading/75 hover:text-amber-900 p-2"
                                aria-label="Toggle Menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H19C19.2652 0 19.5196 0.105357 19.7071 0.292893C19.8946 0.48043 20 0.734784 20 1C20 1.26522 19.8946 1.51957 19.7071 1.70711C19.5196 1.89464 19.2652 2 19 2H1C0.734784 2 0.48043 1.89464 0.292893 1.70711C0.105357 1.51957 0 1.26522 0 1ZM1 10H19C19.2652 10 19.5196 9.89464 19.7071 9.70711C19.8946 9.51957 20 9.26522 20 9C20 8.73478 19.8946 8.48043 19.7071 8.29289C19.5196 8.10536 19.2652 8 19 8H1C0.734784 8 0.48043 8.10536 0.292893 8.29289C0.105357 8.48043 0 8.73478 0 9C0 9.26522 0.105357 9.51957 0.292893 9.70711C0.48043 9.89464 0.734784 10 1 10ZM19 16H10C9.73478 16 9.48043 16.1054 9.29289 16.2929C9.10536 16.4804 9 16.7348 9 17C9 17.2652 9.10536 17.5196 9.29289 17.7071C9.48043 17.8946 9.73478 18 10 18H19C19.2652 18 19.5196 17.8946 19.7071 17.7071C19.8946 17.5196 20 17.2652 20 17C20 16.7348 19.8946 16.4804 19.7071 16.2929C19.5196 16.1054 19.2652 16 19 16Z" fill="currentColor" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mega menu — rendered once at header level for correct positioning & hover */}
            {activeCategory && (
                <MegaMenu
                    key={activeCategory.id}
                    menuId={activeCategory.id}
                    sections={activeCategory.sections}
                    featuredImage={activeCategory.featuredImage}
                    label={activeCategory.label}
                    basePath={activeCategory.basePath}
                    isOpen
                    onNavItemClick={() => setActiveMegaMenu(null)}
                />
            )}

            {/* Mobile Search Overlay */}
            <SearchBar
                variant="overlay"
                isOpen={isSearchOverlayOpen}
                onClose={() => setIsSearchOverlayOpen(false)}
            />

            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
                navigation={navigation}
            />
        </header>
    );
}
