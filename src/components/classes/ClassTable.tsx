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
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

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
import { Label } from "../ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTranslations } from "next-intl";
import { Class } from "@/lib/types";
import { Link } from "@/i18n/routing";
import { DeleteDialog } from "./DeleteDialog";
import { useDebounce } from "use-debounce";
import { addDays, format, parseISO } from "date-fns";

interface ClassTableProps {
  classes: Class[];
}
interface ClassTableProps {
  classes: Class[];
  isRefreshing?: boolean; // NEW: Add refreshing state prop
}

function calculateEndDate(startDateString: string, durationDays: number) {
  const startDate = parseISO(startDateString);
  const endDate = addDays(startDate, durationDays);
  return format(endDate, "dd/MM/yyyy");
}

export function ClassTable({ classes, isRefreshing }: ClassTableProps) {
  const t = useTranslations("ClassTable");
  console.log("classes", classes);

  const [sorting, setSorting] = React.useState<SortingState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("classesTableSorting");
      return saved ? JSON.parse(saved) : [{ id: "startDate", desc: true }];
    }
    return [{ id: "startDate", desc: true }];
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("classesTableFilters");
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    }
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("classesTableVisibility");
        return saved ? JSON.parse(saved) : {};
      }
      return {};
    });

  // NEW: Debounced search
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearch] = useDebounce(searchValue, 300);

  React.useEffect(() => {
    localStorage.setItem("classesTableSorting", JSON.stringify(sorting));
    localStorage.setItem("classesTableFilters", JSON.stringify(columnFilters));
    localStorage.setItem(
      "classesTableVisibility",
      JSON.stringify(columnVisibility)
    );
  }, [sorting, columnFilters, columnVisibility]);

  const columns = React.useMemo<ColumnDef<Class>[]>(
    () => [
      // {
      //   accessorKey: "id",
      //   id: "id",
      //   header: ({ column }) => {
      //     return (
      //       <Button
      //         variant="ghost"
      //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      //         className="text-center"
      //       >
      //         {t("Class ID")}
      //         <ArrowUpDown className="ml-2 h-4 w-4" />
      //       </Button>
      //     );
      //   },
      //   cell: ({ row }) => (
      //     <Link href={`/classes/${row.original.id}`} passHref>
      //       <div className="text-green-500 hover:underline cursor-pointer text-center ">
      //         {row.original.id}
      //       </div>
      //     </Link>
      //   ),
      // },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="text-center"
            >
              {t("Class Name")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <Link href={`/classes/${row.original.id}`} passHref>
            <div className="text-green-500 hover:underline cursor-pointer text-left ">
              {row.original.name}
            </div>
          </Link>
        ),
      },
      {
        accessorKey: "teacher.name",
        id: "teacher.name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="text-center"
            >
              {t("Teacher")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center">{row.original.teacher.name}</div>
        ),
      },
      {
        accessorKey: "startDate",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="text-center"
            >
              {t("Start Date")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center">
            {new Date(row.original.startDate).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "expectedDuration",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="text-center"
            >
              {t("Duration (Days)")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center flex flex-col">
            {" "}
            <div>{row.original.expectedDuration}</div>
            <div className="text-xs text-gray-600">
              {calculateEndDate(
                row.original.startDate,
                row.original.expectedDuration
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "grade.name",
        id: "grade.name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="text-center"
            >
              {t("Grade")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center">{row.original.grade?.name || "N/A"}</div>
        ),
      },
      {
        accessorKey: "course.name",
        id: "course.name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="text-center"
            >
              {t("Course")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.grade?.course?.name || "N/A"}
          </div>
        ),
        filterFn: (row, columnId, filterValue) => {
          const courseName = row.original.grade?.course?.name || "N/A";
          return courseName.toLowerCase().includes(filterValue.toLowerCase());
        },
      },
      {
        id: "actions",
        header: ({}) => {
          return <div className="text-center"></div>;
        },
        cell: ({ row }) => (
          <div className="text-center ">
            <DeleteDialog objectName="classes" id={row.original.id}>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  // Add your delete logic here
                  console.log("Delete class clicked");
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete class</span>
              </Button>
            </DeleteDialog>
          </div>
        ),
      },
    ],
    [t]
  );

  const table = useReactTable({
    data: classes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // NEW: Apply debounced search
  React.useEffect(() => {
    table.getColumn("name")?.setFilterValue(debouncedSearch);
  }, [debouncedSearch, table]);

  const handleDownload = () => {
    const headers = [
      "Class ID",
      "Class Name",
      "Teacher",
      "Start Date",
      "Duration (Days)",
      "Course",
    ];
    const tableData = table
      .getRowModel()
      .rows.map((row) => [
        row.original.id,
        row.original.name,
        row.original.teacher.name,
        new Date(row.original.startDate).toLocaleDateString(),
        row.original.expectedDuration,
        row.original.course?.name || "N/A",
      ]);

    const doc = new jsPDF();

    // Add the title
    doc.setFontSize(18);
    doc.text("Class Report", 50, 20);

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
    doc.save("classes.pdf");
  };

  return (
    <div className="w-full relative">
      {isRefreshing && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-4">
        <div className="flex">
          <div className="relative flex-1 mr-3">
            <Input
              id="search"
              placeholder={`${t("Search classes")}`}
              value={searchValue} // CHANGED: Use local state instead of direct table access
              onChange={(e) => setSearchValue(e.target.value)}
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="teacher">{t("Teacher")}</Label>
            <Input
              id="teacher"
              placeholder={t("Filter by teacher")}
              value={
                (table.getColumn("teacher.name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("teacher.name")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="course">{t("Course")}</Label>
            <Input
              id="course"
              placeholder={t("Filter by course")}
              value={
                (table.getColumn("course.name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("course.name")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="grade">{t("Grade")}</Label>
            <Input
              id="grade"
              placeholder={t("Filter by grade")}
              value={
                (table.getColumn("grade.name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("grade.name")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> {t("Download List")}
            </Button>
          </div>
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
