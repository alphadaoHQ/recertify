import { create } from "zustand";

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface TelegramState {
  user: TelegramUser | null;
  initialized: boolean;
  setUser: (user: TelegramUser | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useTelegramStore = create<TelegramState>((set) => ({
  user: null,
  initialized: false,
  setUser: (user) => set({ user }),
  setInitialized: (initialized) => set({ initialized }),
}));
