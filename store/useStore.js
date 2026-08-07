import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import useUIStore from './useUIStore'

const useStore = create(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],
            currency: 'USD',
            exchangeRate: 12800,

            notifications: [
                {
                    id: 'summer_sale_2026',
                    type: 'promo',
                    isRead: false,
                    date: new Date().toISOString(),
                    title: {
                        uz: "🔥 Katta yozgi chegirmalar boshlandi!",
                        ru: "🔥 Начались большие летние скидки!",
                        en: "🔥 Huge summer sale has started!"
                    },
                    message: {
                        uz: "Tanlangan mahsulotlarga 30% gacha chegirmalar e'lon qilindi. Shoshiling, mahsulotlar soni cheklangan!",
                        ru: "Объявлены скидки до 30% на выбранные товары. Спешите, количество товара ограничено!",
                        en: "Discounts up to 30% on selected products. Hurry up, limited stock!"
                    },
                    actionLink: "/products?sort=discount"
                },
                {
                    id: 'new_arrival_rtx',
                    type: 'update',
                    isRead: false,
                    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    title: {
                        uz: "🚀 Yangi mahsulotlar yetib keldi!",
                        ru: "🚀 Прибыли новые товары!",
                        en: "🚀 New arrivals are here!"
                    },
                    message: {
                        uz: "Eng so'nggi avlod RTX 40 seriyali video kartalar va yangi mexanik klaviaturalar omborimizga qo'shildi. Birinchilardan bo'lib xarid qiling.",
                        ru: "Видеокарты серии RTX 40 последнего поколения и новые механические клавиатуры добавлены на склад. Покупайте первыми.",
                        en: "The latest generation RTX 40 series graphics cards and new mechanical keyboards have been added to our stock. Be the first to buy."
                    },
                    actionLink: "/products?sort=newest"
                },
            ],
            clearNotifications: () => set({ notifications: [] }),
            addNotification: (notification) => set((state) => {
                // Check if identical notification already exists to prevent duplicates on strict mode
                if (notification.id && state.notifications.some(n => n.id === notification.id)) return state;
                return {
                    notifications: [{
                        id: notification.id || Date.now().toString(),
                        isRead: false,
                        date: new Date().toISOString(),
                        ...notification
                    }, ...state.notifications]
                }
            }),
            markAllNotificationsAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true }))
            })),
            markNotificationAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
            })),
            setCurrency: (currency) => set({ currency }),
            setExchangeRate: (rate) => set({ exchangeRate: rate }),

            addToCart: (product) => set((state) => {
                const existing = state.cart.find(item => item.id === product.id);
                const nextCart = existing
                    ? state.cart.map(item =>
                        item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
                      )
                    : [...state.cart, { ...product, quantity: 1 }];
                
                // Open the cart drawer using the UI store
                useUIStore.getState().setCartDrawerOpen(true);

                return { 
                    cart: nextCart
                };
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
            }),

            compareList: [],
            toggleCompare: (product) => set((state) => {
                const inCompare = state.compareList.some(item => item.id === product.id);
                if (inCompare) {
                    return { compareList: state.compareList.filter(item => item.id !== product.id) };
                }
                // Optionally limit compare list to e.g. 4 items max
                if (state.compareList.length >= 4) {
                    // Remove first item and add new
                    return { compareList: [...state.compareList.slice(1), product] };
                }
                return { compareList: [...state.compareList, product] };
            }),
            removeFromCompare: (productId) => set((state) => ({
                compareList: state.compareList.filter(item => item.id !== productId)
            })),
            clearCompare: () => set({ compareList: [] })
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
