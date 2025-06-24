// stores/useChatStore.ts
import { create } from "zustand";

interface ChatState {
  messages: any[];
  usersTyping: string[];
  setMessages: (msgs: any[]) => void;
  addMessage: (msg: any) => void;
  setTyping: (user: string) => void;
  clearTyping: (user: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  usersTyping: [],
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setTyping: (user) =>
    set((s) => ({
      usersTyping: Array.from(new Set([...s.usersTyping, user])),
    })),
  clearTyping: (user) =>
    set((s) => ({ usersTyping: s.usersTyping.filter((u) => u !== user) })),
}));
