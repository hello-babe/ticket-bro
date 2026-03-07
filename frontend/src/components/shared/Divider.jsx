import React from "react";

const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-border" />
    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-border" />
  </div>
);

export default Divider;
