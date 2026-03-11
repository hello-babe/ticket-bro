import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const SubcategoryCard = ({ subcategory, parentSlug, className }) => {
  const href = parentSlug && subcategory.slug
    ? `/${parentSlug}/${subcategory.slug}`
    : subcategory.href ?? "#";

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border bg-card",
        "hover:border-foreground/20 hover:bg-accent transition-all group shrink-0",
        className
      )}
    >
      {subcategory.emoji && (
        <span className="text-base leading-none">{subcategory.emoji}</span>
      )}
      {subcategory.icon && (
        <subcategory.icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{subcategory.name}</p>
        {subcategory.count != null && (
          <p className="text-[10px] text-muted-foreground">{subcategory.count} events</p>
        )}
      </div>
    </Link>
  );
};

export default SubcategoryCard;
