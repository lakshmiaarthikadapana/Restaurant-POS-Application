import { api } from "./api";
import type { Category } from "../types/category";

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get("/categories");

    const result = response.data;
    if (Array.isArray(result)) {
        return result as Category[];
    }
    if (Array.isArray(result?.data)) {
        return result.data as Category[];
    }

    throw new Error("The categories API did not return an array.");
};