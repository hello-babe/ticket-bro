// frontend/src/components/layout/UserMenu.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  Ticket,
  Calendar,
  CreditCard,
  Heart,
  PlusCircle,
  Camera,
  LayoutDashboard,
  BarChart3,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import AvatarUpload from "@/components/user/AvatarUpload";
import { useAuth } from "@/context/AuthContext";

const UserRole = { ADMIN: "admin", ORGANIZER: "organizer", USER: "user" };

const getFullName = (user) => {
  if (!user) return "";
  if (user.name) return user.name;
  return (
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    ""
  );
};

const getInitials = (user) => {
  if (!user) return "U";
  const first = user.firstName || user.name?.split(" ")[0] || "";
  const last = user.lastName || user.name?.split(" ")[1] || "";
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "U";
};

const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const fullName = getFullName(user);
  const initials = getInitials(user);

  const canCreateEvent =
    isAuthenticated &&
    (user?.role === UserRole.ADMIN || user?.role === UserRole.ORGANIZER);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // ── Unauthenticated ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <>
        {/* Desktop: two buttons */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 hidden sm:flex h-9 px-3 text-sm"
          asChild
        >
          <Link to="?auth=login">
            <User className="h-3.5 w-3.5" />
            Sign In
          </Link>
        </Button>
        <Button
          size="sm"
          className="gap-1.5 hidden sm:flex h-9 px-3 text-sm text-black"
          asChild
        >
          <Link to="?auth=register">Sign Up</Link>
        </Button>

        {/* Mobile: icon only */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden h-9 w-9"
          asChild
        >
          <Link to="?auth=login">
            <User className="h-4 w-4" />
          </Link>
        </Button>
      </>
    );
  }

  // ── Authenticated ──────────────────────────────────────────────────────────
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full p-0 hover:bg-accent ml-0.5 shrink-0"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown — responsive width */}
        <DropdownMenuContent
          align="end"
          // w-56 on desktop, slightly narrower if needed; always fits viewport
          className="w-52 sm:w-56 max-w-[calc(100vw-1rem)]"
          sideOffset={8}
        >
          {/* User info */}
          <DropdownMenuLabel className="py-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none truncate">
                {fullName}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email}
              </p>
              <Badge
                variant="outline"
                className="mt-1.5 w-fit text-[10px] px-1.5 py-0"
              >
                {user?.role}
              </Badge>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Change avatar */}
          <DropdownMenuItem
            onClick={() => setShowAvatarUpload(true)}
            className="h-9 text-sm cursor-pointer gap-2"
          >
            <Camera className="h-3.5 w-3.5 shrink-0" />
            <span>Change Avatar</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Quick links */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="h-9 text-sm">
              <Link
                to="/bookings"
                className="cursor-pointer flex items-center gap-2"
              >
                <Ticket className="h-3.5 w-3.5 shrink-0" />
                <span>My Tickets</span>
                <DropdownMenuShortcut className="text-xs hidden sm:block">
                  ⌘T
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="h-9 text-sm">
              <Link
                to="/calendar"
                className="cursor-pointer flex items-center gap-2"
              >
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>Calendar</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="h-9 text-sm">
              <Link
                to="/payments/history"
                className="cursor-pointer flex items-center gap-2"
              >
                <CreditCard className="h-3.5 w-3.5 shrink-0" />
                <span>Payments</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="h-9 text-sm">
              <Link
                to="/profile"
                className="cursor-pointer flex items-center gap-2"
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="h-9 text-sm">
              <Link
                to="/favorites"
                className="cursor-pointer flex items-center gap-2"
              >
                <Heart className="h-3.5 w-3.5 shrink-0" />
                <span>Favorites</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="h-9 text-sm">
              <Link
                to="/settings"
                className="cursor-pointer flex items-center gap-2"
              >
                <Settings className="h-3.5 w-3.5 shrink-0" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {/* Create event — only for admin/organizer, shown in dropdown on mobile
              (the standalone button is hidden on < lg) */}
          {canCreateEvent && (
            <>
              <DropdownMenuSeparator />
              {/* Organizer links */}
              {(user?.role === UserRole.ORGANIZER || user?.role === UserRole.ADMIN) && (
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                    Organizer
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild className="h-9 text-sm">
                    <Link to="/organizer/dashboard" className="cursor-pointer flex items-center gap-2">
                      <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                      <span>Organizer Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="h-9 text-sm">
                    <Link to="/organizer/events" className="cursor-pointer flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>My Events</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="h-9 text-sm">
                    <Link to="/organizer/revenue" className="cursor-pointer flex items-center gap-2">
                      <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                      <span>Revenue</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="h-9 text-sm lg:hidden">
                    <Link to="/organizer/events/create" className="cursor-pointer text-primary flex items-center gap-2">
                      <PlusCircle className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium">Create Event</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
              {/* Admin-only links */}
              {user?.role === UserRole.ADMIN && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                      Admin
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild className="h-9 text-sm">
                      <Link to="/admin/dashboard" className="cursor-pointer flex items-center gap-2">
                        <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="h-9 text-sm">
                      <Link to="/admin/users" className="cursor-pointer flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        <span>User Management</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
            </>
          )}

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive focus:text-destructive cursor-pointer h-9 text-sm gap-2"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            <span>Log out</span>
            <DropdownMenuShortcut className="text-xs hidden sm:block">
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Avatar upload dialog */}
      <AvatarUpload
        user={user}
        open={showAvatarUpload}
        onOpenChange={setShowAvatarUpload}
      />
    </>
  );
};

export default UserMenu;
