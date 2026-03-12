// pages/organizer/OrganizerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Ticket, DollarSign, Users, Plus, ArrowRight, TrendingUp, Clock, Star, Eye, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate, formatPrice } from '@/utils/formatters';
import { ROUTES } from '@/app/AppRoutes';
import api from '@/lib/axios';

const OrganizerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/organizer/dashboard');
        setData(res.data?.data || res.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const stats = [
    { title: 'Total Events', value: data?.totalEvents || '—', change: data?.eventGrowth, icon: Calendar, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500' },
    { title: 'Tickets Sold', value: data?.totalTicketsSold?.toLocaleString() || '—', change: data?.ticketGrowth, icon: Ticket, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
    { title: 'Total Revenue', value: data?.totalRevenue ? formatPrice(data.totalRevenue) : '—', change: data?.revenueGrowth, icon: DollarSign, iconBg: 'bg-green-500/10', iconColor: 'text-green-500' },
    { title: 'Avg Rating', value: data?.avgRating ? `${data.avgRating.toFixed(1)} ★` : '—', icon: Star, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-500' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <PageHeader title="My Dashboard" subtitle="Manage your events and track performance" className="mb-0" />
        <Link to={ROUTES.ORGANIZER.CREATE_EVENT}>
          <Button className="font-bold h-9">
            <Plus className="h-4 w-4 mr-2" /> Create Event
          </Button>
        </Link>
      </div>

      {/* Pending payout alert */}
      {(data?.pendingPayout || 0) > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20">
          <DollarSign className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Payout Available: {formatPrice(data.pendingPayout)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Your funds are ready to be withdrawn</p>
          </div>
          <Link to={ROUTES.ORGANIZER.REVENUE}>
            <Button size="sm" className="h-8 font-bold">Request Payout</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} loading={loading} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold font-heading">My Events</CardTitle>
                <Link to={ROUTES.ORGANIZER.EVENTS} className="text-xs text-primary hover:underline font-medium">
                  View all →
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />)}</div>
              ) : (data?.recentEvents || []).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No events yet</p>
                  <Link to={ROUTES.ORGANIZER.CREATE_EVENT}>
                    <Button size="sm" className="font-bold"><Plus className="h-3.5 w-3.5 mr-1.5" />Create Your First Event</Button>
                  </Link>
                </div>
              ) : (data?.recentEvents || []).map((event) => (
                <div key={event._id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {event.coverImage ? <img src={event.coverImage} alt="" className="w-full h-full object-cover" /> : <Calendar className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{event.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(event.startDate, { dateStyle: 'medium', timeStyle: undefined })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-semibold">{event.ticketsSold || 0}/{event.capacity || '∞'}</p>
                      <p className="text-[11px] text-muted-foreground">tickets</p>
                    </div>
                    <StatusBadge status={event.status} />
                  </div>
                  <Link to={ROUTES.ORGANIZER.EDIT_EVENT(event._id)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Eye className="h-3.5 w-3.5" /></Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-bold font-heading">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Create New Event', icon: Plus, href: ROUTES.ORGANIZER.CREATE_EVENT, primary: true },
                { label: 'View All Bookings', icon: Users, href: ROUTES.ORGANIZER.BOOKINGS },
                { label: 'Revenue Report', icon: DollarSign, href: ROUTES.ORGANIZER.REVENUE },
                { label: 'Analytics', icon: TrendingUp, href: ROUTES.ORGANIZER.ANALYTICS },
              ].map((a) => (
                <Link key={a.label} to={a.href}>
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${a.primary ? 'bg-primary/10 hover:bg-primary/20' : 'hover:bg-muted'}`}>
                    <a.icon className={`h-4 w-4 shrink-0 ${a.primary ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-semibold ${a.primary ? 'text-primary' : 'text-foreground'}`}>{a.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent bookings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold font-heading">Recent Bookings</CardTitle>
                <Link to={ROUTES.ORGANIZER.BOOKINGS} className="text-xs text-primary hover:underline">View all →</Link>
              </div>
            </CardHeader>
            <CardContent>
              {(data?.recentBookings || []).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
              ) : (data?.recentBookings || []).slice(0, 4).map((b) => (
                <div key={b._id} className="flex items-center gap-2.5 py-2 border-b border-border last:border-0">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="text-xs bg-muted font-bold">
                      {b.user?.firstName?.[0]}{b.user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{b.user?.firstName} {b.user?.lastName}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{b.event?.title}</p>
                  </div>
                  <span className="text-xs font-semibold text-green-600 shrink-0">{formatPrice(b.totalAmount)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
