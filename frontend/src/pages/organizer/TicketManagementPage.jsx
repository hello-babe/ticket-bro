// pages/organizer/TicketManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Ticket, Plus, Edit, Trash2, MoreHorizontal, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PageHeader from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/StatusBadge';
import { formatPrice } from '@/utils/formatters';
import { toast } from '@/components/shared/common';
import api from '@/lib/axios';

const EMPTY = { name: '', price: '', quantity: '', type: 'general', description: '', salesStart: '', salesEnd: '', isActive: true };

const TicketManagementPage = () => {
  const { eventId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const url = eventId ? `/organizer/events/${eventId}/tickets` : '/organizer/tickets';
      const res = await api.get(url);
      const d = res.data?.data || res.data;
      setTickets(d?.tickets || d || []);
    } catch { toast.error('Failed to load tickets'); }
    finally { setLoading(false); }
  }, [eventId]);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setForm(EMPTY); setEditingId(null); setDialogOpen(true); };
  const openEdit = (t) => { setForm({ name: t.name, price: t.price, quantity: t.quantity, type: t.type, description: t.description || '', salesStart: t.salesStart?.split('T')[0] || '', salesEnd: t.salesEnd?.split('T')[0] || '', isActive: t.isActive }); setEditingId(t._id); setDialogOpen(true); };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.name || !form.quantity) return toast.error('Name and quantity required');
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) || 0, quantity: parseInt(form.quantity) };
      if (editingId) await api.put(`/organizer/tickets/${editingId}`, payload);
      else await api.post(eventId ? `/organizer/events/${eventId}/tickets` : '/organizer/tickets', payload);
      toast.success(editingId ? 'Ticket updated' : 'Ticket created');
      setDialogOpen(false); fetch();
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/organizer/tickets/${deleteConfirm._id}`);
      toast.success('Ticket type deleted'); fetch(); setDeleteConfirm(null);
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      <PageHeader title="Ticket Management" subtitle="Manage ticket types and availability"
        actions={[
          { label: 'Refresh', icon: RefreshCw, onClick: fetch, variant: 'outline' },
          { label: 'Add Ticket Type', icon: Plus, onClick: openCreate },
        ]}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map((i) => <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl" />)}
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <Ticket className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground mb-3">No ticket types yet</p>
            <Button onClick={openCreate} className="font-bold"><Plus className="h-4 w-4 mr-2" />Create First Ticket</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((t) => {
            const sold = t.soldCount || 0;
            const fillPct = t.quantity ? (sold / t.quantity) * 100 : 0;
            return (
              <Card key={t._id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${t.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <p className="text-base font-bold font-heading">{t.name}</p>
                      <Badge variant="secondary" className="text-[10px] mt-0.5 capitalize">{t.type}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(t)}><Edit className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteConfirm(t)} className="text-red-600"><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-2xl font-extrabold font-heading mb-4">
                    {t.price === 0 ? 'FREE' : formatPrice(t.price)}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Sold</span>
                      <span className="font-semibold">{sold} / {t.quantity}</span>
                    </div>
                    <Progress value={fillPct} className="h-2" />
                    <p className="text-[11px] text-muted-foreground">{t.quantity - sold} remaining</p>
                  </div>
                  {t.description && <p className="text-xs text-muted-foreground mt-3 border-t border-border pt-3">{t.description}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{editingId ? 'Edit Ticket Type' : 'New Ticket Type'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label className="text-xs font-semibold">Name *</Label><Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="General Admission, VIP…" className="mt-1.5 h-9" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Type</Label>
                <Select value={form.type} onValueChange={(v) => set('type', v)}>
                  <SelectTrigger className="mt-1.5 h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['general', 'vip', 'vvip', 'student', 'early_bird', 'group'].map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace('_', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs font-semibold">Price ($)</Label><Input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="0.00" className="mt-1.5 h-9" min="0" step="0.01" /></div>
            </div>
            <div><Label className="text-xs font-semibold">Quantity *</Label><Input type="number" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} placeholder="100" className="mt-1.5 h-9" min="1" /></div>
            <div><Label className="text-xs font-semibold">Description</Label><Input value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Includes backstage pass…" className="mt-1.5 h-9" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs font-semibold">Sales Start</Label><Input type="date" value={form.salesStart} onChange={(e) => set('salesStart', e.target.value)} className="mt-1.5 h-9" /></div>
              <div><Label className="text-xs font-semibold">Sales End</Label><Input type="date" value={form.salesEnd} onChange={(e) => set('salesEnd', e.target.value)} className="mt-1.5 h-9" /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={(v) => set('isActive', v)} /><Label className="text-sm">Active (visible to buyers)</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="font-bold">{saving ? 'Saving…' : editingId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)} title="Delete Ticket Type?" description="This ticket type will be permanently removed. Existing bookings are not affected." confirmLabel="Delete" onConfirm={handleDelete} loading={deleting} />
    </div>
  );
};

export default TicketManagementPage;
