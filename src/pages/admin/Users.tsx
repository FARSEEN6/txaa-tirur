
import { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { rtdb } from "@/firebase/config";
import { Search, Users, Loader2, Shield, User } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "@/components/layout/AdminLayout";

interface UserData {
    uid: string;
    email: string;
    displayName: string;
    role: "user" | "admin";
    createdAt?: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        const usersRef = ref(rtdb, "users");
        const unsubscribe = onValue(usersRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const usersList: UserData[] = Object.keys(data).map((key) => ({
                    uid: key,
                    email: data[key].email || "No email",
                    displayName: data[key].displayName || "Unnamed User",
                    role: data[key].role || "user",
                    createdAt: data[key].createdAt,
                }));
                usersList.sort((a, b) => {
                    if (a.role === "admin" && b.role !== "admin") return -1;
                    if (a.role !== "admin" && b.role === "admin") return 1;
                    return a.displayName.localeCompare(b.displayName);
                });
                setUsers(usersList);
            } else {
                setUsers([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleUserRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        setUpdatingId(userId);
        try {
            const userRef = ref(rtdb, `users/${userId}`);
            await update(userRef, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Failed to update user role");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-black" size={40} />
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-black uppercase tracking-tight font-heading mb-2">Users</h1>
                        <p className="text-gray-500 text-sm">Manage user access and roles</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-black"></span>
                            <span className="text-black">{users.filter(u => u.role === "admin").length} Admins</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                            <span className="text-gray-500">{users.filter(u => u.role === "user").length} Users</span>
                        </div>
                    </div>
                </div>

                {/* Content Frame */}
                <div className="bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                    {/* Search Toolbar */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="SEARCH USERS..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none text-black text-sm font-bold tracking-wider placeholder:text-gray-400 focus:ring-1 focus:ring-black outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white text-xs font-bold uppercase tracking-widest text-black border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-6">User</th>
                                    <th className="px-8 py-6">Email</th>
                                    <th className="px-8 py-6">Joined</th>
                                    <th className="px-8 py-6">Role</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16 text-center text-gray-400">
                                            <Users size={32} className="mx-auto mb-3 opacity-20" />
                                            <p className="text-sm font-medium uppercase tracking-widest">No users found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.uid} className="group hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 flex items-center justify-center border ${user.role === 'admin' ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                                        {user.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                                                    </div>
                                                    <span className="font-bold text-black text-sm uppercase tracking-wide">{user.displayName}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-sm text-gray-500 font-medium">{user.email}</td>
                                            <td className="px-8 py-4 text-xs text-gray-400 font-bold uppercase tracking-wider">{formatDate(user.createdAt)}</td>
                                            <td className="px-8 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${user.role === "admin" ? "border-black text-black" : "border-gray-200 text-gray-400"}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <button
                                                    onClick={() => toggleUserRole(user.uid, user.role)}
                                                    disabled={updatingId === user.uid}
                                                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${user.role === "admin"
                                                        ? "text-red-500 hover:bg-red-50"
                                                        : "bg-black text-white hover:bg-gray-800"
                                                        }`}
                                                >
                                                    {updatingId === user.uid ? (
                                                        <Loader2 className="animate-spin" size={12} />
                                                    ) : user.role === "admin" ? (
                                                        "Demote"
                                                    ) : (
                                                        "Make Admin"
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
