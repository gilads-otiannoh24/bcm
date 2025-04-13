import { create } from "zustand";

type Store = {
  open: boolean;
  setOpen: (state: boolean) => void;
};

export const useSidebarStore = create<Store>((set) => ({
  open: false,
  setOpen: (state: boolean) => set({ open: state }),
}));
