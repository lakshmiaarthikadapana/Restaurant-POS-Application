import type { FoodItem } from "./item";

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
}