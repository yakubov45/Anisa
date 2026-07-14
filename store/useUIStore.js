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
    },

    // Global Confirm Modal
    confirmModal: {
        isOpen: false,
        message: "",
        onConfirm: null,
        title: "Confirm Action"
    },
    showConfirm: (message, onConfirm, title = "Confirm Action") => {
        set({ confirmModal: { isOpen: true, message, onConfirm, title } });
    },
    hideConfirm: () => {
        set({ confirmModal: { isOpen: false, message: "", onConfirm: null, title: "" } });
    },

    // Drawer States
    cartDrawerOpen: false,
    setCartDrawerOpen: (isOpen) => set({ cartDrawerOpen: isOpen }),

    notificationsDrawerOpen: false,
    setNotificationsDrawerOpen: (isOpen) => set({ notificationsDrawerOpen: isOpen })
}))

export default useUIStore
