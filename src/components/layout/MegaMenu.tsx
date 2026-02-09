'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface MegaMenuProps {
    sections: Array<{
        title: string;
        basePath: string;
        items: Array<{ name: string; slug: string; image: string }>;
    }>;
    featuredImage: string;
    label: string;
    isOpen: boolean;
    onNavItemClick: () => void;
}

export default function MegaMenu({ sections, featuredImage, label, isOpen, onNavItemClick }: MegaMenuProps) {
    return (
        <div
            className={`
                fixed left-0 right-0 top-[100px] bottom-0 bg-white shadow-2xl border-t border-gray-100 
                transition-all duration-500 z-40 overflow-y-auto
                ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4 pointer-events-none'}
            `}
        >
            <div className="container mx-auto px-8 lg:px-16 xl:px-24 py-12">
                <div className="grid grid-cols-12 gap-12">
                    {/* Content Sections */}
                    <div className="col-span-9 grid grid-cols-3 gap-10">
                        {sections.map((section, idx) => (
                            <div key={idx} className="space-y-8">
                                <Link
                                    href={section.basePath}
                                    onClick={onNavItemClick}
                                    className="block group/title"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight group-hover/title:text-black transition-colors">
                                        {section.title}
                                    </h3>
                                    <div className="w-8 h-0.5 bg-black mt-2 transform scale-x-0 group-hover/title:scale-x-100 transition-transform origin-left duration-300" />
                                </Link>

                                <div className="space-y-4">
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.slug}
                                            href={`${section.basePath}&item=${item.slug}`}
                                            onClick={onNavItemClick}
                                            className="group/item flex items-center gap-4 transition-all hover:bg-gray-50 p-2 -ml-2 rounded-xl"
                                        >
                                            <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-600 group-hover/item:text-black transition-colors">
                                                    {item.name}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Featured Side Image */}
                    <div className="col-span-3">
                        <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-2xl group/featured">
                            <Image
                                src={featuredImage}
                                alt={`${label} featured`}
                                fill
                                className="object-cover group-hover/featured:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                <span className="text-sm font-bold capitalize text-gray-300 mb-2 block">Premium Collection</span>
                                <h3 className="text-3xl font-bold mb-4 tracking-tight">
                                    {label}
                                </h3>
                                <Link
                                    href={`/products?category=${label.toLowerCase()}`}
                                    onClick={onNavItemClick}
                                    className="inline-flex items-center gap-2 text-sm font-bold capitalize hover:gap-3 transition-all duration-300 border-b-2 border-white pb-2"
                                >
                                    Explore All
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
