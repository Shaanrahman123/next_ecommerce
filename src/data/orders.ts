export const mockOrders = [
    {
        id: 'ORD-12345678',
        date: '2026-01-08',
        status: 'delivered',
        total: 189.99,
        itemsCount: 3,
        shippingAddress: {
            fullName: 'John Doe',
            addressLine1: '123 Main Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            phone: '+1 (555) 123-4567',
        },
        paymentMethod: 'Credit Card (ending in 4242)',
        subtotal: 175.99,
        shipping: 14.00,
        tax: 0.00,
        products: [
            {
                id: '1',
                name: 'Neutral Shades Sneakers',
                image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
                price: 89.99,
                size: 'UK 9',
                quantity: 1
            },
            {
                id: '2',
                name: 'Minimal Canvas Tote',
                image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
                price: 45.00,
                size: 'Medium',
                quantity: 1
            },
            {
                id: '3',
                name: 'Classic White Tee',
                image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
                price: 55.00,
                size: 'L',
                quantity: 1
            }
        ]
    },
    {
        id: 'ORD-12345679',
        date: '2026-01-05',
        status: 'shipped',
        total: 129.99,
        itemsCount: 2,
        shippingAddress: {
            fullName: 'John Doe',
            addressLine1: '123 Main Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            phone: '+1 (555) 123-4567',
        },
        paymentMethod: 'PayPal',
        subtotal: 119.99,
        shipping: 10.00,
        tax: 0.00,
        products: [
            {
                id: '4',
                name: 'Outback Outdoor Shoes',
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
                price: 99.99,
                size: 'UK 10',
                quantity: 1
            },
            {
                id: '5',
                name: 'Sports Performance Socks',
                image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80',
                price: 30.00,
                size: 'Free Size',
                quantity: 1
            }
        ]
    },
    {
        id: 'ORD-12345680',
        date: '2026-01-02',
        status: 'processing',
        total: 249.99,
        itemsCount: 1,
        shippingAddress: {
            fullName: 'John Doe',
            addressLine1: '456 Office Plaza, Suite 200',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            country: 'USA',
            phone: '+1 (555) 987-6543',
        },
        paymentMethod: 'Credit Card (ending in 1234)',
        subtotal: 249.99,
        shipping: 0.00,
        tax: 0.00,
        products: [
            {
                id: '6',
                name: 'Premium Leather Boots',
                image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80',
                price: 249.99,
                size: 'UK 8',
                quantity: 1
            }
        ]
    },
];
