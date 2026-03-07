// frontend/src/components/layout/UserMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

import {
  User,
  Heart,
  Settings,
  Ticket,
  Calendar,
  CreditCard,
  PlusCircle,
  LogOut,
} from "lucide-react";

const UserMenu = ({ user, isAuthenticated, onLogout, canCreateEvent }) => {
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
            <Link to="/bookings">
              <Ticket className="mr-2 h-3.5 w-3.5" />
              My Tickets
              <DropdownMenuShortcut className="text-xs">
                ⌘T
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/calendar">
              <Calendar className="mr-2 h-3.5 w-3.5" />
              Calendar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/payments/history">
              <CreditCard className="mr-2 h-3.5 w-3.5" />
              Payments
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/profile">
              <User className="mr-2 h-3.5 w-3.5" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/favorites">
              <Heart className="mr-2 h-3.5 w-3.5" />
              Favorites
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="h-8 text-sm">
            <Link to="/settings">
              <Settings className="mr-2 h-3.5 w-3.5" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {canCreateEvent && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="h-8 text-sm">
              <Link to="/events/create" className="text-primary">
                <PlusCircle className="mr-2 h-3.5 w-3.5" />
                Create Event
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="text-destructive cursor-pointer h-8 text-sm"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
