// frontend/src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  ShoppingBag,
  Sun,
  Moon,
  Monitor,
  PlusCircle,
  User,
  LogOut,
  Settings,
  Ticket,
  Calendar,
  CreditCard,
  Heart,
  Bell,
  LayoutDashboard,
  Info,
  Mail,
  HelpCircle,
  MapPin,
  ChevronDown,
  Check,
  Locate,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Container from "@/components/layout/Container";
import { useTheme } from "@/context/ThemeContext";
import useAuth from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useNotification } from "@/context/NotificationContext";
import { useSearch } from "@/context/SearchContext";
import { useLocation, LOCATIONS } from "@/context/LocationContext";

import lightLogo from "@/assets/images/ticket-bro-logo-light-mode.png";
import darkLogo from "@/assets/images/ticket-bro-logo-dark-mode.png";
import UserMenu from "@/components/user/UserMenu";

const UserRole = { ADMIN: "admin", ORGANIZER: "organizer", USER: "user" };

/* ═══════════════════════════════════════════════════════════════
   LOCATION SELECTOR
═══════════════════════════════════════════════════════════════ */
const LocationSelector = ({ selectedLocation, onLocationChange }) => {
  const [open, setOpen] = useState(false);
  const [locSearch, setLocSearch] = useState("");
  const [detecting, setDetecting] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setLocSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
    if (!navigator.geolocation) {
      setDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        onLocationChange({
          id: "current",
          label: "Current Location",
          country: "",
          flag: "📍",
        });
        setDetecting(false);
        setOpen(false);
      },
      () => setDetecting(false),
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-background hover:bg-accent max-w-[160px]"
        aria-label="Select location"
        aria-expanded={open}
      >
        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
        <span
          className="font-medium text-foreground truncate max-w-[90px] text-sm"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {selectedLocation?.label || "Location"}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 w-72 rounded-md border border-border bg-popover shadow-lg z-[60] overflow-hidden"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search city or country..."
                value={locSearch}
                onChange={(e) => setLocSearch(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 text-sm bg-muted rounded border-0 outline-none text-foreground placeholder:text-muted-foreground"
              />
              {locSearch && (
                <button
                  onClick={() => setLocSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="p-1 border-b border-border">
            <button
              onClick={handleDetect}
              disabled={detecting}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-sm hover:bg-accent text-left"
            >
              <Locate className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-medium text-foreground">
                {detecting ? "Detecting..." : "Use my current location"}
              </span>
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No locations found
              </p>
            ) : (
              <>
                {!locSearch && (
                  <p className="text-[10px] font-semibold text-muted-foreground px-3 py-1.5 uppercase tracking-wider">
                    Popular Cities
                  </p>
                )}
                {filtered.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onLocationChange(loc);
                      setOpen(false);
                      setLocSearch("");
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-sm hover:bg-accent text-left"
                  >
                    <span className="text-base leading-none shrink-0">
                      {loc.flag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm leading-none">
                        {loc.label}
                      </p>
                      {loc.country && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {loc.country}
                        </p>
                      )}
                    </div>
                    {selectedLocation?.id === loc.id && (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
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

/* ═══════════════════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════════════════ */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { theme, isDark, setThemeMode } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useNotification();
  const { setQuery } = useSearch();
  const { selectedLocation, changeLocation } = useLocation();

  const canCreateEvent =
    isAuthenticated &&
    (user?.role === UserRole.ADMIN || user?.role === UserRole.ORGANIZER);

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    navigate(
      `/search/results?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation?.id || "")}`,
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        {/* Main row */}
        <div className="flex h-16 items-center justify-between gap-3">
          {/* LEFT: Hamburger (mobile, left-side) + Logo + divider + location */}
          <div className="flex items-center gap-3 shrink-0">
            {/* ✅ Mobile menu trigger — now on the LEFT, before the logo */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <MobileMenuContent
                  onClose={() => setIsMobileMenuOpen(false)}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  canCreateEvent={canCreateEvent}
                  selectedLocation={selectedLocation}
                  onLocationChange={changeLocation}
                />
              </SheetContent>
            </Sheet>

            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={isDark ? darkLogo : lightLogo}
                alt="Ticket Bro"
                className="h-6.5 w-auto"
              />
              <span
                className="text-xl font-bold text-foreground hidden sm:inline"
                style={{ fontFamily: "var(--font-brand)" }}
              >
                Ticket<span className="text-primary">Bro</span>
              </span>
            </Link>

            <div className="hidden md:block h-5 w-px bg-border" />

            {/* Location selector — desktop only */}
            <div className="hidden md:block">
              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationChange={changeLocation}
              />
            </div>
          </div>

          {/* CENTER: Search — desktop only */}
          <div className="hidden md:block flex-1 max-w-xl">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search events in ${selectedLocation?.label || "your city"}...`}
                  className="pl-9 pr-4 py-1 h-9 w-full bg-background/50 border-border focus-visible:ring-primary text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                asChild
              >
                <Link to="/notifications">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-destructive text-destructive-foreground rounded-full text-[10px] animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              asChild
            >
              <Link to="/cart">
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-primary text-primary-foreground rounded-full text-[10px]">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Theme switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex h-9 w-9"
                >
                  {getThemeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onClick={() => setThemeMode("light")}
                  className="gap-2 cursor-pointer h-8 text-sm"
                >
                  <Sun className="h-3.5 w-3.5" /> Light{" "}
                  {theme === "light" && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setThemeMode("dark")}
                  className="gap-2 cursor-pointer h-8 text-sm"
                >
                  <Moon className="h-3.5 w-3.5" /> Dark{" "}
                  {theme === "dark" && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setThemeMode("system")}
                  className="gap-2 cursor-pointer h-8 text-sm"
                >
                  <Monitor className="h-3.5 w-3.5" /> System{" "}
                  {theme === "system" && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <UserMenu />

            {canCreateEvent && (
              <Button
                size="sm"
                className="hidden lg:flex gap-1.5 bg-primary hover:bg-primary/90 h-9 px-3 text-sm"
                asChild
              >
                <Link to="/events/create">
                  <PlusCircle className="h-3.5 w-3.5" /> Create Event
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile row: location + search */}
        <div className="md:hidden py-2 border-t border-border flex items-center gap-2">
          <LocationSelector
            selectedLocation={selectedLocation}
            onLocationChange={changeLocation}
          />
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-9 pr-4 py-1 h-9 w-full bg-background border-border text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </Container>
    </header>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════════════════════ */
const MobileMenuContent = ({
  onClose,
  isAuthenticated,
  user,
  canCreateEvent,
  selectedLocation,
  onLocationChange,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {isAuthenticated ? (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <Badge variant="outline" className="mt-1 text-[10px] px-1 py-0">
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-border space-y-2">
          <Button asChild className="w-full h-9 text-sm" onClick={onClose}>
            <Link to="?auth=login">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full h-9 text-sm"
            onClick={onClose}
          >
            <Link to="?auth=register">Create Account</Link>
          </Button>
        </div>
      )}

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-0.5">
          <MobileNavItem
            to="/"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Home"
            onClose={onClose}
          />
          <MobileNavItem
            to="/search"
            icon={<Search className="h-4 w-4" />}
            label="Search"
            onClose={onClose}
          />
          <MobileNavItem
            to="/browse"
            icon={<Calendar className="h-4 w-4" />}
            label="Browse Events"
            onClose={onClose}
          />
          {isAuthenticated && (
            <>
              <li className="pt-3 pb-1">
                <p className="text-[10px] font-medium text-muted-foreground px-3">
                  ACCOUNT
                </p>
              </li>
              <MobileNavItem
                to="/bookings"
                icon={<Ticket className="h-4 w-4" />}
                label="My Tickets"
                onClose={onClose}
              />
              <MobileNavItem
                to="/calendar"
                icon={<Calendar className="h-4 w-4" />}
                label="Calendar"
                onClose={onClose}
              />
              <MobileNavItem
                to="/payments/history"
                icon={<CreditCard className="h-4 w-4" />}
                label="Payments"
                onClose={onClose}
              />
              <MobileNavItem
                to="/favorites"
                icon={<Heart className="h-4 w-4" />}
                label="Favorites"
                onClose={onClose}
              />
              <MobileNavItem
                to="/profile"
                icon={<User className="h-4 w-4" />}
                label="Profile"
                onClose={onClose}
              />
              <MobileNavItem
                to="/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
                onClose={onClose}
              />
              {canCreateEvent && (
                <>
                  <li className="pt-3 pb-1">
                    <p className="text-[10px] font-medium text-muted-foreground px-3">
                      ORGANIZER
                    </p>
                  </li>
                  <MobileNavItem
                    to="/events/create"
                    icon={<PlusCircle className="h-4 w-4 text-primary" />}
                    label={
                      <span className="text-primary text-sm font-medium">
                        Create Event
                      </span>
                    }
                    onClose={onClose}
                  />
                  <MobileNavItem
                    to="/organizer/dashboard"
                    icon={<LayoutDashboard className="h-4 w-4" />}
                    label="Organizer Dashboard"
                    onClose={onClose}
                  />
                  <MobileNavItem
                    to="/organizer/events"
                    icon={<Calendar className="h-4 w-4" />}
                    label="Manage Events"
                    onClose={onClose}
                  />
                  <MobileNavItem
                    to="/organizer/revenue"
                    icon={<CreditCard className="h-4 w-4" />}
                    label="Revenue"
                    onClose={onClose}
                  />
                </>
              )}
            </>
          )}
          <li className="pt-3 pb-1">
            <p className="text-[10px] font-medium text-muted-foreground px-3">
              SUPPORT
            </p>
          </li>
          <MobileNavItem
            to="/about"
            icon={<Info className="h-4 w-4" />}
            label="About"
            onClose={onClose}
          />
          <MobileNavItem
            to="/contact"
            icon={<Mail className="h-4 w-4" />}
            label="Contact"
            onClose={onClose}
          />
          <MobileNavItem
            to="/faq"
            icon={<HelpCircle className="h-4 w-4" />}
            label="FAQ"
            onClose={onClose}
          />
        </ul>
      </nav>

      {isAuthenticated && (
        <div className="p-4 border-t border-border">
          <Button
            variant="destructive"
            className="w-full gap-2 h-9 text-sm"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </Button>
        </div>
      )}
    </div>
  );
};

const MobileNavItem = ({ to, icon, label, onClose }) => (
  <li>
    <Link
      to={to}
      onClick={onClose}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm min-h-9"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span>{label}</span>
    </Link>
  </li>
);

export default Header;
