// frontend/src/components/browse/shared/SectionHeader.jsx
// Reusable section header with title, subtitle, and optional "view all" link.

import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const SectionHeader = ({
  title,
  subtitle,
  viewAllTo,
  viewAllLabel = "View all",
  rightSlot,
}) => (
  <div className="flex items-end justify-between mb-5 gap-4">
    <div>
      <h2
        className="text-xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-sm text-muted-foreground mt-0.5"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {subtitle}
        </p>
      )}
    </div>

    <div className="flex items-center gap-3 shrink-0">
      {rightSlot}
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="flex items-center gap-1 text-xs font-semibold text-foreground hover:underline whitespace-nowrap"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {viewAllLabel}
          <ChevronRight size={13} />
        </Link>
      )}
    </div>
  </div>
);

export default SectionHeader;
