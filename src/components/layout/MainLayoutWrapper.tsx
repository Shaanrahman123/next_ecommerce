'use client';

import { usePathname } from 'next/navigation';
import TopPromoBar from "./TopPromoBar";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/admin');

    if (isAdminPath) {
        return <>{children}</>;
    }

    return (
        <>
            <TopPromoBar />
            <Header />
            <main className="min-h-screen pb-0 lg:pb-0">
                {children}
            </main>
            <Footer />
            <MobileBottomNav />
        </>
    );
}
