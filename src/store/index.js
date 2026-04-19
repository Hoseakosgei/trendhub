import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Cart Store ───────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const existing = get().items.find(i => i.id === product.id)
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          }))
        } else {
          set(state => ({ items: [...state.items, { ...product, quantity }] }))
        }
      },

      removeItem: (id) =>
        set(state => ({ items: state.items.filter(i => i.id !== id) })),

      updateQty: (id, quantity) => {
        if (quantity < 1) return
        set(state => ({
          items: state.items.map(i => i.id === id ? { ...i, quantity } : i),
        }))
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    { name: 'trendhub-cart' }
  )
)

// ─── Wishlist Store ───────────────────────────────────────────
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const exists = get().items.find(i => i.id === product.id)
        if (exists) {
          set(state => ({ items: state.items.filter(i => i.id !== product.id) }))
          return false
        } else {
          set(state => ({ items: [...state.items, product] }))
          return true
        }
      },

      isWishlisted: (id) => get().items.some(i => i.id === id),

      removeItem: (id) =>
        set(state => ({ items: state.items.filter(i => i.id !== id) })),
    }),
    { name: 'trendhub-wishlist' }
  )
)

// ─── Auth Store ───────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      updateUser: (data) => set(state => ({ user: { ...state.user, ...data } })),
    }),
    { name: 'trendhub-auth' }
  )
)

// ─── UI Store (no persist) ────────────────────────────────────
export const useUIStore = create((set) => ({
  cartOpen:   false,
  menuOpen:   false,
  searchOpen: false,

  openCart:    () => set({ cartOpen: true }),
  closeCart:   () => set({ cartOpen: false }),
  toggleCart:  () => set(state => ({ cartOpen: !state.cartOpen })),

  openMenu:    () => set({ menuOpen: true }),
  closeMenu:   () => set({ menuOpen: false }),
  toggleMenu:  () => set(state => ({ menuOpen: !state.menuOpen })),

  openSearch:  () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
}))
