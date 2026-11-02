import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ProductSelections } from "@/lib/product-configuration";

export type CartItem = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selections: { label: string; value: string }[];
};

type AddCartItem = Omit<CartItem, "id">;

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: AddCartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function createItemId(item: AddCartItem) {
  return JSON.stringify([item.productName, item.quantity, item.unitPrice, item.selections]);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.totalPrice, 0),
    addItem: (item) => {
      const id = createItemId(item);
      setItems((current) => [...current, { ...item, id }]);
    },
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart måste användas inom CartProvider");
  return context;
}

export function selectionsForCart(
  options: { id: string; label: string; choices: { label: string }[] }[],
  selected: ProductSelections,
) {
  return options.map((option) => ({
    label: option.label,
    value: option.choices[selected[option.id]]?.label ?? "",
  }));
}
