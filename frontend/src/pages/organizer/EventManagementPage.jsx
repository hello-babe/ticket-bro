// pages/organizer/EventManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, MoreHorizontal, Eye, Edit, Trash2, Ticket, Users, DollarSign, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import { StatusBadge, ConfirmDialog } from '@/components/shared/StatusBadge';
import { formatDate, formatPrice } from '@/utils/formatters';
import { toast } from '@/components/shared/common';
import { ROUTES } from '@/app/AppRoutes';
import api from '@/lib/axios';

const EventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const LIMIT = 12;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/organizer/events', { params: { page, limit: LIMIT, ...filters } });
      const d = res.data?.data || res.data;
      setEvents(d?.events || d || []);
      setTotal(d?.total || 0);
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/organizer/events/${deleteConfirm._id}`);
      toast.success('Event deleted'); fetch(); setDeleteConfirm(null);
    } catch { toast.error('Failed to delete event'); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key: 'event', label: 'Event', render: (r) => (
      <div className="flex items-center gap-3 max-w-xs">
        <div className="w-10 h-10 rounded-xl bg-primary/10 overflow-hidden shrink-0 flex items-center justify-center">
          {r.coverImage ? <img src={r.coverImage} alt="" className="w-full h-full object-cover" /> : <Calendar className="h-4 w-4 text-primary" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{r.title}</p>
          <p className="text-xs text-muted-foreground">{formatDate(r.startDate, { dateStyle: 'medium', timeStyle: undefined })}</p>
        </div>
      </div>
    )},
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'sold', label: 'Sold', render: (r) => (
      <div className="space-y-1 min-w-[80px]">
        <div className="flex justify-between text-xs">
          <span className="font-semibold">{r.ticketsSold || 0}</span>
          <span className="text-muted-foreground">/{r.capacity || '∞'}</span>
        </div>
        {r.capacity && <Progress value={(r.ticketsSold / r.capacity) * 100} className="h-1.5" />}
      </div>
    )},
    { key: 'revenue', label: 'Revenue', render: (r) => <span className="text-sm font-semibold text-green-600">{formatPrice(r.totalRevenue || 0)}</span> },
  ];

  const rowActions = (row) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild><Link to={ROUTES.ORGANIZER.EDIT_EVENT(row._id)}><Edit className="h-4 w-4 mr-2" />Edit Event</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to={ROUTES.ORGANIZER.TICKET_MGMT(row._id)}><Ticket className="h-4 w-4 mr-2" />Manage Tickets</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setDeleteConfirm(row)} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      <PageHeader title="My Events" subtitle={`${total} events`}
        actions={[
          { label: 'Refresh', icon: RefreshCw, onClick: fetch, variant: 'outline' },
          { label: 'Create Event', icon: Plus, onClick: () => {} },
        ]}
      />
      <FilterBar
        filters={[
          { type: 'search', key: 'search', placeholder: 'Search events…' },
          { type: 'select', key: 'status', placeholder: 'All statuses', options: [{ label: 'Published', value: 'published' }, { label: 'Draft', value: 'draft' }, { label: 'Pending', value: 'pending_review' }, { label: 'Cancelled', value: 'cancelled' }] },
        ]}
        values={filters}
        onChange={(k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); }}
        onClear={() => { setFilters({ search: '', status: '' }); setPage(1); }}
      />
      <DataTable columns={columns} data={events} actions={rowActions} loading={loading}
        pagination={{ page, limit: LIMIT, total, onPageChange: setPage }}
        emptyMessage="No events yet — create your first event!"
        emptyIcon={Calendar}
      />
      <ConfirmDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}
        title="Delete Event?" description="This will permanently delete the event and all its tickets. Bookings will be cancelled and refunded."
        confirmLabel="Delete Event" onConfirm={handleDelete} loading={deleting}
      />
    </div>
  );
};

export default EventManagementPage;
