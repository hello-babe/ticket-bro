import React from "react";
import { MailCheck } from "lucide-react";

const UnverifiedBanner = () => (
  <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] px-3 py-2.5 mb-1">
    <MailCheck size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-[0.75rem] font-semibold text-amber-600 dark:text-amber-400 mb-0.5">
        Email not verified
      </p>
      <p className="text-[0.72rem] text-muted-foreground leading-snug">
        A new verification link has been sent to your inbox. Check your email
        and click the link to activate your account.
      </p>
    </div>
  </div>
);

export default UnverifiedBanner;