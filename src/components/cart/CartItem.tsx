import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../../types/cart";

interface CartItemProps {
  item: CartItemType;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div className="border-b border-slate-100 py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <img
          src={
            item.imageUrl?.trim() ||
            "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=200&auto=format&fit=crop&q=80"
          }
          alt={item.name}
          className="h-16 w-16 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-slate-800">
            {item.name}
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            ₹{item.price.toFixed(2)} each
          </p>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-1">
              <button
                type="button"
                onClick={() => onDecrease(item.id)}
                className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
                aria-label={`Decrease ${item.name} quantity`}
              >
                <Minus size={14} />
              </button>

              <span className="min-w-4 text-center text-sm font-semibold">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => onIncrease(item.id)}
                className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
                aria-label={`Increase ${item.name} quantity`}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-between text-sm">
        <span className="text-slate-500">Line total</span>
        <span className="font-bold text-slate-800">
          ₹{(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default CartItem;