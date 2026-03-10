// frontend/src/components/layout/Header.jsx
//
// BREAKPOINTS:
//   Mobile/tablet (< 1024px): xl:hidden   — xxs:320 xs:375 sm:480 md:640 lg:768
//   Desktop       (≥ 1024px): hidden xl:flex

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, Search, ShoppingBag, Sun, Moon, Monitor, PlusCircle,
  MapPin, ChevronDown, Check, Locate, X,
  TrendingUp, Tag, LogOut, User, Settings, Ticket, Calendar,
  CreditCard, Heart, LayoutDashboard, Info, Mail, HelpCircle, ChevronRight,
} from "lucide-react";
import { Button }                                from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage }   from "@/components/ui/avatar";
import { Badge }                                 from "@/components/ui/badge";
import { Input }                                 from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Container                                 from "@/components/layout/Container";
import { useTheme }                              from "@/context/ThemeContext";
import useAuth                                   from "@/context/AuthContext";
import { useCart }                               from "@/context/CartContext";
import { useSearch }                             from "@/context/SearchContext";
import { useLocation as useLocationCtx, LOCATIONS } from "@/context/LocationContext";
import lightLogo from "@/assets/images/ticket-bro-logo-light-mode.png";
import darkLogo  from "@/assets/images/ticket-bro-logo-dark-mode.png";
import UserMenu  from "@/components/user/UserMenu";

const UserRole = { ADMIN: "admin", ORGANIZER: "organizer", USER: "user" };

