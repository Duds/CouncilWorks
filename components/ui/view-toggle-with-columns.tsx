"use client";

import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { Table as TanStackTable } from "@tanstack/react-table";
import { LayoutGrid, Table } from "lucide-react";

interface ViewToggleWithColumnsProps<TData> {
  currentView: "table" | "cards";
  onViewChange: (view: "table" | "cards") => void;
  table?: TanStackTable<TData>;
}

/**
 * View Toggle Component with Column Options
 * Allows switching between table and card views, and toggling table columns
 * @component ViewToggleWithColumns
 * @example
 * ```tsx
 * <ViewToggleWithColumns currentView="table" onViewChange={setView} table={table} />
 * ```
 * @accessibility
 * - ARIA roles: button group for view options
 * - Keyboard navigation: Tab through view options
 * - Screen reader: Announces current view and available options
 */
export function ViewToggleWithColumns<TData>({
  currentView,
  onViewChange,
  table
}: ViewToggleWithColumnsProps<TData>) {
  return (
    <div className="flex items-center space-x-2">
      {currentView === "table" && table && (
        <DataTableViewOptions table={table} />
      )}
      <div className="flex items-center border rounded-md">
        <Button
          variant={currentView === "table" ? "default" : "ghost"}
          size="sm"
          className="h-9 rounded-r-none border-r"
          onClick={() => onViewChange("table")}
          aria-label="Switch to table view"
        >
          <Table className="h-4 w-4" />
        </Button>
        <Button
          variant={currentView === "cards" ? "default" : "ghost"}
          size="sm"
          className="h-9 rounded-l-none"
          onClick={() => onViewChange("cards")}
          aria-label="Switch to card view"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
