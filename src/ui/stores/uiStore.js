import { writable } from 'svelte/store';

// Initial State
const initialState = {
  isOpen: false,
  view: null, // 'profile', 'experience', 'skills', 'education'
  data: null, // Optional data payload
};

export const uiStore = writable(initialState);

// Helper actions
export const openModal = (view, data = null) => {
  uiStore.set({ isOpen: true, view, data });
};

export const closeModal = () => {
  uiStore.set({ isOpen: false, view: null, data: null });
};