/* ════════════════════════════════════════════════════════════
   LOCATION SELECTOR
════════════════════════════════════════════════════════════ */
const LocationSelector = ({ selectedLocation, onLocationChange, compact = false }) => {
  const [open, setOpen]           = useState(false);
  const [locSearch, setLocSearch] = useState("");
  const [detecting, setDetecting] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef    = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false); setLocSearch("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = LOCATIONS.filter(
    (l) =>
      l.label.toLowerCase().includes(locSearch.toLowerCase()) ||
      l.country.toLowerCase().includes(locSearch.toLowerCase()),
  );

  const handleDetect = () => {
    setDetecting(true);
    if (!navigator.geolocation) { setDetecting(false); return; }
    navigator.geolocation.getCurrentPosition(
      () => {
        onLocationChange({ id: "current", label: "Current Location", country: "", flag: "📍" });
        setDetecting(false); setOpen(false);
      },
      () => setDetecting(false),
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center rounded-md border border-border bg-background hover:bg-accent transition-colors ${
          compact ? "h-8 px-2 gap-1" : "h-9 px-3 gap-1.5 max-w-[160px]"
        }`}
        aria-label="Select location"
        aria-expanded={open}
      >
        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
        {/* compact (mobile header): show label only from sm (480px+), icon-only below to avoid overlapping brand name */}
        {compact ? (
          <span className="hidden sm:inline font-medium text-foreground truncate text-sm max-w-[110px]">
            {selectedLocation?.label || "Location"}
          </span>
        ) : (
          <span className="font-medium text-foreground truncate text-sm">
            {selectedLocation?.label || "Location"}
          </span>
        )}
        <ChevronDown className={`${
          compact ? "hidden sm:block" : ""
        } h-3 w-3 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-[min(288px,calc(100vw-1rem))] rounded-md border border-border bg-popover shadow-lg z-[60] overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={inputRef} type="text" placeholder="Search city or country..."
                value={locSearch} onChange={(e) => setLocSearch(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 text-sm bg-muted rounded border-0 outline-none text-foreground placeholder:text-muted-foreground"
              />
              {locSearch && (
                <button onClick={() => setLocSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          <div className="p-1 border-b border-border">
            <button onClick={handleDetect} disabled={detecting}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-sm hover:bg-accent text-left">
              <Locate className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-medium text-foreground">{detecting ? "Detecting..." : "Use my current location"}</span>
            </button>
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No locations found</p>
            ) : (
              <>
                {!locSearch && (
                  <p className="text-[10px] font-semibold text-muted-foreground px-3 py-1.5 uppercase tracking-wider">Popular Cities</p>
                )}
                {filtered.map((loc) => (
                  <button key={loc.id}
                    onClick={() => { onLocationChange(loc); setOpen(false); setLocSearch(""); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-sm hover:bg-accent text-left">
                    <span className="text-base leading-none shrink-0">{loc.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm leading-none">{loc.label}</p>
                      {loc.country && <p className="text-[11px] text-muted-foreground mt-0.5">{loc.country}</p>}
                    </div>
                    {selectedLocation?.id === loc.id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   THEME SWITCHER
════════════════════════════════════════════════════════════ */
const ThemeSwitcher = ({ theme, setThemeMode, size = "md" }) => {
  const icon =
    theme === "light" ? <Sun  className="h-4 w-4" /> :
    theme === "dark"  ? <Moon className="h-4 w-4" /> :
                        <Monitor className="h-4 w-4" />;
  const cls = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`${cls} shrink-0`}>{icon}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => setThemeMode("light")} className="gap-2 cursor-pointer h-8 text-sm">
          <Sun className="h-3.5 w-3.5" /> Light
          {theme === "light" && <span className="ml-auto text-xs text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeMode("dark")} className="gap-2 cursor-pointer h-8 text-sm">
          <Moon className="h-3.5 w-3.5" /> Dark
          {theme === "dark" && <span className="ml-auto text-xs text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeMode("system")} className="gap-2 cursor-pointer h-8 text-sm">
          <Monitor className="h-3.5 w-3.5" /> System
          {theme === "system" && <span className="ml-auto text-xs text-primary">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* ════════════════════════════════════════════════════════════
   MOBILE SIDEBAR
════════════════════════════════════════════════════════════ */
const MobileSidebar = ({ open, onClose, isAuthenticated, user, canCreateEvent }) => {
  const { logout }    = useAuth();
  const navigate      = useNavigate();
  const { pathname }  = useLocation();

  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current !== pathname) { prevPath.current = pathname; onClose(); }
  }, [pathname, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = async () => { await logout(); navigate("/"); onClose(); };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label="Navigation menu"
        className="fixed inset-y-0 left-0 z-50 flex flex-col w-[min(300px,85vw)] bg-background border-r border-border shadow-2xl">

        <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
          <Link to="/" onClick={onClose}>
            <span className="text-base font-bold" style={{ fontFamily: "var(--font-brand)" }}>
              Ticket<span className="text-primary">Bro</span>
            </span>
          </Link>
          <button onClick={onClose} aria-label="Close menu"
            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {isAuthenticated ? (
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <Badge variant="outline" className="mt-1 text-[10px] px-1 py-0">{user?.role}</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-border space-y-2">
            <Button asChild className="w-full h-9 text-sm" onClick={onClose}><Link to="?auth=login">Sign In</Link></Button>
            <Button asChild variant="outline" className="w-full h-9 text-sm" onClick={onClose}><Link to="?auth=register">Create Account</Link></Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <SideSection label="Discover">
            <SideItem to="/"         icon={<LayoutDashboard className="h-4 w-4" />} label="Home"         onClose={onClose} />
            <SideItem to="/search"   icon={<Search         className="h-4 w-4" />} label="Search"       onClose={onClose} />
            <SideItem to="/browse"   icon={<Calendar       className="h-4 w-4" />} label="Browse Events" onClose={onClose} />
            <SideItem to="/browse"   icon={<Tag            className="h-4 w-4" />} label="Offers"       onClose={onClose} />
            <SideItem to="/browse" icon={<TrendingUp     className="h-4 w-4" />} label="Trending"     onClose={onClose} />
          </SideSection>

          {isAuthenticated && (
            <SideSection label="Account">
              <SideItem to="/bookings"         icon={<Ticket     className="h-4 w-4" />} label="My Tickets" onClose={onClose} />
              <SideItem to="/bookings"         icon={<Calendar   className="h-4 w-4" />} label="Calendar"   onClose={onClose} />
              <SideItem to="/payments/history" icon={<CreditCard className="h-4 w-4" />} label="Payments"   onClose={onClose} />
              <SideItem to="/profile"        icon={<Heart      className="h-4 w-4" />} label="Favorites"  onClose={onClose} />
              <SideItem to="/profile"          icon={<User       className="h-4 w-4" />} label="Profile"    onClose={onClose} />
              <SideItem to="/profile/change-password"         icon={<Settings   className="h-4 w-4" />} label="Settings"   onClose={onClose} />
            </SideSection>
          )}

          {canCreateEvent && (
            <SideSection label="Organizer">
              <SideItem to="/events/create"       icon={<PlusCircle      className="h-4 w-4 text-primary" />} label={<span className="text-primary font-medium">Create Event</span>} onClose={onClose} />
              <SideItem to="/organizer/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard"     onClose={onClose} />
              <SideItem to="/organizer/events"    icon={<Calendar        className="h-4 w-4" />} label="Manage Events" onClose={onClose} />
              <SideItem to="/organizer/revenue"   icon={<CreditCard      className="h-4 w-4" />} label="Revenue"       onClose={onClose} />
            </SideSection>
          )}

          <SideSection label="Support">
            <SideItem to="/about"   icon={<Info       className="h-4 w-4" />} label="About"   onClose={onClose} />
            <SideItem to="/contact" icon={<Mail       className="h-4 w-4" />} label="Contact" onClose={onClose} />
            <SideItem to="/faq"     icon={<HelpCircle className="h-4 w-4" />} label="FAQ"     onClose={onClose} />
          </SideSection>
        </div>

        {isAuthenticated && (
          <div className="p-4 border-t border-border shrink-0">
            <Button variant="destructive" className="w-full gap-2 h-9 text-sm" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" /> Logout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

const SideSection = ({ label, children }) => (
  <div className="py-1">
    <p className="text-[10px] font-semibold text-muted-foreground px-4 py-2 uppercase tracking-wider">{label}</p>
    <ul className="space-y-0.5 px-2">{children}</ul>
  </div>
);

const SideItem = ({ to, icon, label, onClose }) => (
  <li>
    <Link to={to} onClick={onClose}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm min-h-9 text-foreground transition-colors">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
    </Link>
  </li>
);

/* ════════════════════════════════════════════════════════════
   HEADER
════════════════════════════════════════════════════════════ */
const Header = () => {
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery,      setSearchQuery]      = useState("");
  const navigate = useNavigate();

  const { theme, isDark, setThemeMode }      = useTheme();
  const { user, isAuthenticated }             = useAuth();
  const { itemCount }                         = useCart();
  const { setQuery }                          = useSearch();
  const { selectedLocation, changeLocation }  = useLocationCtx();

  const canCreateEvent =
    isAuthenticated &&
    (user?.role === UserRole.ADMIN || user?.role === UserRole.ORGANIZER);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setMobileSearchOpen(false);
    navigate(`/search/results?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation?.id || "")}`);
  };

  const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <Container>

          {/* ══ MOBILE / TABLET  (< 1024px) ══════════════════════════ */}
          <div className="flex xl:hidden h-14 items-center justify-between">

            {/* LEFT: ☰ + 📍 location
                xxs (320px): icon only fits beside tiny location label
                xs+  (375px): label shows up to ~110px
                sm+  (480px): label up to 130px                        */}
            <div className="flex items-center gap-1 xs:gap-2 shrink-0">
              <Button
                variant="ghost" size="icon"
                className="h-9 w-9 shrink-0"
                onClick={openSidebar}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationChange={changeLocation}
                compact
              />
            </div>

            {/* CENTER: TicketBro — absolutely centred, never pushed by sides */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="absolute left-1/2 -translate-x-1/2 z-10 hover:opacity-80 transition-opacity"
            >
              <span
                className="text-2xl font-bold text-foreground tracking-tight whitespace-nowrap"
                style={{ fontFamily: "var(--font-brand)" }}
              >
                Ticket<span className="text-primary">Bro</span>
              </span>
            </Link>

            {/* RIGHT: 🔍 + 🛍 + 🌙
                All three always visible, h-8 on xxs to save space, h-9 on xs+ */}
            <div className="flex items-center gap-0 xs:gap-0.5 shrink-0">
              {/* Search toggle */}
              <Button
                variant="ghost" size="icon"
                className="h-8 w-8 xs:h-9 xs:w-9 shrink-0"
                onClick={() => setMobileSearchOpen((p) => !p)}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" className="relative h-8 w-8 xs:h-9 xs:w-9 shrink-0" asChild>
                <Link to="/cart" aria-label="Cart">
                  <ShoppingBag className="h-4 w-4" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 bg-primary text-primary-foreground rounded-full text-[9px]">
                      {itemCount > 9 ? "9+" : itemCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Theme */}
              <ThemeSwitcher theme={theme} setThemeMode={setThemeMode} size="sm" />
            </div>
          </div>

          {/* Expandable search bar — slides in below mobile header row */}
          {mobileSearchOpen && (
            <div className="xl:hidden pb-2 pt-1 px-0">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search" autoFocus
                  placeholder={`Search in ${selectedLocation?.label || "your city"}...`}
                  className="pl-9 pr-9 h-9 w-full text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="button" onClick={() => setMobileSearchOpen(false)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* ══ DESKTOP  (≥ 1024px) ═══════════════════════════════════ */}
          <div className="hidden xl:flex h-16 items-center gap-2">

            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <img src={isDark ? darkLogo : lightLogo} alt="Ticket Bro" className="h-7 w-auto" />
              <span className="text-xl font-bold text-foreground whitespace-nowrap" style={{ fontFamily: "var(--font-brand)" }}>
                Ticket<span className="text-primary">Bro</span>
              </span>
            </Link>

            <div className="h-5 w-px bg-border shrink-0 mx-1" />

            <LocationSelector selectedLocation={selectedLocation} onLocationChange={changeLocation} />

            <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-xl mx-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="search"
                  placeholder={`Search events in ${selectedLocation?.label || "your city"}...`}
                  className="pl-9 pr-4 h-9 w-full bg-background/50 border-border focus-visible:ring-primary text-sm"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Offers */}
            <Link to="/browse"
              className="flex items-center gap-1.5 px-3 h-9 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-colors shrink-0">
              <Tag className="h-3.5 w-3.5" />
              Offers
            </Link>

            {/* Trending */}
            <Link to="/browse"
              className="flex items-center gap-1.5 px-3 h-9 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-colors shrink-0">
              <TrendingUp className="h-3.5 w-3.5" />
              Trending
            </Link>

            <ThemeSwitcher theme={theme} setThemeMode={setThemeMode} />

            <UserMenu />

            {canCreateEvent && (
              <Button size="sm" asChild
                className="gap-1.5 bg-primary hover:bg-primary/90 h-9 px-3 text-sm shrink-0 whitespace-nowrap">
                <Link to="/events/create">
                  <PlusCircle className="h-3.5 w-3.5" /> Create Event
                </Link>
              </Button>
            )}
          </div>

        </Container>
      </header>

      <MobileSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        isAuthenticated={isAuthenticated}
        user={user}
        canCreateEvent={canCreateEvent}
      />
    </>
  );
};

export default Header;