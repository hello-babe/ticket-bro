// frontend/src/components/layout/MobileBottomNav.jsx
// Visible only on mobile/tablet (< 1024px / xl breakpoint)
// 5 tabs: Home · Offers · Trending · My Tickets · Account

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Tag, TrendingUp, Ticket, User } from "lucide-react";
import useAuth from "@/context/AuthContext";

const TABS = [
  { label: "Home",     icon: Home,       to: "/",         public: true  },
  { label: "Browse",   icon: Tag,        to: "/browse",   public: true  },
  { label: "Trending", icon: TrendingUp, to: "/browse", public: true  },
  { label: "Tickets",  icon: Ticket,     to: "/bookings", public: false },
  { label: "Account",  icon: User,       to: "/profile",  public: false },
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    // xl:hidden — only shows on screens < 1024px
    <nav
      className="xl:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-14">
        {TABS.map(({ label, icon: Icon, to, public: isPublic }) => {
          const href = (!isPublic && !isAuthenticated) ? `/?auth=login` : to;
          const isActive = pathname === to;

          return (
            <Link
              key={label}
              to={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors relative ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`h-5 w-5 transition-transform duration-150 ${isActive ? "scale-110" : ""}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{label}</span>
              {/* Active dot */}
              {isActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;