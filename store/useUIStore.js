import { create } from 'zustand'

const useUIStore = create((set) => ({
    toasts: [],
    
    // Add a toast notification
    addToast: (message, type = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };
        
        set((state) => ({
            toasts: [...state.toasts, newToast]
        }));

        // Auto remove after 3 seconds
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter(t => t.id !== id)
            }));
        }, 3000);
    },

    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
    })),

    // Animation state for cart icon
    cartAnimation: false,
    triggerCartAnimation: () => {
        set({ cartAnimation: true });
        setTimeout(() => set({ cartAnimation: false }), 1000);
    }
}))

export default useUIStore
