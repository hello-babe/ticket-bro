// frontend/src/components/home/MostLovedCategories.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "@/components/layout/Container";
import { useBrowse } from "@/hooks";
import { CATEGORY_MAP } from "@/data/browseData";

// Visual accent colours per category slug
const ACCENT = {
  music:         { bg: "rgba(59,130,246,0.08)",  text: "#93c5fd" },
  sports:        { bg: "rgba(34,197,94,0.08)",   text: "#86efac" },
  "arts-culture":{ bg: "rgba(168,85,247,0.08)",  text: "#d8b4fe" },
  "food-drink":  { bg: "rgba(249,115,22,0.08)",  text: "#fdba74" },
  business:      { bg: "rgba(99,102,241,0.08)",  text: "#a5b4fc" },
  education:     { bg: "rgba(20,184,166,0.08)",  text: "#5eead4" },
  health:        { bg: "rgba(236,72,153,0.08)",  text: "#f9a8d4" },
  technology:    { bg: "rgba(163,230,53,0.08)",  text: "#a3e635" },
  "kids-family": { bg: "rgba(251,191,36,0.08)",  text: "#fde68a" },
  community:     { bg: "rgba(239,68,68,0.08)",   text: "#fca5a5" },
};

const CategoryCard = ({ slug, cat, onClick }) => {
  const accent = ACCENT[slug] || { bg: "rgba(163,230,53,0.08)", text: "#a3e635" };
  const Icon = cat.icon;
  return (
    <button
      onClick={() => onClick(slug)}
      className="group relative flex items-center h-28 sm:h-32 rounded-sm border border-border overflow-hidden bg-card hover:border-foreground/30 hover:shadow-lg transition-all duration-300 cursor-pointer text-left w-full"
    >
      {/* Left text */}
      <div className="flex-1 pl-4 sm:pl-5 z-10 min-w-0">
        <div
          className="inline-flex items-center justify-center w-7 h-7 rounded-sm mb-2 border"
          style={{ background: accent.bg, borderColor: accent.text + "40", color: accent.text }}
        >
          {Icon && <Icon size={13} strokeWidth={2} />}
        </div>
        <h3 className="text-sm font-bold text-foreground leading-tight truncate"
          style={{ fontFamily: "var(--font-heading)" }}>
          {cat.label}
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5"
          style={{ fontFamily: "var(--font-sans)" }}>
          {cat.totalEvents?.toLocaleString()}+ events
        </p>
      </div>

      {/* Right image bleed */}
      <div
        className="absolute right-0 top-0 h-full w-1/2 transition-transform group-hover:scale-105 duration-500"
        style={{ clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)", background: accent.bg }}
      >
        <div className="absolute inset-0" style={{
          background: `linear-gradient(to left, ${accent.bg} 0%, transparent 100%)`
        }} />
        <span className="absolute inset-0 flex items-center justify-center opacity-20 text-5xl pointer-events-none select-none">
          {Icon && <Icon size={48} strokeWidth={1} color={accent.text} />}
        </span>
      </div>
    </button>
  );
};

const MostLovedCategories = () => {
  const navigate = useNavigate();
  const { locationLabel, buildCategoryUrl } = useBrowse();

  const categories = Object.entries(CATEGORY_MAP);

  return (
    <section className="bg-background py-10">
      <Container>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}>
              {locationLabel}'s Most-Loved
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5"
              style={{ fontFamily: "var(--font-sans)" }}>
              Browse by category
            </p>
          </div>
          <button
            onClick={() => navigate("/browse")}
            className="text-xs font-semibold text-primary hover:text-primary/80 "
            style={{ fontFamily: "var(--font-sans)" }}
          >
            All categories →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map(([slug, cat]) => (
            <CategoryCard
              key={slug}
              slug={slug}
              cat={cat}
              onClick={(s) => navigate(buildCategoryUrl(s))}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default MostLovedCategories;
