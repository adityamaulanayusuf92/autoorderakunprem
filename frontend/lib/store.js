import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token) {
      set({ token });
    }
    if (user) {
      set({ user: JSON.parse(user) });
    }
  },
}));

export const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,

  addItem: (product, quantity = 1) =>
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id);
      let newItems;

      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...product, quantity }];
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: newItems, total };
    }),

  removeItem: (productId) =>
    set((state) => {
      const newItems = state.items.filter(item => item.id !== productId);
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: newItems, total };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const newItems = state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: newItems, total };
    }),

  clearCart: () => set({ items: [], total: 0 }),

  getCartCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
}));
