// components/shared/DetailDrawer.jsx
// Reusable right-side Sheet drawer for detail views (user, event, booking, etc.)
import React from 'react';
import { X } from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const DetailDrawer = ({
  open,
  onClose,
  title,
  description,
  loading = false,
  children,
  width = 'sm:max-w-lg',
  footer,
}) => (
  <Sheet open={open} onOpenChange={onClose}>
    <SheetContent className={`${width} overflow-y-auto p-0`} side="right">
      <SheetHeader className="p-6 pb-4 border-b border-border sticky top-0 bg-background z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            {loading ? (
              <>
                <Skeleton className="h-5 w-40 mb-1.5" />
                <Skeleton className="h-4 w-56" />
              </>
            ) : (
              <>
                <SheetTitle className="font-heading text-lg">{title}</SheetTitle>
                {description && (
                  <SheetDescription className="text-sm mt-0.5">
                    {description}
                  </SheetDescription>
                )}
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </SheetHeader>

      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        ) : (
          children
        )}
      </div>

      {footer && (
        <div className="sticky bottom-0 bg-background border-t border-border p-4">
          {footer}
        </div>
      )}
    </SheetContent>
  </Sheet>
);

// ── Detail Field ──────────────────────────────────────────────────────────────
export const DetailField = ({ label, value, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
      {label}
    </p>
    <p className="text-sm font-medium text-foreground break-words">
      {value || '—'}
    </p>
  </div>
);

// ── Detail Section ────────────────────────────────────────────────────────────
export const DetailSection = ({ title, children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
      {title}
    </h3>
    {children}
    <Separator />
  </div>
);

export default DetailDrawer;
