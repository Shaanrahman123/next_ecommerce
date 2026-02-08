'use client';

import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function MyWallet() {
    const transactions = [
        { id: '1', type: 'credit', amount: '$50.00', description: 'Refund for Order #12340', date: 'Dec 15, 2025' },
        { id: '2', type: 'debit', amount: '$25.00', description: 'Used for Order #12345', date: 'Dec 10, 2025' },
        { id: '3', type: 'credit', amount: '$100.00', description: 'Added to wallet', date: 'Dec 1, 2025' },
    ];

    return (
        <div className="animate-fade-in pb-20 lg:pb-0">
            <div className="hidden lg:block mb-10">
                <h1 className="text-section-title font-black text-gray-900 mb-2 uppercase tracking-tight">My Wallet</h1>
                <p className="text-body text-gray-600">Manage your store credit and wallet balance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Balance Card */}
                <div className="lg:col-span-1">
                    <div className="bg-black text-white rounded-lg p-8 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full transition-transform duration-700 group-hover:scale-150" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center">
                                    <WalletIcon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available Balance</p>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-10">₹25,000.00</h2>
                            <Button className="w-full h-14 bg-white text-black rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                                <Plus className="w-4 h-4" />
                                Add Money
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-300 bg-gray-50/50">
                            <h2 className="text-small font-black text-gray-900 uppercase tracking-widest border-l-4 border-black pl-3">Recent Transactions</h2>
                        </div>
                        <div className="divide-y divide-gray-300">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="p-6 flex items-center justify-between group transition-colors hover:bg-gray-50/50"
                                >
                                    <div className="flex items-center gap-4 lg:gap-6">
                                        <div className={`w-12 h-12 rounded-md flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${transaction.type === 'credit'
                                            ? 'bg-green-50 text-green-600 border border-gray-300'
                                            : 'bg-red-50 text-red-600 border border-gray-300'
                                            }`}>
                                            {transaction.type === 'credit' ? (
                                                <ArrowDownLeft className="w-5 h-5" />
                                            ) : (
                                                <ArrowUpRight className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-small font-black text-gray-900 uppercase tracking-tight mb-1">{transaction.description}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{transaction.date}</p>
                                        </div>
                                    </div>
                                    <p className={`text-body font-black uppercase tracking-tight ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
