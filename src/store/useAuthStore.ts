import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { ref, get, child } from 'firebase/database';
import { rtdb } from '@/firebase/config';

interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'user' | 'admin' | 'superadmin';
}

interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    setUser: (user: User | null) => Promise<void>;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    loading: true,
    setUser: async (user) => {
        set({ user });
        if (user) {
            // Fetch profile from Realtime Database
            try {
                const dbRef = ref(rtdb);
                const snapshot = await get(child(dbRef, `users/${user.uid}`));
                if (snapshot.exists()) {
                    set({ profile: snapshot.val() as UserProfile });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        } else {
            set({ profile: null });
        }
        set({ loading: false });
    },
    setLoading: (loading) => set({ loading }),
}));
