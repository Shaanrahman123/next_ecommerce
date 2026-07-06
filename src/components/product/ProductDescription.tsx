'use client';

import { useState } from 'react';
import { Package, Ruler, Shirt } from 'lucide-react';

interface ProductDescriptionProps {
  description: string;
  category: string;
  specifications?: { key: string; value: string }[];
  material?: string;
  season?: string;
  brand?: string;
}

export default function ProductDescription({
  description,
  category,
  specifications = [],
  material,
  season,
  brand,
}: ProductDescriptionProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'care'>('description');

  const tabs = [
    { id: 'description' as const, label: 'Description', icon: Package },
    { id: 'specifications' as const, label: 'Specifications', icon: Ruler },
    { id: 'care' as const, label: 'Care Instructions', icon: Shirt },
  ];

  const specRows: { label: string; value: string }[] = [
    ...(brand ? [{ label: 'Brand', value: brand }] : []),
    { label: 'Category', value: category },
    ...(material ? [{ label: 'Material', value: material }] : []),
    ...(season ? [{ label: 'Season', value: season }] : []),
    ...specifications.map((s) => ({ label: s.key, value: s.value })),
  ];

  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-amber-100 overflow-hidden">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-6 py-3 md:py-4 text-small font-semibold transition-all duration-300 ${
                activeTab === tab.id ? 'bg-primary text-on-primary' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 md:p-6 lg:p-8">
        {activeTab === 'description' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-section-title text-gray-900 mb-4">Product Description</h3>
            <p className="text-body text-gray-700 whitespace-pre-line leading-relaxed">{description}</p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-section-title text-gray-900 mb-4">Specifications</h3>
            {specRows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specRows.map((row) => (
                  <div key={row.label} className="flex justify-between py-3 border-b border-gray-200 gap-4">
                    <span className="text-body text-gray-600">{row.label}</span>
                    <span className="text-body font-medium text-gray-900 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body text-gray-500">No specifications available for this product.</p>
            )}
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-section-title text-gray-900 mb-4">Care Instructions</h3>
            <div className="space-y-3">
              {[
                { emoji: '🧺', title: 'Machine Wash', desc: 'Wash with similar colors in cold water' },
                { emoji: '🌡️', title: 'Low Temperature', desc: 'Iron on low heat if needed' },
                { emoji: '☀️', title: 'Dry Naturally', desc: 'Hang to dry, avoid direct sunlight' },
                { emoji: '❌', title: 'Do Not Bleach', desc: 'Avoid using bleach or harsh chemicals' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="text-card-title text-gray-900">{item.title}</p>
                    <p className="text-small text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
