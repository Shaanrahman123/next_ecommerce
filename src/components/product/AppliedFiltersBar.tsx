'use client';

import { X } from 'lucide-react';

interface AppliedFilter {
    id: string;
    label: string;
    section: string;
}

interface AppliedFiltersBarProps {
    filters: AppliedFilter[];
    onRemove: (filterId: string, section: string) => void;
    onClearAll: () => void;
}

export default function AppliedFiltersBar({ filters, onRemove, onClearAll }: AppliedFiltersBarProps) {
    if (filters.length === 0) return null;

    return (
        <div className="flex items-center gap-2 flex-wrap mb-6 pb-4 border-b border-gray-200">
            {filters.map((filter) => (
                <button
                    key={`${filter.section}-${filter.id}`}
                    onClick={() => onRemove(filter.id, filter.section)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                    <span>{filter.label}</span>
                    <X className="w-3 h-3" />
                </button>
            ))}
            <button
                onClick={onClearAll}
                className="text-xs text-black font-semibold hover:underline ml-2"
            >
                Clear All
            </button>
        </div>
    );
}
