export interface Category {
  id: number;
  name: string;
  imageUrl: string | null;
  isActive: boolean;
}

export interface FoodItem {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}