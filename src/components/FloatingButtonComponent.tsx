"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Filter } from "lucide-react";

export function FloatingButtonGroup({
  onAdd,
  onFilter,
}: {
  onAdd?: () => void;
  onFilter?: () => void;
}) {
  type ActiveType = "filter" | "add" | "calendar" | "null";
  const [active, setActive] = useState<ActiveType>("null");

  // Mapping posisi highlight
  const positions: Record<ActiveType, string> = {
    filter: "translate-x-0",
    add: "translate-x-[52px]", // geser sesuai lebar tombol
    calendar: "translate-x-[156px]",
    null: "translate-x-0 opacity-0",
  };

  return (
    <div className="fixed left-1/2 top-4 md:top-6 z-50 -translate-x-1/2">
      <div className="relative flex items-center gap-2 bg-white/30 backdrop-blur-md rounded-full px-2 py-1 shadow">
        {/* Highlight animasi */}
        <span
          className={`absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-blue-500/20 transition-all duration-300 ${positions[active]}`}
        />

        {/* Tombol filter */}
        <Button
          size="icon"
          className={`h-9 w-9 relative z-10 ${active === "filter" ? "text-blue-600" : ""}`}
          aria-label="Filter"
          onClick={() => {
            setActive("filter");
            onFilter?.();
          }}
        >
          <Filter className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border/40" />

        {/* Tombol tambah */}
        <button
          onClick={() => {
            setActive("add");
            onAdd?.();
          }}
          aria-label="Tambah Planner"
          title="Tambah Planner"
          className={`relative z-10 inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition ${
            active === "add"
              ? "bg-blue-600 text-white"
              : "bg-transparen"
          }`}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline text-sm">Tambah</span>
        </button>

        {/* Tombol calendar */}
        <Button
          size="icon"
          className={`h-9 w-9 relative z-10 ${active === "calendar" ? "text-blue-600" : ""}`}
          aria-label="Calendar view"
          onClick={() => setActive("calendar")}
        >
          <Calendar className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
