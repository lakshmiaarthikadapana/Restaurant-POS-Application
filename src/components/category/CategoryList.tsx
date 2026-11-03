import { useEffect, useState } from "react";
import {
  Utensils,
  Pizza,
  Sandwich,
  Coffee,
  CakeSlice,
  Soup,
  RefreshCw,
} from "lucide-react";

import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/category";

interface CategoryListProps {
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";

const categoryImages: Record<string, string> = {
  biryani:
    "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=1188&auto=format&fit=crop",

  beverages:
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1257&auto=format&fit=crop",

  cococola:
    "https://plus.unsplash.com/premium_photo-1725075086631-b21a5642918b?q=80&w=687&auto=format&fit=crop",

  southindia:
    "https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=880&auto=format&fit=crop",

  pizza:
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",

  burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",

  chocolate:
    "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=400&q=80",

  coffee:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",

  cake:
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",

  icecream:
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",

  pasta:
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=400&q=80",

  salad:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",

  sandwich:
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80",

  soup:
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80",

  chicken:
    "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=400&q=80",

  fries:
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80",

  fish:
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80",
    desserts:
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1188&auto=format&fit=crop",
  snacks:
  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop"
};

function getCategoryImage(categoryName: string): string | undefined {
  const name = categoryName.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (name.includes("biryani") || name.includes("briyani")) {
    return categoryImages.biryani;
  }

  if (name.includes("beverage") || name.includes("becerge")) {
    return categoryImages.beverages;
  }

  if (name.includes("cococola") || name.includes("cocacola") || name.includes("cola")) {
    return categoryImages.cococola;
  }

  if (name.includes("southindia") || name.includes("southindian")) {
    return categoryImages.southindia;
  }

  if (name.includes("pizza")) return categoryImages.pizza;
  if (name.includes("burger")) return categoryImages.burger;
  if (name.includes("chocolate")) return categoryImages.chocolate;
  if (name.includes("coffee")) return categoryImages.coffee;
  if (name.includes("cake")) return categoryImages.cake;
  if (name.includes("icecream")) return categoryImages.icecream;
  if (name.includes("pasta")) return categoryImages.pasta;
  if (name.includes("salad")) return categoryImages.salad;
  if (name.includes("sandwich")) return categoryImages.sandwich;
  if (name.includes("soup")) return categoryImages.soup;
  if (name.includes("chicken")) return categoryImages.chicken;
  if (name.includes("fries")) return categoryImages.fries;
  if (name.includes("snack")) return categoryImages.snacks;
  if (
  name.includes("dessert") ||
  name.includes("desert") ||
  name.includes("sweet") ||
  name.includes("pudding")
) {
  return categoryImages.desserts;
}
  if (name.includes("fish") || name.includes("seafood")) {
    return categoryImages.fish;
  }

  return undefined;
}
const categoryIcons = [
  Utensils,
  Pizza,
  Sandwich,
  Soup,
  CakeSlice,
  Coffee,
];

function CategoryList({
  selectedCategoryId,
  onSelectCategory,
}: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        setLoading(true);
        setError("");

        const data = await getCategories();

        if (active) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Unable to load categories:", err);

        if (active) {
          setError("Unable to load categories.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, [retryKey]);

  // Loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-xl border border-gray-100 p-2"
          >
            <div className="h-24 rounded-lg bg-gray-100" />
            <div className="mt-3 h-3 w-3/4 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  // Error message and retry
  if (error) {
    return (
      <div className="py-5 text-center">
        <p className="text-sm text-red-500">{error}</p>

        <button
          type="button"
          onClick={() => setRetryKey((previous) => previous + 1)}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-100"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {/* All Items Card */}
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        aria-pressed={selectedCategoryId === null}
        className={`group overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          selectedCategoryId === null
            ? "border-orange-500 ring-1 ring-orange-200 shadow-sm"
            : "border-gray-100 hover:border-orange-200"
        }`}
      >
        <div className="relative h-24 overflow-hidden bg-gray-100">
          <img
            src={fallbackImage}
            alt="Assorted food"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-orange-500 shadow-sm">
            <Utensils size={16} />
          </div>
        </div>

        <div className="p-3">
          <h3 className="truncate text-sm font-bold text-gray-900">
            All Items
          </h3>

          <p className="mt-1 truncate text-xs text-gray-500">
            Entire menu
          </p>
        </div>
      </button>

      {/* Category Cards */}
      {categories.map((category, index) => {
        const Icon = categoryIcons[index % categoryIcons.length];
        const isSelected = selectedCategoryId === category.id;
        const image = getCategoryImage(category.name);

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            aria-pressed={isSelected}
            className={`group overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              isSelected
                ? "border-orange-500 ring-1 ring-orange-200 shadow-sm"
                : "border-gray-100 hover:border-orange-200"
            }`}
          >
            {/* Image */}
            <div className="relative flex h-24 items-center justify-center overflow-hidden bg-orange-50">
              {image && (
                <img
                  src={image}
                  alt={category.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}

              {/* Show an icon when the category has no mapped image */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 text-orange-500 shadow-sm ${
                  image ? "absolute bottom-2 left-2 h-7 w-7 rounded-lg" : ""
                }`}
              >
                <Icon size={image ? 16 : 24} />
              </div>
            </div>

            {/* Category Name */}
            <div className="p-3">
              <h3
                title={category.name}
                className={`truncate text-sm font-bold ${
                  isSelected ? "text-orange-600" : "text-gray-900"
                }`}
              >
                {category.name}
              </h3>

              <p className="mt-1 truncate text-xs text-gray-500">
                View items
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryList;