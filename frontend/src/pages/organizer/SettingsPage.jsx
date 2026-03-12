// pages/organizer/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { Save, Building, CreditCard, Bell, Shield, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PageHeader from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { toast } from '@/components/shared/common';
import { formatDate } from '@/utils/formatters';
import api from '@/lib/axios';

const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold">{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
  </div>
);

const SettingsPage = () => {
  const [profile, setProfile] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', website: '', phone: '', instagram: '', facebook: '', twitter: '' });
  const [bankForm, setBankForm] = useState({ bankName: '', accountName: '', accountNumber: '', routingNumber: '' });
  const [notifForm, setNotifForm] = useState({ emailOnBooking: true, emailOnCancellation: true, emailOnPayout: true, smsOnBooking: false });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [profRes, verRes] = await Promise.allSettled([
          api.get('/organizer/profile'),
          api.get('/organizer/verification'),
        ]);
        if (profRes.status === 'fulfilled') {
          const d = profRes.value.data?.data || profRes.value.data;
          setProfile(d);
          setForm({ name: d?.name || '', bio: d?.bio || '', website: d?.website || '', phone: d?.phone || '', instagram: d?.socialLinks?.instagram || '', facebook: d?.socialLinks?.facebook || '', twitter: d?.socialLinks?.twitter || '' });
          setBankForm({ bankName: d?.bankDetails?.bankName || '', accountName: d?.bankDetails?.accountName || '', accountNumber: d?.bankDetails?.accountNumber || '', routingNumber: d?.bankDetails?.routingNumber || '' });
        }
        if (verRes.status === 'fulfilled') setVerification(verRes.value.data?.data || verRes.value.data);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const set = (f, key, val) => f === 'profile' ? setForm((p) => ({ ...p, [key]: val })) : f === 'bank' ? setBankForm((p) => ({ ...p, [key]: val })) : setNotifForm((p) => ({ ...p, [key]: val }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/organizer/profile', { ...form, socialLinks: { instagram: form.instagram, facebook: form.facebook, twitter: form.twitter } });
      toast.success('Profile saved');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const saveBankDetails = async () => {
    setSaving(true);
    try {
      await api.put('/organizer/profile', { bankDetails: bankForm });
      toast.success('Bank details saved');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const saveNotifications = async () => {
    setSaving(true);
    try {
      await api.put('/organizer/profile', { notificationPreferences: notifForm });
      toast.success('Preferences saved');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const submitVerification = async () => {
    setSubmitting(true);
    try {
      await api.post('/organizer/verification');
      toast.success('Verification request submitted');
      const res = await api.get('/organizer/verification');
      setVerification(res.data?.data || res.data);
    } catch (e) { toast.error(e.response?.data?.message || 'Submission failed'); }
    finally { setSubmitting(false); }
  };

  const SaveBtn = ({ onClick, label = 'Save Changes' }) => (
    <Button onClick={onClick} disabled={saving} size="sm" className="font-bold">
      {saving ? 'Saving…' : <><Save className="h-3.5 w-3.5 mr-2" />{label}</>}
    </Button>
  );

  const VERIF_STATUS = {
    pending: { icon: Clock, text: 'Verification Pending', color: 'text-yellow-600', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    approved: { icon: CheckCircle2, text: 'Verified Organizer', color: 'text-green-600', bg: 'bg-green-500/10 border-green-500/20' },
    rejected: { icon: AlertCircle, text: 'Verification Rejected', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      <PageHeader title="Organizer Settings" subtitle="Manage your organization profile and preferences" />
      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="profile"><Building className="h-3.5 w-3.5 mr-1.5" />Profile</TabsTrigger>
          <TabsTrigger value="verification"><Shield className="h-3.5 w-3.5 mr-1.5" />Verification</TabsTrigger>
          <TabsTrigger value="bank"><CreditCard className="h-3.5 w-3.5 mr-1.5" />Bank Details</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-3.5 w-3.5 mr-1.5" />Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between"><CardTitle className="text-sm font-bold">Organization Profile</CardTitle><SaveBtn onClick={saveProfile} /></CardHeader>
            <CardContent className="space-y-5">
              {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />) : (
                <>
                  <Field label="Organization Name"><Input value={form.name} onChange={(e) => set('profile', 'name', e.target.value)} className="h-9" /></Field>
                  <Field label="Bio / About" hint="Shown on your public organizer profile"><Textarea value={form.bio} onChange={(e) => set('profile', 'bio', e.target.value)} rows={4} className="text-sm resize-none" /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Website"><Input value={form.website} onChange={(e) => set('profile', 'website', e.target.value)} placeholder="https://…" className="h-9" /></Field>
                    <Field label="Phone"><Input value={form.phone} onChange={(e) => set('profile', 'phone', e.target.value)} className="h-9" /></Field>
                  </div>
                  <Separator />
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Social Links</p>
                  {[{ key: 'instagram', label: 'Instagram' }, { key: 'facebook', label: 'Facebook' }, { key: 'twitter', label: 'Twitter / X' }].map((s) => (
                    <Field key={s.key} label={s.label}><Input value={form[s.key]} onChange={(e) => set('profile', s.key, e.target.value)} placeholder="https://…" className="h-9" /></Field>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-5">
              {verification && VERIF_STATUS[verification.status] && (
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${VERIF_STATUS[verification.status].bg}`}>
                  {React.createElement(VERIF_STATUS[verification.status].icon, { className: `h-5 w-5 ${VERIF_STATUS[verification.status].color} shrink-0` })}
                  <div>
                    <p className={`text-sm font-semibold ${VERIF_STATUS[verification.status].color}`}>{VERIF_STATUS[verification.status].text}</p>
                    {verification.submittedAt && <p className="text-xs text-muted-foreground mt-0.5">Submitted {formatDate(verification.submittedAt, { dateStyle: 'medium', timeStyle: undefined })}</p>}
                    {verification.status === 'rejected' && verification.rejectionReason && <p className="text-xs text-red-500 mt-0.5">Reason: {verification.rejectionReason}</p>}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm font-semibold">Why get verified?</p>
                {['Verified badge on your profile and events', 'Higher trust from attendees = more ticket sales', 'Priority placement in search results', 'Faster payout processing', 'Access to promoted listing features'].map((b) => (
                  <div key={b} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    {b}
                  </div>
                ))}
              </div>

              {(!verification || verification.status === 'rejected') && (
                <Button onClick={submitVerification} disabled={submitting} className="w-full font-bold">
                  {submitting ? 'Submitting…' : 'Submit Verification Request'}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="mt-4">
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between"><CardTitle className="text-sm font-bold">Bank Account Details</CardTitle><SaveBtn onClick={saveBankDetails} /></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
                Your bank details are encrypted and used only for payout processing. We never share this information.
              </div>
              {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />) : (
                <>
                  <Field label="Bank Name"><Input value={bankForm.bankName} onChange={(e) => set('bank', 'bankName', e.target.value)} className="h-9" /></Field>
                  <Field label="Account Holder Name"><Input value={bankForm.accountName} onChange={(e) => set('bank', 'accountName', e.target.value)} className="h-9" /></Field>
                  <Field label="Account Number"><Input value={bankForm.accountNumber} onChange={(e) => set('bank', 'accountNumber', e.target.value)} className="h-9 font-mono" /></Field>
                  <Field label="Routing Number / SWIFT"><Input value={bankForm.routingNumber} onChange={(e) => set('bank', 'routingNumber', e.target.value)} className="h-9 font-mono" /></Field>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between"><CardTitle className="text-sm font-bold">Notification Preferences</CardTitle><SaveBtn onClick={saveNotifications} /></CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: 'emailOnBooking', label: 'New booking received', hint: 'Email when someone books your event' },
                { key: 'emailOnCancellation', label: 'Booking cancelled', hint: 'Email when an attendee cancels' },
                { key: 'emailOnPayout', label: 'Payout processed', hint: 'Email when your payout is released' },
                { key: 'smsOnBooking', label: 'SMS on new booking', hint: 'Text message for each new booking' },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-semibold">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.hint}</p>
                  </div>
                  <Switch checked={notifForm[n.key]} onCheckedChange={(v) => set('notif', n.key, v)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
