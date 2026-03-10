// frontend/src/components/layout/FloatingTimerWidget.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

const FloatingTimerWidget = ({ linkTo = "/browse" }) => {
  return (
    <Link
      to={linkTo}
      aria-label="View closing soon events"
      className="fixed top-1/2 -translate-y-1/2 right-10 z-50 flex flex-col items-center justify-center w-18 h-18 rounded-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground shadow-md cursor-pointer no-underline gap-1"
    >
      <Clock size={24} strokeWidth={2} />
      <span className="text-[7px] font-bold font-heading tracking-widest uppercase leading-tight text-center opacity-80">
        CLOSING<br />SOON
      </span>
    </Link>
  );
};

export default FloatingTimerWidget;