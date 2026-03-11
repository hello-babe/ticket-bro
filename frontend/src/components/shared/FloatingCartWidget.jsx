// frontend/src/components/layout/FloatingCartWidget.jsx
//
// Floating cart button — visible only on large screen (>= 1024px)
// Mirrors the MobileBottomNav breakpoint pattern: xl:hidden → hidden xl:flex
// Follows Container.jsx responsive conventions

import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const FloatingCartWidget = () => {
  const { itemCount } = useCart();

  return (
    <Link
      to="/cart"
      aria-label={`View cart${itemCount > 0 ? `, ${itemCount} item${itemCount !== 1 ? "s" : ""}` : ""}`}
      className="
        hidden xl:flex
        fixed bottom-10 right-10 z-50
        flex-col items-center justify-center
        w-14 h-14
        rounded
        bg-popover text-popover-foreground
        hover:bg-accent hover:text-accent-foreground
        shadow-sm
        cursor-pointer no-underline
        gap-1
      "
    >
      {/* Icon + badge */}
      <div className="relative">
        <ShoppingCart size={20} strokeWidth={1.9} />
        {itemCount > 0 && (
          <span className="
            absolute -top-1.5 -right-2
            bg-primary text-primary-foreground
            text-[8px] font-bold font-heading
            leading-none px-1 py-0.5
            rounded-full min-w-[15px] text-center
            border border-popover
          ">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="text-[7.5px] font-bold font-heading tracking-widest uppercase leading-none opacity-60">
        CART
      </span>
    </Link>
  );
};

export default FloatingCartWidget;