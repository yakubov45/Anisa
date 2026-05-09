import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],
            currency: 'USD',
            exchangeRate: 12800,

            setCurrency: (currency) => set({ currency }),
            setExchangeRate: (rate) => set({ exchangeRate: rate }),

            addToCart: (product) => set((state) => {
                const existing = state.cart.find(item => item.id === product.id);
                if (existing) {
                    return {
                        cart: state.cart.map(item =>
                            item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
                        )
                    };
                }
                return { cart: [...state.cart, { ...product, quantity: 1 }] };
            }),

            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter(item => item.id !== productId)
            })),

            updateQuantity: (productId, quantity) => set((state) => ({
                cart: state.cart.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            })),

            clearCart: () => set({ cart: [] }),
            setCart: (cart) => set({ cart }),

            toggleWishlist: (product) => set((state) => {
                const isFavorite = state.wishlist.some(item => item.id === product.id);
                if (isFavorite) {
                    return { wishlist: state.wishlist.filter(item => item.id !== product.id) };
                }
                return { wishlist: [...state.wishlist, product] };
            })
        }),
        {
            name: 'onepc-storage',
            storage: createJSONStorage(() => {
                // Server tomonida xato chiqmasligi uchun
                if (typeof window === 'undefined') {
                    return {
                        getItem: () => null,
                        setItem: () => {},
                        removeItem: () => {},
                    };
                }
                return localStorage;
            }),
        }
    )
)

export default useStore
