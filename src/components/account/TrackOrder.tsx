'use client';

import Link from 'next/link';
import {
    Package,
    Truck,
    Check,
    MapPin,
    Calendar,
    ArrowLeft,
    Phone,
    Mail,
    Clock
} from 'lucide-react';

interface TrackOrderProps {
    orderId: string | null;
}

// Mock tracking data - Replace with actual API call
const mockTrackingData = {
    orderId: 'ORD-2024-12345',
    trackingNumber: 'TRK1234567890',
    carrier: 'FedEx Express',
    currentStatus: 'Out for Delivery',
    estimatedDelivery: 'Today by 8:00 PM',
    shippingAddress: {
        name: 'John Doe',
        addressLine1: '123 Main Street',
        addressLine2: 'Apartment 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phone: '+1 (555) 123-4567'
    },
    trackingHistory: [
        {
            id: '5',
            status: 'Out for Delivery',
            description: 'Package is out for delivery',
            location: 'New York, NY 10001',
            date: 'Feb 2, 2024',
            time: '07:30 AM',
            completed: true,
            current: true
        },
        {
            id: '4',
            status: 'Arrived at Local Facility',
            description: 'Package arrived at local delivery facility',
            location: 'New York Distribution Center',
            date: 'Feb 2, 2024',
            time: '05:15 AM',
            completed: true,
            current: false
        },
        {
            id: '3',
            status: 'In Transit',
            description: 'Package in transit to destination',
            location: 'Philadelphia, PA',
            date: 'Feb 1, 2024',
            time: '11:45 PM',
            completed: true,
            current: false
        },
        {
            id: '2',
            status: 'Departed Facility',
            description: 'Package departed from warehouse',
            location: 'Baltimore Distribution Center',
            date: 'Jan 30, 2024',
            time: '02:30 PM',
            completed: true,
            current: false
        },
        {
            id: '1',
            status: 'Order Placed',
            description: 'Your order has been confirmed and is being prepared',
            location: 'Processing Center',
            date: 'Jan 28, 2024',
            time: '03:45 PM',
            completed: true,
            current: false
        }
    ]
};

export default function TrackOrder({ orderId }: TrackOrderProps) {
    const tracking = mockTrackingData; // Replace with actual tracking fetch by orderId

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/account?section=orders"
                    className="inline-flex items-center gap-2 text-body text-gray-600 hover:text-gray-900 mb-3"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </Link>
                <h1 className="text-page-title text-gray-900">Track Order</h1>
                <p className="text-body text-gray-600 mt-1">Order {orderId || tracking.orderId}</p>
            </div>

            {/* Current Status Card */}
            <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                        <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-section-title text-gray-900 mb-1">{tracking.currentStatus}</h2>
                        <p className="text-body text-gray-600 mb-3">
                            Your package is on its way!
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-small text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Estimated: {tracking.estimatedDelivery}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                <span>Tracking: {tracking.trackingNumber}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-section-title text-gray-900 mb-6">Tracking History</h3>

                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gray-200" />

                    {/* Timeline Items */}
                    <div className="space-y-6">
                        {tracking.trackingHistory.map((event, index) => (
                            <div key={event.id} className="relative flex gap-4">
                                {/* Timeline Dot */}
                                <div className={`
                                    relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0
                                    ${event.current
                                        ? 'bg-green-500 ring-4 ring-green-100'
                                        : event.completed
                                            ? 'bg-green-500'
                                            : 'bg-gray-200'
                                    }
                                `}>
                                    {event.completed ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : (
                                        <Clock className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>

                                {/* Event Details */}
                                <div className={`
                                    flex-1 pb-6 pt-1
                                    ${event.current ? 'bg-green-50 -ml-4 pl-8 pr-4 py-4 rounded-lg border border-green-200' : ''}
                                `}>
                                    <div className="flex items-start justify-between gap-4 mb-1">
                                        <h4 className={`text-card-title ${event.current ? 'text-green-700' : 'text-gray-900'}`}>
                                            {event.status}
                                        </h4>
                                        <div className="text-right shrink-0">
                                            <p className="text-small text-gray-600">{event.date}</p>
                                            <p className="text-small text-gray-500">{event.time}</p>
                                        </div>
                                    </div>
                                    <p className="text-body text-gray-600 mb-1">{event.description}</p>
                                    <div className="flex items-center gap-1.5 text-small text-gray-500">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-700" />
                    <h3 className="text-card-title text-gray-900">Delivery Address</h3>
                </div>
                <div className="space-y-1 text-body text-gray-600">
                    <p className="font-semibold text-gray-900">{tracking.shippingAddress.name}</p>
                    <p>{tracking.shippingAddress.addressLine1}</p>
                    {tracking.shippingAddress.addressLine2 && <p>{tracking.shippingAddress.addressLine2}</p>}
                    <p>{tracking.shippingAddress.city}, {tracking.shippingAddress.state} {tracking.shippingAddress.zipCode}</p>
                    <div className="pt-2 space-y-1 border-t border-gray-200 mt-3">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{tracking.shippingAddress.phone}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carrier Info */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-small text-gray-600">Shipped via</p>
                        <p className="text-card-title text-gray-900">{tracking.carrier}</p>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-card-title text-gray-900 mb-2">Need Help?</h3>
                <p className="text-body text-gray-600 mb-4">
                    If you have any questions about your delivery, please contact our support team.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/account?section=support"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-small font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        Contact Support
                    </Link>
                    <Link
                        href={`/account?section=order-details&orderId=${tracking.orderId}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-small font-semibold hover:bg-gray-800 transition-colors"
                    >
                        <Package className="w-4 h-4" />
                        View Order Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
