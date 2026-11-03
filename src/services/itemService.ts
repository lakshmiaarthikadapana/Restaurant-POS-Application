import { api } from "./api";
import type { FoodItem } from "../types/item";

export const getItems = async (
  categoryId?: number
): Promise<FoodItem[]> => {
  const response = await api.get("/items", {
    params:
      categoryId !== undefined
        ? { categoryId }
        : {},
  });

  const result = response.data;

  if (result?.success === false) {
    throw new Error(result.message || "Failed to retrieve items.");
  }

  if (Array.isArray(result?.data)) {
    return result.data as FoodItem[];
  }

  if (Array.isArray(result)) {
    return result as FoodItem[];
  }

  throw new Error("The items API did not return a valid item list.");
};