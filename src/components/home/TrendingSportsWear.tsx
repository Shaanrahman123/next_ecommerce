import TrendingSlider from '@/components/ui/TrendingSlider';

const sportsWearItems = [
    {
        id: 1,
        title: 'Online Exclusive Nike Styles',
        subtitle: 'For an collectible grill & a flexible workout',
        image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
        link: '/products?category=topwear&item=sweatshirts',
        badge: null,
    },
    {
        id: 2,
        title: 'Activewear By Proline',
        subtitle: 'Step into something stretcher',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        link: '/products?category=sportswear',
        badge: null,
    },
    {
        id: 3,
        title: 'ASICS Gel Running Shoes',
        subtitle: 'Get your A-game on',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        link: '/products?category=footwear',
        badge: null,
    },
    {
        id: 4,
        title: 'Best Of Activewear',
        subtitle: 'Transform the way you train',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
        link: '/products?category=sportswear',
        badge: null,
    },
    {
        id: 5,
        title: 'Footwear By Nike',
        subtitle: 'Join the revolution',
        image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
        link: '/products?category=footwear',
        badge: 'BESTSELLER',
    },
];

export default function TrendingSportsWear() {
    return <TrendingSlider items={sportsWearItems} title="Trending In Sports Wear" bgColor="bg-gray-50" />;
}
