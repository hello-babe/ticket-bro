import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const CategoryCard = ({
  category,
  variant = "card",   // "card" | "pill" | "icon"
  className,
}) => {
  const href = category.slug ? `/${category.slug}` : "#";

  if (variant === "pill") {
    return (
      <Link
        to={href}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card",
          "text-sm font-medium text-foreground hover:border-foreground/30 hover:bg-accent",
          "transition-colors shrink-0",
          className
        )}
      >
        {category.emoji && <span className="text-base leading-none">{category.emoji}</span>}
        {category.icon && <category.icon className="size-3.5" />}
        <span>{category.name}</span>
        {category.count != null && (
          <span className="text-xs text-muted-foreground">({category.count})</span>
        )}
      </Link>
    );
  }

  if (variant === "icon") {
    return (
      <Link
        to={href}
        className={cn(
          "flex flex-col items-center gap-2 p-3 rounded-xl border bg-card",
          "hover:border-foreground/20 hover:shadow-sm transition-all group",
          className
        )}
      >
        <div className="size-12 rounded-xl flex items-center justify-center bg-secondary text-2xl group-hover:scale-110 transition-transform">
          {category.emoji ?? (category.icon && <category.icon className="size-6" />)}
        </div>
        <span className="text-xs font-semibold text-foreground text-center leading-tight">{category.name}</span>
        {category.count != null && (
          <span className="text-[10px] text-muted-foreground">{category.count} events</span>
        )}
      </Link>
    );
  }

  // default: "card"
  return (
    <Link
      to={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card",
        "hover:shadow-md hover:border-foreground/20 transition-all",
        className
      )}
    >
      {category.image ? (
        <div className="relative h-32 overflow-hidden bg-muted">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
            onError={(e) => (e.target.style.display = "none")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-3">
            <h3 className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              {category.name}
            </h3>
            {category.count != null && (
              <p className="text-[10px] text-white/70">{category.count} events</p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">
            {category.emoji ?? (category.icon && <category.icon className="size-5" />)}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">{category.name}</h3>
            {category.count != null && (
              <p className="text-xs text-muted-foreground">{category.count} events</p>
            )}
          </div>
        </div>
      )}
    </Link>
  );
};

export default CategoryCard;
