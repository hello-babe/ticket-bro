// components/shared/FilterBar.jsx
// Reusable filter bar — search input + select dropdowns + date range + clear
import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

/**
 * filters: [
 *   { type: 'search', key, placeholder }
 *   { type: 'select', key, placeholder, options: [{ label, value }] }
 *   { type: 'date', key, placeholder }
 * ]
 * values: { [key]: value }
 * onChange: (key, value) => void
 * onClear: () => void
 * activeCount: number (how many filters active)
 */
const FilterBar = ({
  filters = [],
  values = {},
  onChange,
  onClear,
  className = '',
}) => {
  const activeCount = Object.values(values).filter(
    (v) => v && v !== '' && v !== 'all',
  ).length;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />

      {filters.map((f) => {
        if (f.type === 'search') {
          return (
            <div key={f.key} className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={values[f.key] || ''}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder || 'Search…'}
                className="pl-9 h-9 text-sm"
              />
            </div>
          );
        }

        if (f.type === 'select') {
          return (
            <Select
              key={f.key}
              value={values[f.key] || 'all'}
              onValueChange={(v) => onChange(f.key, v === 'all' ? '' : v)}
            >
              <SelectTrigger className="h-9 w-auto min-w-[130px] text-sm">
                <SelectValue placeholder={f.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{f.placeholder || 'All'}</SelectItem>
                {f.options?.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        if (f.type === 'date') {
          return (
            <Input
              key={f.key}
              type="date"
              value={values[f.key] || ''}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="h-9 w-auto text-sm"
              placeholder={f.placeholder}
            />
          );
        }

        return null;
      })}

      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-9 gap-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear
          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
            {activeCount}
          </Badge>
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
