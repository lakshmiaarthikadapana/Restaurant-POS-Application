import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  Bell,
  ChevronDown,
  Clock,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  UtensilsCrossed,
  History,
  RefreshCw,
  UserRound,
  X,
  ChefHat,
  Menu,
  ArrowUpDown
} from "lucide-react";

import CategoryList from "../components/category/CategoryList";
import FoodCard from "../components/food/FoodCard";
import CartPanel from "../components/cart/CartPanel";

import { getItems } from "../services/itemService";

import type { FoodItem } from "../types/item";
import type { CartItem as CartItemType } from "../types/cart";

type SortOption =
  | "default"
  | "name-asc"
  | "price-low"
  | "price-high"
  | "rating-high";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, disabled: true },
  { label: "Food Order", icon: UtensilsCrossed, disabled: false },
  { label: "Order History", icon: History, disabled: true },
  { label: "Payment Details", icon: CreditCard, disabled: true },
  { label: "Feedback", icon: MessageSquare, disabled: true },
  { label: "Reports", icon: BarChart3, disabled: true },
  { label: "Settings", icon: Settings, disabled: true },
];

export default function POSPage() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] =
    useState<SortOption>("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [showMobileCart, setShowMobileCart] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const [activeNavigation, setActiveNavigation] =
    useState("Food Order");

  // Fetch menu items
  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getItems(
          selectedCategoryId ?? undefined
        );

        if (isMounted) {
          setItems(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);

        if (isMounted) {
          setError(
            "Unable to load menu items. Please check your connection and try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchItems();

    return () => {
      isMounted = false;
    };
  }, [selectedCategoryId, retryCount]);

  // Search and sort menu items
  const filteredItems = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const filtered = items.filter((item) => {
      return (
        !search ||
        item.name?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
      );
    });

    switch (sortOption) {
      case "name-asc":
        filtered.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
        break;

      case "price-low":
        filtered.sort(
          (a, b) =>
            Number(a.price || 0) - Number(b.price || 0)
        );
        break;

      case "price-high":
        filtered.sort(
          (a, b) =>
            Number(b.price || 0) - Number(a.price || 0)
        );
        break;

      case "rating-high":
        filtered.sort(
          (a, b) =>
            Number(b.rating || 0) - Number(a.rating || 0)
        );
        break;

      default:
        break;
    }

    return filtered;
  }, [items, searchTerm, sortOption]);

  // Calculate total quantity
  const totalQuantity = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  // Calculate total amount
  const totalAmount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          Number(item.price || 0) *
          Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  // Add food to cart
  const handleAddToCart = (item: FoodItem) => {
    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return previousItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
              ...cartItem,
              quantity: Number(cartItem.quantity || 0) + 1,
            }
            : cartItem
        );
      }

      return [
        ...previousItems,
        {
          ...item,
          quantity: 1,
        } as CartItemType,
      ];
    });
  };

  // Increase quantity in cart
  const handleIncreaseCartItem = (id: number) => {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: Number(item.quantity || 0) + 1,
          }
          : item
      )
    );
  };

  // Decrease quantity in cart
  const handleDecreaseCartItem = (id: number) => {
    setCartItems((previousItems) =>
      previousItems.flatMap((item) => {
        if (item.id !== id) {
          return [item];
        }

        const newQuantity = Number(item.quantity || 0) - 1;

        return newQuantity > 0
          ? [{ ...item, quantity: newQuantity }]
          : [];
      })
    );
  };

  // Remove item from cart
  const handleRemoveFromCart = (itemId: number) => {
    setCartItems((previousItems) =>
      previousItems.filter((item) => item.id !== itemId)
    );
  };

  // Clear cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Retry loading menu
  const handleRetry = () => {
    setRetryCount((count) => count + 1);
  };

  // Get quantity for a food item
  const getItemQuantity = (itemId: number) => {
    const cartItem = cartItems.find(
      (item) => item.id === itemId
    );

    return cartItem?.quantity ?? 0;
  };

  const formattedTotal = totalAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Sidebar navigation
  const handleNavigation = (
    label: string,
    disabled: boolean
  ) => {
    if (disabled) return;

    setActiveNavigation(label);
    setShowMobileSidebar(false);
  };

  // Sidebar content
  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-[82px] items-center gap-3 border-b border-gray-100 px-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-200">
          <ChefHat size={25} />
        </div>

        <div className="min-w-0">
          <h1 className="text-lg font-extrabold tracking-tight text-gray-900">
            Savora
          </h1>
          <p className="text-xs font-medium text-gray-400">
            Restaurant POS
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowMobileSidebar(false)}
          className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
          Main Menu
        </p>

        <nav className="space-y-1.5">
          {navigationItems.map((navItem) => {
            const Icon = navItem.icon;
            const isActive = activeNavigation === navItem.label;

            return (
              <button
                key={navItem.label}
                type="button"
                onClick={() =>
                  handleNavigation(
                    navItem.label,
                    navItem.disabled
                  )
                }
                disabled={navItem.disabled}
                title={
                  navItem.disabled
                    ? `${navItem.label} page is not connected yet`
                    : navItem.label
                }
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition-all ${isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-100"
                  : navItem.disabled
                    ? "cursor-not-allowed text-gray-400"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
              >
                <Icon
                  size={19}
                  className={
                    isActive
                      ? "text-white"
                      : navItem.disabled
                        ? "text-gray-300"
                        : "text-gray-500 group-hover:text-orange-500"
                  }
                />

                <span className="flex-1">{navItem.label}</span>

                {isActive && (
                  <ChevronDown
                    size={16}
                    className="shrink-0 -rotate-90"
                  />
                )}


              </button>
            );
          })}
        </nav>

        <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <UtensilsCrossed size={21} />
          </div>

          <h3 className="text-sm font-bold">
            Serve with a smile!
          </h3>

          <p className="mt-1 text-xs leading-5 text-orange-50">
            Great food and great service make every visit special.
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white/90">
            <Star size={13} className="fill-white" />
            <span>Every order matters</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <UserRound size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-800">
              Administrator
            </p>
            <p className="text-xs text-gray-400">
              POS Manager
            </p>
          </div>

          <button
            type="button"
            title="Sign out"
            disabled
            className="cursor-not-allowed rounded-lg p-2 text-gray-300"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fb] text-gray-800">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[250px] shrink-0 border-r border-gray-100 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={() => setShowMobileSidebar(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside className="relative z-10 h-full w-[280px] max-w-[85vw] shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="z-20 flex min-h-[82px] items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-3 sm:px-6 xl:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMobileSidebar(true)}
              aria-label="Open navigation"
              className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0">
              <div className="hidden items-center gap-2 text-xs text-orange-400 sm:flex">
                <span>Restaurant Management</span>
                <span>/</span>

              </div>

              <h2 className="mt-0.5 truncate text-xl font-extrabold text-gray-900 sm:text-2xl">
                Food Order
              </h2>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative mx-auto w-full max-w-sm">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search food items..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-green-700">
                Online
              </span>
            </div>

            <button
              type="button"
              title="Notifications"
              className="relative rounded-xl border border-gray-100 p-2.5 text-gray-500 transition hover:bg-gray-50 hover:text-orange-500"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-orange-500" />
            </button>

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 sm:flex">
              <UserRound size={19} />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 xl:p-8">
            {/* Mobile Search */}
            <div className="mb-5 md:hidden">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search food items..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Hero Banner */}
            <section className="relative mb-8 min-h-[210px] overflow-hidden rounded-3xl bg-gray-900 sm:min-h-[250px]">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=85"
                alt="Freshly prepared food"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/65 to-gray-900/10" />

              <div className="relative flex min-h-[210px] flex-col items-start justify-center p-6 sm:min-h-[250px] sm:p-10">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <ChefHat size={15} />
                  Welcome to Savora
                </span>

                <h2 className="max-w-lg text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                  Good food,
                  <br />
                  great experience.
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-white/80 sm:text-base">
                  Discover delicious dishes and create the perfect order for every customer.
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white">
                  <ShoppingBag size={17} />
                  <span>Fresh choices, made for you</span>
                </div>
              </div>
            </section>

            {/* Explore Menu */}
            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-orange-500">
                    Discover your favourites
                  </p>

                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    Explore Menu
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Find the perfect dish for every craving.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500">
                  <Clock size={15} className="text-orange-500" />
                  <span>Freshly prepared</span>
                </div>
              </div>

              <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <SlidersHorizontal size={18} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Categories
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Choose a category to explore the menu.
                    </p>
                  </div>
                </div>

                <CategoryList
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                />
              </div>
            </section>

            {/* Our Menu */}
            <section>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Menu Heading and Quote */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-1 rounded-full bg-[#F0784F]" />

                    <h2 className="text-2xl font-black tracking-tight text-[#332B26] sm:text-3xl">
                      Our Menu
                    </h2>

                    <span className="rounded-full bg-[#FFF0E8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D9633A]">
                      Fresh & Tasty
                    </span>
                  </div>

                  <p className="mt-2 pl-3 text-sm italic leading-6 text-[#94877D]">
                    "Good food, good mood, unforgettable moments."
                  </p>
                </div>

                {/* Sorting Control */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#F1E8E1] bg-white p-2 shadow-sm sm:justify-start">
                  <div className="flex h-7 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#E66F47]">
                    <ArrowUpDown size={18} />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label
                      htmlFor="menu-sort"
                      className="text-xs text-gray-500"
                    >
                      Sort by:
                    </label>

                    <div className="relative">
                      <select
                        id="menu-sort"
                        value={sortOption}
                        onChange={(event) =>
                          setSortOption(event.target.value as SortOption)
                        }
                     className="h-10 w-[165px] appearance-none rounded-lg border border-[#F1E8E1] bg-white pl-2 pr-6 text-xs font-medium text-[#332B26] outline-none transition focus:border-[#F0784F]"
                      >
                        <option value="default">Featured</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating-high">Highest Rating</option>
                      </select>

                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#E66F47]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((placeholder) => (
                    <div
                      key={placeholder}
                      className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white"
                    >
                      <div className="h-48 bg-gray-100" />

                      <div className="space-y-3 p-4">
                        <div className="h-5 w-2/3 rounded bg-gray-100" />
                        <div className="h-4 w-full rounded bg-gray-100" />
                        <div className="h-4 w-1/2 rounded bg-gray-100" />

                        <div className="flex justify-between pt-3">
                          <div className="h-6 w-20 rounded bg-gray-100" />
                          <div className="h-10 w-24 rounded-xl bg-gray-100" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="rounded-2xl border border-red-100 bg-white px-5 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <RefreshCw size={25} />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    Couldn't load the menu
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    <RefreshCw size={16} />
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredItems.length === 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white px-5 py-14 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">
                    <Search size={29} />
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    No food items found
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Try another search term or select a different category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategoryId(null);
                      setSortOption("default");
                    }}
                    className="mt-5 rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Food Cards */}
              {!loading && !error && filteredItems.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                  {filteredItems.map((item) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      quantity={getItemQuantity(item.id)}
                      onAddToCart={handleAddToCart}
                      onIncrease={() =>
                        handleIncreaseCartItem(item.id)
                      }
                      onDecrease={() =>
                        handleDecreaseCartItem(item.id)
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            <div className="h-24 xl:h-8" />
          </div>
        </div>
      </main>

      {/* Desktop Cart */}
      <aside className="hidden w-[340px] shrink-0 border-l border-gray-100 bg-white xl:block 2xl:w-[380px]">
        <CartPanel
          cartItems={cartItems}
          onIncrease={handleIncreaseCartItem}
          onDecrease={handleDecreaseCartItem}
          onRemove={handleRemoveFromCart}
          onClearCart={handleClearCart}
        />
      </aside>

      {/* Mobile Cart Button */}
      <div className="fixed bottom-4 left-4 right-4 z-30 xl:hidden">
        <button
          type="button"
          onClick={() => setShowMobileCart(true)}
          className="flex w-full items-center justify-between rounded-2xl bg-orange-500 px-5 py-4 text-white shadow-xl shadow-orange-200 transition hover:bg-orange-600 active:scale-[0.99]"
        >
          <span className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <ShoppingBag size={21} />

              {totalQuantity > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-extrabold text-orange-600">
                  {totalQuantity}
                </span>
              )}
            </span>

            <span className="text-left">
              <span className="block text-sm font-bold">
                View Current Order
              </span>

              <span className="mt-0.5 block text-xs text-orange-100">
                {totalQuantity}{" "}
                {totalQuantity === 1 ? "item" : "items"} in cart
              </span>
            </span>
          </span>

          <span className="flex items-center gap-2 text-sm font-extrabold">
            ₹{formattedTotal}
            <ChevronDown size={16} />
          </span>
        </button>
      </div>

      {/* Mobile Cart Overlay */}
      {showMobileCart && (
        <div className="fixed inset-0 z-50 flex justify-end xl:hidden">
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setShowMobileCart(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Current Order
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  {totalQuantity}{" "}
                  {totalQuantity === 1 ? "item" : "items"} in your cart
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileCart(false)}
                aria-label="Close current order"
                className="rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <CartPanel
                cartItems={cartItems}
                onIncrease={handleIncreaseCartItem}
                onDecrease={handleDecreaseCartItem}
                onRemove={handleRemoveFromCart}
                onClearCart={handleClearCart}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}