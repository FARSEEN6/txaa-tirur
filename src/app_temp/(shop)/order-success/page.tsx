"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 dark:text-green-400">
                        <CheckCircle size={48} strokeWidth={3} />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-4 dark:text-white">Order Confirmed!</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Thank you for your purchase. We have received your order and will begin processing it right away. You will receive an email confirmation shortly.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/orders"
                        className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        View My Orders
                    </Link>
                    <Link
                        href="/"
                        className="block w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
