import { create } from 'zustand';
import { ref, get as getFromDb, update } from 'firebase/database';
import { rtdb } from '@/firebase/config';

interface Settings {
    razorpayEnabled: boolean;
    codEnabled: boolean;
    razorpayKeyId?: string;
}

interface SettingsState {
    settings: Settings;
    loading: boolean;
    fetchSettings: () => Promise<void>;
    updateSettings: (data: Partial<Settings>) => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
    razorpayEnabled: true,
    codEnabled: true,
};

export const useSettingsStore = create<SettingsState>((set, getState) => ({
    settings: DEFAULT_SETTINGS,
    loading: true,

    fetchSettings: async () => {
        try {
            const snapshot = await getFromDb(ref(rtdb, 'settings'));
            if (snapshot.exists()) {
                set({ settings: snapshot.val(), loading: false });
            } else {
                // Initialize defaults
                await update(ref(rtdb, 'settings'), DEFAULT_SETTINGS);
                set({ settings: DEFAULT_SETTINGS, loading: false });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            set({ loading: false });
        }
    },

    updateSettings: async (data: Partial<Settings>) => {
        try {
            await update(ref(rtdb, 'settings'), data);
            set({ settings: { ...getState().settings, ...data } });
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }
}));
