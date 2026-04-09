'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Upload, Save, Trash2, Palette, Layers, Settings, Image as ImageIcon, Tag, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURATION ---
const CATEGORY_DATA = {
    masters: ['Men', 'Women', 'Kids', 'Unisex'],
    subs: { 'Men': ['Topwear', 'Bottomwear', 'Footwear', 'Accessories'], 'Women': ['Topwear', 'Bottomwear', 'Footwear', 'Accessories'] } as Record<string, string[]>,
    types: {
        'Topwear': ['Shirts', 'T-shirts', 'Jackets'],
        'Accessories': ['Watches', 'Bags', 'Sunglasses'],
        'Bottomwear': ['Jeans', 'Trousers'],
        'Footwear': ['Sneakers', 'Formal Shoes']
    } as Record<string, string[]>,
};

const SPEC_CONFIG: Record<string, string[]> = {
    'Shirts': ['Sleeve Type', 'Collar Type', 'Fit Type', 'Fabric', 'Pattern'],
    'Watches': ['Watch Type', 'Strap Material', 'Movement', 'Water Resistance'],
    'Jeans': ['Fit Type', 'Rise', 'Wash', 'Fabric'],
    'default': ['Fabric', 'Pattern', 'Occasion']
};

const SIZE_GROUPS = [
    { id: 'alpha', label: 'Alpha Sizes (Topwear)', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] },
    { id: 'bottom', label: 'Waist Sizes (Bottomwear)', options: ['28', '30', '32', '34', '36', '38', '40'] },
    { id: 'foot', label: 'Shoe Sizes (Footwear)', options: ['6', '7', '8', '9', '10', '11', '12'] }
];

const INITIAL_OPTIONS: Record<string, string[]> = {
    'Watch Type': ['Analog', 'Digital', 'Smartwatch'],
    'Strap Material': ['Leather', 'Stainless Steel', 'Silicone'],
    'Fabric': ['Cotton', 'Linen', 'Polyester'],
    'Color': ['Black', 'White', 'Blue', 'Silver', 'Gold']
};

