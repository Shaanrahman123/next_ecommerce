'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AccountLayout from '@/components/account/AccountLayout';
import Dashboard from '@/components/account/Dashboard';
// import MyProfile from '@/components/account/MyProfile';
import EditProfile from '@/components/account/EditProfile';
import ChangePassword from '@/components/account/ChangePassword';
import MyOrders from '@/components/account/MyOrders';
import OrderDetails from '@/components/account/OrderDetails';
import TrackOrder from '@/components/account/TrackOrder';
import MyAddresses from '@/components/account/MyAddresses';
import AddEditAddress from '@/components/account/AddEditAddress';
import MyReviews from '@/components/account/MyReviews';
import MyWallet from '@/components/account/MyWallet';
import Support from '@/components/account/Support';
import Notifications from '@/components/account/Notifications';
import MyProfile from '@/components/account/MyProfile';

function AccountContent() {
    const searchParams = useSearchParams();
    const section = searchParams.get('section') || 'dashboard';
    const orderId = searchParams.get('orderId');
    const addressId = searchParams.get('addressId');

    const renderSection = () => {
        switch (section) {
            case 'profile':
                return <MyProfile />;
            case 'edit-profile':
                return <EditProfile />;
            case 'password':
                return <ChangePassword />;
            case 'orders':
                return <MyOrders />;
            case 'order-details':
                return <OrderDetails orderId={orderId} />;
            case 'track-order':
                return <TrackOrder orderId={orderId} />;
            case 'addresses':
                return <MyAddresses />;
            case 'add-address':
            case 'edit-address':
                return <AddEditAddress addressId={addressId} />;
            case 'reviews':
                return <MyReviews />;
            case 'wallet':
                return <MyWallet />;
            case 'support':
                return <Support />;
            case 'notifications':
                return <Notifications />;
            case 'dashboard':
            default:
                return <Dashboard />;
        }
    };

    return (
        <AccountLayout currentSection={section}>
            {renderSection()}
        </AccountLayout>
    );
}

export default function AccountPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <AccountContent />
        </Suspense>
    );
}
