import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-9xl font-bold text-black font-heading tracking-tighter mb-4">404</h1>
            <h2 className="text-2xl font-bold text-black uppercase tracking-widest mb-2">Page Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                The page you are looking for does not exist or has been moved.
            </p>

            <Link
                to="/"
                className="group flex items-center gap-2 px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Return Home
            </Link>
        </div>
    );
}
