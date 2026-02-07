"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function DebugPage() {
    const { user, profile, loading } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white p-8">
            <h1 className="text-3xl font-bold mb-8">Auth Debug Info</h1>

            <div className="space-y-6 max-w-2xl">
                <div className="border p-4">
                    <h2 className="font-bold mb-2">Loading State:</h2>
                    <p>{loading ? "Loading..." : "Loaded"}</p>
                </div>

                <div className="border p-4">
                    <h2 className="font-bold mb-2">User Object:</h2>
                    <pre className="text-xs bg-gray-100 p-2 overflow-auto">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>

                <div className="border p-4">
                    <h2 className="font-bold mb-2">Profile Object:</h2>
                    <pre className="text-xs bg-gray-100 p-2 overflow-auto">
                        {JSON.stringify(profile, null, 2)}
                    </pre>
                </div>

                <div className="border p-4">
                    <h2 className="font-bold mb-2">Role Check:</h2>
                    <p>Role: <strong>{profile?.role || "NO ROLE"}</strong></p>
                    <p>Is Admin: <strong>{profile?.role === 'admin' ? 'YES' : 'NO'}</strong></p>
                    <p>Is Superadmin: <strong>{profile?.role === 'superadmin' ? 'YES' : 'NO'}</strong></p>
                    <p>Can Access Admin: <strong>{(profile?.role === 'admin' || profile?.role === 'superadmin') ? 'YES' : 'NO'}</strong></p>
                </div>

                <div className="border p-4">
                    <h2 className="font-bold mb-2">LocalStorage Check:</h2>
                    <button
                        onClick={() => {
                            const stored = localStorage.getItem('user');
                            alert('LocalStorage user: ' + stored);
                        }}
                        className="px-4 py-2 bg-black text-white"
                    >
                        Check LocalStorage
                    </button>
                </div>
            </div>
        </div>
    );
}
