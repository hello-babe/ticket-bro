// frontend/src/components/layout/UserMenu.jsx
import React from "react";
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
import useAuth from "@/context/AuthContext";

const UserRole = { ADMIN: "admin", ORGANIZER: "organizer", USER: "user" };

const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const canCreateEvent =
    isAuthenticated &&
    (user?.role === UserRole.ADMIN || user?.role === UserRole.ORGANIZER);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <>
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0 hover:bg-accent ml-0.5"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            <Badge
              variant="outline"
              className="mt-1 w-fit text-[10px] px-1 py-0"
            >
              {user?.role}
            </Badge>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/bookings" className="cursor-pointer">
              <Ticket className="mr-2 h-3.5 w-3.5" />
              <span>My Tickets</span>
              <DropdownMenuShortcut className="text-xs">
                ⌘T
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/calendar" className="cursor-pointer">
              <Calendar className="mr-2 h-3.5 w-3.5" />
              <span>Calendar</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/payments/history" className="cursor-pointer">
              <CreditCard className="mr-2 h-3.5 w-3.5" />
              <span>Payments</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/profile" className="cursor-pointer">
              <User className="mr-2 h-3.5 w-3.5" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/favorites" className="cursor-pointer">
              <Heart className="mr-2 h-3.5 w-3.5" />
              <span>Favorites</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-3.5 w-3.5" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {canCreateEvent && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="h-8 text-sm">
              <Link to="/events/create" className="cursor-pointer text-primary">
                <PlusCircle className="mr-2 h-3.5 w-3.5" />
                <span className="font-medium">Create Event</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive cursor-pointer h-8 text-sm"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          <span>Log out</span>
          <DropdownMenuShortcut className="text-xs">⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
