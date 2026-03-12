// pages/organizer/CreateEventPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Calendar, MapPin, Ticket, Image, Eye, Upload, Plus, X, Globe, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PageHeader from '@/components/shared/PageHeader';
import { toast } from '@/components/shared/common';
import { ROUTES } from '@/app/AppRoutes';
import api from '@/lib/axios';

// ── Step Indicator ──────────────────────────────────────────────────────────
const StepIndicator = ({ steps, current }) => (
  <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${i === current ? 'bg-primary text-primary-foreground' : i < current ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
          {i < current ? <Check className="h-3 w-3" /> : <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-[10px]">{i + 1}</span>}
          <span className="hidden sm:block">{step}</span>
        </div>
        {i < steps.length - 1 && <div className={`h-0.5 w-6 rounded-full ${i < current ? 'bg-green-500' : 'bg-muted'}`} />}
      </React.Fragment>
    ))}
  </div>
);

// ── Field Wrapper ───────────────────────────────────────────────────────────
const Field = ({ label, required, error, hint, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-foreground">
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    {children}
    {hint && !error && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    {error && <p className="text-[11px] text-destructive">{error}</p>}
  </div>
);

const inputCls = "h-9 text-sm";

const STEPS = ['Basic Info', 'Date & Venue', 'Tickets', 'Media & Publish'];

const EMPTY_TICKET = { name: '', price: '', quantity: '', description: '', type: 'general', salesStart: '', salesEnd: '' };

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Basic
    title: '', description: '', category: '', subcategory: '', tags: [],
    isOnline: false, ageRestriction: 'none',
    // Date & Venue
    startDate: '', startTime: '', endDate: '', endTime: '', timezone: 'Asia/Dhaka',
    venueName: '', venueAddress: '', venueCity: '', venueCountry: 'Bangladesh', onlineLink: '',
    // Tickets
    isFree: false, tickets: [{ ...EMPTY_TICKET, name: 'General Admission', type: 'general' }],
    // Media
    coverImage: '', images: [], publishStatus: 'draft',
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const errs = {};
    if (step === 0) {
      if (!form.title.trim()) errs.title = 'Title is required';
      if (!form.category) errs.category = 'Category is required';
      if (!form.description.trim()) errs.description = 'Description is required';
    }
    if (step === 1) {
      if (!form.startDate) errs.startDate = 'Start date is required';
      if (!form.startTime) errs.startTime = 'Start time is required';
      if (!form.isOnline && !form.venueName) errs.venueName = 'Venue name is required';
    }
    if (step === 2) {
      if (!form.isFree && form.tickets.some((t) => !t.name || !t.price || !t.quantity)) {
        errs.tickets = 'All ticket fields are required';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(STEPS.length - 1, s + 1)); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const addTicket = () => setForm((f) => ({ ...f, tickets: [...f.tickets, { ...EMPTY_TICKET }] }));
  const removeTicket = (i) => setForm((f) => ({ ...f, tickets: f.tickets.filter((_, idx) => idx !== i) }));
  const updateTicket = (i, key, val) => setForm((f) => ({ ...f, tickets: f.tickets.map((t, idx) => idx === i ? { ...t, [key]: val } : t) }));

  const handleSubmit = async (status = 'draft') => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title, description: form.description, category: form.category,
        tags: form.tags, isOnline: form.isOnline, ageRestriction: form.ageRestriction,
        startDate: `${form.startDate}T${form.startTime}`, endDate: form.endDate ? `${form.endDate}T${form.endTime || '23:59'}` : undefined,
        timezone: form.timezone,
        venue: form.isOnline ? undefined : { name: form.venueName, address: form.venueAddress, city: form.venueCity, country: form.venueCountry },
        onlineLink: form.isOnline ? form.onlineLink : undefined,
        isFree: form.isFree, ticketTypes: form.isFree ? [{ name: 'Free Admission', price: 0, quantity: form.tickets[0]?.quantity || 100 }] : form.tickets.map((t) => ({ ...t, price: parseFloat(t.price), quantity: parseInt(t.quantity) })),
        coverImage: form.coverImage, status,
      };
      await api.post('/organizer/events', payload);
      toast.success(status === 'draft' ? 'Event saved as draft' : 'Event submitted for review');
      navigate(ROUTES.ORGANIZER.EVENTS);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 font-sans">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(ROUTES.ORGANIZER.EVENTS)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title="Create Event" subtitle="Fill in the details for your new event" className="mb-0" />
      </div>

      <StepIndicator steps={STEPS} current={step} />

      <Card>
        <CardContent className="p-6 space-y-5">
          {/* ── Step 0: Basic Info ─────────────────────────────────────────── */}
          {step === 0 && (
            <>
              <Field label="Event Title" required error={errors.title}>
                <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Summer Music Festival 2025" className={inputCls} />
              </Field>
              <Field label="Description" required error={errors.description} hint="Describe what attendees can expect. Min 100 characters recommended.">
                <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Tell people about your event…" rows={5} className="text-sm resize-none" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category" required error={errors.category}>
                  <Select value={form.category} onValueChange={(v) => set('category', v)}>
                    <SelectTrigger className={inputCls}><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {['Music', 'Sports', 'Arts & Culture', 'Food & Drink', 'Business', 'Education', 'Technology', 'Health', 'Kids & Family', 'Community'].map((c) => (
                        <SelectItem key={c} value={c.toLowerCase().replace(/[^a-z]/g, '-')}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Age Restriction">
                  <Select value={form.ageRestriction} onValueChange={(v) => set('ageRestriction', v)}>
                    <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All Ages</SelectItem>
                      <SelectItem value="13+">13+</SelectItem>
                      <SelectItem value="18+">18+</SelectItem>
                      <SelectItem value="21+">21+</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Online Event</p>
                  <p className="text-xs text-muted-foreground">This is a virtual/online event</p>
                </div>
                <Switch checked={form.isOnline} onCheckedChange={(v) => set('isOnline', v)} />
              </div>
            </>
          )}

          {/* ── Step 1: Date & Venue ───────────────────────────────────────── */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Date" required error={errors.startDate}>
                  <Input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls} />
                </Field>
                <Field label="Start Time" required error={errors.startTime}>
                  <Input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} className={inputCls} />
                </Field>
                <Field label="End Date">
                  <Input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} className={inputCls} />
                </Field>
                <Field label="End Time">
                  <Input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} className={inputCls} />
                </Field>
              </div>
              <Field label="Timezone">
                <Select value={form.timezone} onValueChange={(v) => set('timezone', v)}>
                  <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Asia/Dhaka', 'Asia/Kolkata', 'Asia/Singapore', 'America/New_York', 'Europe/London', 'UTC'].map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Separator />
              {form.isOnline ? (
                <Field label="Online Event Link" hint="Zoom, Google Meet, YouTube live link etc.">
                  <Input value={form.onlineLink} onChange={(e) => set('onlineLink', e.target.value)} placeholder="https://zoom.us/j/..." className={inputCls} />
                </Field>
              ) : (
                <>
                  <Field label="Venue Name" required error={errors.venueName}>
                    <Input value={form.venueName} onChange={(e) => set('venueName', e.target.value)} placeholder="e.g. Bashundhara International Convention City" className={inputCls} />
                  </Field>
                  <Field label="Street Address">
                    <Input value={form.venueAddress} onChange={(e) => set('venueAddress', e.target.value)} placeholder="123 Gulshan Avenue" className={inputCls} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="City">
                      <Input value={form.venueCity} onChange={(e) => set('venueCity', e.target.value)} placeholder="Dhaka" className={inputCls} />
                    </Field>
                    <Field label="Country">
                      <Input value={form.venueCountry} onChange={(e) => set('venueCountry', e.target.value)} placeholder="Bangladesh" className={inputCls} />
                    </Field>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Step 2: Tickets ────────────────────────────────────────────── */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                <Ticket className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Free Event</p>
                  <p className="text-xs text-muted-foreground">No charge for attendees</p>
                </div>
                <Switch checked={form.isFree} onCheckedChange={(v) => set('isFree', v)} />
              </div>

              {errors.tickets && <p className="text-xs text-destructive">{errors.tickets}</p>}

              <div className="space-y-4">
                {form.tickets.map((ticket, i) => (
                  <div key={i} className="border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">Ticket {i + 1}</p>
                      {form.tickets.length > 1 && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500" onClick={() => removeTicket(i)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Ticket Name">
                        <Input value={ticket.name} onChange={(e) => updateTicket(i, 'name', e.target.value)} placeholder="General, VIP, VVIP…" className={inputCls} />
                      </Field>
                      <Field label="Type">
                        <Select value={ticket.type} onValueChange={(v) => updateTicket(i, 'type', v)}>
                          <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="vvip">VVIP</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="early_bird">Early Bird</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    {!form.isFree && (
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Price ($)">
                          <Input type="number" value={ticket.price} onChange={(e) => updateTicket(i, 'price', e.target.value)} placeholder="0.00" className={inputCls} min="0" step="0.01" />
                        </Field>
                        <Field label="Quantity">
                          <Input type="number" value={ticket.quantity} onChange={(e) => updateTicket(i, 'quantity', e.target.value)} placeholder="100" className={inputCls} min="1" />
                        </Field>
                      </div>
                    )}
                    {form.isFree && (
                      <Field label="Max Capacity">
                        <Input type="number" value={ticket.quantity} onChange={(e) => updateTicket(i, 'quantity', e.target.value)} placeholder="100" className={inputCls} min="1" />
                      </Field>
                    )}
                    <Field label="Description" hint="Optional — shown to buyers">
                      <Input value={ticket.description} onChange={(e) => updateTicket(i, 'description', e.target.value)} placeholder="What's included…" className={inputCls} />
                    </Field>
                  </div>
                ))}

                <Button variant="outline" className="w-full h-9" onClick={addTicket}>
                  <Plus className="h-4 w-4 mr-2" /> Add Another Ticket Type
                </Button>
              </div>
            </>
          )}

          {/* ── Step 3: Media & Publish ─────────────────────────────────────── */}
          {step === 3 && (
            <>
              <Field label="Cover Image URL" hint="Recommended: 1200×630px, under 5MB">
                <Input value={form.coverImage} onChange={(e) => set('coverImage', e.target.value)} placeholder="https://..." className={inputCls} />
              </Field>
              {form.coverImage && (
                <img src={form.coverImage} alt="Cover preview" className="w-full h-48 object-cover rounded-xl" onError={(e) => { e.target.style.display = 'none'; }} />
              )}
              <Separator />
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm font-bold font-heading mb-1">Ready to publish?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Saving as <strong>Draft</strong> lets you keep editing. <strong>Submit for Review</strong> sends it to our team for approval — it will go live once approved (usually within 24 hours).
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Nav Buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={back} className="flex-1 font-semibold">
            <ArrowLeft className="h-4 w-4 mr-2" />Back
          </Button>
        )}
        {step < STEPS.length - 1 && (
          <Button onClick={next} className="flex-1 font-bold">
            Next<ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
        {step === STEPS.length - 1 && (
          <>
            <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={saving} className="flex-1 font-semibold">
              Save as Draft
            </Button>
            <Button onClick={() => handleSubmit('pending_review')} disabled={saving} className="flex-1 font-bold">
              {saving ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />Submitting…</> : <>Submit for Review<ArrowRight className="h-4 w-4 ml-2" /></>}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateEventPage;
