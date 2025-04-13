import { create } from "zustand";

type Store = {
  isCriticalError: boolean;
  setCriticalError: (value: boolean) => void;
  setFixingFunction: (value: () => void | null) => void;
  fixingFunction: () => void | null;
  error: Error | null;
  setError: (value: Error | null) => void;
};

const useCriticalErrorStore = create<Store>((set) => ({
  isCriticalError: false,
  error: null,
  fixingFunction: () => {},
  setCriticalError: (value) => set({ isCriticalError: value }),
  setFixingFunction: (value) => set({ fixingFunction: value }),
  setError: (value) => set({ error: value }),
}));

export default useCriticalErrorStore;
