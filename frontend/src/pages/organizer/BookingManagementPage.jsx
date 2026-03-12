// pages/organizer/BookingManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Users, Download, RefreshCw, QrCode, CheckCircle2, MoreHorizontal, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import DetailDrawer, { DetailField, DetailSection } from '@/components/shared/DetailDrawer';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate, formatPrice } from '@/utils/formatters';
import { toast } from '@/components/shared/common';
import api from '@/lib/axios';

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', status: '', event: '' });
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [checkInCode, setCheckInCode] = useState('');
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);
  const LIMIT = 15;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, ...filters };
      const res = await api.get('/bookings/organizer/all', { params });
      const d = res.data?.data || res.data;
      setBookings(d?.bookings || d || []);
      setTotal(d?.total || 0);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const openDrawer = async (id) => {
    setDrawerOpen(true); setDrawerLoading(true);
    try {
      const res = await api.get(`/bookings/${id}`);
      setSelected(res.data?.data || res.data);
    } catch { toast.error('Failed to load booking'); setDrawerOpen(false); }
    finally { setDrawerLoading(false); }
  };

  const handleCheckIn = async () => {
    if (!checkInCode.trim()) return;
    setCheckInLoading(true);
    try {
      const res = await api.post(`/bookings/organizer/${checkInCode}/checkin`);
      setCheckInResult({ success: true, message: res.data?.message || 'Check-in successful!', booking: res.data?.data });
      setCheckInCode('');
      toast.success('Attendee checked in!');
    } catch (e) {
      setCheckInResult({ success: false, message: e.response?.data?.message || 'Invalid ticket code' });
    } finally {
      setCheckInLoading(false);
    }
  };

  const columns = [
    { key: 'ref', label: 'Ref#', render: (r) => <span className="text-xs font-mono font-bold text-primary">{r.bookingRef || r._id?.slice(-8).toUpperCase()}</span> },
    { key: 'attendee', label: 'Attendee', render: (r) => (
      <div className="flex items-center gap-2.5">
        <Avatar className="h-7 w-7 shrink-0"><AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">{r.user?.firstName?.[0]}{r.user?.lastName?.[0]}</AvatarFallback></Avatar>
        <div><p className="text-sm font-semibold">{r.user?.firstName} {r.user?.lastName}</p><p className="text-xs text-muted-foreground">{r.user?.email}</p></div>
      </div>
    )},
    { key: 'event', label: 'Event', render: (r) => <span className="text-sm truncate max-w-[160px] block">{r.event?.title || '—'}</span> },
    { key: 'tickets', label: 'Qty', render: (r) => <span className="text-sm font-semibold">{r.quantity || 1}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'amount', label: 'Amount', render: (r) => <span className="text-sm font-semibold text-green-600">{formatPrice(r.totalAmount || 0)}</span> },
    { key: 'date', label: 'Booked', render: (r) => <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(r.createdAt, { dateStyle: 'medium', timeStyle: undefined })}</span> },
  ];

  const rowActions = (row) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openDrawer(row._id)}><Eye className="h-4 w-4 mr-2" />View Details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      <PageHeader title="Bookings" subtitle={`${total.toLocaleString()} total bookings`}
        actions={[
          { label: 'Export', icon: Download, onClick: () => {}, variant: 'outline' },
          { label: 'Refresh', icon: RefreshCw, onClick: fetch, variant: 'outline' },
        ]}
      />

      {/* Check-in panel */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <p className="text-sm font-bold font-heading mb-3 flex items-center gap-2"><QrCode className="h-4 w-4 text-primary" />Quick Check-In</p>
        <div className="flex gap-2 max-w-md">
          <Input value={checkInCode} onChange={(e) => setCheckInCode(e.target.value.toUpperCase())} placeholder="Enter ticket code or booking ref…" className="h-9 font-mono" onKeyDown={(e) => e.key === 'Enter' && handleCheckIn()} />
          <Button onClick={handleCheckIn} disabled={checkInLoading || !checkInCode.trim()} className="h-9 font-bold px-5 shrink-0">
            {checkInLoading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <><CheckCircle2 className="h-4 w-4 mr-1.5" />Check In</>}
          </Button>
        </div>
        {checkInResult && (
          <div className={`mt-3 p-3 rounded-xl text-sm font-medium ${checkInResult.success ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {checkInResult.success ? '✓' : '✗'} {checkInResult.message}
            {checkInResult.success && checkInResult.booking && (
              <span className="ml-2 text-xs text-muted-foreground">— {checkInResult.booking.user?.firstName} {checkInResult.booking.user?.lastName}</span>
            )}
          </div>
        )}
      </div>

      <FilterBar
        filters={[
          { type: 'search', key: 'search', placeholder: 'Search by name or ref…' },
          { type: 'select', key: 'status', placeholder: 'All statuses', options: [{ label: 'Confirmed', value: 'confirmed' }, { label: 'Pending', value: 'pending' }, { label: 'Cancelled', value: 'cancelled' }] },
        ]}
        values={filters}
        onChange={(k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); }}
        onClear={() => { setFilters({ search: '', status: '', event: '' }); setPage(1); }}
      />

      <DataTable columns={columns} data={bookings} actions={rowActions} loading={loading}
        pagination={{ page, limit: LIMIT, total, onPageChange: setPage }}
        emptyMessage="No bookings yet" emptyIcon={Users}
      />

      <DetailDrawer open={drawerOpen} onClose={() => { setDrawerOpen(false); setSelected(null); }} loading={drawerLoading}
        title={selected ? `Booking #${selected.bookingRef || selected._id?.slice(-8).toUpperCase()}` : 'Booking Details'}
        description={selected?.event?.title}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-2"><StatusBadge status={selected.status} /></div>
            <DetailSection title="Booking Info">
              <DetailField label="Reference" value={selected.bookingRef} />
              <DetailField label="Date" value={formatDate(selected.createdAt)} />
              <DetailField label="Tickets" value={`${selected.quantity || 1}`} />
              <DetailField label="Total Amount" value={formatPrice(selected.totalAmount)} />
            </DetailSection>
            <DetailSection title="Attendee">
              <DetailField label="Name" value={`${selected.user?.firstName} ${selected.user?.lastName}`} />
              <DetailField label="Email" value={selected.user?.email} />
              <DetailField label="Phone" value={selected.user?.phone} />
            </DetailSection>
            <DetailSection title="Event">
              <DetailField label="Event" value={selected.event?.title} />
              <DetailField label="Date" value={formatDate(selected.event?.startDate)} />
              <DetailField label="Ticket Type" value={selected.ticketType?.name} />
            </DetailSection>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
};

export default BookingManagementPage;
