// pages/organizer/AnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Ticket, Star, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { formatPrice } from '@/utils/formatters';
import { toast } from '@/components/shared/common';
import api from '@/lib/axios';

const BarChart = ({ data = [], color = 'bg-primary', label }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.slice(0, 7).map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-24 shrink-0 truncate">{item.label}</span>
          <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
            <div className={`h-full ${color} rounded transition-all duration-500`} style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <span className="text-xs font-semibold w-14 text-right shrink-0">{label === 'revenue' ? formatPrice(item.value) : item.value}</span>
        </div>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState('all');
  const [events, setEvents] = useState([]);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = eventFilter !== 'all' ? { eventId: eventFilter } : {};
      const [analyticsRes, eventsRes] = await Promise.allSettled([
        api.get('/organizer/analytics', { params }),
        api.get('/organizer/events', { params: { limit: 20 } }),
      ]);
      if (analyticsRes.status === 'fulfilled') setData(analyticsRes.value.data?.data || analyticsRes.value.data);
      if (eventsRes.status === 'fulfilled') { const d = eventsRes.value.data?.data || eventsRes.value.data; setEvents(d?.events || d || []); }
    } catch { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [eventFilter]);

  const stats = [
    { title: 'Total Views', value: data?.totalViews?.toLocaleString() || '—', change: data?.viewsGrowth, icon: BarChart3, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500' },
    { title: 'Conversion Rate', value: data?.conversionRate ? `${data.conversionRate}%` : '—', change: data?.conversionGrowth, icon: TrendingUp, iconBg: 'bg-green-500/10', iconColor: 'text-green-500' },
    { title: 'Avg Rating', value: data?.avgRating ? `${data.avgRating.toFixed(1)} ★` : '—', icon: Star, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-500' },
    { title: 'Return Attendees', value: data?.returnRate ? `${data.returnRate}%` : '—', icon: Users, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-500' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <PageHeader title="Analytics" subtitle="Performance insights for your events" className="mb-0" />
        <div className="flex items-center gap-2">
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="h-9 w-44"><SelectValue placeholder="All events" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {events.map((e) => <SelectItem key={e._id} value={e._id}>{e.title.slice(0, 25)}{e.title.length > 25 ? '…' : ''}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={fetch}><RefreshCw className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} loading={loading} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold">Sales by Ticket Type</CardTitle></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-36 w-full" /> : <BarChart data={data?.byTicketType || []} color="bg-primary" />}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold">Revenue by Event</CardTitle></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-36 w-full" /> : <BarChart data={data?.revenueByEvent || []} color="bg-green-500" label="revenue" />}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold">Audience Demographics</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-36 w-full" /> :
              (data?.demographics || []).map((d, i) => (
                <div key={i} className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">{d.label}</span><span className="font-semibold">{d.percent}%</span></div>
                  <Progress value={d.percent} className="h-2" />
                </div>
              ))
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold">Traffic Sources</CardTitle></CardHeader>
          <CardContent>{loading ? <Skeleton className="h-36 w-full" /> : <BarChart data={data?.trafficSources || []} color="bg-purple-500" />}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
