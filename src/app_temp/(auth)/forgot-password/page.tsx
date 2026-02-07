"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import toast from "react-hot-toast";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent! Check your inbox.");
            setEmail("");
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Image */}
            <div className="relative hidden md:block">
                <Image
                    src="/images/hero.png" // Use hero image for now
                    alt="Login Background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                        <h2 className="text-4xl font-bold mb-4">Secure Your Account</h2>
                        <p className="text-xl">Safety first for your premium experience.</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-900">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-accent mb-4">
                            <ArrowLeft size={16} className="mr-1" /> Back to Login
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
                        <p className="mt-2 text-gray-500">Enter your email to receive reset instructions</p>
                    </div>

                    <form onSubmit={handleReset} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    placeholder="name@example.com"
                                    required
                                />
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
