'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface SizeChartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const sizeData = {
    inches: [
        { size: 'XS', chest: '36', shoulder: '19.75', length: '29' },
        { size: 'S', chest: '38', shoulder: '20.5', length: '29' },
        { size: 'M', chest: '40', shoulder: '21.25', length: '29.5' },
        { size: 'L', chest: '42', shoulder: '22', length: '29.5' },
        { size: 'XL', chest: '44', shoulder: '22.75', length: '30' },
        { size: 'XXL', chest: '46', shoulder: '23.75', length: '30' },
        { size: 'XXXL', chest: '48', shoulder: '24.75', length: '30.5' },
    ],
    cm: [
        { size: 'XS', chest: '91', shoulder: '50', length: '74' },
        { size: 'S', chest: '97', shoulder: '52', length: '74' },
        { size: 'M', chest: '102', shoulder: '54', length: '75' },
        { size: 'L', chest: '107', shoulder: '56', length: '75' },
        { size: 'XL', chest: '112', shoulder: '58', length: '76' },
        { size: 'XXL', chest: '117', shoulder: '60', length: '76' },
        { size: 'XXXL', chest: '122', shoulder: '63', length: '77' },
    ],
};

export default function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
    const [activeTab, setActiveTab] = useState<'inches' | 'cm'>('inches');

    if (!isOpen) return null;

    const currentData = activeTab === 'inches' ? sizeData.inches : sizeData.cm;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900">Size Chart</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="p-4 md:p-6">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('inches')}
                                className={`pb-3 px-4 text-xs md:text-sm font-semibold transition-colors duration-200 ${activeTab === 'inches'
                                    ? 'text-black border-b-2 border-black'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                SIZE IN INCHES
                            </button>
                            <button
                                onClick={() => setActiveTab('cm')}
                                className={`pb-3 px-4 text-xs md:text-sm font-semibold transition-colors duration-200 ${activeTab === 'cm'
                                    ? 'text-black border-b-2 border-black'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                SIZE IN CM
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Size Table */}
                            <div className="lg:col-span-2">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900 border border-gray-200">
                                                    Size
                                                </th>
                                                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900 border border-gray-200">
                                                    Chest
                                                </th>
                                                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900 border border-gray-200">
                                                    Shoulder
                                                </th>
                                                <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900 border border-gray-200">
                                                    Length
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((row, index) => (
                                                <tr key={row.size} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-900 border border-gray-200">
                                                        {row.size}
                                                    </td>
                                                    <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 border border-gray-200">
                                                        {row.chest}
                                                    </td>
                                                    <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 border border-gray-200">
                                                        {row.shoulder}
                                                    </td>
                                                    <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 border border-gray-200">
                                                        {row.length}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* How to Measure - Mobile/Tablet */}
                                <div className="mt-6 lg:hidden bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">How To Measure</h3>
                                    <div className="space-y-2 text-xs text-gray-600">
                                        <p><strong>Chest:</strong> Measure around the fullest part of your chest</p>
                                        <p><strong>Shoulder:</strong> Measure from shoulder seam to shoulder seam</p>
                                        <p><strong>Length:</strong> Measure from highest point of shoulder to bottom hem</p>
                                    </div>
                                </div>
                            </div>

                            {/* Model Info - Desktop Only */}
                            <div className="hidden lg:block">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Model Measurements</h3>

                                    {/* Model Image */}
                                    <div className="relative w-full aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-gray-200">
                                        <Image
                                            src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&q=80"
                                            alt="Model"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="space-y-2 text-xs md:text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Size:</span>
                                            <span className="font-semibold text-gray-900">L</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Height:</span>
                                            <span className="font-semibold text-gray-900">6ft</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h4 className="text-xs font-semibold text-gray-900 mb-2">How To Measure</h4>
                                        <div className="space-y-1.5 text-xs text-gray-600">
                                            <p><strong>Chest:</strong> Around fullest part</p>
                                            <p><strong>Shoulder:</strong> Seam to seam</p>
                                            <p><strong>Length:</strong> Shoulder to hem</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
