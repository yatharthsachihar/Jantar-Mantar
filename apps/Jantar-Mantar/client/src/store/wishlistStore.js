import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      has: (id) => get().items.some((i) => i._id === id),
      toggle: (product) => {
        const items = get().items;
        if (items.some((i) => i._id === product._id)) {
          set({ items: items.filter((i) => i._id !== product._id) });
        } else {
          set({
            items: [...items, {
              _id: product._id, name: product.name, slug: product.slug,
              image: product.images?.[0] || '', price: product.price,
              compareAtPrice: product.compareAtPrice,
            }],
          });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i._id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'jantar_mantar_wishlist' }
  )
);
