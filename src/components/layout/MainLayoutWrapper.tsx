'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import TopPromoBar from "./TopPromoBar";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import MobileSidebar from "./MobileSidebar";
import SearchBar from "./Search";
import { useAuthStore } from '@/store';
import { performLogout } from '@/utils/logout';
import { useRouter } from 'next/navigation';
import { useAddressStore } from '@/store';
import { useCategoryTree } from '@/hooks/useCategoryTree';
import { mainNavigation } from '@/data/categories';

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/admin');

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // Owned here so the overlay renders OUTSIDE the <header> backdrop-filter stacking context
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const { isAuthenticated, user, logout } = useAuthStore();
    const clearAddresses = useAddressStore((s) => s.clearAddresses);
    const router = useRouter();
    const { tree: categoryTree } = useCategoryTree();

    const navigation = categoryTree.length > 0
        ? categoryTree.map((dept) => ({
            id: dept.slug,
            label: dept.label,
            basePath: dept.basePath,
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
        : mainNavigation.filter((n) => n.id !== 'sale');

    const handleLogout = async () => {
        await performLogout(logout, () => router.push('/'), clearAddresses);
    };

    if (isAdminPath) {
        return <>{children}</>;
    }

    const isCartOrWishlist = pathname === '/cart' || pathname === '/wishlist';

    return (
        <>
            <TopPromoBar />
            <Header
                onMobileMenuOpen={() => setMobileMenuOpen(true)}
                onMobileMenuClose={() => setMobileMenuOpen(false)}
                onMobileSearchOpen={() => setMobileSearchOpen(true)}
            />
            <main className="min-h-screen pb-0 lg:pb-0">
                {children}
            </main>
            {!isCartOrWishlist && <Footer />}
            <MobileBottomNav />

            {/* MobileSidebar at root — outside header stacking context */}
            <MobileSidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
                navigation={navigation}
            />

            {/*
             * Search overlay at ROOT level — NOT inside <header>.
             * The header uses backdrop-blur-lg (backdrop-filter) which creates a
             * CSS stacking context. Any position:fixed child inside it is positioned
             * relative to the header box, not the viewport — no matter how high the
             * z-index. Rendering here makes fixed+inset-0 cover the full screen
             * correctly, including the hero banner.
             */}
            <SearchBar
                variant="overlay"
                isOpen={mobileSearchOpen}
                onClose={() => setMobileSearchOpen(false)}
            />
        </>
    );
}
