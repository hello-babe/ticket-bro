// components/shared/PageHeader.jsx
// Reusable page header — title, subtitle, badge, action buttons, breadcrumb
import React from 'react';
import { Breadcrumb } from '@/components/shared/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PageHeader = ({
  title,
  subtitle,
  badge,
  badgeVariant = 'secondary',
  actions,       // array of { label, icon: Icon, onClick, href, variant, loading }
  className = '',
}) => (
  <div className={`mb-6 ${className}`}>
    <Breadcrumb className="mb-3" />
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-heading">
            {title}
          </h1>
          {badge && (
            <Badge variant={badgeVariant} className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {actions?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions.map((action, i) => {
            const Icon = action.icon;
            const btn = (
              <Button
                key={i}
                variant={action.variant || (i === actions.length - 1 ? 'default' : 'outline')}
                size="sm"
                onClick={action.onClick}
                disabled={action.loading}
                className={i === actions.length - 1 ? 'font-bold' : ''}
              >
                {action.loading ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : Icon ? (
                  <Icon className="h-4 w-4 mr-2" />
                ) : null}
                {action.label}
              </Button>
            );
            if (action.href) return <a key={i} href={action.href}>{btn}</a>;
            return btn;
          })}
        </div>
      )}
    </div>
  </div>
);

export default PageHeader;
