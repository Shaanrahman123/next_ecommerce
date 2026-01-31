'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';

interface SimilarProductsProps {
    currentProductId: string;
    category: string;
    allProducts: Product[];
}

export default function SimilarProducts({ currentProductId, category, allProducts }: SimilarProductsProps) {
    const similarProducts = allProducts
        .filter((p) => p.category === category && p.id !== currentProductId)
        .slice(0, 4);

    if (similarProducts.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
            <div className="mb-6 md:mb-8">
                <h2 className="text-section-title text-gray-900 mb-2">You May Also Like</h2>
                <p className="text-body text-gray-600">Similar products that might interest you</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {similarProducts.map((product) => (
                    <ProductCard key={product.id} product={product} compact />
                ))}
            </div>
        </div>
    );
}
