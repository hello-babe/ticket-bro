import React from "react";

const Spinner = () => (
  <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black inline-block animate-spin" />
);

const Button = ({ children, isLoading, ...props }) => (
  <button
    className="mt-1 w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-[#a3e635] text-black text-[0.85rem] font-semibold font-heading hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
    {...props}
  >
    {isLoading ? <Spinner /> : children}
  </button>
);

export default Button;
