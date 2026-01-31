'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Package,
    Download,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CreditCard,
    Truck,
    Check,
    ArrowLeft,
    FileText
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface OrderDetailsProps {
    orderId: string | null;
}

// Mock order data - Replace with actual API call
const mockOrderData = {
    id: 'ORD-2024-12345',
    orderDate: 'January 28, 2024',
    deliveryDate: 'February 2, 2024',
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    items: [
        {
            id: '1',
            name: 'Premium Cotton T-Shirt',
            size: 'M',
            color: 'Navy Blue',
            quantity: 2,
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
        },
        {
            id: '2',
            name: 'Slim Fit Jeans',
            size: '32',
            color: 'Dark Wash',
            quantity: 1,
            price: 59.99,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
        }
    ],
    shippingAddress: {
        name: 'John Doe',
        addressLine1: '123 Main Street',
        addressLine2: 'Apartment 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@example.com'
    },
    billingAddress: {
        name: 'John Doe',
        addressLine1: '123 Main Street',
        addressLine2: 'Apartment 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
    },
    pricing: {
        subtotal: 119.97,
        shipping: 9.99,
        tax: 10.40,
        discount: 12.00,
        total: 128.36
    },
    trackingNumber: 'TRK1234567890'
};

export default function OrderDetails({ orderId }: OrderDetailsProps) {
    const [downloading, setDownloading] = useState(false);
    const order = mockOrderData; // Replace with actual order fetch by orderId

    const handleDownloadInvoice = () => {
        setDownloading(true);
        // Simulate download
        setTimeout(() => {
            // In production, this would generate and download a PDF invoice
            const invoiceContent = generateInvoiceHTML(order);
            const blob = new Blob([invoiceContent], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${order.id}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            setDownloading(false);
        }, 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-700 border-green-200';
            case '(processing':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-6 pb-24 lg:pb-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <Link
                        href="/account?section=orders"
                        className="inline-flex items-center gap-2 text-body text-gray-600 hover:text-gray-900 mb-3"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                    <h1 className="text-page-title text-gray-900">Order Details</h1>
                    <p className="text-body text-gray-600 mt-1">Order {orderId || order.id}</p>
                </div>
                <div className="hidden lg:block">
                    <Button
                        onClick={handleDownloadInvoice}
                        disabled={downloading}
                        className="flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        {downloading ? 'Generating...' : 'Download Invoice'}
                    </Button>
                </div>
            </div>

            {/* Order Status Card */}
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-small text-gray-600">Order Date</span>
                        </div>
                        <p className="text-card-title text-gray-900">{order.orderDate}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-4 h-4 text-gray-400" />
                            <span className="text-small text-gray-600">Estimated Delivery</span>
                        </div>
                        <p className="text-card-title text-gray-900">{order.deliveryDate}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-small text-gray-600">Order Status</span>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-small font-semibold ${getStatusColor(order.status)}`}>
                            <Check className="w-3 h-3" />
                            {order.status}
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-small text-gray-600">Payment</span>
                        </div>
                        <p className="text-card-title text-gray-900">{order.paymentStatus}</p>
                    </div>
                </div>
            </div>

            {/* Track Order Button */}
            <Link href={`/account?section=track-order&orderId=${order.id}`}>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4" />
                    Track Your Order
                </Button>
            </Link>

            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <h2 className="text-section-title text-gray-900">Order Items</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                        <div key={item.id} className="p-6 flex gap-4">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-card-title text-gray-900 mb-1">{item.name}</h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-small text-gray-600 mb-2">
                                    <span>Size: {item.size}</span>
                                    <span>Color: {item.color}</span>
                                    <span>Qty: {item.quantity}</span>
                                </div>
                                <p className="text-price text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-gray-700" />
                        <h3 className="text-card-title text-gray-900">Shipping Address</h3>
                    </div>
                    <div className="space-y-1 text-body text-gray-600">
                        <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        <div className="pt-2 space-y-1 border-t border-gray-200 mt-3">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{order.shippingAddress.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{order.shippingAddress.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing Address */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-gray-700" />
                        <h3 className="text-card-title text-gray-900">Billing Address</h3>
                    </div>
                    <div className="space-y-1 text-body text-gray-600">
                        <p className="font-semibold text-gray-900">{order.billingAddress.name}</p>
                        <p>{order.billingAddress.addressLine1}</p>
                        {order.billingAddress.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
                        <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-section-title text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-body">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">₹{order.pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-body">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">₹{order.pricing.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-body">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">₹{order.pricing.tax.toFixed(2)}</span>
                    </div>
                    {order.pricing.discount > 0 && (
                        <div className="flex justify-between text-body">
                            <span className="text-green-600">Discount</span>
                            <span className="text-green-600">-₹{order.pricing.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                        <span className="text-card-title text-gray-900 font-bold">Total</span>
                        <span className="text-price text-gray-900">₹{order.pricing.total.toFixed(2)}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <div className="flex justify-between text-small">
                            <span className="text-gray-600">Payment Method</span>
                            <span className="text-gray-900 font-semibold">{order.paymentMethod}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Button for Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
                <Button
                    onClick={handleDownloadInvoice}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    {downloading ? 'Generating Invoice...' : 'Download Invoice'}
                </Button>
            </div>
        </div>
    );
}

// Helper function to generate invoice HTML
function generateInvoiceHTML(order: typeof mockOrderData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice - ${order.id}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
        .details { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; }
        .total { font-size: 18px; font-weight: bold; }
        .addresses { display: flex; justify-content: space-between; margin: 20px 0; }
        .address { flex: 1; padding: 10px; background: #f9f9f9; margin: 0 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>INVOICE</h1>
        <p>Order ID: ${order.id}</p>
        <p>Date: ${order.orderDate}</p>
    </div>
    
    <div class="addresses">
        <div class="address">
            <h3>Shipping Address</h3>
            <p>${order.shippingAddress.name}</p>
            <p>${order.shippingAddress.addressLine1}</p>
            ${order.shippingAddress.addressLine2 ? `<p>${order.shippingAddress.addressLine2}</p>` : ''}
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
            <p>${order.shippingAddress.phone}</p>
        </div>
        <div class="address">
            <h3>Billing Address</h3>
            <p>${order.billingAddress.name}</p>
            <p>${order.billingAddress.addressLine1}</p>
            ${order.billingAddress.addressLine2 ? `<p>${order.billingAddress.addressLine2}</p>` : ''}
            <p>${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}</p>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Size</th>
                <th>Color</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${order.items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.size}</td>
                    <td>${item.color}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div style="text-align: right; margin-top: 20px;">
        <p>Subtotal: ₹${order.pricing.subtotal.toFixed(2)}</p>
        <p>Shipping: ₹${order.pricing.shipping.toFixed(2)}</p>
        <p>Tax: ₹${order.pricing.tax.toFixed(2)}</p>
        ${order.pricing.discount > 0 ? `<p style="color: green;">Discount: -₹${order.pricing.discount.toFixed(2)}</p>` : ''}
        <p class="total">Total: ₹${order.pricing.total.toFixed(2)}</p>
        <p style="margin-top: 10px;">Payment Method: ${order.paymentMethod} (${order.paymentStatus})</p>
    </div>
</body>
</html>
    `.trim();
}
