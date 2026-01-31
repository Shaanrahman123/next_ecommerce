'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterOption {
    id: string;
    label: string;
    count?: number;
}

interface FilterSection {
    id: string;
    title: string;
    type: 'checkbox' | 'radio' | 'range' | 'color';
    options?: FilterOption[];
    min?: number;
    max?: number;
    categories?: string[]; // Which categories this filter applies to
}

// Comprehensive filter definitions for different product categories
const allFilterSections: FilterSection[] = [
    // SHIRTS SPECIFIC FILTERS
    {
        id: 'sleeve-type',
        title: 'SLEEVE TYPE',
        type: 'checkbox',
        categories: ['shirts', 'topwear'],
        options: [
            { id: 'full-sleeve', label: 'Full Sleeve', count: 1245 },
            { id: 'half-sleeve', label: 'Half Sleeve', count: 2156 },
            { id: 'short-sleeve', label: 'Short Sleeve', count: 892 },
            { id: 'sleeveless', label: 'Sleeveless', count: 445 },
            { id: 'three-quarter', label: '3/4 Sleeve', count: 328 },
            { id: 'roll-up', label: 'Roll-Up Sleeve', count: 567 },
        ],
    },
    {
        id: 'collar-type',
        title: 'COLLAR TYPE',
        type: 'checkbox',
        categories: ['shirts', 'topwear'],
        options: [
            { id: 'classic-collar', label: 'Classic Collar', count: 1823 },
            { id: 'mandarin-collar', label: 'Mandarin Collar', count: 456 },
            { id: 'spread-collar', label: 'Spread Collar', count: 789 },
            { id: 'button-down', label: 'Button Down', count: 634 },
            { id: 'band-collar', label: 'Band Collar', count: 298 },
            { id: 'cuban-collar', label: 'Cuban Collar', count: 412 },
            { id: 'no-collar', label: 'No Collar', count: 267 },
        ],
    },
    {
        id: 'fit-type',
        title: 'FIT TYPE',
        type: 'checkbox',
        categories: ['shirts', 'topwear', 'jeans', 'bottomwear', 't-shirts'],
        options: [
            { id: 'slim-fit', label: 'Slim Fit', count: 2145 },
            { id: 'regular-fit', label: 'Regular Fit', count: 3267 },
            { id: 'relaxed-fit', label: 'Relaxed Fit', count: 1089 },
            { id: 'oversized', label: 'Oversized', count: 876 },
            { id: 'tailored-fit', label: 'Tailored Fit', count: 654 },
            { id: 'athletic-fit', label: 'Athletic Fit', count: 432 },
            { id: 'loose-fit', label: 'Loose Fit', count: 567 },
        ],
    },
    {
        id: 'fabric',
        title: 'FABRIC',
        type: 'checkbox',
        categories: ['shirts', 'topwear', 't-shirts', 'jeans', 'bottomwear'],
        options: [
            { id: 'cotton', label: 'Cotton', count: 4523 },
            { id: 'cotton-blend', label: 'Cotton Blend', count: 2876 },
            { id: 'linen', label: 'Linen', count: 892 },
            { id: 'polyester', label: 'Polyester', count: 1456 },
            { id: 'denim', label: 'Denim', count: 2134 },
            { id: 'silk', label: 'Silk', count: 345 },
            { id: 'rayon', label: 'Rayon', count: 678 },
            { id: 'lycra-blend', label: 'Lycra Blend', count: 1234 },
            { id: 'poly-cotton', label: 'Poly Cotton', count: 1567 },
            { id: 'khadi', label: 'Khadi', count: 234 },
            { id: 'chambray', label: 'Chambray', count: 456 },
            { id: 'flannel', label: 'Flannel', count: 567 },
        ],
    },
    {
        id: 'pattern',
        title: 'PATTERN',
        type: 'checkbox',
        categories: ['shirts', 'topwear', 't-shirts'],
        options: [
            { id: 'solid', label: 'Solid', count: 5234 },
            { id: 'striped', label: 'Striped', count: 1876 },
            { id: 'checked', label: 'Checked', count: 1456 },
            { id: 'printed', label: 'Printed', count: 2345 },
            { id: 'floral', label: 'Floral', count: 678 },
            { id: 'geometric', label: 'Geometric', count: 534 },
            { id: 'polka-dots', label: 'Polka Dots', count: 423 },
            { id: 'abstract', label: 'Abstract', count: 789 },
            { id: 'graphic', label: 'Graphic', count: 1234 },
            { id: 'camouflage', label: 'Camouflage', count: 345 },
        ],
    },
    {
        id: 'occasion',
        title: 'OCCASION',
        type: 'checkbox',
        categories: ['shirts', 'topwear', 't-shirts', 'jeans', 'bottomwear'],
        options: [
            { id: 'casual', label: 'Casual', count: 4567 },
            { id: 'formal', label: 'Formal', count: 2345 },
            { id: 'party', label: 'Party', count: 1234 },
            { id: 'sports', label: 'Sports', count: 876 },
            { id: 'festive', label: 'Festive', count: 654 },
            { id: 'office', label: 'Office', count: 1890 },
            { id: 'travel', label: 'Travel', count: 567 },
        ],
    },

    // JEANS/BOTTOMWEAR SPECIFIC FILTERS
    {
        id: 'rise',
        title: 'RISE',
        type: 'checkbox',
        categories: ['jeans', 'bottomwear', 'trousers'],
        options: [
            { id: 'low-rise', label: 'Low Rise', count: 1234 },
            { id: 'mid-rise', label: 'Mid Rise', count: 2456 },
            { id: 'high-rise', label: 'High Rise', count: 1876 },
        ],
    },
    {
        id: 'length',
        title: 'LENGTH',
        type: 'checkbox',
        categories: ['jeans', 'bottomwear', 'trousers'],
        options: [
            { id: 'full-length', label: 'Full Length', count: 3456 },
            { id: 'cropped', label: 'Cropped', count: 1234 },
            { id: 'ankle-length', label: 'Ankle Length', count: 876 },
            { id: 'shorts', label: 'Shorts', count: 1567 },
        ],
    },
    {
        id: 'wash',
        title: 'WASH',
        type: 'checkbox',
        categories: ['jeans', 'bottomwear'],
        options: [
            { id: 'light-wash', label: 'Light Wash', count: 1456 },
            { id: 'medium-wash', label: 'Medium Wash', count: 2134 },
            { id: 'dark-wash', label: 'Dark Wash', count: 1876 },
            { id: 'black-wash', label: 'Black Wash', count: 987 },
            { id: 'acid-wash', label: 'Acid Wash', count: 345 },
            { id: 'stone-wash', label: 'Stone Wash', count: 567 },
        ],
    },
    {
        id: 'distress',
        title: 'DISTRESS LEVEL',
        type: 'checkbox',
        categories: ['jeans', 'bottomwear'],
        options: [
            { id: 'clean', label: 'Clean Look', count: 2345 },
            { id: 'light-distress', label: 'Light Distress', count: 1234 },
            { id: 'medium-distress', label: 'Medium Distress', count: 876 },
            { id: 'heavy-distress', label: 'Heavy Distress', count: 456 },
        ],
    },
    {
        id: 'stretch',
        title: 'STRETCH',
        type: 'checkbox',
        categories: ['jeans', 'bottomwear'],
        options: [
            { id: 'stretchable', label: 'Stretchable', count: 2456 },
            { id: 'non-stretch', label: 'Non-Stretch', count: 1234 },
        ],
    },

    // FOOTWEAR SPECIFIC FILTERS
    {
        id: 'shoe-type',
        title: 'SHOE TYPE',
        type: 'checkbox',
        categories: ['footwear', 'shoes'],
        options: [
            { id: 'sneakers', label: 'Sneakers', count: 2345 },
            { id: 'formal-shoes', label: 'Formal Shoes', count: 1456 },
            { id: 'loafers', label: 'Loafers', count: 876 },
            { id: 'boots', label: 'Boots', count: 654 },
            { id: 'sandals', label: 'Sandals', count: 1234 },
            { id: 'flip-flops', label: 'Flip Flops', count: 567 },
            { id: 'sports-shoes', label: 'Sports Shoes', count: 1890 },
            { id: 'casual-shoes', label: 'Casual Shoes', count: 2134 },
        ],
    },
    {
        id: 'closure',
        title: 'CLOSURE TYPE',
        type: 'checkbox',
        categories: ['footwear', 'shoes'],
        options: [
            { id: 'lace-up', label: 'Lace-Up', count: 2456 },
            { id: 'slip-on', label: 'Slip-On', count: 1876 },
            { id: 'velcro', label: 'Velcro', count: 456 },
            { id: 'buckle', label: 'Buckle', count: 345 },
            { id: 'zipper', label: 'Zipper', count: 567 },
        ],
    },
    {
        id: 'sole-material',
        title: 'SOLE MATERIAL',
        type: 'checkbox',
        categories: ['footwear', 'shoes'],
        options: [
            { id: 'rubber', label: 'Rubber', count: 3456 },
            { id: 'eva', label: 'EVA', count: 1234 },
            { id: 'leather', label: 'Leather', count: 876 },
            { id: 'pu', label: 'PU', count: 1567 },
            { id: 'tpr', label: 'TPR', count: 654 },
        ],
    },

    // ACCESSORIES SPECIFIC FILTERS
    {
        id: 'accessory-type',
        title: 'ACCESSORY TYPE',
        type: 'checkbox',
        categories: ['accessories'],
        options: [
            { id: 'watches', label: 'Watches', count: 1456 },
            { id: 'bags', label: 'Bags', count: 2134 },
            { id: 'wallets', label: 'Wallets', count: 876 },
            { id: 'belts', label: 'Belts', count: 654 },
            { id: 'sunglasses', label: 'Sunglasses', count: 1234 },
            { id: 'caps', label: 'Caps & Hats', count: 567 },
            { id: 'ties', label: 'Ties', count: 345 },
            { id: 'scarves', label: 'Scarves', count: 456 },
        ],
    },
    {
        id: 'watch-type',
        title: 'WATCH TYPE',
        type: 'checkbox',
        categories: ['accessories', 'watches'],
        options: [
            { id: 'analog', label: 'Analog', count: 1234 },
            { id: 'digital', label: 'Digital', count: 876 },
            { id: 'chronograph', label: 'Chronograph', count: 456 },
            { id: 'smart-watch', label: 'Smart Watch', count: 789 },
        ],
    },
    {
        id: 'bag-type',
        title: 'BAG TYPE',
        type: 'checkbox',
        categories: ['accessories', 'bags'],
        options: [
            { id: 'backpack', label: 'Backpack', count: 1456 },
            { id: 'messenger', label: 'Messenger Bag', count: 567 },
            { id: 'duffle', label: 'Duffle Bag', count: 345 },
            { id: 'laptop-bag', label: 'Laptop Bag', count: 876 },
            { id: 'tote', label: 'Tote Bag', count: 234 },
        ],
    },

    // COMMON FILTERS (Apply to all categories)
    {
        id: 'brand',
        title: 'BRAND',
        type: 'checkbox',
        categories: [], // Empty means applies to all
        options: [
            { id: 'highlander', label: 'HIGHLANDER', count: 2289 },
            { id: 'roadster', label: 'Roadster', count: 928 },
            { id: 'flying-machine', label: 'Flying Machine', count: 318 },
            { id: 'stylecast', label: 'StyleCast', count: 269 },
            { id: 'here-now', label: 'HERE&NOW', count: 186 },
            { id: 'mast-harbour', label: 'Mast & Harbour', count: 241 },
            { id: 'levis', label: "Levi's", count: 456 },
            { id: 'nike', label: 'Nike', count: 789 },
            { id: 'adidas', label: 'Adidas', count: 654 },
            { id: 'puma', label: 'Puma', count: 543 },
            { id: 'us-polo', label: 'U.S. Polo Assn.', count: 432 },
            { id: 'allen-solly', label: 'Allen Solly', count: 567 },
        ],
    },
    {
        id: 'price',
        title: 'PRICE',
        type: 'range',
        categories: [],
        min: 180,
        max: 11000,
    },
    {
        id: 'color',
        title: 'COLOR',
        type: 'color',
        categories: [],
        options: [
            { id: 'black', label: 'Black', count: 3926 },
            { id: 'white', label: 'White', count: 2664 },
            { id: 'blue', label: 'Blue', count: 3421 },
            { id: 'gray', label: 'Gray', count: 1609 },
            { id: 'green', label: 'Green', count: 1847 },
            { id: 'navy-blue', label: 'Navy Blue', count: 1414 },
            { id: 'olive', label: 'Olive', count: 316 },
            { id: 'red', label: 'Red', count: 892 },
            { id: 'yellow', label: 'Yellow', count: 456 },
            { id: 'pink', label: 'Pink', count: 678 },
            { id: 'brown', label: 'Brown', count: 1234 },
            { id: 'beige', label: 'Beige', count: 567 },
        ],
    },
    {
        id: 'discount',
        title: 'DISCOUNT RANGE',
        type: 'radio',
        categories: [],
        options: [
            { id: '10-above', label: '10% and above' },
            { id: '20-above', label: '20% and above' },
            { id: '30-above', label: '30% and above' },
            { id: '40-above', label: '40% and above' },
            { id: '50-above', label: '50% and above' },
            { id: '60-above', label: '60% and above' },
            { id: '70-above', label: '70% and above' },
            { id: '80-above', label: '80% and above' },
        ],
    },
];

