// src/zustand/useViewStore.ts
import { create } from "zustand";

interface ViewState {
  view: {
    filter: Array<{ id: string; value: string }>;
    sorting: Array<any>;
    group: Array<any>;
  };
  setView: (view: ViewState["view"]) => void;
  currentView: {
    filter: Array<any>;
    sorting: Array<any>;
    group: Array<any>;
  };
  setCurrentView: (view: ViewState["currentView"]) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  view: {
    filter: [],
    sorting: [],
    group: [],
  },
  setView: (view) => set({ view }),
  currentView: {
    filter: [],
    sorting: [],
    group: [],
  },
  setCurrentView: (currentView) => set({ currentView }),
}));
