'use client';

import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/products';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function FeaturedProducts() {
    const featuredProducts = mockProducts.filter(p => p.featured).slice(0, 10);

    return (
        <section className="py-12 px-8 lg:px-16 xl:px-24 container mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-section-title text-gray-900 uppercase tracking-tight">
                    Featured Products
                </h2>
                <p className="text-body text-gray-600 mt-2">
                    Handpicked selections from our latest collection
                </p>
                <div className="h-0.5 w-24 bg-gray-900 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} compact />
                ))}
            </div>

            <div className="text-center">
                <Link href="/products">
                    <Button size="lg" variant="outline">
                        View All Products
                    </Button>
                </Link>
            </div>
        </section>
    );
}
