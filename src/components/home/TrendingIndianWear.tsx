import TrendingSlider from '@/components/ui/TrendingSlider';

const indianWearItems = [
    {
        id: 1,
        title: 'All White Indian Wear',
        subtitle: 'For an always cool attitude',
        image: 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=800&q=80',
        link: '/products?category=topwear&item=ethnic-wear&color=white',
    },
    {
        id: 2,
        title: 'Ethnic Casuals',
        subtitle: 'Indians surely know the route to comfort',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
        link: '/products?category=topwear&item=kurtas',
    },
    {
        id: 3,
        title: 'Printed Kurta Sets',
        subtitle: 'Festive wear that your family will love',
        image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80',
        link: '/products?category=topwear&item=ethnic-wear',
    },
    {
        id: 4,
        title: 'Everyday Kurtas',
        subtitle: 'When style meets comfort',
        image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80',
        link: '/products?category=topwear&item=kurtas',
    },
    {
        id: 5,
        title: 'Handpicked Trendy Styles',
        subtitle: 'Update the language of comfort with these',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
        link: '/products?category=topwear&item=ethnic-wear',
    },
];

export default function TrendingIndianWear() {
    return <TrendingSlider items={indianWearItems} title="Trending In Indian Wear" bgColor="bg-white" />;
}
