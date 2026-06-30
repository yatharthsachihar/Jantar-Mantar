import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// A cart line is keyed by product id + chosen variation weight, so the same
// product in two weights are separate lines.
const lineKey = (productId, weight) => `${productId}__${weight || ''}`;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, { weight = '', price, quantity = 1 } = {}) => {
        const key = lineKey(product._id, weight);
        const items = [...get().items];
        const existing = items.find((i) => i.key === key);
        if (existing) {
          existing.quantity += quantity;
        } else {
          items.push({
            key,
            product: product._id,
            name: product.name,
            slug: product.slug,
            image: product.images?.[0] || '',
            price: price ?? product.price,
            variationWeight: weight,
            quantity,
          });
        }
        set({ items });
      },

      setQuantity: (key, quantity) =>
        set({
          items: get().items
            .map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i)),
        }),

      removeItem: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'jantar_mantar_cart' }
  )
);

// Derived selectors — call with the store hook, e.g. useCartStore(selectCount).
export const selectCount = (s) => s.items.reduce((n, i) => n + i.quantity, 0);
export const selectTotal = (s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
