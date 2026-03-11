import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Send, CheckCircle2 } from "lucide-react";

const ContactForm = ({ onSubmit, className }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit?.(form);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => { setForm((p) => ({ ...p, [key]: e.target.value })); setErrors((p) => ({ ...p, [key]: "" })); };

  if (sent) return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <CheckCircle2 className="size-10 text-green-500" />
      <p className="font-semibold text-foreground">Message sent!</p>
      <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
      <Button variant="outline" size="sm" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
        Send another
      </Button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-4", className)}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cf-name">Full Name</Label>
          <Input id="cf-name" placeholder="John Doe" value={form.name} onChange={set("name")}
            className={cn(errors.name && "border-destructive")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cf-email">Email</Label>
          <Input id="cf-email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")}
            className={cn(errors.email && "border-destructive")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cf-subject">Subject <span className="text-muted-foreground text-xs">(optional)</span></Label>
        <Input id="cf-subject" placeholder="How can we help?" value={form.subject} onChange={set("subject")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cf-msg">Message</Label>
        <Textarea id="cf-msg" placeholder="Tell us more…" rows={5} value={form.message} onChange={set("message")}
          className={cn(errors.message && "border-destructive")} />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>
      <Button type="submit" disabled={loading} className="w-full gap-2">
        <Send className="size-4" />
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
};

export default ContactForm;
