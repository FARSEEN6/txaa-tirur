"use client";

import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, Loader2, CreditCard, Banknote, Settings, AlertTriangle } from "lucide-react";

export default function AdminSettings() {
    const router = useRouter();
    const { profile } = useAuthStore();
    const { settings, loading, fetchSettings, updateSettings } = useSettingsStore();
    const [saving, setSaving] = useState(false);
    const [razorpayEnabled, setRazorpayEnabled] = useState(true);
    const [codEnabled, setCodEnabled] = useState(true);

    useEffect(() => {
        // Only admin can access this page
        if (profile && profile.role !== 'admin' && profile.role !== 'superadmin') {
            toast.error("Access denied. Admin only.");
            router.push("/admin");
        }
    }, [profile, router]);

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (settings) {
            setRazorpayEnabled(settings.razorpayEnabled);
            setCodEnabled(settings.codEnabled);
        }
    }, [settings]);

    const handleSave = async () => {
        // At least one payment method must be enabled
        if (!razorpayEnabled && !codEnabled) {
            toast.error("At least one payment method must be enabled");
            return;
        }

        setSaving(true);
        try {
            await updateSettings({
                razorpayEnabled,
                codEnabled
            });
            toast.success("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="animate-spin text-[#d4a017]" size={48} />
            </div>
        );
    }

    // Check role
    if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <AlertTriangle className="text-red-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                <p className="text-gray-500 dark:text-gray-400">This page is for Admins only.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Settings size={24} /> Settings
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Manage payment methods and platform settings</p>
            </div>

            {/* Payment Settings */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Methods</h2>

                <div className="space-y-4">
                    {/* Razorpay Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <CreditCard className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Razorpay</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">UPI, Credit/Debit Card, Net Banking</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={razorpayEnabled}
                                onChange={(e) => setRazorpayEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d4a017]/20 dark:peer-focus:ring-[#d4a017]/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-slate-600 peer-checked:bg-[#d4a017]"></div>
                        </label>
                    </div>

                    {/* COD Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                <Banknote className="text-green-600" size={24} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Cash on Delivery</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive your order</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={codEnabled}
                                onChange={(e) => setCodEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d4a017]/20 dark:peer-focus:ring-[#d4a017]/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-slate-600 peer-checked:bg-[#d4a017]"></div>
                        </label>
                    </div>
                </div>

                {!razorpayEnabled && !codEnabled && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
                        <AlertTriangle size={20} />
                        <span className="text-sm">At least one payment method must be enabled</span>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving || (!razorpayEnabled && !codEnabled)}
                className="w-full py-4 bg-[#d4a017] hover:bg-[#b88b14] text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {saving ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save size={20} />
                        Save Settings
                    </>
                )}
            </button>
        </div>
    );
}
