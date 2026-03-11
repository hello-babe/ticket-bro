import React from "react";
import { QrCode, Calendar, MapPin, User, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusVariants = {
  confirmed: "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800",
  pending:   "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  used:      "bg-muted text-muted-foreground border-border",
};

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  } catch { return iso ?? ""; }
};
const fmtTime = (iso) => {
  try { return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }); }
  catch { return ""; }
};

const TicketCard = ({
  ticket,
  onDownload,
  onView,
  showQR = false,
  className,
}) => {
  const status = ticket.status ?? "confirmed";

  return (
    <div
      className={cn(
        "relative flex flex-col sm:flex-row rounded-xl border bg-card overflow-hidden",
        "shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      {/* Left accent bar */}
      <div
        className="w-full sm:w-1.5 h-1.5 sm:h-auto shrink-0"
        style={{
          background: status === "confirmed" ? "var(--color-brand-primary)" :
                      status === "pending"   ? "#f59e0b" :
                      status === "cancelled" ? "var(--destructive)" : "var(--muted-foreground)",
        }}
      />

      {/* Main content */}
      <div className="flex flex-col sm:flex-row flex-1 divide-y sm:divide-y-0 sm:divide-x divide-dashed divide-border">
        {/* Event info */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge
              className={cn("text-[10px] font-semibold border rounded-full px-2 py-0.5 capitalize", statusVariants[status])}
            >
              {status}
            </Badge>
            {ticket.ticketNumber && (
              <span className="text-[10px] font-mono text-muted-foreground">#{ticket.ticketNumber}</span>
            )}
          </div>

          <h3
            className="text-sm font-bold text-foreground leading-snug line-clamp-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {ticket.eventTitle ?? ticket.event?.title}
          </h3>

          <div className="mt-2 space-y-1">
            {(ticket.startDate ?? ticket.event?.startDate) && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3 shrink-0" />
                <span>{fmtDate(ticket.startDate ?? ticket.event?.startDate)}</span>
                <span>·</span>
                <span>{fmtTime(ticket.startDate ?? ticket.event?.startDate)}</span>
              </div>
            )}
            {(ticket.venue ?? ticket.event?.location?.name) && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{ticket.venue ?? ticket.event?.location?.name}</span>
              </div>
            )}
            {ticket.attendeeName && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="size-3 shrink-0" />
                <span>{ticket.attendeeName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-dashed border-border">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Ticket Type</p>
              <p className="text-xs font-semibold text-foreground">{ticket.ticketType ?? "General"}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Amount Paid</p>
              <p className="text-sm font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {ticket.isFree ? "Free" : ticket.price != null ? `${ticket.currency ?? "$"}${ticket.price}` : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* QR + actions */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 p-4 sm:w-32 bg-muted/30">
          {showQR && ticket.qrCode ? (
            <img src={ticket.qrCode} alt="QR Code" className="size-16 sm:size-20 rounded" />
          ) : (
            <div className="size-16 sm:size-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
              <QrCode className="size-7 opacity-40" />
            </div>
          )}
          <div className="flex sm:flex-col gap-2">
            {onDownload && (
              <Button variant="ghost" size="icon-sm" onClick={() => onDownload(ticket)} aria-label="Download ticket">
                <Download className="size-3.5" />
              </Button>
            )}
            {onView && (
              <Button variant="ghost" size="icon-sm" onClick={() => onView(ticket)} aria-label="View ticket">
                <ExternalLink className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
