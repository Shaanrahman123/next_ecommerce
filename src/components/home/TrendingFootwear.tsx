import TrendingSlider from '@/components/ui/TrendingSlider';

const footwearItems = [
    {
        id: 1,
        title: 'Neutral Shades',
        subtitle: 'Ticks all the boxes & pairs with everything!',
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
        link: '/products?category=footwear&color=neutral',
    },
    {
        id: 2,
        title: 'Sneakers For Dancers',
        subtitle: 'These were made for all your moves',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
        link: '/products?category=footwear&type=sneakers',
    },
    {
        id: 3,
        title: 'Printed Sneakers For Men',
        subtitle: 'Give your staples a snazzy makeover!',
        image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
        link: '/products?category=footwear&style=printed',
    },
    {
        id: 4,
        title: 'Outback Outdoor Shoes',
        subtitle: 'Bring the adventure back home',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        link: '/products?category=footwear&type=outdoor',
    },
    {
        id: 5,
        title: 'Flip-Flops & Sliders',
        subtitle: 'Slide right in to comfort and ease!',
        image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80',
        link: '/products?category=footwear&type=casual',
    },
];

export default function TrendingFootwear() {
    return <TrendingSlider items={footwearItems} title="Trending In Footwear" bgColor="bg-white" />;
}
