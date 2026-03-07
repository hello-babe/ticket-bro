import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, Heart, PlusCircle, Settings } from "lucide-react";

const ProfilePage = () => {
  // Dummy user data (replace with your auth context)
  const user = {
    name: "Sihab Hasan",
    email: "sihab@example.com",
    role: "organizer",
    avatar: null,
    stats: {
      tickets: 12,
      favorites: 5,
      eventsCreated: 3,
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 lg:p-12 space-y-8">
      {/* Profile Card */}
      <div className="bg-background/50 p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-3xl">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge className="mt-2 px-2 py-1">{user.role.toUpperCase()}</Badge>

            {/* Stats */}
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Ticket className="h-4 w-4 text-primary" />
                <span>{user.stats.tickets} Tickets</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-pink-500" />
                <span>{user.stats.favorites} Favorites</span>
              </div>
              {user.role === "organizer" && (
                <div className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4 text-green-500" />
                  <span>{user.stats.eventsCreated} Events</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div>
            <Button size="sm" className="gap-2">
              <Settings className="h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
