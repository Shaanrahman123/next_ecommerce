'use client';

import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function MyWallet() {
    const transactions = [
        { id: '1', type: 'credit', amount: '$50.00', description: 'Refund for Order #12340', date: 'Dec 15, 2025' },
        { id: '2', type: 'debit', amount: '$25.00', description: 'Used for Order #12345', date: 'Dec 10, 2025' },
        { id: '3', type: 'credit', amount: '$100.00', description: 'Added to wallet', date: 'Dec 1, 2025' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-page-title text-gray-900 mb-2">My Wallet</h1>
                <p className="text-gray-600">Manage your store credit and wallet balance</p>
            </div>

            {/* Balance Card */}
            <div className="bg-linear-to-br from-black to-gray-800 text-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-gray-300 text-sm mb-2">Available Balance</p>
                        <h2 className="text-price font-bold">$250.00</h2>
                    </div>
                    <WalletIcon className="w-12 h-12 text-gray-400" />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium">
                    <Plus className="w-4 h-4" />
                    Add Money
                </button>
            </div>

            {/* Transaction History */}
            <div>
                <h2 className="text-section-title font-bold text-gray-900 mb-6">Transaction History</h2>
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    {transaction.type === 'credit' ? (
                                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{transaction.description}</p>
                                    <p className="text-sm text-gray-500">{transaction.date}</p>
                                </div>
                            </div>
                            <p className={`font-semibold text-lg ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
