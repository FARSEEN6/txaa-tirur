"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            setUser(user);
            toast.success("Welcome back!");
            router.push("/");
        } catch (error: any) {
            console.error("Login Error:", error);
            let message = "Failed to login";
            if (error.code === "auth/user-not-found") {
                message = "No account found with this email.";
            } else if (error.code === "auth/wrong-password") {
                message = "Incorrect password.";
            } else if (error.code === "auth/invalid-email") {
                message = "Invalid email address.";
            } else if (error.code === "auth/user-disabled") {
                message = "This account has been disabled.";
            } else if (error.code === "auth/invalid-credential") {
                message = "Invalid email or password.";
            } else if (error.message) {
                message = error.message;
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Image */}
            <div className="relative hidden md:block order-2">
                <Image
                    src="/images/hero.png"
                    alt="Login Background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                        <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
                        <p className="text-xl">Sign in to access your premium car accessories.</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-900 order-1">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sign In</h1>
                        <p className="mt-2 text-gray-500">Welcome back to TXAA</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            <Link href="/forgot-password" className="text-sm font-medium text-accent hover:text-blue-700">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-bold text-accent hover:text-blue-700">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
