export const topwearCategories = [
    { name: 'Shirts', slug: 'shirts', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop' },
    { name: 'T-Shirts', slug: 't-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop' },
    { name: 'Sweatshirts', slug: 'sweatshirts', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop' },
    { name: 'Kurtas', slug: 'kurtas', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop' },
    { name: 'Ethnic Wear', slug: 'ethnic-wear', image: 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?q=80&w=800&auto=format&fit=crop' },
];

export const bottomwearCategories = [
    { name: 'Jeans', slug: 'jeans', image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=800&auto=format&fit=crop' },
    { name: 'Trousers', slug: 'trousers', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=800&auto=format&fit=crop' },
    { name: 'Formal Pants', slug: 'formal-pants', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop' },
];

export const accessoriesCategories = [
    { name: 'Belts', slug: 'belts', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop' },
    { name: 'Perfumes', slug: 'perfumes', image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?q=80&w=800&auto=format&fit=crop' },
    { name: 'Wallets', slug: 'wallets', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' },
    { name: 'Watches', slug: 'watches', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop' },
];

// Main Navigation Structure
export const mainNavigation = [
    {
        id: 'topwear',
        label: 'Topwear',
        items: topwearCategories,
        basePath: '/products?category=topwear'
    },
    {
        id: 'bottomwear',
        label: 'Bottomwear',
        items: bottomwearCategories,
        basePath: '/products?category=bottomwear'
    },
    {
        id: 'accessories',
        label: 'Accessories',
        items: accessoriesCategories,
        basePath: '/products?category=accessories'
    },
    {
        id: 'sale',
        label: 'Mega Sale',
        items: [
            { name: 'Under ₹999', slug: 'under-999', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop' },
            { name: 'Flat 50% Off', slug: 'flat-50', image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800&auto=format&fit=crop' },
            { name: 'New Arrivals', slug: 'new-arrivals', image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=800&auto=format&fit=crop' },
            { name: 'Best Sellers', slug: 'best-sellers', image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=800&auto=format&fit=crop' },
        ],
        basePath: '/products?category=sale'
    }
];

export const megaMenuImages = {
    topwear: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=800&auto=format&fit=crop',
    bottomwear: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    accessories: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop',
    sale: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=800&auto=format&fit=crop',
};
