// pages/organizer/EditEventPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/shared/PageHeader';
import { StatusBadge, ConfirmDialog } from '@/components/shared/StatusBadge';
import { toast } from '@/components/shared/common';
import { ROUTES } from '@/app/AppRoutes';
import api from '@/lib/axios';

const Field = ({ label, required, error, hint, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold">{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
    {children}
    {hint && !error && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    {error && <p className="text-[11px] text-destructive">{error}</p>}
  </div>
);

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', isOnline: false, coverImage: '',
    startDate: '', startTime: '', endDate: '', endTime: '',
    venueName: '', venueAddress: '', venueCity: '', venueCountry: '',
    ageRestriction: 'none',
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/organizer/events/${eventId}`);
        const d = res.data?.data || res.data;
        setEvent(d);
        setForm({
          title: d.title || '',
          description: d.description || '',
          isOnline: d.isOnline || false,
          coverImage: d.coverImage || '',
          startDate: d.startDate ? d.startDate.split('T')[0] : '',
          startTime: d.startDate ? d.startDate.split('T')[1]?.slice(0, 5) : '',
          endDate: d.endDate ? d.endDate.split('T')[0] : '',
          endTime: d.endDate ? d.endDate.split('T')[1]?.slice(0, 5) : '',
          venueName: d.venue?.name || '',
          venueAddress: d.venue?.address || '',
          venueCity: d.venue?.city || '',
          venueCountry: d.venue?.country || 'Bangladesh',
          ageRestriction: d.ageRestriction || 'none',
        });
      } catch {
        toast.error('Failed to load event');
        navigate(ROUTES.ORGANIZER.EVENTS);
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      await api.put(`/organizer/events/${eventId}`, {
        title: form.title,
        description: form.description,
        isOnline: form.isOnline,
        coverImage: form.coverImage,
        startDate: form.startDate && form.startTime ? `${form.startDate}T${form.startTime}` : form.startDate,
        endDate: form.endDate ? `${form.endDate}T${form.endTime || '23:59'}` : undefined,
        venue: form.isOnline ? undefined : {
          name: form.venueName,
          address: form.venueAddress,
          city: form.venueCity,
          country: form.venueCountry,
        },
        ageRestriction: form.ageRestriction,
      });
      toast.success('Event updated successfully');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.patch(`/organizer/events/${eventId}`, { status: 'cancelled' });
      toast.success('Event cancelled');
      navigate(ROUTES.ORGANIZER.EVENTS);
    } catch {
      toast.error('Failed to cancel event');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 font-sans">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(ROUTES.ORGANIZER.EVENTS)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <PageHeader title="Edit Event" subtitle={event?.title} className="mb-0" />
        </div>
        {event?.status && <StatusBadge status={event.status} />}
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="venue">Date & Venue</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        {/* Details */}
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-5">
              <Field label="Event Title" required>
                <Input value={form.title} onChange={(e) => set('title', e.target.value)} className="h-9" />
              </Field>
              <Field label="Description">
                <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={6} className="text-sm resize-none" />
              </Field>
              <Field label="Age Restriction">
                <Select value={form.ageRestriction} onValueChange={(v) => set('ageRestriction', v)}>
                  <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All Ages</SelectItem>
                    <SelectItem value="13+">13+</SelectItem>
                    <SelectItem value="18+">18+</SelectItem>
                    <SelectItem value="21+">21+</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                <div className="flex-1">
                  <p className="text-sm font-semibold">Online Event</p>
                  <p className="text-xs text-muted-foreground">This is a virtual event</p>
                </div>
                <Switch checked={form.isOnline} onCheckedChange={(v) => set('isOnline', v)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Venue */}
        <TabsContent value="venue" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Date">
                  <Input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className="h-9" />
                </Field>
                <Field label="Start Time">
                  <Input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} className="h-9" />
                </Field>
                <Field label="End Date">
                  <Input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} className="h-9" />
                </Field>
                <Field label="End Time">
                  <Input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} className="h-9" />
                </Field>
              </div>
              {!form.isOnline && (
                <>
                  <Separator />
                  <Field label="Venue Name">
                    <Input value={form.venueName} onChange={(e) => set('venueName', e.target.value)} className="h-9" />
                  </Field>
                  <Field label="Address">
                    <Input value={form.venueAddress} onChange={(e) => set('venueAddress', e.target.value)} className="h-9" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="City">
                      <Input value={form.venueCity} onChange={(e) => set('venueCity', e.target.value)} className="h-9" />
                    </Field>
                    <Field label="Country">
                      <Input value={form.venueCountry} onChange={(e) => set('venueCountry', e.target.value)} className="h-9" />
                    </Field>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media */}
        <TabsContent value="media" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-5">
              <Field label="Cover Image URL" hint="Paste a direct image URL (1200×630px recommended)">
                <Input value={form.coverImage} onChange={(e) => set('coverImage', e.target.value)} placeholder="https://..." className="h-9" />
              </Field>
              {form.coverImage && (
                <img src={form.coverImage} alt="Preview" className="w-full h-52 object-cover rounded-xl border border-border" onError={(e) => { e.target.style.display = 'none'; }} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger" className="mt-4">
          <Card className="border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                <div>
                  <p className="text-sm font-semibold">Cancel This Event</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    All ticket holders will be notified and refunded. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setCancelConfirm(true)} disabled={event?.status === 'cancelled'}>
                  Cancel Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save button */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(ROUTES.ORGANIZER.EVENTS)} className="font-semibold">
          Discard
        </Button>
        <Button onClick={handleSave} disabled={saving} className="font-bold flex-1">
          {saving ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />Saving…</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
        </Button>
      </div>

      <ConfirmDialog
        open={cancelConfirm}
        onOpenChange={setCancelConfirm}
        title="Cancel Event?"
        description="This will cancel the event and automatically refund all ticket holders. This cannot be undone."
        confirmLabel="Cancel Event"
        onConfirm={handleCancel}
        loading={cancelling}
      />
    </div>
  );
};

export default EditEventPage;
