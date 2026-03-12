// components/shared/StatCard.jsx
// Reusable KPI stat card used across all dashboards
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({
  title,
  value,
  change,          // number — positive = up, negative = down
  changeLabel,     // e.g. "from last month"
  icon: Icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  loading = false,
  footer,
  onClick,
}) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0 || change == null;

  return (
    <Card
      className={`hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground leading-tight">
                {title}
              </p>
              {Icon && (
                <div className={`p-2.5 rounded-xl ${iconBg} shrink-0`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
              )}
            </div>

            <p className="text-2xl font-extrabold font-heading text-foreground mb-1.5">
              {value ?? '—'}
            </p>

            {change != null && (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : isNegative
                    ? 'text-red-500'
                    : 'text-muted-foreground'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : isNegative ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                <span>
                  {isPositive ? '+' : ''}{change}%{' '}
                  {changeLabel || 'vs last period'}
                </span>
              </div>
            )}

            {footer && (
              <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                {footer}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