export default function AddProductPage() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('basic');
    const [form, setForm] = useState({ name: '', desc: '', price: '', mrp: '', brand: '', master: '', sub: '', type: '' });
    const [specs, setSpecs] = useState<Record<string, string>>({});

    // Variants State
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sizeGroup, setSizeGroup] = useState<string | null>(null);
    const [selectedColors, setSelectedColors] = useState<{ name: string, hex: string }[]>([]);

    // Custom Options & UI Helpers
    const [customOptions, setCustomOptions] = useState(INITIAL_OPTIONS);
    const [adding, setAdding] = useState<{ type: string, key?: string } | null>(null);
    const [tempVal, setTempVal] = useState('');
    const [tempColor, setTempColor] = useState({ name: '', hex: '#000000' });

    // --- LOGIC ---
    const TABS = [
        { id: 'basic', label: 'General', icon: Tag },
        { id: 'cat', label: 'Category', icon: Layers },
        { id: 'spec', label: 'Specs', icon: Settings },
        { id: 'var', label: 'Variants', icon: Palette },
        { id: 'media', label: 'Media', icon: ImageIcon },
    ];

    const currentIdx = TABS.findIndex(t => t.id === activeTab);
    const nextTab = () => currentIdx < TABS.length - 1 && setActiveTab(TABS[currentIdx + 1].id);
    const prevTab = () => currentIdx > 0 && setActiveTab(TABS[currentIdx - 1].id);

    const toggleSize = (group: string, val: string) => {
        if (sizeGroup !== group) {
            setSelectedSizes([val]);
            setSizeGroup(group);
        } else {
            setSelectedSizes(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
        }
    };

    const handleAddOption = () => {
        if (!tempVal) return;
        setCustomOptions(prev => ({ ...prev, [adding!.key!]: [...(prev[adding!.key!] || []), tempVal] }));
        setSpecs(p => ({ ...p, [adding!.key!]: tempVal }));
        setTempVal(''); setAdding(null);
    };

    const handleAddColor = () => {
        if (!tempColor.name) return;
        setSelectedColors(prev => [...prev, tempColor]);
        setTempColor({ name: '', hex: '#000000' }); setAdding(null);
    };

    return (
        <div className="w-full pb-20 font-sans px-4 md:px-0">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold uppercase tracking-tight">Create Product</h1>
                    <p className="text-gray-500 font-semibold text-lg mt-1 italic-none">Define your collection</p>
                </div>
                <button className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-bold shadow-xl shadow-black/10 hover:scale-[1.02] transition-all">
                    <Save className="w-5 h-5" /> PUBLISH PRODUCT
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <nav className="lg:col-span-3 space-y-2 sticky top-24 h-fit hidden lg:block">
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center w-full px-6 py-4 rounded-xl font-bold transition-all ${activeTab === t.id ? 'bg-black text-white shadow-lg scale-[1.02]' : 'bg-white text-gray-400 hover:bg-gray-50'}`}>
                            <t.icon className="w-5 h-5 mr-3" /> {t.label}
                        </button>
                    ))}
                </nav>

                <main className="col-span-1 lg:col-span-9 bg-white p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm min-h-[600px] flex flex-col">
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {activeTab === 'basic' && (
                                <motion.div key="1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                                    <h2 className="text-2xl font-bold uppercase border-b pb-4 border-gray-50">General Information</h2>
                                    <div className="grid gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                                            <input placeholder="e.g. Premium Slim Fit Linen Shirt" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold text-xl outline-none focus:ring-1 focus:ring-black" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                            <textarea placeholder="Write about fabric, fit and style..." rows={5} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-xl font-semibold outline-none focus:ring-1 focus:ring-black" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Price</label>
                                                <input placeholder="0.00" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">MRP</label>
                                                <input placeholder="0.00" type="number" value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold text-gray-400 line-through outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Brand</label>
                                                <input placeholder="Brand Name" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'cat' && (
                                <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <h2 className="text-2xl font-bold uppercase border-b pb-4 border-gray-50">Classification</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {[
                                            { label: 'Master Category', key: 'master', data: CATEGORY_DATA.masters },
                                            { label: 'Sub Category', key: 'sub', data: CATEGORY_DATA.subs[form.master] || [] },
                                            { label: 'Product Type', key: 'type', data: CATEGORY_DATA.types[form.sub] || [] }
                                        ].map(col => (
                                            <div key={col.key} className="space-y-4">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{col.label}</span>
                                                <div className="space-y-2">
                                                    {col.data.map(item => (
                                                        <button key={item} onClick={() => setForm({ ...form, [col.key]: item })} className={`w-full p-4 rounded-xl font-bold text-sm border transition-all ${form[col.key as keyof typeof form] === item ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}>
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'spec' && (
                                <motion.div key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                                    <h2 className="text-2xl font-bold uppercase border-b pb-4 border-gray-50">Specifications for {form.type || 'Product'}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        {(SPEC_CONFIG[form.type] || SPEC_CONFIG['default']).map(s => (
                                            <div key={s} className="space-y-3">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s}</label>
                                                    <button onClick={() => setAdding({ type: 'option', key: s })} className="text-xs font-bold text-blue-600 hover:underline">+ ADD NEW</button>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {(customOptions[s] || []).map(opt => (
                                                        <button key={opt} onClick={() => setSpecs({ ...specs, [s]: opt })} className={`p-4 rounded-xl text-xs font-bold border transition-all ${specs[s] === opt ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-100'}`}>
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'var' && (
                                <motion.div key="4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                                    <h2 className="text-2xl font-bold uppercase border-b pb-4 border-gray-50">Variants</h2>

                                    {/* Categorized Size Selection */}
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Size Selection (Please choose one scale)</label>
                                            {sizeGroup && <button onClick={() => { setSizeGroup(null); setSelectedSizes([]); }} className="text-xs font-bold text-red-500 hover:underline">RESET SIZES</button>}
                                        </div>
                                        <div className="space-y-10">
                                            {SIZE_GROUPS.map(group => (
                                                <div key={group.id} className={`space-y-4 transition-opacity ${sizeGroup && sizeGroup !== group.id ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                                    <h3 className="text-xs font-bold text-black/40 uppercase bg-gray-50 py-1 px-3 rounded-full w-fit">{group.label}</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {group.options.map(sz => (
                                                            <button key={sz} onClick={() => toggleSize(group.id, sz)} className={`px-6 py-4 rounded-xl font-bold text-sm border transition-all ${selectedSizes.includes(sz) ? 'bg-black text-white border-black scale-105 shadow-lg' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                                                                {sz}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Selection Restore */}
                                    <div className="space-y-6 pt-8 border-t border-gray-50">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Visual Palette</label>
                                            <button onClick={() => setAdding({ type: 'color' })} className="text-xs font-bold text-blue-600 hover:underline">+ ADD CUSTOM COLOR</button>
                                        </div>
                                        <div className="flex flex-wrap gap-6 items-start">
                                            {selectedColors.map((c, i) => (
                                                <div key={i} className="flex flex-col items-center gap-2 group relative">
                                                    <div className="w-14 h-14 rounded-xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: c.hex }}>
                                                        <button onClick={() => setSelectedColors(selectedColors.filter((_, idx) => idx !== i))} className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-md p-2 rounded-lg text-white transition-all">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{c.name}</span>
                                                </div>
                                            ))}
                                            <div className="flex flex-wrap gap-3 items-center min-h-[60px] pl-4 border-l border-gray-100">
                                                {['#000000', '#FFFFFF', '#2563EB', '#6B7280', '#DC2626', '#16A34A'].map(hex => (
                                                    <button key={hex} onClick={() => !selectedColors.find(c => c.hex === hex) && setSelectedColors([...selectedColors, { name: 'Group Selected', hex }])} className="w-10 h-10 rounded-full border border-gray-100 shadow-sm hover:scale-110 transition-all" style={{ backgroundColor: hex }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'media' && (
                                <motion.div key="5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center py-10">
                                    <h2 className="text-2xl font-bold uppercase border-b pb-4 border-gray-50 text-left">Media Assets</h2>
                                    <div className="border-4 border-dashed border-gray-50 rounded-2xl p-24 flex flex-col items-center justify-center space-y-6 bg-[#fafafa] hover:bg-white transition-all cursor-pointer">
                                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl"><Upload className="w-8 h-8 text-black" /></div>
                                        <div className="space-y-1">
                                            <p className="text-xl font-bold uppercase tracking-tight">Drop images here</p>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max 10 files • 10MB per image</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Navigation */}
                    <footer className="mt-12 flex justify-between items-center pt-8 border-t border-gray-50">
                        <button onClick={prevTab} disabled={currentIdx === 0} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${currentIdx === 0 ? 'opacity-0' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            <ChevronLeft className="w-4 h-4" /> PREVIOUS
                        </button>
                        {currentIdx < TABS.length - 1 ? (
                            <button onClick={nextTab} className="flex items-center gap-2 px-10 py-4 bg-black text-white rounded-xl font-bold text-sm shadow-xl shadow-black/10 hover:scale-[1.05] active:scale-95 transition-all">
                                NEXT STEP <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button className="px-12 py-4 bg-green-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-green-500/20 hover:scale-[1.05] transition-all uppercase tracking-widest">
                                Finalize & Save
                            </button>
                        )}
                    </footer>
                </main>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {adding && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdding(null)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm relative z-10 border border-gray-50">
                            {adding.type === 'color' ? (
                                <div className="space-y-6">
                                    <h3 className="font-bold uppercase tracking-widest text-xs">Custom Color Variant</h3>
                                    <div className="space-y-4">
                                        <input placeholder="Color Name (e.g. Navy Blue)" className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold" value={tempColor.name} onChange={e => setTempColor({ ...tempColor, name: e.target.value })} />
                                        <div className="flex gap-4 items-center">
                                            <input type="color" className="w-14 h-14 rounded-lg cursor-pointer bg-transparent border-none" value={tempColor.hex} onChange={e => setTempColor({ ...tempColor, hex: e.target.value })} />
                                            <input className="flex-1 p-4 bg-gray-50 rounded-xl outline-none font-bold uppercase" value={tempColor.hex} readOnly />
                                        </div>
                                    </div>
                                    <button onClick={handleAddColor} className="w-full p-4 bg-black text-white rounded-xl font-bold shadow-xl">ADD TO PALETTE</button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h3 className="font-bold uppercase tracking-widest text-xs">Add Option to {adding.key}</h3>
                                    <input autoFocus placeholder="New Value..." className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-lg ring-1 ring-gray-100 focus:ring-black" value={tempVal} onChange={e => setTempVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddOption()} />
                                    <div className="flex gap-2">
                                        <button onClick={() => setAdding(null)} className="flex-1 p-4 font-bold text-gray-400 bg-gray-50 rounded-xl">CANCEL</button>
                                        <button onClick={handleAddOption} className="flex-1 p-4 font-bold text-white bg-black rounded-xl">CONFIRM</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
