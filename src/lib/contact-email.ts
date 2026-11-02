import type { CartItem } from "@/context/CartContext";

export function formatCartSummary(items: CartItem[], total: number) {
  if (items.length === 0) return "";

  const lines = items.flatMap((item) => [
    `${item.productName} — ${item.quantity.toLocaleString("sv-SE")} st — ${item.totalPrice.toLocaleString("sv-SE")} kr`,
    ...item.selections.filter((selection) => selection.value).map((selection) => `  ${selection.label}: ${selection.value}`),
  ]);

  return `${lines.join("\n")}\nTotalt: ${total.toLocaleString("sv-SE")} kr`;
}
