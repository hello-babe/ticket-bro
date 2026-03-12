// pages/organizer/RevenuePage.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowDownRight, Clock, CheckCircle2, RefreshCw, TrendingUp, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate, formatPrice } from '@/utils/formatters';
import { toast } from '@/components/shared/common';
import api from '@/lib/axios';

const RevenuePage = () => {
  const [revenue, setRevenue] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payoutDialog, setPayoutDialog] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [requesting, setRequesting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const [revRes, payRes] = await Promise.allSettled([
        api.get('/organizer/revenue'),
        api.get('/organizer/payouts'),
      ]);
      if (revRes.status === 'fulfilled') setRevenue(revRes.value.data?.data || revRes.value.data);
      if (payRes.status === 'fulfilled') { const d = payRes.value.data?.data || payRes.value.data; setPayouts(d?.payouts || d || []); }
    } catch { toast.error('Failed to load revenue'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleRequestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) return toast.error('Enter a valid amount');
    if (parseFloat(payoutAmount) > (revenue?.availableBalance || 0)) return toast.error('Insufficient balance');
    setRequesting(true);
    try {
      await api.post('/organizer/payouts', { amount: parseFloat(payoutAmount) });
      toast.success('Payout request submitted');
      setPayoutDialog(false); setPayoutAmount(''); fetch();
    } catch (e) { toast.error(e.response?.data?.message || 'Request failed'); }
    finally { setRequesting(false); }
  };

  const stats = [
    { title: 'Total Earnings', value: revenue?.totalEarnings ? formatPrice(revenue.totalEarnings) : '—', change: revenue?.earningsGrowth, icon: DollarSign, iconBg: 'bg-green-500/10', iconColor: 'text-green-500' },
    { title: 'This Month', value: revenue?.monthEarnings ? formatPrice(revenue.monthEarnings) : '—', change: revenue?.monthGrowth, icon: TrendingUp, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500' },
    { title: 'Available Balance', value: revenue?.availableBalance ? formatPrice(revenue.availableBalance) : '—', icon: CreditCard, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
    { title: 'Pending Payout', value: revenue?.pendingPayout ? formatPrice(revenue.pendingPayout) : '—', icon: Clock, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      <div className="flex items-start justify-between gap-3">
        <PageHeader title="Revenue" subtitle="Your earnings and payout history" className="mb-0" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={fetch}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button onClick={() => setPayoutDialog(true)} disabled={!revenue?.availableBalance || revenue.availableBalance <= 0} className="h-9 font-bold">
            <ArrowDownRight className="h-4 w-4 mr-2" />Request Payout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} loading={loading} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by event */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold">Revenue by Event</CardTitle></CardHeader>
          <CardContent>
            {loading ? <div className="space-y-2">{[1,2,3].map((i) => <Skeleton key={i} className="h-10" />)}</div> :
              (revenue?.byEvent || []).length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">No data yet</p> :
              (revenue?.byEvent || []).map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.eventTitle}</p>
                    <p className="text-xs text-muted-foreground">{item.ticketsSold} tickets sold</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-green-600">{formatPrice(item.revenue)}</p>
                    <p className="text-xs text-muted-foreground">after fees</p>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold">Payout History</CardTitle></CardHeader>
          <CardContent>
            {loading ? <div className="space-y-2">{[1,2,3].map((i) => <Skeleton key={i} className="h-14" />)}</div> :
              payouts.length === 0 ? (
                <div className="text-center py-6">
                  <CreditCard className="h-7 w-7 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No payouts yet</p>
                </div>
              ) : payouts.map((p) => (
                <div key={p._id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{formatPrice(p.amount)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(p.requestedAt, { dateStyle: 'medium', timeStyle: undefined })}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>

      {/* Payout Dialog */}
      <Dialog open={payoutDialog} onOpenChange={setPayoutDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-heading">Request Payout</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-3 rounded-xl bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-extrabold font-heading text-green-600">{formatPrice(revenue?.availableBalance || 0)}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold">Amount to Withdraw</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm text-muted-foreground">$</span>
                <Input type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} placeholder="0.00" className="h-9" min="10" max={revenue?.availableBalance} step="0.01" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Payouts take 3-5 business days to appear in your bank account.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutDialog(false)}>Cancel</Button>
            <Button onClick={handleRequestPayout} disabled={requesting} className="font-bold">
              {requesting ? 'Requesting…' : 'Request Payout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RevenuePage;
