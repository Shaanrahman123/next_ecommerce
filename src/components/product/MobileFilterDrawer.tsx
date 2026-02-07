'use client';

import { useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';

interface FilterOption {
    id: string;
    label: string;
    count?: number;
}

interface FilterSection {
    id: string;
    title: string;
    type: 'checkbox' | 'radio' | 'range' | 'color' | 'search';
    options?: FilterOption[];
    min?: number;
    max?: number;
}

interface MobileFilterDrawerProps {
    sections: FilterSection[];
    selectedFilters: any;
    onFilterChange: (sectionId: string, optionId: string, type: 'checkbox' | 'radio') => void;
    onPriceChange?: (min: number, max: number) => void;
    priceRange?: number[];
}

export default function MobileFilterDrawer({
    sections,
    selectedFilters,
    onFilterChange,
    onPriceChange,
    priceRange = [180, 11000]
}: MobileFilterDrawerProps) {
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
    const [searchQuery, setSearchQuery] = useState('');

    const activeFilter = sections.find(s => s.id === activeSection);

    // Filter options based on search query
    const filteredOptions = activeFilter?.options?.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const displayOptions = searchQuery ? filteredOptions : activeFilter?.options || [];

    // Group options for some sections (like collar types)
    const getGroupedOptions = () => {
        if (!activeFilter || !displayOptions) return { topPicks: [], all: [] };

        // For demonstration, you can customize this logic per section
        if (activeFilter.id === 'collar-type') {
            const topPicks = displayOptions.slice(0, 3);
            const all = displayOptions.slice(3);
            return { topPicks, all };
        }

        return { topPicks: [], all: displayOptions };
    };

    const { topPicks, all } = getGroupedOptions();

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
        <div className="flex h-full">
            {/* Left Sidebar - Filter Categories */}
            <div className="w-32 bg-gray-50 border-r border-gray-200 overflow-y-auto scrollbar-hide">
                {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    const selectedCount = Array.isArray(selectedFilters[section.id])
                        ? selectedFilters[section.id].length
                        : selectedFilters[section.id] ? 1 : 0;

                    return (
                        <button
                            key={section.id}
                            onClick={() => {
                                setActiveSection(section.id);
                                setSearchQuery('');
                            }}
                            className={`w-full text-left px-3 py-3 text-xs border-b border-gray-200 transition-colors ${isActive ? 'bg-white font-semibold' : 'hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className={isActive ? 'text-gray-900' : 'text-gray-700'}>
                                    {section.title}
                                </span>
                                {selectedCount > 0 && (
                                    <span className="text-[12px] bg-gray-900 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                        {selectedCount}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Right Content - Filter Options */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Search Bar (if applicable) */}
                {activeFilter && activeFilter.type === 'checkbox' && activeFilter.options && activeFilter.options.length > 10 && (
                    <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search by ${activeFilter.title}`}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                        </div>
                    </div>
                )}

                {/* Options List */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {activeFilter?.type === 'checkbox' && (
                        <div className="p-3">
                            {/* Top Picks Section */}
                            {topPicks.length > 0 && (
                                <>
                                    <div className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        TOP PICKS
                                    </div>
                                    <div className="space-y-1 mb-4">
                                        {topPicks.map((option) => (
                                            <label
                                                key={option.id}
                                                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                                            >
                                                <div className="flex items-center gap-2 flex-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters[activeSection]?.includes(option.id) || false}
                                                        onChange={() => onFilterChange(activeSection, option.id, 'checkbox')}
                                                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                                    />
                                                    <span className="text-sm text-gray-900">{option.label}</span>
                                                </div>
                                                {option.count && (
                                                    <span className="text-xs text-gray-500">{option.count}</span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* All Options Section */}
                            {all.length > 0 && topPicks.length > 0 && (
                                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    ALL {activeFilter.title}
                                </div>
                            )}
                            <div className="space-y-1">
                                {(topPicks.length > 0 ? all : displayOptions).map((option) => (
                                    <label
                                        key={option.id}
                                        className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters[activeSection]?.includes(option.id) || false}
                                                onChange={() => onFilterChange(activeSection, option.id, 'checkbox')}
                                                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                            />
                                            <span className="text-sm text-gray-900">{option.label}</span>
                                        </div>
                                        {option.count && (
                                            <span className="text-xs text-gray-500">{option.count}</span>
                                        )}
                                    </label>
                                ))}
                            </div>

                            {displayOptions.length === 0 && searchQuery && (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No results found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}

                    {activeFilter?.type === 'radio' && activeFilter.options && (
                        <div className="p-3 space-y-1">
                            {activeFilter.options.map((option) => (
                                <label
                                    key={option.id}
                                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            type="radio"
                                            name={activeSection}
                                            checked={selectedFilters[activeSection] === option.id}
                                            onChange={() => onFilterChange(activeSection, option.id, 'radio')}
                                            className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                                        />
                                        <span className="text-sm text-gray-900">{option.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}

                    {activeFilter?.type === 'color' && activeFilter.options && (
                        <div className="p-3 space-y-1">
                            {activeFilter.options.map((option) => (
                                <label
                                    key={option.id}
                                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters[activeSection]?.includes(option.id) || false}
                                            onChange={() => onFilterChange(activeSection, option.id, 'checkbox')}
                                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                        />
                                        <div className={`w-4 h-4 rounded-full border ${getColorClass(option.id)}`} />
                                        <span className="text-sm text-gray-900">{option.label}</span>
                                    </div>
                                    {option.count && (
                                        <span className="text-xs text-gray-500">{option.count}</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    )}

                    {activeFilter?.type === 'range' && (
                        <div className="p-4">
                            <div className="space-y-4">
                                {/* Price Display */}
                                <div className="flex items-center justify-between text-sm font-semibold">
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
                                                left: `${((priceRange[0] - (activeFilter.min || 0)) / ((activeFilter.max || 11000) - (activeFilter.min || 0))) * 100}%`,
                                                right: `${100 - ((priceRange[1] - (activeFilter.min || 0)) / ((activeFilter.max || 11000) - (activeFilter.min || 0))) * 100}%`,
                                            }}
                                        />
                                    </div>

                                    {/* Min Thumb */}
                                    <input
                                        type="range"
                                        min={activeFilter.min}
                                        max={activeFilter.max}
                                        value={priceRange[0]}
                                        onChange={(e) => onPriceChange && onPriceChange(parseInt(e.target.value), priceRange[1])}
                                        className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing"
                                    />

                                    {/* Max Thumb */}
                                    <input
                                        type="range"
                                        min={activeFilter.min}
                                        max={activeFilter.max}
                                        value={priceRange[1]}
                                        onChange={(e) => onPriceChange && onPriceChange(priceRange[0], parseInt(e.target.value))}
                                        className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing"
                                    />
                                </div>

                                {/* Input Fields */}
                                <div className="flex items-center gap-2 mt-3">
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => onPriceChange && onPriceChange(parseInt(e.target.value) || 0, priceRange[1])}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                        placeholder="Min"
                                    />
                                    <span className="text-sm text-gray-500">to</span>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => onPriceChange && onPriceChange(priceRange[0], parseInt(e.target.value) || 0)}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
