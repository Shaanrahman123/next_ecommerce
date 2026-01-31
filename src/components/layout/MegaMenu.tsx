'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface MegaMenuProps {
    items: Array<{ name: string; slug: string; image: string }>;
    image: string; // Featured image
    type: string;
}

export default function MegaMenu({ items, image, type }: MegaMenuProps) {
    return (
        <div className="fixed left-0 right-0 top-[100px] bottom-0 w-full bg-white shadow-2xl border-t border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40 overflow-y-auto">
            <div className="container mx-auto px-8 lg:px-16 xl:px-24 py-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Items Grid - 9 columns */}
                    <div className="col-span-9">
                        <div className="grid grid-cols-4 gap-6">
                            {items.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/products?category=${type.toLowerCase()}&item=${item.slug}`}
                                    className="group/item block space-y-3"
                                >
                                    <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-gray-100">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover/item:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors duration-300" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-gray-900 group-hover/item:text-black">
                                            {item.name}
                                        </span>
                                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Featured Collection Image - 3 columns */}
                    <div className="col-span-3">
                        <div className="relative aspect-3/4 rounded-lg overflow-hidden shadow-lg group/image">
                            <Image
                                src={image}
                                alt={`${type} collection`}
                                fill
                                className="object-cover group-hover/image:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                <h3 className="text-3xl font-bold mb-3">
                                    {type}
                                </h3>
                                <Link
                                    href={`/products?category=${type.toLowerCase()}`}
                                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all duration-300 border-b border-white pb-1"
                                >
                                    Shop All
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

