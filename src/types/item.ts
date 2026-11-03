export interface FoodItem {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
    rating?: number | null;
  isActive?: boolean;
}