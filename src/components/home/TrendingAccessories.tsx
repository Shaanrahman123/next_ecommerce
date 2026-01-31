import TrendingSlider from '@/components/ui/TrendingSlider';

const accessoriesItems = [
    {
        id: 1,
        title: 'Wireless Headphones',
        subtitle: 'Perfect sound. Not just in our vocabulary',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        link: '/products?category=accessories&item=headphones',
        bgColor: 'bg-black',
    },
    {
        id: 2,
        title: 'Sporty Watches',
        subtitle: 'Made for a little bit of style & performance',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
        link: '/products?category=accessories&item=watches&style=sport',
        bgColor: 'bg-red-600',
    },
    {
        id: 3,
        title: 'White Watches',
        subtitle: 'Classy every sense of the word',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
        link: '/products?category=accessories&item=watches&color=white',
        bgColor: 'bg-amber-900',
    },
    {
        id: 4,
        title: 'Best Of Fastrack',
        subtitle: 'The go-to where sports meets sass',
        image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
        link: '/products?category=accessories&item=watches&brand=fastrack',
        bgColor: 'bg-teal-500',
    },
    {
        id: 5,
        title: 'Minimalist Watches',
        subtitle: 'Understated is the new style statement',
        image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80',
        link: '/products?category=accessories&item=watches&style=minimal',
        bgColor: 'bg-slate-900',
    },
];

export default function TrendingAccessories() {
    return <TrendingSlider items={accessoriesItems} title="Trending In Accessories" bgColor="bg-gray-50" />;
}
