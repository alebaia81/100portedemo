import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './menu-data';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  customerName: string;
  pickupTime: string;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setCustomerName: (name: string) => void;
  setPickupTime: (time: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerName: '',
      pickupTime: '',
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      setCustomerName: (customerName) => set({ customerName }),
      setPickupTime: (pickupTime) => set({ pickupTime }),
      clearCart: () => set({ items: [], customerName: '', pickupTime: '' }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cento-porte-cart',
    }
  )
);