interface ProductFiltersProps {
    onFilterChange: (filters: any) => void;
    category?: string; // Current product category (e.g., 'shirts', 'jeans', 'accessories')
}

// Export the filter sections so they can be used in other components
export { allFilterSections };

// Helper function to get filter sections for a specific category
export function getFilterSectionsForCategory(category: string) {
    return allFilterSections.filter(section => {
        // If section has no categories specified, it applies to all
        if (!section.categories || section.categories.length === 0) {
            return true;
        }
        // Otherwise, check if current category matches
        return section.categories.includes(category);
    });
}

export default function ProductFilters({ onFilterChange, category = 'all' }: ProductFiltersProps) {
    const [expandedSections, setExpandedSections] = useState<string[]>([]); // All sections start collapsed
    const [selectedFilters, setSelectedFilters] = useState<any>({});
    const [priceRange, setPriceRange] = useState<number[]>([180, 11000]);
    const [showMoreSections, setShowMoreSections] = useState<{ [key: string]: boolean }>({});

    // Filter sections based on current category
    const filterSections = useMemo(() => {
        return allFilterSections.filter(section => {
            // If section has no categories specified, it applies to all
            if (!section.categories || section.categories.length === 0) {
                return true;
            }
            // Otherwise, check if current category matches
            return section.categories.includes(category);
        });
    }, [category]);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const toggleShowMore = (sectionId: string) => {
        setShowMoreSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleCheckboxChange = (sectionId: string, optionId: string) => {
        setSelectedFilters((prev: any) => {
            const sectionFilters = prev[sectionId] || [];
            const newFilters = sectionFilters.includes(optionId)
                ? sectionFilters.filter((id: string) => id !== optionId)
                : [...sectionFilters, optionId];

            const updated = { ...prev, [sectionId]: newFilters };
            onFilterChange(updated);
            return updated;
        });
    };

    const handleRadioChange = (sectionId: string, optionId: string) => {
        setSelectedFilters((prev: any) => {
            const updated = { ...prev, [sectionId]: optionId };
            onFilterChange(updated);
            return updated;
        });
    };

    const handlePriceChange = (index: number, value: number) => {
        const newRange = [...priceRange];
        newRange[index] = value;

        // Ensure min doesn't exceed max and vice versa
        if (index === 0 && value > priceRange[1]) {
            newRange[1] = value;
        } else if (index === 1 && value < priceRange[0]) {
            newRange[0] = value;
        }

        setPriceRange(newRange);
        setSelectedFilters((prev: any) => {
            const updated = { ...prev, price: newRange };
            onFilterChange(updated);
            return updated;
        });
    };

    const clearAll = () => {
        setSelectedFilters({});
        setPriceRange([180, 11000]);
        onFilterChange({});
    };

    const getColorClass = (colorId: string) => {
        const colors: any = {
            black: 'bg-black',
            white: 'bg-white border-gray-300',
            blue: 'bg-blue-600',
            gray: 'bg-gray-500',
            green: 'bg-green-600',
            'navy-blue': 'bg-blue-900',
            olive: 'bg-green-700',
            red: 'bg-red-600',
            yellow: 'bg-yellow-400',
            pink: 'bg-pink-500',
            brown: 'bg-amber-800',
            beige: 'bg-amber-200',
        };
        return colors[colorId] || 'bg-gray-400';
    };

    return (
        <div className="w-64 shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase">FILTERS</h3>
                <button
                    onClick={clearAll}
                    className="text-xs text-red-600 font-semibold hover:underline"
                >
                    CLEAR ALL
                </button>
            </div>

            {/* Filter Sections */}
            <div className="space-y-6">
                {filterSections.map((section) => {
                    const INITIAL_SHOW_COUNT = 10;
                    const showMore = showMoreSections[section.id] || false;
                    const hasOptions = section.options && section.options.length > 0;
                    const displayOptions = hasOptions && !showMore
                        ? section.options!.slice(0, INITIAL_SHOW_COUNT)
                        : section.options;
                    const hasMoreOptions = hasOptions && section.options!.length > INITIAL_SHOW_COUNT;

                    return (
                        <div key={section.id} className="border-b border-gray-200 pb-4">
                            {/* Section Header */}
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="flex items-center justify-between w-full mb-3"
                            >
                                <h4 className="text-xs font-bold uppercase">{section.title}</h4>
                                {expandedSections.includes(section.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>

                            {/* Section Content */}
                            {expandedSections.includes(section.id) && (
                                <div className="space-y-2">
                                    {section.type === 'checkbox' && displayOptions && (
                                        <>
                                            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                                                {displayOptions.map((option) => (
                                                    <label
                                                        key={option.id}
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters[section.id]?.includes(option.id) || false}
                                                            onChange={() => handleCheckboxChange(section.id, option.id)}
                                                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                                        />
                                                        <span className="text-xs text-gray-700 flex-1">
                                                            {option.label}
                                                        </span>
                                                        {option.count && (
                                                            <span className="text-xs text-gray-500">({option.count})</span>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                            {hasMoreOptions && (
                                                <button
                                                    onClick={() => toggleShowMore(section.id)}
                                                    className="text-xs text-blue-600 font-semibold hover:underline mt-2 flex items-center gap-1"
                                                >
                                                    {showMore ? (
                                                        <>
                                                            <ChevronUp className="w-3 h-3" />
                                                            Show Less
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-3 h-3" />
                                                            Show More ({section.options!.length - INITIAL_SHOW_COUNT} more)
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {section.type === 'radio' && section.options && (
                                        <div className="space-y-2">
                                            {section.options.map((option) => (
                                                <label
                                                    key={option.id}
                                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={section.id}
                                                        checked={selectedFilters[section.id] === option.id}
                                                        onChange={() => handleRadioChange(section.id, option.id)}
                                                        className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                                                    />
                                                    <span className="text-xs text-gray-700">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {section.type === 'range' && (
                                        <div className="space-y-4 pt-2">
                                            {/* Price Display */}
                                            <div className="flex items-center justify-between text-xs font-semibold">
                                                <span>₹{priceRange[0].toLocaleString()}</span>
                                                <span>₹{priceRange[1].toLocaleString()}</span>
                                            </div>

                                            {/* Custom Two-Sided Slider */}
                                            <div className="relative h-6 flex items-center">
                                                {/* Track */}
                                                <div className="absolute w-full h-1.5 bg-gray-200 rounded-full">
                                                    {/* Active Track */}
                                                    <div
                                                        className="absolute h-full bg-black rounded-full"
                                                        style={{
                                                            left: `${((priceRange[0] - (section.min || 0)) / ((section.max || 11000) - (section.min || 0))) * 100}%`,
                                                            right: `${100 - ((priceRange[1] - (section.min || 0)) / ((section.max || 11000) - (section.min || 0))) * 100}%`,
                                                        }}
                                                    />
                                                </div>

                                                {/* Min Thumb */}
                                                <input
                                                    type="range"
                                                    min={section.min}
                                                    max={section.max}
                                                    value={priceRange[0]}
                                                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                                                    className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing"
                                                />

                                                {/* Max Thumb */}
                                                <input
                                                    type="range"
                                                    min={section.min}
                                                    max={section.max}
                                                    value={priceRange[1]}
                                                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                                                    className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing"
                                                />
                                            </div>

                                            {/* Input Fields */}
                                            <div className="flex items-center gap-2 mt-3">
                                                <input
                                                    type="number"
                                                    value={priceRange[0]}
                                                    onChange={(e) => handlePriceChange(0, parseInt(e.target.value) || 0)}
                                                    className="w-20 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
                                                    placeholder="Min"
                                                />
                                                <span className="text-xs text-gray-500">to</span>
                                                <input
                                                    type="number"
                                                    value={priceRange[1]}
                                                    onChange={(e) => handlePriceChange(1, parseInt(e.target.value) || 0)}
                                                    className="w-20 px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-black"
                                                    placeholder="Max"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {section.type === 'color' && displayOptions && (
                                        <>
                                            <div className="space-y-2">
                                                {displayOptions.map((option) => (
                                                    <label
                                                        key={option.id}
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters[section.id]?.includes(option.id) || false}
                                                            onChange={() => handleCheckboxChange(section.id, option.id)}
                                                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                                        />
                                                        <div className={`w-4 h-4 rounded-full border ${getColorClass(option.id)}`} />
                                                        <span className="text-xs text-gray-700 flex-1">{option.label}</span>
                                                        {option.count && (
                                                            <span className="text-xs text-gray-500">({option.count})</span>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                            {hasMoreOptions && (
                                                <button
                                                    onClick={() => toggleShowMore(section.id)}
                                                    className="text-xs text-blue-600 font-semibold hover:underline mt-2 flex items-center gap-1"
                                                >
                                                    {showMore ? (
                                                        <>
                                                            <ChevronUp className="w-3 h-3" />
                                                            Show Less
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-3 h-3" />
                                                            Show More ({section.options!.length - INITIAL_SHOW_COUNT} more)
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
