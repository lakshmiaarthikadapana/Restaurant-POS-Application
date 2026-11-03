import {
  ShoppingCart,
  ReceiptText,
  Trash2,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";

import type { CartItem as CartItemType } from "../../types/cart";
import CartItem from "./CartItem";

interface CartPanelProps {
  cartItems: CartItemType[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  onClearCart: () => void;
}

function CartPanel({
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
  onClearCart,
}: CartPanelProps) {
  // SUBTOTAL
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );
  const discount = 0;
  const taxRate = 0;

  const tax = (subtotal - discount) * taxRate;
  const grandTotal = subtotal - discount + tax;

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleCheckout() {
    // Connect your order creation API here.
  }

  return (
    <section className="custom-scrollbar flex h-full min-h-0 w-full flex-col overflow-y-auto overflow-x-hidden border-l border-[#F1E8E1] bg-white text-[#332B26]">
  
      <header className="shrink-0 border-b border-[#F1E8E1] bg-white px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E8] text-[#E66F47]">
              <ShoppingCart size={22} strokeWidth={2} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#332B26]">
                Your Order
              </h2>

              <p className="mt-0.5 text-xs text-[#A49A91]">
                Review your selection
              </p>
            </div>
          </div>

          <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-[#F0784F] px-2 text-sm font-bold text-white">
            {totalQuantity}
          </span>
        </div>

        {cartItems.length > 0 && (
          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-[#94877D]">
              {totalQuantity}{" "}
              {totalQuantity === 1 ? "item" : "items"} selected
            </p>

            <button
              type="button"
              onClick={onClearCart}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-[#94877D] transition hover:bg-[#FFF3EB] hover:text-[#D9633A]"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          </div>
        )}
      </header>

      {/* ORDER SUMMARY */}
      <div className="shrink-0 border-b border-[#F5EEE8] bg-[#FFFAF6] px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReceiptText
              size={16}
              className="text-[#E66F47]"
            />

            <span className="text-xs font-bold text-[#65554A]">
              Order Summary
            </span>
          </div>

          <span className="text-xs font-semibold text-[#A49A91]">
            {totalQuantity}{" "}
            {totalQuantity === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-[#94877D]">
            Current subtotal
          </span>

          <span className="text-sm font-extrabold text-[#D9633A]">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="shrink-0">
        {cartItems.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center px-5 py-10 text-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#FFF0E8]">
              <ShoppingBag
                size={43}
                strokeWidth={1.5}
                className="text-[#E99B77]"
              />

              <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#F0784F] text-xl font-bold leading-none text-white">
                +
              </span>
            </div>

            <h3 className="mt-6 text-base font-extrabold text-[#332B26]">
              Your cart is empty
            </h3>

            <p className="mt-2 max-w-[225px] text-xs leading-5 text-[#94877D]">
              Looks like you haven't added anything yet. Explore the
              menu and choose your favourite dishes!
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#F5D8C8] bg-[#FFFAF6] px-4 py-2 text-xs font-semibold text-[#D9633A]">
              <UtensilsCrossed size={14} />
              Fresh food awaits
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#F3EAE3] px-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>


      <footer className="shrink-0 border-t border-[#F1E8E1] bg-white px-5 py-5">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#E66F47]">
            <ReceiptText size={18} />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-[#332B26]">
              Bill Summary
            </h3>

            <p className="mt-0.5 text-[10px] text-[#A49A91]">
              Your order breakdown
            </p>
          </div>
        </div>

      
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[#94877D]">
              Subtotal
            </span>

            <span className="font-semibold text-[#332B26]">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>


          <div className="flex items-center justify-between gap-3">
            <span className="text-[#94877D]">
              Discount
            </span>

            <span className="font-semibold text-[#D9633A]">
              − ₹{discount.toFixed(2)}
            </span>
          </div>

 
          <div className="flex items-center justify-between gap-3">
            <span className="text-[#94877D]">
              Tax
            </span>

            <span className="font-semibold text-[#332B26]">
              ₹{tax.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-[#EADDD3]" />

  
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-extrabold text-[#332B26]">
            Grand Total
          </span>

          <span className="text-2xl font-black tracking-tight text-[#D9633A]">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>


        <button
          type="button"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F0784F] px-4 py-3.5 text-sm font-extrabold text-white shadow-md shadow-orange-100 transition hover:bg-[#D9633A] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#E4DDD7] disabled:text-[#9A9188] disabled:shadow-none"
        >
          <CreditCard size={18} />

          Proceed to Checkout

          <ArrowRight size={17} />
        </button>

        <p className="mt-3 text-center text-[10px] leading-5 text-[#A49A91]">
          Fresh food. Better service.
        </p>
      </footer>
    </section>
  );
}

export default CartPanel;