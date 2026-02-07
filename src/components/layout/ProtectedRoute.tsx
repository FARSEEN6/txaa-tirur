import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
    const { user, profile, loading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/login");
            } else if (adminOnly && profile?.role !== 'admin') {
                navigate("/"); // Redirect non-admins to home
            }
        }
    }, [user, profile, loading, navigate, adminOnly]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    if (!user || (adminOnly && profile?.role !== 'admin')) {
        return null;
    }

    return <>{children}</>;
}
