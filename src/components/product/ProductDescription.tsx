'use client';

import { useState } from 'react';
import { ChevronDown, Package, Ruler, Shirt } from 'lucide-react';

interface ProductDescriptionProps {
    description: string;
    category: string;
}

export default function ProductDescription({ description, category }: ProductDescriptionProps) {
    const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'care'>('description');

    const tabs = [
        { id: 'description' as const, label: 'Description', icon: Package },
        { id: 'specifications' as const, label: 'Specifications', icon: Ruler },
        { id: 'care' as const, label: 'Care Instructions', icon: Shirt },
    ];

    return (
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-6 py-3 md:py-4 text-small font-semibold transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-black text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 lg:p-8">
                {activeTab === 'description' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-section-title text-gray-900 mb-4">Product Description</h3>
                        <p className="text-body text-gray-700">{description}</p>
                        <div className="mt-6 space-y-3">
                            <h4 className="text-card-title text-gray-900">Key Features:</h4>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                                    <span className="text-body text-gray-700">Premium quality materials for lasting durability</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                                    <span className="text-gray-700">Carefully crafted with attention to detail</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                                    <span className="text-gray-700">Versatile design suitable for various occasions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
                                    <span className="text-gray-700">Comfortable fit for all-day wear</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'specifications' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-section-title text-gray-900 mb-4">Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-between py-3 border-b border-gray-200">
                                <span className="text-body text-gray-600">Material</span>
                                <span className="text-body font-medium text-gray-900">Premium Cotton Blend</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-200">
                                <span className="text-gray-600">Fit</span>
                                <span className="font-medium">Regular Fit</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-200">
                                <span className="text-gray-600">Pattern</span>
                                <span className="font-medium">Solid</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-200">
                                <span className="text-gray-600">Occasion</span>
                                <span className="font-medium">Casual</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-200">
                                <span className="text-gray-600">Sleeve</span>
                                <span className="font-medium">Full Sleeve</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-200">
                                <span className="text-gray-600">Neck Type</span>
                                <span className="font-medium">Round Neck</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'care' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-section-title text-gray-900 mb-4">Care Instructions</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <span className="text-2xl">🧺</span>
                                <div>
                                    <p className="text-card-title text-gray-900">Machine Wash</p>
                                    <p className="text-small text-gray-600">Wash with similar colors in cold water</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <span className="text-2xl">🌡️</span>
                                <div>
                                    <p className="font-semibold">Low Temperature</p>
                                    <p className="text-gray-600 text-sm">Iron on low heat if needed</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <span className="text-2xl">☀️</span>
                                <div>
                                    <p className="font-semibold">Dry Naturally</p>
                                    <p className="text-gray-600 text-sm">Hang to dry, avoid direct sunlight</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <span className="text-2xl">❌</span>
                                <div>
                                    <p className="font-semibold">Do Not Bleach</p>
                                    <p className="text-gray-600 text-sm">Avoid using bleach or harsh chemicals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
