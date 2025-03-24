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
import { ArrowUpDown, ChevronDown, Download, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
// import { Label } from "../ui/label";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTranslations } from "next-intl";
import { Course } from "@/lib/types";

interface CourseTableProps {
  courses: Course[];
}

export function CourseTable({ courses }: CourseTableProps) {
  const t = useTranslations("CourseTable");

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "id",
      id: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Course ID")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
    },
    {
      accessorKey: "name",
      id: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Course Name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
    },
    {
      accessorKey: "description",
      id: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Description")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.original.description}</div>
      ),
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: courses,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    getSubRows: (row) => row.grades as unknown as Course[] | undefined, // Use grades as subrows
  });

  const handleDownload = () => {
    const headers = ["Course ID", "Course Name", "Description"];
    const tableData = table
      .getRowModel()
      .rows.map((row) => [
        row.original.id,
        row.original.name,
        row.original.description,
      ]);

    const doc = new jsPDF();

    // Add the title
    doc.setFontSize(18);
    doc.text("Course Report", 50, 20);

    // Add the current date
    doc.setFontSize(12);
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`, 50, 30);

    // Use AutoTable to create a table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 60, // Position the table below the title
    });

    // Save the PDF
    doc.save("courses.pdf");
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="flex">
          <div className="relative flex-1 mr-3">
            <Input
              id="search"
              placeholder={`${t("Search courses")}`}
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {t("Columns")} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
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
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-end">
          <Button className="w-full" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> {t("Download List")}
          </Button>
        </div>
      </div>

      <div className="rounded-md border mt-8">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() &&
                    row.subRows.map((subRow) => (
                      <TableRow key={subRow.id}>
                        {subRow.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
