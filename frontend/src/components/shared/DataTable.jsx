// components/shared/DataTable.jsx
// Enterprise-level reusable data table — search, filter, sort, pagination, actions
import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

/**
 * columns: [{ key, label, render?: (row) => ReactNode, sortable?, width? }]
 * data: array of objects
 * actions: (row) => ReactNode — rendered in last column
 * pagination: { page, limit, total, onPageChange }
 * searchPlaceholder
 * onSearch: (q) => void
 * filters: ReactNode — extra filter controls
 * loading
 * emptyMessage
 * emptyIcon: Icon component
 */
const DataTable = ({
  columns = [],
  data = [],
  actions,
  pagination,
  searchPlaceholder = 'Search…',
  onSearch,
  filters,
  loading = false,
  emptyMessage = 'No records found',
  emptyIcon: EmptyIcon,
  className = '',
}) => {
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    onSearch?.(e.target.value);
  };

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;

  const colCount = columns.length + (actions ? 1 : 0);

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      {(onSearch || filters) && (
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
          {onSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchVal}
                onChange={handleSearch}
                placeholder={searchPlaceholder}
                className="pl-9 h-9"
              />
            </div>
          )}
          {filters && <div className="flex items-center gap-2 flex-wrap">{filters}</div>}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.sortable ? (
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                      {col.label}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: colCount }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    {EmptyIcon && (
                      <EmptyIcon className="h-10 w-10 opacity-30" />
                    )}
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={row._id || row.id || i} className="hover:bg-muted/30 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm py-3">
                      {col.render ? col.render(row) : (row[col.key] ?? '—')}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right whitespace-nowrap">
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {pagination && pagination.total > 0 && (
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">
              {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-foreground">
              {pagination.total}
            </span>{' '}
            results
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, pagination.page - 2)) + i;
              return (
                <Button
                  key={p}
                  variant={p === pagination.page ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => pagination.onPageChange(p)}
                >
                  {p}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DataTable;
