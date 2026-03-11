// frontend/src/components/browse/sections/EventGridSection.jsx
import React, { useState, useMemo } from "react";
import { LayoutGrid, List, Inbox } from "lucide-react";
import { useBrowse, unslugify, spotsPercent } from "@/hooks";
import BrowseEventCard from "@/components/shared/cards/EventCard";
import SectionShell from "./SectionShell";
import Container from "@/components/layout/Container";

const EVENTS_PER_PAGE = 12;

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1))
      pages.push(i);
    else if (i === page - 2 || i === page + 2) pages.push("...");
  }
  const deduped = pages.filter((p, i) => p !== "..." || pages[i - 1] !== "...");
  return (
    <div className="flex items-center justify-center gap-1 pt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ‹
      </button>
      {deduped.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="flex items-center justify-center w-8 h-8 rounded-md border text-xs font-medium"
            style={{
              background:
                p === page ? "var(--foreground)" : "var(--background)",
              borderColor: p === page ? "var(--foreground)" : "var(--border)",
              color:
                p === page ? "var(--background)" : "var(--muted-foreground)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
};

const EmptyState = ({ locationLabel, title }) => (
  <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed border-border text-center">
    <Inbox size={28} className="text-muted-foreground mb-3" />
    <p
      className="text-sm font-semibold text-foreground mb-1"
      style={{ fontFamily: "var(--font-heading)" }}
    >
      No {title} events found in {locationLabel}
    </p>
    <p
      className="text-xs text-muted-foreground"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      Try adjusting your filters or changing your location.
    </p>
  </div>
);

const EventGridSection = ({ filters }) => {
  const {
    getEvents,
    level,
    categorySlug,
    subCategorySlug,
    eventTypeSlug,
    locationLabel,
  } = useBrowse();
  const [savedIds, setSavedIds] = useState(new Set());
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);

  const allEvents = useMemo(() => getEvents(), [getEvents]);
  const totalCount = allEvents.length;
  const totalPages = Math.ceil(totalCount / EVENTS_PER_PAGE);
  const pageEvents = allEvents.slice(
    (page - 1) * EVENTS_PER_PAGE,
    page * EVENTS_PER_PAGE,
  );

  const toggle = (id) =>
    setSavedIds((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const handlePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sectionTitle =
    level === "root"
      ? "All Events"
      : level === "category"
        ? `All ${unslugify(categorySlug)} Events`
        : level === "subCategory"
          ? `All ${unslugify(subCategorySlug)} Events`
          : `All ${unslugify(eventTypeSlug)} Events`;

  const levelLabel =
    level === "root"
      ? ""
      : level === "category"
        ? unslugify(categorySlug)
        : level === "subCategory"
          ? unslugify(subCategorySlug)
          : unslugify(eventTypeSlug);

  return (
    <section className="w-full bg-background" aria-label="All events grid">
      <Container>
        <div className="py-8">
          <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
            <div>
              <h2
                className="text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {sectionTitle}
              </h2>
              <p
                className="text-sm text-muted-foreground mt-0.5"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <span className="font-semibold text-foreground">
                  {totalCount}
                </span>{" "}
                events in {locationLabel}
              </p>
            </div>
            <div className="flex items-center rounded-md border border-border overflow-hidden shrink-0">
              {[
                ["grid", LayoutGrid],
                ["list", List],
              ].map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className="flex items-center justify-center w-8 h-8"
                  style={{
                    background:
                      viewMode === mode
                        ? "var(--foreground)"
                        : "var(--background)",
                    color:
                      viewMode === mode
                        ? "var(--background)"
                        : "var(--muted-foreground)",
                  }}
                  aria-label={`${mode} view`}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {pageEvents.length === 0 ? (
            <EmptyState locationLabel={locationLabel} title={levelLabel} />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pageEvents.map((e) => (
                <BrowseEventCard
                  key={e.id}
                  event={e}
                  variant="grid"
                  saved={savedIds.has(e.id)}
                  onSave={toggle}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pageEvents.map((e) => (
                <BrowseEventCard
                  key={e.id}
                  event={e}
                  variant="list"
                  saved={savedIds.has(e.id)}
                  onSave={toggle}
                />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePage}
          />
        </div>
        <div className="w-full h-px bg-border" />
      </Container>
    </section>
  );
};

export default EventGridSection;
