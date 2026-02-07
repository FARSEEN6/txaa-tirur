"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, rtdb } from "@/firebase/config";
import { ref, set } from "firebase/database";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Create auth user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update profile
            await updateProfile(user, { displayName: name });

            // 3. Create Realtime Database Profile
            const userRef = ref(rtdb, 'users/' + user.uid);
            const createProfilePromise = set(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: name,
                role: "user",
                createdAt: new Date().toISOString(),
                wishlist: []
            });

            // Race against a 5-second timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Database write timed out")), 5000)
            );

            try {
                await Promise.race([createProfilePromise, timeoutPromise]);
            } catch (dbError) {
                console.error("Database Error (non-fatal):", dbError);
                // Continue even if DB write fails, so user can at least login
                toast.error("Account created, but profile setup failed. Please contact support.");
            }

            // 4. Update state
            setUser({ ...user, displayName: name }); // Force update display name in store
            toast.success("Account created successfully!");
            router.push("/");
        } catch (error: any) {
            console.error("Registration Error:", error);
            let message = "Failed to register";
            if (error.code === "auth/email-already-in-use") {
                message = "This email is already in use.";
            } else if (error.code === "auth/weak-password") {
                message = "Password should be at least 6 characters.";
            } else if (error.code === "auth/operation-not-allowed" || error.code === "auth/configuration-not-found") {
                message = "Email/Password login is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.";
            } else if (error.code === "permission-denied") {
                message = "Database permission denied. Check Firestore rules.";
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
                    src="/images/hero.png" // Use hero image for now
                    alt="Register Background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                        <h2 className="text-4xl font-bold mb-4">Join TXAA Today</h2>
                        <p className="text-xl">Unlock exclusive deals and track your premium orders.</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-white dark:bg-slate-900 order-1">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h1>
                        <p className="mt-2 text-gray-500">Start your journey with us</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    placeholder="John Doe"
                                    required
                                />
                                <UserIcon className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </div>
                        </div>

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
                                    minLength={6}
                                />
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-accent hover:text-blue-700">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
