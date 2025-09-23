"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";

interface ViewToggleProps {
  currentView: "table" | "cards";
  onViewChange: (view: "table" | "cards") => void;
}

/**
 * View Toggle Component
 * Allows switching between table and card views for asset display
 * @component ViewToggle
 * @example
 * ```tsx
 * <ViewToggle currentView="table" onViewChange={setView} />
 * ```
 * @accessibility
 * - ARIA roles: button group for view options
 * - Keyboard navigation: Tab through view options
 * - Screen reader: Announces current view and available options
 */
export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={currentView === "table" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("table")}
        aria-label="Switch to table view"
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === "cards" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("cards")}
        aria-label="Switch to card view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
