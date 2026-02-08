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
                return 'bg-green-100 text-green-700 border-gray-300';
            case 'processing':
                return 'bg-blue-100 text-blue-700 border-gray-300';
            case 'shipped':
                return 'bg-purple-100 text-purple-700 border-gray-300';
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    return (
        <div className="animate-fade-in pb-6 lg:pb-0">
            {/* Header - Desktop */}
            <div className="hidden lg:flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-black rounded-md flex items-center justify-center text-white">
                        <Package className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-section-title font-black text-gray-900 uppercase tracking-tight">Order #{order.id.split('-').pop()}</h1>
                        <p className="text-body text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Placed on {order.orderDate}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={handleDownloadInvoice}
                        disabled={downloading}
                        className="h-11 px-6 border-gray-300 rounded-md font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-none"
                    >
                        <Download className="w-4 h-4" />
                        {downloading ? '...' : 'Invoice'}
                    </Button>
                    <Link href={`/account?section=track-order&orderId=${order.id}`}>
                        <Button className="h-11 px-6 bg-black text-white rounded-md font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-none">
                            <Truck className="w-4 h-4" />
                            Track
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="space-y-6 lg:space-y-8">
                {/* Status Bar */}
                <div className="bg-white border border-gray-300 rounded-lg p-6 lg:p-8 shadow-none">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Status</p>
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                <Check className="w-3 h-3" />
                                {order.status}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Estimated Delivery</p>
                            <p className="text-small font-black text-gray-900 uppercase">{order.deliveryDate}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Payment</p>
                            <p className="text-small font-black text-gray-900 uppercase">{order.paymentStatus}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tracking #</p>
                            <p className="text-small font-black text-gray-900 uppercase truncate">{order.trackingNumber}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Products List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-none">
                            <div className="p-6 border-b border-gray-300 bg-gray-50/50">
                                <h2 className="text-small font-black text-gray-900 uppercase tracking-widest border-l-4 border-black pl-3">Order Items ({order.items.length})</h2>
                            </div>
                            <div className="divide-y divide-gray-300">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-6 flex gap-4 lg:gap-6 group">
                                        <div className="relative w-24 h-28 lg:w-28 lg:h-32 bg-gray-50 rounded-md overflow-hidden border border-gray-300 shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-body font-black text-gray-900 uppercase tracking-tight mb-2 truncate">{item.name}</h3>
                                            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                                                <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-300 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Size: {item.size}</div>
                                                <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-300 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Color: {item.color}</div>
                                                <div className="bg-gray-50 px-3 py-1 rounded-full border border-gray-300 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Qty: {item.quantity}</div>
                                            </div>
                                            <p className="text-body font-black text-black uppercase tracking-tight">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary - Combined on Mobile to be below products */}
                        <div className="lg:hidden bg-white border border-gray-300 rounded-lg p-6 shadow-none">
                            <h3 className="text-small font-black text-gray-900 uppercase tracking-widest mb-6 border-l-4 border-black pl-3">Order Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">₹{order.pricing.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-gray-900">₹{order.pricing.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    <span>Tax</span>
                                    <span className="text-gray-900">₹{order.pricing.tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-300 flex justify-between items-center">
                                    <span className="text-body font-black text-gray-900 uppercase tracking-tight">Total Amount</span>
                                    <span className="text-section-title font-black text-black uppercase tracking-tight">₹{order.pricing.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Addresses & Summary */}
                    <div className="space-y-6 lg:space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white border border-gray-300 rounded-lg p-6 lg:p-8 shadow-none">
                            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center text-white shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                Delivery Address
                            </h3>
                            <div className="space-y-1">
                                <p className="text-body font-black text-gray-900 uppercase tracking-tight">{order.shippingAddress.name}</p>
                                <p className="text-small font-bold text-gray-500 uppercase tracking-tight leading-relaxed">{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p className="text-small font-bold text-gray-500 uppercase tracking-tight leading-relaxed">{order.shippingAddress.addressLine2}</p>}
                                <p className="text-small font-bold text-gray-500 uppercase tracking-tight leading-relaxed">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                <div className="pt-4 mt-4 border-t border-gray-300 space-y-2">
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Phone className="w-3.5 h-3.5" />
                                        {order.shippingAddress.phone}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Mail className="w-3.5 h-3.5" />
                                        {order.shippingAddress.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary - Desktop */}
                        <div className="hidden lg:block bg-black text-white rounded-lg p-8 shadow-none">
                            <h3 className="text-small font-black uppercase tracking-widest mb-8 border-l-4 border-white pl-3 text-white">Order Summary</h3>
                            <div className="space-y-5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{order.pricing.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-white">₹{order.pricing.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Tax</span>
                                    <span className="text-white">₹{order.pricing.tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-6 border-t border-white/20 flex justify-between items-center">
                                    <span className="text-small font-black uppercase tracking-widest text-white">Total</span>
                                    <span className="text-2xl font-black uppercase tracking-tight">₹{order.pricing.total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Button
                                onClick={handleDownloadInvoice}
                                disabled={downloading}
                                className="w-full h-11 bg-white text-black mt-10 rounded-md font-bold uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all shadow-none flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4 shrink-0" />
                                <span className="truncate">{downloading ? '...' : 'Download'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Actions Overlay - Positioned above MobileBottomNav (4rem = 64px) */}
            <div className="lg:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] left-0 right-0 p-4 bg-white border-t border-gray-300 flex gap-3 z-40">
                <Button variant="outline" onClick={handleDownloadInvoice} disabled={downloading} className="flex-1 h-11 border-gray-300 rounded-md font-bold uppercase tracking-widest text-[10px] shadow-none">
                    Invoice
                </Button>
                <Link href={`/account?section=track-order&orderId=${order.id}`} className="flex-1">
                    <Button className="w-full h-11 bg-black text-white rounded-md font-bold uppercase tracking-widest text-[10px] shadow-none">
                        Track Order
                    </Button>
                </Link>
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
