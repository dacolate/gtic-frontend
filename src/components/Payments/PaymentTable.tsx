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
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTranslations } from "next-intl";
import { Payment } from "@/lib/types";
import { Link } from "@/i18n/routing";
import { generatePaymentMatricule } from "@/lib/utils";

interface PaymentTableProps {
  payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  const t = useTranslations("PaymentTable");

  const columns: ColumnDef<Payment>[] = [
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
            {t("PaymentRef")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const matricule = generatePaymentMatricule(
          row.original.createdAt,
          row.original.id,
          row.original.studentId
        );

        return (
          <Link href={`/payments/${row.original.id}`} passHref>
            <div className="text-green-500 hover:underline cursor-pointer">
              {matricule}
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "student.name",
      id: "student.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("StudentName")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link href={`/students/${row.original.studentId}`} passHref>
          <div className="text-green-500 hover:underline cursor-pointer text-center ">
            {row.original.student.name + " " + row.original.student.firstname}
          </div>
        </Link>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Amount")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("amount") + " FCFA"}</div>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Payment Method")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("paymentMethod") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Date")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        const paymentDate = new Date(row.getValue(columnId));
        const [startDate, endDate] = filterValue || [null, null];

        if (!startDate || !endDate) return true; // No filter applied

        return paymentDate >= startDate && paymentDate <= endDate;
      },
    },
    {
      accessorKey: "student_class.paymentStatus",
      id: "student_class.paymentStatus",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Payment Status")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.student_class.paymentStatus || "none"}
        </div>
      ),
    },
    {
      accessorKey: "student_class.remainingPayment",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Remaining Payment")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.student_class.remainingPayment}
        </div>
      ),
    },
    {
      accessorKey: "student_class.nextdeadline",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            {t("Next Deadline")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.student_class.nextdeadline
            ? new Date(
                row.original.student_class.nextdeadline
              ).toLocaleDateString()
            : "N/A"}
        </div>
      ),
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdAt",
      desc: true, // Sort by date in descending order by default
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: payments,
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
  });

  const handleDownload = () => {
    const headers = [
      "Student Name",
      "Amount",
      "Payment Method",
      "Date",
      "Payment Status",
      "Remaining Payment",
      "Next Deadline",
    ];
    const tableData = table
      .getRowModel()
      .rows.map((row) => [
        `${row.original.student.name} ${row.original.student.firstname}`,
        row.original.amount,
        row.original.paymentMethod || "N/A",
        new Date(row.original.createdAt).toLocaleDateString(),
        row.original.student_class.paymentStatus,
        row.original.student_class.remainingPayment,
        row.original.student_class.nextdeadline
          ? new Date(
              row.original.student_class.nextdeadline
            ).toLocaleDateString()
          : "N/A",
      ]);

    const doc = new jsPDF();

    // Add the title
    doc.setFontSize(18);
    doc.text("Payment Report", 50, 20);

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
    doc.save("payments.pdf");
  };

  const handleTimePeriodFilter = (period: string) => {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (period) {
      case "Today":
        startDate = startOfToday;
        endDate = endOfToday;
        break;
      case "Yesterday":
        startDate = new Date(today.setDate(today.getDate() - 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case "Last 7 Days":
        startDate = new Date(today.setDate(today.getDate() - 7));
        startDate.setHours(0, 0, 0, 0);
        endDate = endOfToday;
        break;
      default:
        startDate = null;
        endDate = null;
    }

    // Pass the date range to the filter
    table
      .getColumn("createdAt")
      ?.setFilterValue(startDate && endDate ? [startDate, endDate] : undefined);
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="flex">
          <div className="relative flex-1 mr-3">
            <Input
              id="search"
              placeholder={`${t("Search payments")}`}
              value={
                (table.getColumn("student.name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("student.name")
                  ?.setFilterValue(event.target.value)
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="paymentMethod">{t("Payment Method")}</Label>
            <Select
              value={
                (table
                  .getColumn("paymentMethod")
                  ?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("paymentMethod")?.setFilterValue("");
                } else {
                  table.getColumn("paymentMethod")?.setFilterValue(value);
                }
              }}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder={t("Select payment method")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All")}</SelectItem>
                <SelectItem value="Cash">{t("Cash")}</SelectItem>
                <SelectItem value="Card">{t("Card")}</SelectItem>
                <SelectItem value="Bank Transfer">
                  {t("Bank Transfer")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentStatus">{t("Payment Status")}</Label>
            <Select
              value={
                (table
                  .getColumn("student_class.paymentStatus")
                  ?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) => {
                if (value === "all") {
                  table
                    .getColumn("student_class.paymentStatus")
                    ?.setFilterValue("");
                } else {
                  table
                    .getColumn("student_class.paymentStatus")
                    ?.setFilterValue(value);
                }
              }}
            >
              <SelectTrigger id="paymentStatus">
                <SelectValue placeholder={t("Select payment status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All")}</SelectItem>
                <SelectItem value="Not up to date">
                  {t("Not up to date")}
                </SelectItem>
                <SelectItem value="Up to date">{t("Up to date")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="timePeriod">{t("Time Period")}</Label>
            <Select onValueChange={(value) => handleTimePeriodFilter(value)}>
              <SelectTrigger id="timePeriod">
                <SelectValue placeholder={t("Select time period")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">{t("Today")}</SelectItem>
                <SelectItem value="Yesterday">{t("Yesterday")}</SelectItem>
                <SelectItem value="Last 7 Days">{t("Last 7 Days")}</SelectItem>
              </SelectContent>
            </Select>
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
