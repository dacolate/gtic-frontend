"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface GenericDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  translationKey: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  searchColumn?: string;
  additionalFilters?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

export function GenericDataTable<T>({
  data,
  columns,
  translationKey,
  onRefresh,
  isRefreshing,
  searchColumn = "name",
  additionalFilters,
  onRowClick,
}: GenericDataTableProps<T>) {
  const t = useTranslations(translationKey);

  // State management with localStorage persistence
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${translationKey}TableSorting`);
      return saved ? JSON.parse(saved) : [];
    }
    return [
      {
        id: "createdAt",
        desc: true,
      },
    ];
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(`${translationKey}TableFilters`);
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    }
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(`${translationKey}TableVisibility`);
        if (saved) return JSON.parse(saved);
      }
      // Default visibility state
      return {
        createdAt: false,
      };
    });

  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearch] = useDebounce(searchValue, 300);

  // Save state to localStorage
  React.useEffect(() => {
    localStorage.setItem(
      `${translationKey}TableSorting`,
      JSON.stringify(sorting)
    );
    localStorage.setItem(
      `${translationKey}TableFilters`,
      JSON.stringify(columnFilters)
    );
    localStorage.setItem(
      `${translationKey}TableVisibility`,
      JSON.stringify(columnVisibility)
    );
  }, [sorting, columnFilters, columnVisibility, translationKey]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    initialState: { columnVisibility: { createdAt: false } },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Apply debounced search
  React.useEffect(() => {
    table.getColumn(searchColumn)?.setFilterValue(debouncedSearch);
  }, [debouncedSearch, searchColumn, table]);

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <div className="w-full relative">
      {isRefreshing && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Input
              id="search"
              placeholder={t("Search")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {t("Refresh")}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {t("Columns")} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {additionalFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalFilters}
          </div>
        )}
      </div>

      <div className="rounded-md border mt-8">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row.original)}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {t("Of")}{" "}
          {table.getFilteredRowModel().rows.length} {t("RowsSelected")}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("Previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("Next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
