import { useEffect, useState } from "react";
import { Plus, Minus, ShoppingBag, Star, ImageOff } from "lucide-react";
import type { FoodItem } from "../../types/item";

interface FoodCardProps {
  readonly item: FoodItem;
  readonly quantity: number;
  readonly onAddToCart: (item: FoodItem) => void;
  readonly onIncrease: (item: FoodItem) => void;
  readonly onDecrease: (item: FoodItem) => void;
}

export default function FoodCard({
  item,
  quantity,
  onAddToCart,
  onIncrease,
  onDecrease,
}: FoodCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [item.imageUrl]);

  const isAvailable = item.isActive && item.price > 0;

  const hasRating =
    item.rating !== null &&
    item.rating !== undefined &&
    Number.isFinite(Number(item.rating));

  const rating = hasRating ? Number(item.rating).toFixed(1) : null;

  const description =
    item.description?.trim() || "A delicious choice for your next meal.";

  const formattedPrice = Number(item.price || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-100 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden bg-orange-50">
        {item.imageUrl && !imageFailed ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isAvailable ? "grayscale" : ""
              }`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-orange-300">
            <ImageOff size={38} strokeWidth={1.5} />
            <span className="text-xs font-medium">Image unavailable</span>
          </div>
        )}

        <div className="absolute left-3 top-3">
          {isAvailable ? (
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
              Available
            </span>
          ) : (
            <span className="rounded-full bg-gray-800/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
              Unavailable
            </span>
          )}
        </div>

      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="min-w-0 flex-1 truncate text-base font-bold text-gray-900 transition-colors group-hover:text-orange-600"
            title={item.name}
          >
            {item.name}
          </h3>

          {rating !== null && (
            <div className="flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-sm font-semibold text-gray-800">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </div>
          )}
        </div>

        <p
          className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500"
          title={description}
        >
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-400">Price</p>
            <p className="mt-1 whitespace-nowrap text-lg font-bold text-gray-900">
              ₹{formattedPrice}
            </p>
          </div>

          {!isAvailable ? (
            <button
              type="button"
              disabled
              className="flex cursor-not-allowed items-center gap-2 rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-semibold text-gray-400"
            >
              <ShoppingBag size={16} />
              Unavailable
            </button>
          ) : quantity === 0 ? (
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 active:scale-95"
            >
              <Plus size={17} strokeWidth={2.5} />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50 p-1.5">
              <button
                type="button"
                onClick={() => onDecrease(item)}
                aria-label={`Decrease ${item.name} quantity`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-orange-600 shadow-sm transition-colors hover:bg-orange-100"
              >
                <Minus size={15} />
              </button>

              <span className="min-w-5 text-center text-sm font-bold text-gray-900">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => onIncrease(item)}
                aria-label={`Increase ${item.name} quantity`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm transition-colors hover:bg-orange-600"
              >
                <Plus size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}


