"use client";

import { useState, useEffect } from "react";
import { ref, get, update, child } from "firebase/database";
import { rtdb } from "@/firebase/config";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Users, UserPlus, Shield, Trash2, Loader2, AlertTriangle, Search } from "lucide-react";

interface User {
    uid: string;
    email: string;
    displayName: string;
    role: 'user' | 'admin' | 'superadmin';
}

export default function ManageAdmins() {
    const router = useRouter();
    const { profile } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (profile && profile.role !== 'superadmin') {
            toast.error("Access denied. Super Admin only.");
            router.push("/admin");
        }
    }, [profile, router]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const snapshot = await get(ref(rtdb, 'users'));
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                const usersList = Object.entries(usersData).map(([uid, data]: [string, any]) => ({
                    uid,
                    ...data
                }));
                setUsers(usersList);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (uid: string, newRole: 'user' | 'admin') => {
        if (uid === profile?.uid) {
            toast.error("You cannot change your own role");
            return;
        }

        setUpdating(uid);
        try {
            await update(child(ref(rtdb), `users/${uid}`), { role: newRole });
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update role");
        } finally {
            setUpdating(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="animate-spin text-[#d4a017]" size={48} />
            </div>
        );
    }

    if (profile?.role !== 'superadmin') {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <AlertTriangle className="text-red-500 mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                <p className="text-gray-500 dark:text-gray-400">This page is for Super Admins only.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users size={24} /> Manage Admins
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Add or remove admin access for users</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users by email or name..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-[#d4a017] outline-none"
                />
            </div>

            {/* Users List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredUsers.map((user) => (
                                <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{user.displayName || 'No Name'}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'superadmin'
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                                : user.role === 'admin'
                                                    ? 'bg-[#d4a017]/20 text-[#d4a017]'
                                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {user.role === 'superadmin' && <Shield size={12} />}
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.role !== 'superadmin' && (
                                            <div className="flex items-center justify-end gap-2">
                                                {updating === user.uid ? (
                                                    <Loader2 className="animate-spin text-[#d4a017]" size={18} />
                                                ) : (
                                                    <>
                                                        {user.role === 'user' ? (
                                                            <button
                                                                onClick={() => updateUserRole(user.uid, 'admin')}
                                                                className="px-3 py-1.5 bg-[#d4a017] text-black text-xs font-medium rounded-lg hover:bg-[#b88b14] transition-colors flex items-center gap-1"
                                                            >
                                                                <UserPlus size={14} /> Make Admin
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => updateUserRole(user.uid, 'user')}
                                                                className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1"
                                                            >
                                                                <Trash2 size={14} /> Remove Admin
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        {user.role === 'superadmin' && (
                                            <span className="text-xs text-gray-400">Protected</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="mx-auto text-gray-300 dark:text-slate-600 mb-4" size={48} />
                        <p className="text-gray-500 dark:text-gray-400">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
